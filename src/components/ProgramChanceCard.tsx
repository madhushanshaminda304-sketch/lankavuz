import React from 'react';
import { Plus, Check, Scale, AlertTriangle, Globe, Users, Clock, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ProgramCutoffViewRow } from '../data/sriLankaUgcSnapshot';
import { classifyProgramMatch } from '../lib/ugcLogic';

const MEDIUM_LABELS: Record<string, string> = {
  E: 'English',
  S: 'Sinhala',
  T: 'Tamil',
};

export const ProgramChanceCard: React.FC<{
  program: ProgramCutoffViewRow;
  studentZ?: number | null;
}> = ({ program, studentZ }) => {
  const {
    planEntries,
    addToPlan,
    removeFromPlan,
    compareList,
    toggleCompare,
    openCourseProfile,
    openInstitutionProfile,
  } = useApp();

  const match = classifyProgramMatch({
    studentZ: studentZ ?? null,
    minZScore: program.min_z_score,
    status: program.status,
    allIslandMeritOnly: program.all_island_merit_only,
    allIslandZScore: program.all_island_max_z,
  });

  const isInPlan = planEntries.some((p) => p.uni_code === program.uni_code);
  const isInCompare = compareList.includes(program.uni_code);

  const cutoffBadge = () => {
    if (program.status === 'NQC' || match.effectiveCutoff === null) {
      return (
        <span
          title="No candidates from your district met the minimum threshold or all quota seats were filled in the previous intake — check All-Island Merit and historical years."
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 cursor-help font-tabular"
        >
          ⚪ 2024/25 Cutoff: NQC
        </span>
      );
    }
    if (program.all_island_merit_only) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-950 border border-sky-300 font-tabular">
          🌐 All-Island Cutoff: {match.effectiveCutoff.toFixed(4)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 font-tabular">
        📊 {program.district_name} 2024/25 Cutoff: {match.effectiveCutoff.toFixed(4)}
      </span>
    );
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 flex flex-col justify-between gap-4">
      <div>
        {/* Top Row: uni_code badge + Stream + Factual Cutoff Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCourseProfile(program.uni_code)}
              className="font-tabular font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-md bg-[var(--color-brand-primary)] text-amber-300 hover:bg-slate-800"
            >
              {program.uni_code}
            </button>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {program.stream}
            </span>
          </div>
          {cutoffBadge()}
        </div>

        {/* Title & Institution */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          <button
            type="button"
            onClick={() => openCourseProfile(program.uni_code)}
            className="text-left hover:text-amber-700"
          >
            {program.course_name} — <span className="font-semibold text-slate-700">{program.degree_awarded}</span>
          </button>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          <button
            type="button"
            onClick={() => openInstitutionProfile(program.institution_code)}
            className="font-semibold text-slate-800 hover:underline"
          >
            {program.institution_name} ({program.institution_code})
          </button>{' '}
          · {program.institution_location}
        </p>

        {/* Special UGC Rule Badges (Suspended / Aptitude Test / All-Island Merit / Special O/L / NQC) */}
        {(program.is_suspended || program.requires_ol_special || program.aptitude_test_required || program.all_island_merit_only || program.status === 'NQC') && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {program.is_suspended && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400">
                ⛔ Suspended for 2025/2026 Intake (Curriculum Review)
              </span>
            )}
            {program.requires_ol_special && (
              <span
                title="G.C.E. O/L Special Prerequisite: Candidate must have obtained specific credit passes in English, Mathematics, or Science (UGC Handbook Section 5.3)."
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-100 text-violet-900 border border-violet-300 cursor-help"
              >
                📋 Special O/L Credit Required — Section 5.3
              </span>
            )}
            {program.aptitude_test_required && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                University Aptitude Test Required
              </span>
            )}
            {program.all_island_merit_only && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-300">
                <Globe className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                100% All-Island Merit Quota
              </span>
            )}
            {program.status === 'NQC' && (
              <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                ℹ️ NQC in {program.district_name}: No candidates met the quota cutoff in 2024/25.
              </span>
            )}
          </div>
        )}

        {/* Factual Comparison Box (if student entered a Z-score) */}
        {studentZ !== undefined && studentZ !== null && match.effectiveCutoff !== null && (
          <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-tabular">
              <span className="font-semibold text-slate-700">
                Your Z: <strong className="text-slate-950">{studentZ.toFixed(4)}</strong>
              </span>
              <span className="font-bold text-slate-900">
                Diff vs 2024/25: {' '}
                <span className={match.margin !== null && match.margin >= 0 ? 'text-emerald-700' : 'text-amber-700'}>
                  {match.margin !== null && match.margin >= 0 ? `+${match.margin.toFixed(4)}` : match.margin?.toFixed(4)}
                </span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Historical 2024/2025 UGC cutoff for reference only; official cutoffs vary each admission year.
            </p>
          </div>
        )}

        {/* Metadata Pills: Medium, Duration, Proposed Intake */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-700">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            Medium: {program.medium.map((m) => MEDIUM_LABELS[m] ?? m).join(', ')}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-tabular font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            {program.duration_years} Yrs
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 font-tabular font-medium">
            <Users className="w-3.5 h-3.5 text-slate-600" />
            Intake: {program.proposed_intake} seats
          </span>
        </div>
      </div>

      {/* Bottom Action Row: + Add to My UGC Plan & ⇄ Compare */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={program.is_suspended}
          onClick={() => (isInPlan ? removeFromPlan(program.uni_code) : addToPlan(program.uni_code))}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold interactive-surface ${
            program.is_suspended
              ? 'bg-slate-300 text-slate-600 cursor-not-allowed opacity-75'
              : isInPlan
              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
              : 'bg-[var(--color-brand-primary)] text-white hover:bg-slate-800'
          }`}
        >
          {program.is_suspended ? (
            <span>⛔ Intake Suspended</span>
          ) : isInPlan ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved in My UGC Plan</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Add to My UGC Plan</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(program.uni_code)}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border interactive-surface ${
            isInCompare
              ? 'border-amber-600 bg-amber-50 text-amber-950'
              : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isInCompare ? 'Comparing' : '⇄ Compare'}</span>
        </button>
      </div>
    </article>
  );
};
