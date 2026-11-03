export type ALGrade = 'A' | 'B' | 'C' | 'S' | 'F';
export type ChanceTier = 'SAFE' | 'TARGET' | 'REACH' | 'OUT_OF_RANGE' | 'NQC';

export interface ClassifyInput {
  studentZ: number;
  minZScore: number | null;
  status: 'QUALIFIED' | 'NQC';
  allIslandMeritOnly: boolean;
  allIslandZScore?: number | null;
}

export interface ClassifyResult {
  tier: ChanceTier;
  margin: number | null;
  effectiveCutoff: number | null;
}

/**
 * Classifies a student's Z-score against a program's historical cutoff.
 * CRITICAL SRI LANKAN UGC RULE: Never treat NULL / NQC as 0.0000!
 */
export function classifyProgramMatch(input: ClassifyInput): ClassifyResult {
  const effectiveCutoff = input.allIslandMeritOnly
    ? (input.allIslandZScore ?? input.minZScore)
    : input.minZScore;

  if (input.status === 'NQC' || effectiveCutoff === null || effectiveCutoff === undefined) {
    return {
      tier: 'NQC',
      margin: null,
      effectiveCutoff: null,
    };
  }

  const margin = Number((input.studentZ - effectiveCutoff).toFixed(4));

  if (margin >= 0.05) {
    return { tier: 'SAFE', margin, effectiveCutoff };
  }
  if (margin >= -0.05) {
    return { tier: 'TARGET', margin, effectiveCutoff };
  }
  if (margin >= -0.2) {
    return { tier: 'REACH', margin, effectiveCutoff };
  }
  return { tier: 'OUT_OF_RANGE', margin, effectiveCutoff };
}

export interface PreferencePlanItem {
  uni_code: string;
  course_name: string;
  institution_code: string;
  min_z_score: number | null;
  locked?: boolean;
}

export interface PreferenceConflict {
  upperIndex: number;
  lowerIndex: number;
  upperUniCode: string;
  lowerUniCode: string;
  upperCutoff: number;
  lowerCutoff: number;
  message: string;
}

/**
 * Scans the student's ordered UGC preference list.
 * Flags any pair where Preference #N has a lower historical district cutoff Z-score
 * than Preference #(N+1), unless manually locked by the student.
 */
export function auditPreferenceOrder(items: PreferencePlanItem[]): PreferenceConflict[] {
  const conflicts: PreferenceConflict[] = [];

  for (let i = 0; i < items.length - 1; i++) {
    const current = items[i];
    const next = items[i + 1];

    if (current.locked || next.locked) continue;
    if (current.min_z_score === null || next.min_z_score === null) continue;

    if (current.min_z_score < next.min_z_score) {
      conflicts.push({
        upperIndex: i,
        lowerIndex: i + 1,
        upperUniCode: current.uni_code,
        lowerUniCode: next.uni_code,
        upperCutoff: current.min_z_score,
        lowerCutoff: next.min_z_score,
        message: `Warning: Your #${i + 1} choice (${current.uni_code} - Cutoff ${current.min_z_score.toFixed(4)}) has a lower Z-score requirement than your #${i + 2} choice (${next.uni_code} - Cutoff ${next.min_z_score.toFixed(4)}). If your Z-score exceeds ${next.min_z_score.toFixed(4)}, the UGC computer system will lock you into #${i + 1} and never evaluate #${i + 2}!`,
      });
    }
  }

  return conflicts;
}

/**
 * Sorts unlocked items by descending Z-score priority while keeping manually locked
 * items fixed at their chosen preference positions.
 */
export function optimizePreferenceOrder<T extends PreferencePlanItem>(items: T[]): T[] {
  const unlocked = items
    .filter((item) => !item.locked)
    .sort((a, b) => {
      const zA = a.min_z_score ?? -999;
      const zB = b.min_z_score ?? -999;
      return zB - zA;
    });

  let unlockedIdx = 0;
  return items.map((item) => {
    if (item.locked) return item;
    const replacement = unlocked[unlockedIdx];
    unlockedIdx += 1;
    return replacement;
  });
}

const GRADE_WEIGHTS: Record<ALGrade, number> = {
  A: 0.65,
  B: 0.38,
  C: 0.14,
  S: -0.08,
  F: -0.6,
};

const STREAM_OFFSET: Record<string, number> = {
  'Biological Science': 0.08,
  'Physical Science': 0.12,
  Commerce: 0.02,
  Technology: 0.04,
  Arts: -0.04,
  Other: 0.0,
};

/**
 * Estimates a student's approximate G.C.E. A/L Z-score from 3 subject grades and stream.
 */
export function estimateZScoreFromGrades(grades: [ALGrade, ALGrade, ALGrade], stream: string): number {
  const sum = grades.reduce((acc, g) => acc + (GRADE_WEIGHTS[g] ?? 0), 0);
  const offset = STREAM_OFFSET[stream] ?? 0;
  return Number(Math.max(-1.0, Math.min(2.85, sum + offset)).toFixed(4));
}

const GRADE_RANK: Record<ALGrade, number> = {
  A: 4,
  B: 3,
  C: 2,
  S: 1,
  F: 0,
};

export interface SubjectGradePair {
  subject: string;
  grade: ALGrade;
}

export interface SubjectRequirementsSpec {
  required_subjects?: string[];
  any_of_subjects?: string[];
  min_grade?: ALGrade;
  notes?: string;
}

export function checkSubjectEligibility(
  studentSubjects: SubjectGradePair[],
  commonGeneralTestScore: number,
  requirements: SubjectRequirementsSpec
): { eligible: boolean; reason: string } {
  if (commonGeneralTestScore < 30) {
    return {
      eligible: false,
      reason: 'Common General Test score must be at least 30% for UGC university admission.',
    };
  }

  const passedCount = studentSubjects.filter((s) => GRADE_RANK[s.grade] >= GRADE_RANK.S).length;
  if (passedCount < 3) {
    return {
      eligible: false,
      reason: 'Minimum 3 passes (grade S or above) at a single sitting required.',
    };
  }

  const minGrade = requirements.min_grade ?? 'S';
  const minRank = GRADE_RANK[minGrade];

  if (requirements.required_subjects && requirements.required_subjects.length > 0) {
    for (const reqSub of requirements.required_subjects) {
      const found = studentSubjects.find(
        (s) => s.subject.toLowerCase() === reqSub.toLowerCase() && GRADE_RANK[s.grade] >= minRank
      );
      if (!found) {
        return {
          eligible: false,
          reason: `Requires ${reqSub} with at least grade '${minGrade}'.`,
        };
      }
    }
  }

  if (requirements.any_of_subjects && requirements.any_of_subjects.length > 0) {
    const hasOne = requirements.any_of_subjects.some((reqSub) =>
      studentSubjects.some(
        (s) => s.subject.toLowerCase() === reqSub.toLowerCase() && GRADE_RANK[s.grade] >= minRank
      )
    );
    if (!hasOne) {
      return {
        eligible: false,
        reason: `Requires at least one of (${requirements.any_of_subjects.join(', ')}) with grade '${minGrade}' or above.`,
      };
    }
  }

  return { eligible: true, reason: 'Meets 3-subject and Common General Test requirements.' };
}
