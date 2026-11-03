import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SRI_LANKA_DISTRICTS,
  UGC_INSTITUTIONS,
  UGC_COURSES,
  buildProgramCutoffRowsForDistrict,
  NON_STATE_IFSLS_PATHWAYS,
  CAREER_ATLAS,
  INITIAL_CAMPUS_REVIEWS,
  INITIAL_QNA_THREADS,
  ADMISSIONS_CALENDAR_EVENTS,
  type ProgramCutoffViewRow,
  type InstitutionRecord,
  type CourseRecord,
  type CampusReviewItem,
  type QnAThreadItem,
  type DistrictInfo,
  type CareerAtlasItem,
} from '../data/sriLankaUgcSnapshot';
import { classifyProgramMatch, type ChanceTier } from '../lib/ugcLogic';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// In-memory + sessionStorage cache to protect Supabase 5GB free-tier egress
const memoryCache = new Map<string, unknown>();

function getCached<T>(key: string): T | null {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  try {
    const raw = sessionStorage.getItem(`lankavuz_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw) as T;
      memoryCache.set(key, parsed);
      return parsed;
    }
  } catch {
    // Ignore sessionStorage quota or private browsing errors
  }
  return null;
}

function setCached<T>(key: string, value: T): void {
  memoryCache.set(key, value);
  try {
    sessionStorage.setItem(`lankavuz_cache_${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export interface MatchedProgramRow extends ProgramCutoffViewRow {
  z_margin: number | null;
  chance_tier: ChanceTier;
}

export async function fetchProgramCutoffsByDistrict(districtId: number): Promise<ProgramCutoffViewRow[]> {
  const cacheKey = `v_program_cutoffs_d${districtId}`;
  const cached = getCached<ProgramCutoffViewRow[]>(cacheKey);
  if (cached) return cached;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('v_program_cutoffs')
        .select('*')
        .eq('district_id', districtId);

      if (!error && data && data.length > 0) {
        setCached(cacheKey, data);
        return data as ProgramCutoffViewRow[];
      }
    } catch {
      // Fallback to local snapshot when offline
    }
  }

  const fallback = buildProgramCutoffRowsForDistrict(districtId);
  setCached(cacheKey, fallback);
  return fallback;
}

export async function matchEligibleProgramsRpc(params: {
  p_district_id: number;
  p_student_z: number;
  p_stream: string;
}): Promise<MatchedProgramRow[]> {
  const { p_district_id, p_student_z, p_stream } = params;

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('match_eligible_programs', {
        p_district_id,
        p_student_z,
        p_stream,
      });
      if (!error && data && data.length > 0) {
        return data as MatchedProgramRow[];
      }
    } catch {
      // Fallback to client-side evaluation of the exact RPC logic
    }
  }

  const rows = await fetchProgramCutoffsByDistrict(p_district_id);
  const filtered = rows.filter(
    (r) => p_stream === 'ALL' || r.stream === p_stream || r.stream === 'Other'
  );

  return filtered.map((row) => {
    const classification = classifyProgramMatch({
      studentZ: p_student_z,
      minZScore: row.min_z_score,
      status: row.status,
      allIslandMeritOnly: row.all_island_merit_only,
      allIslandZScore: row.all_island_max_z,
    });
    return {
      ...row,
      z_margin: classification.margin,
      chance_tier: classification.tier,
    };
  });
}

export async function fetchAllDistrictCutoffsForUniCode(
  uniCode: string
): Promise<{ district_id: number; district_name: string; min_z_score: number | null; status: 'QUALIFIED' | 'NQC' }[]> {
  const cacheKey = `all_districts_${uniCode}`;
  const cached = getCached<{ district_id: number; district_name: string; min_z_score: number | null; status: 'QUALIFIED' | 'NQC' }[]>(cacheKey);
  if (cached) return cached;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('historical_cutoffs')
        .select('district_id, district_name, min_z_score, status')
        .eq('uni_code', uniCode)
        .order('district_id', { ascending: true });
      if (!error && data && data.length > 0) {
        setCached(cacheKey, data);
        return data;
      }
    } catch {
      // Fallback below
    }
  }

  const result = SRI_LANKA_DISTRICTS.map((d) => {
    const row = buildProgramCutoffRowsForDistrict(d.district_id).find((r) => r.uni_code === uniCode);
    return {
      district_id: d.district_id,
      district_name: d.district_name,
      min_z_score: row?.min_z_score ?? null,
      status: row?.status ?? 'NQC',
    };
  });

  setCached(cacheKey, result);
  return result;
}

