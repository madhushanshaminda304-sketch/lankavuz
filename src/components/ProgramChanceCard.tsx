import React from 'react';
import { Plus, Check, Scale, AlertTriangle, Globe, Users, Clock, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';
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

  // Consolidated Cutoff Pill (Anchor 2)
  const renderCutoffPill = () => {
    if (program.status === 'NQC' || match.effectiveCutoff === null) {
      return (
        <span
          title="No candidates from your district met the minimum cutoff threshold in 2024/2025."
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300/80 font-mono"
        >
          ⚪ 2024/25: NQC
        </span>
      );
    }
    if (program.all_island_merit_only) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-950 border border-sky-300/80 font-mono shadow-xs">
          🌐 All-Island: {match.effectiveCutoff.toFixed(4)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300/90 font-mono shadow-xs">
        📊 {program.district_name}: {match.effectiveCutoff.toFixed(4)}
      </span>
    );
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-elevated hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Top Anchor Row: Authority Tag (Anchor 1) + 2024/25 Cutoff Pill (Anchor 2) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCourseProfile(program.uni_code)}
              className="font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-[var(--primitive-obsidian-900)] text-amber-300 hover:bg-slate-800 transition-colors shadow-xs"
              title="Inspect UGC Course Matrix"
            >
              {program.uni_code}
            </button>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {program.stream}
            </span>
          </div>
          {renderCutoffPill()}
        </div>

        {/* Title & University */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
          <button
            type="button"
            onClick={() => openCourseProfile(program.uni_code)}
            className="text-left hover:text-amber-700 transition-colors"
          >
            {program.course_name}
          </button>
        </h3>
        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => openInstitutionProfile(program.institution_code)}
            className="font-bold text-slate-800 hover:underline"
          >
            {program.institution_name} ({program.institution_code})
          </button>
          <span>·</span>
          <span>{program.institution_location}</span>
        </p>

        {/* Key Practical Requirements Alert Line (Consolidated) */}
        {(program.is_suspended || program.aptitude_test_required || program.requires_ol_special) && (
          <div className="flex flex-wrap gap-1.5 mt-3 text-xs">
            {program.is_suspended && (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold border border-rose-300">
                ⛔ Intake Suspended for 2025/26
              </span>
            )}
            {program.aptitude_test_required && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold border border-amber-300 inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                Aptitude Test Required
              </span>
            )}
            {program.requires_ol_special && (
              <span
                title="Special O/L Credit Pass Required under UGC Handbook Section 5.3"
                className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-950 font-bold border border-purple-300 cursor-help"
              >
                📋 Section 5.3 O/L Prerequisite
              </span>
            )}
          </div>
        )}

        {/* Factual Cutoff Comparison (When official Z is provided) */}
        {studentZ !== undefined && studentZ !== null && match.effectiveCutoff !== null && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-600">Your Z: <strong>{studentZ.toFixed(4)}</strong></span>
              <span className="font-bold">
                Margin:{' '}
                <span className={match.margin !== null && match.margin >= 0 ? 'text-emerald-700' : 'text-amber-700'}>
                  {match.margin !== null && match.margin >= 0 ? `+${match.margin.toFixed(4)}` : match.margin?.toFixed(4)}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Muted Secondary Specs Row */}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {program.duration_years} Years
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-slate-400" />
            {program.medium.map((m) => MEDIUM_LABELS[m] ?? m).join(', ')}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            {program.proposed_intake} Seats
          </span>
        </div>
      </div>

      {/* Bottom Action Row: + Plan & ⇄ Compare */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={program.is_suspended}
          onClick={() => (isInPlan ? removeFromPlan(program.uni_code) : addToPlan(program.uni_code))}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold interactive-surface flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
            program.is_suspended
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : isInPlan
              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
              : 'bg-[var(--primitive-obsidian-900)] text-white hover:bg-slate-800'
          }`}
        >
          {program.is_suspended ? (
            <span>⛔ Suspended</span>
          ) : isInPlan ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>In My Plan ✓</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Add to My Plan</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(program.uni_code)}
          className={`py-2 px-3 rounded-xl text-xs font-bold border interactive-surface flex items-center justify-center gap-1.5 transition-colors ${
            isInCompare
              ? 'border-amber-500 bg-amber-50 text-amber-950 font-extrabold shadow-xs'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
        </button>
      </div>
    </article>
  );
};
