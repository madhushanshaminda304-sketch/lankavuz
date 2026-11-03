-- ============================================================================
-- LankaVuz (Sri Lankan Vuzopedia) — Official Supabase PostgreSQL Schema & RPC
-- ============================================================================

-- 1. Institutions (21 UGC Universities, Campuses & Institutes)
CREATE TABLE IF NOT EXISTS public.institutions (
  institution_code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('University', 'Campus', 'Institute')),
  location TEXT NOT NULL,
  website TEXT
);

-- 2. Courses (129 UGC Degree Courses)
CREATE TABLE IF NOT EXISTS public.courses (
  course_code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stream TEXT NOT NULL CHECK (stream IN ('Biological Science', 'Physical Science', 'Commerce', 'Arts', 'Technology', 'Other')),
  faculty TEXT NOT NULL,
  degree_awarded TEXT NOT NULL,
  subject_requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT
);

-- 3. Admission Options (276 UGC uni_code Offerings)
CREATE TABLE IF NOT EXISTS public.admission_options (
  uni_code TEXT PRIMARY KEY,
  course_code TEXT NOT NULL REFERENCES public.courses(course_code) ON DELETE CASCADE,
  institution_code TEXT NOT NULL REFERENCES public.institutions(institution_code) ON DELETE CASCADE,
  duration_years INTEGER NOT NULL DEFAULT 4,
  medium JSONB NOT NULL DEFAULT '["E"]'::jsonb,
  proposed_intake INTEGER NOT NULL DEFAULT 100,
  aptitude_test_required BOOLEAN NOT NULL DEFAULT FALSE,
  all_island_merit_only BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. Historical Cutoffs (25 Administrative Districts x uni_code)
CREATE TABLE IF NOT EXISTS public.historical_cutoffs (
  id BIGSERIAL PRIMARY KEY,
  uni_code TEXT NOT NULL REFERENCES public.admission_options(uni_code) ON DELETE CASCADE,
  district_id INTEGER NOT NULL CHECK (district_id BETWEEN 1 AND 25),
  district_name TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2024/2025',
  min_z_score NUMERIC(6,4) NULL,
  status TEXT NOT NULL CHECK (status IN ('QUALIFIED', 'NQC'))
);

CREATE INDEX IF NOT EXISTS idx_historical_cutoffs_district_unicode
  ON public.historical_cutoffs (district_id, uni_code, academic_year);

-- 5. Eligibility Rules
CREATE TABLE IF NOT EXISTS public.eligibility_rules (
  rule_id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 6. Pre-Joined View: v_program_cutoffs
CREATE OR REPLACE VIEW public.v_program_cutoffs AS
SELECT
  ao.uni_code,
  ao.course_code,
  c.name AS course_name,
  c.stream,
  c.faculty,
  c.degree_awarded,
  c.subject_requirements,
  c.description AS course_description,
  ao.institution_code,
  i.name AS institution_name,
  i.type AS institution_type,
  i.location AS institution_location,
  i.website AS institution_website,
  ao.duration_years,
  ao.medium,
  ao.proposed_intake,
  ao.aptitude_test_required,
  ao.all_island_merit_only,
  hc.district_id,
  hc.district_name,
  hc.academic_year,
  hc.min_z_score,
  hc.status
FROM public.admission_options ao
JOIN public.courses c ON c.course_code = ao.course_code
JOIN public.institutions i ON i.institution_code = ao.institution_code
LEFT JOIN public.historical_cutoffs hc ON hc.uni_code = ao.uni_code;

-- 7. RPC Function: match_eligible_programs
CREATE OR REPLACE FUNCTION public.match_eligible_programs(
  p_district_id INT,
  p_student_z NUMERIC,
  p_stream TEXT
)
RETURNS TABLE (
  uni_code TEXT,
  course_code TEXT,
  course_name TEXT,
  stream TEXT,
  degree_awarded TEXT,
  institution_code TEXT,
  institution_name TEXT,
  duration_years INT,
  medium JSONB,
  proposed_intake INT,
  aptitude_test_required BOOLEAN,
  all_island_merit_only BOOLEAN,
  district_id INT,
  district_name TEXT,
  academic_year TEXT,
  min_z_score NUMERIC(6,4),
  status TEXT,
  z_margin NUMERIC(6,4),
  chance_tier TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    v.uni_code,
    v.course_code,
    v.course_name,
    v.stream,
    v.degree_awarded,
    v.institution_code,
    v.institution_name,
    v.duration_years,
    v.medium,
    v.proposed_intake,
    v.aptitude_test_required,
    v.all_island_merit_only,
    v.district_id,
    v.district_name,
    v.academic_year,
    v.min_z_score,
    v.status,
    CASE
      WHEN v.status = 'NQC' OR v.min_z_score IS NULL THEN NULL
      ELSE ROUND(p_student_z - v.min_z_score, 4)
    END AS z_margin,
    CASE
      WHEN v.status = 'NQC' OR v.min_z_score IS NULL THEN 'NQC'
      WHEN (p_student_z - v.min_z_score) >= 0.0500 THEN 'SAFE'
      WHEN (p_student_z - v.min_z_score) >= -0.0500 THEN 'TARGET'
      WHEN (p_student_z - v.min_z_score) >= -0.2000 THEN 'REACH'
      ELSE 'OUT_OF_RANGE'
    END AS chance_tier
  FROM public.v_program_cutoffs v
  WHERE v.district_id = p_district_id
    AND (p_stream = 'ALL' OR v.stream = p_stream OR v.stream = 'Other')
  ORDER BY v.min_z_score DESC NULLS LAST;
$$;

-- 8. Community & Counseling Tables (Prompts 5 & 6)
CREATE TABLE IF NOT EXISTS public.student_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  district_id INT NOT NULL,
  stream TEXT NOT NULL,
  subject_grades JSONB NOT NULL,
  z_score NUMERIC(6,4),
  whatsapp TEXT NOT NULL,
  selected_programs JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campus_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_code TEXT NOT NULL REFERENCES public.institutions(institution_code) ON DELETE CASCADE,
  uni_code TEXT,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  academic_rating INT NOT NULL CHECK (academic_rating BETWEEN 1 AND 5),
  hostel_cost_lkr INT NOT NULL,
  mahapola_rating INT NOT NULL CHECK (mahapola_rating BETWEEN 1 AND 5),
  campus_life_rating INT NOT NULL CHECK (campus_life_rating BETWEEN 1 AND 5),
  employability_rating INT NOT NULL CHECK (employability_rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  verified_ac_lk BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.qna_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_code TEXT NOT NULL REFERENCES public.institutions(institution_code) ON DELETE CASCADE,
  uni_code TEXT,
  asked_by TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  answered_by_role TEXT NOT NULL,
  verified_ambassador BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