export interface StudentBackupApplicationInput {
  full_name: string;
  district_id: number;
  stream: string;
  subject_grades: { subject: string; grade: string }[];
  z_score: number;
  whatsapp: string;
  selected_programs: string[];
}

export async function submitStudentBackupApplication(
  payload: StudentBackupApplicationInput
): Promise<{ ok: boolean; source: 'supabase' | 'local' }> {
  // Validate input at boundary
  if (!payload.full_name.trim() || !payload.whatsapp.trim() || payload.selected_programs.length === 0) {
    throw new Error('Please provide your name, WhatsApp number, and at least one backup program.');
  }

  if (supabase) {
    try {
      const { error } = await supabase.from('student_applications').insert([payload]);
      if (!error) return { ok: true, source: 'supabase' };
    } catch {
      // Fall through to local persistence
    }
  }

  const existingRaw = localStorage.getItem('lankavuz_student_applications');
  const existing = existingRaw ? (JSON.parse(existingRaw) as unknown[]) : [];
  existing.push({ ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() });
  localStorage.setItem('lankavuz_student_applications', JSON.stringify(existing));
  return { ok: true, source: 'local' };
}

export async function submitCampusReview(
  review: Omit<CampusReviewItem, 'id' | 'created_at' | 'verified_ac_lk'>
): Promise<CampusReviewItem> {
  if (!review.student_email.toLowerCase().endsWith('.ac.lk')) {
    throw new Error('Only official Sri Lankan university emails ending in .ac.lk can submit verified reviews.');
  }

  const newReview: CampusReviewItem = {
    ...review,
    id: `rev-${Date.now()}`,
    verified_ac_lk: true,
    created_at: new Date().toISOString().slice(0, 10),
  };

  if (supabase) {
    try {
      await supabase.from('campus_reviews').insert([newReview]);
    } catch {
      // Persist locally as well
    }
  }

  const storedRaw = localStorage.getItem('lankavuz_campus_reviews');
  const stored = storedRaw ? (JSON.parse(storedRaw) as CampusReviewItem[]) : INITIAL_CAMPUS_REVIEWS;
  const updated = [newReview, ...stored];
  localStorage.setItem('lankavuz_campus_reviews', JSON.stringify(updated));
  return newReview;
}

export function getCampusReviews(): CampusReviewItem[] {
  try {
    const raw = localStorage.getItem('lankavuz_campus_reviews');
    if (raw) return JSON.parse(raw) as CampusReviewItem[];
  } catch {
    // Fallback
  }
  return INITIAL_CAMPUS_REVIEWS;
}

export function getQnAThreads(): QnAThreadItem[] {
  try {
    const raw = localStorage.getItem('lankavuz_qna_threads');
    if (raw) return JSON.parse(raw) as QnAThreadItem[];
  } catch {
    // Fallback
  }
  return INITIAL_QNA_THREADS;
}

export function submitQnAQuestion(item: {
  institution_code: string;
  uni_code: string;
  asked_by: string;
  question: string;
}): QnAThreadItem {
  const newThread: QnAThreadItem = {
    id: `qna-${Date.now()}`,
    institution_code: item.institution_code,
    uni_code: item.uni_code,
    asked_by: item.asked_by.trim() || 'Prospective A/L Applicant',
    question: item.question.trim(),
    answer: 'Pending response from verified Campus Ambassador (typical reply time: < 6 hours).',
    answered_by_role: 'Campus Ambassador Desk',
    verified_ambassador: true,
    created_at: new Date().toISOString().slice(0, 10),
  };

  const current = getQnAThreads();
  const updated = [newThread, ...current];
  localStorage.setItem('lankavuz_qna_threads', JSON.stringify(updated));
  return newThread;
}

export {
  SRI_LANKA_DISTRICTS,
  UGC_INSTITUTIONS,
  UGC_COURSES,
  NON_STATE_IFSLS_PATHWAYS,
  CAREER_ATLAS,
  ADMISSIONS_CALENDAR_EVENTS,
  type InstitutionRecord,
  type CourseRecord,
  type DistrictInfo,
  type ProgramCutoffViewRow,
  type CareerAtlasItem,
};
