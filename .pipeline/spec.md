# Spec: LankaVuz — Sri Lankan Higher Education Discovery, Z-Score Predictor & Admission Simulator

## 1. Objective
Build **LankaVuz**, the authoritative Sri Lankan higher education portal combining Vuzopedia.ru's academic directory and preference planning with Shiksha's College Predictor/Comparator/Verified Reviews and CollegeDekho's Career Compass & Single-Window Backup Application Form. Pre-wired to Supabase PostgreSQL (`institutions`, `courses`, `admission_options`, `historical_cutoffs`, `eligibility_rules`, `v_program_cutoffs`, `match_eligible_programs` RPC, plus `student_applications`, `campus_reviews`, and `qna_threads`) and optimized for zero-cost Cloudflare Pages hosting with an in-memory + `sessionStorage` edge cache and offline Sri Lankan UGC snapshot fallback.

## 2. Design Direction (Phase 4 — Hallmark Custom Direction: "Sri Lankan Academic & Civic Atlas")
- **Aesthetic Name**: *Sri Lankan Academic & Civic Atlas*
- **Palette (WCAG AA compliant)**:
  - `--color-brand-navy`: `#0F2942` (Deep Royal Blue — primary header, institutional authority, high-contrast headings; 13.8:1 on white)
  - `--color-brand-navy-light`: `#1E3A5F` (Secondary interactive surface & active pills)
  - `--color-brand-gold`: `#D97706` (Ceylon Gold / Amber — primary CTAs, Aptitude Test badges, highlights; dark text `#0F172A` or deep amber `#B45309` on light backgrounds for AA contrast)
  - `--color-safe`: `#059669` (Emerald — Safe Chance `>= +0.0500` margin)
  - `--color-target`: `#D97706` (Amber — Target Match `-0.0500` to `+0.0499` margin)
  - `--color-reach`: `#E11D48` (Rose — Reach/Dream `-0.2000` to `-0.0501` margin)
  - `--color-nqc`: `#475569` (Slate — `NQC` Not Qualified Candidates / `min_z_score IS NULL`)
  - `--color-canvas`: `#F8FAFC` (Slate-50 clean academic background)
  - `--color-surface`: `#FFFFFF` (Crisp card surface with `#E2E8F0` border)
- **Typography**:
  - Heading & UI Face (`--font-sans`): `'Plus Jakarta Sans', system-ui, sans-serif` (preload with `font-display: swap`)
  - Tabular Numerals & `uni_code` Face (`--font-mono`): `'JetBrains Mono', monospace` (`font-variant-numeric: tabular-nums` for Z-scores like `1.6425` and codes like `001A`, `013A`)
  - Trilingual Support (`--font-trilingual`): `'Noto Sans Sinhala', 'Noto Sans Tamil', sans-serif`
- **Layout Pattern**:
  - Sticky Top Utility Header: Global 25-District Selector Modal (`Select Your District / ඔබේ දිස්ත්‍රික්කය / உங்கள் மாவட்டம்`), Instant `uni_code`/Course/Institution Autocomplete Search, Trilingual Switcher (`EN` | `සිං` | `தமிழ்`), and `My UGC Plan` (`Мой план`) Counter Pill.
  - 5-Link Primary Nav: `Predictor`, `Universities & Courses`, `Compare (4-Way)`, `Career Compass`, `Admissions Calendar`.
  - Mobile 375px Bottom Navigation Bar: `Predictor`, `My Plan`, `Search`, `Compare`, `More`.
- **Motion Stance**:
  - `--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1)` for slide-over drawers (`My UGC Plan`, `1-Click Backup Application`), `--duration-fast: 150ms` for interactive hover/focus states, zero animation delay on high-frequency filtering, full `@media (prefers-reduced-motion: reduce)` support.

## 3. Tech Stack & Commands
- **Stack**: React 19, TypeScript, Vite, Tailwind CSS, `@supabase/supabase-js`, Lucide React icons, Vitest (unit/logic tests for Z-score classification, NQC handling, and Preference Order Conflict Auditor).
- **Commands**:
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Test: `npm test -- --run`

## 4. Data Model & Supabase Schema (`supabase/schema.sql` + `src/services/ugcDataService.ts`)
- Exact tables:
  - `institutions(institution_code PK, name, type, location, website)` — All 21 UGC state institutions (`UOC`, `UOP`, `UOM`, `USJP`, `UOK`, `UOJ`, `UOR`, `EUSL`, `SEUSL`, `RUSL`, `SUSL`, `WUSL`, `UWU`, `UVPA`, `GWUIM`, `UOV`, `IIM`, `UCSC`, `SCPC`, `TRINCO`, `SVIAS`).
  - `courses(course_code PK, name, stream, faculty, degree_awarded, subject_requirements JSONB, description)`
  - `admission_options(uni_code PK, course_code FK, institution_code FK, duration_years, medium JSONB, proposed_intake, aptitude_test_required BOOLEAN, all_island_merit_only BOOLEAN)`
  - `historical_cutoffs(id PK, uni_code FK, district_id INT 1..25, district_name, academic_year, min_z_score NUMERIC(6,4) NULLABLE, status 'QUALIFIED'|'NQC')`
  - `eligibility_rules(rule_id PK, category, title, description, details JSONB)`
  - `student_applications(id PK, full_name, district_id, stream, subject_grades JSONB, z_score NUMERIC(6,4), whatsapp, selected_programs JSONB, created_at)`
  - `campus_reviews(id PK, institution_code, uni_code, student_name, student_email, academic_rating, hostel_cost_lkr, mahapola_rating, campus_life_rating, employability_rating, comment, verified_ac_lk BOOLEAN, created_at)`
  - `qna_threads(id PK, institution_code, uni_code, asked_by, question, answer, answered_by_role, verified_ambassador BOOLEAN, created_at)`
- View `v_program_cutoffs` & RPC `match_eligible_programs(p_district_id INT, p_student_z NUMERIC, p_stream TEXT)`.

## 5. Pages & Feature Requirements (Keep Checklist Mapping)
1. **Prompt 1 — Global Layout, 25-District Context, Trilingual i18n, 4-Tab Hero Discovery & Supabase Edge Cache**:
   - All 25 Sri Lankan districts persisted in Context + `localStorage`.
   - 4-Tab Hero Discovery Bar: Tab 1 (By Z-Score & A/L Subjects), Tab 2 (By 21 State Universities), Tab 3 (By 129 UGC Courses across streams), Tab 4 (By 12 Career Fields).
2. **Prompt 2 — Z-Score + 3-Subject A/L Predictor (`/predictor`)**:
   - Stream + 3 A/L Subjects & Grades (`A`, `B`, `C`, `S`) + Common General Test (`>=30%`) + General English + Official Z-Score or Grade-based Z-Score Estimator.
   - Safe (`>= +0.0500`), Target (`-0.0500` to `+0.0499`), Reach (`-0.2000` to `-0.0501`) classification.
   - Explicit handling of `NQC` (`min_z_score IS NULL` never treated as `0.0000`), `all_island_merit_only`, and `aptitude_test_required` badges.
3. **Prompt 3 — My UGC Admission Plan & Preference Order Conflict Simulator (`/my-plan` & Drawer)**:
   - Reorderable preference list (`#1`, `#2`, `#3`...) with real-time Conflict Auditor warning when `#N` has a lower district cutoff Z-score than `#(N+1)`.
   - 1-click `Auto-Optimize by Z-Score Priority`, manual hometown lock override, Printable UGC Code Sheet view, and WhatsApp share link.
4. **Prompt 4 — 4-Way Comparison Engine (`/compare`) & State + Private / IFSLS Loan Bridge**:
   - Side-by-side 4-column comparison matrix with "Highlight Differences Only" toggle and 1-click popular presets (`UOM CS vs UCSC CS vs USJP Computing`, `UOM Eng vs UOP Eng vs UOR Eng`).
   - Non-State & MOHE Interest-Free Student Loan Scheme (IFSLS) + TVEC NVQ Level 5/6/7 alternative pathway cards with official accreditation badges (`✅ UGC Recognized`, `✅ MOHE DAI`, `✅ TVEC Registered`, `💰 IFSLS Interest-Free Govt Loan Eligible`).
5. **Prompt 5 — Reverse Career Atlas (`/careers`), 3-Minute RIASEC/Klimov Quiz (`/career-quiz`) & 1-Click Backup Application Form**:
   - Searchable Sri Lankan Career Directory with LKR/month starting & 3-5 yr salaries, linked to live district `uni_code`s and NVQ/IFSLS backups.
   - 12-question interactive RIASEC + Klimov assessment generating a personalized 360° Higher Education Roadmap (Top 5 State `uni_code`s + Top 3 IFSLS/Non-State/TVEC pathways).
   - 1-Click Common Application / Counseling Drawer saving to `student_applications`.
6. **Prompt 6 — Enhanced Institution & Course Profiles (`/institution/:code`, `/course/:uni_code`), Verified Reviews, Senior Q&A & Live Admissions Calendar (`/calendar`)**:
   - 5-tab Institution/Course detail modal/view (Overview & Courses, 25-District Cutoff Matrix & Bar Chart, Eligibility & Subject Rules, Shiksha-style 5-star Verified `.ac.lk` Student Reviews with LKR boarding cost, and Campus Ambassador Q&A).
   - Sri Lankan Admissions & Aptitude Test Calendar with WhatsApp / Browser notification reminders.

## 6. Boundaries
- **Always**: Use semantic CSS tokens (`tokens.css`), validate user inputs before saving to Supabase/localStorage, run unit tests (`npm test -- --run`) and production build (`npm run build`), ensure `NQC` (`NULL`) is never coerced to `0`.
- **Ask First**: Pushing to remote git or deploying to live Cloudflare production.
- **Never**: Hardcode API secrets in source code; copy third-party logos or proprietary Russian text from Vuzopedia.ru.
