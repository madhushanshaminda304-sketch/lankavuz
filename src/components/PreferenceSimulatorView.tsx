import React, { useMemo } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Trash2,
  AlertTriangle,
  Sparkles,
  Printer,
  Share2,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auditPreferenceOrder, classifyProgramMatch, type PreferencePlanItem } from '../lib/ugcLogic';

export const PreferenceSimulatorContent: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    district,
    studentZScore,
    districtPrograms,
    planEntries,
    addToPlan,
    removeFromPlan,
    movePlanItem,
    toggleLockPlanItem,
    autoOptimizePlan,
    openCourseProfile,
  } = useApp();

  const resolvedList = useMemo(() => {
    return planEntries.map((entry, idx) => {
      const prog = districtPrograms.find((p) => p.uni_code === entry.uni_code);
      return {
        index: idx,
        uni_code: entry.uni_code,
        locked: entry.locked,
        course_name: prog?.course_name ?? 'UGC Program',
        degree_awarded: prog?.degree_awarded ?? '',
        institution_code: prog?.institution_code ?? '',
        institution_name: prog?.institution_name ?? '',
        min_z_score: prog?.min_z_score ?? null,
        status: prog?.status ?? 'QUALIFIED',
        all_island_merit_only: prog?.all_island_merit_only ?? false,
        aptitude_test_required: prog?.aptitude_test_required ?? false,
        is_suspended: prog?.is_suspended ?? false,
        requires_ol_special: prog?.requires_ol_special ?? false,
      };
    });
  }, [planEntries, districtPrograms]);

  const suspendedItems = useMemo(() => {
    return resolvedList.filter((r) => r.is_suspended);
  }, [resolvedList]);

  const conflicts = useMemo(() => {
    const auditInput: PreferencePlanItem[] = resolvedList.map((r) => ({
      uni_code: r.uni_code,
      course_name: r.course_name,
      institution_code: r.institution_code,
      min_z_score: r.min_z_score,
      locked: r.locked,
    }));
    return auditPreferenceOrder(auditInput);
  }, [resolvedList]);

  // Simulate which preference the UGC computer algorithm will actually assign for studentZScore
  const simulatedAssignedIndex = useMemo(() => {
    return resolvedList.findIndex(
      (item) => item.min_z_score !== null && studentZScore >= item.min_z_score && !item.is_suspended
    );
  }, [resolvedList, studentZScore]);

  const handleWhatsAppShare = () => {
    const lines = resolvedList.map(
      (item, idx) =>
        `${idx + 1}. ${item.uni_code} — ${item.course_name} (${item.institution_code}) [Cutoff: ${
          item.min_z_score !== null ? item.min_z_score.toFixed(4) : 'NQC'
        }]`
    );
    const text = `My Sri Lankan UGC Admission Preference Sheet (${district.district_name} District | My Z-Score: ${studentZScore.toFixed(
      4
    )}):\n\n${lines.join('\n')}\n\nAudited via LankaVuz`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quickAddCandidates = useMemo(() => {
    return districtPrograms
      .filter((p) => !planEntries.some((e) => e.uni_code === p.uni_code))
      .slice(0, 6);
  }, [districtPrograms, planEntries]);

  return (
    <div className="space-y-5">
      {/* Top Action & Status Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-amber-300">Official UGC Computer Selection Algorithm Simulator</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{district.district_name} District</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-tabular font-bold border border-amber-500/30">
              Saved Preferences: {planEntries.length} / 125 Max Allowed (UGC Rule Section 3.1.6)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            The UGC computer assigns the <strong>highest preference (#1 → #N)</strong> for which your Z-score ({studentZScore.toFixed(4)}) meets the cutoff, and ignores every choice below it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={autoOptimizePlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Optimize by Z-Score Priority</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Sheet</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Suspended Course Warning Banner */}
      {suspendedItems.length > 0 && (
        <div role="alert" className="p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 space-y-1">
          <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
            <span>⛔ Warning: Suspended Intake Course in Your Plan!</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
            The following choice(s) are currently suspended for the 2025/2026 intake under UGC Curriculum Review:{' '}
            <strong>{suspendedItems.map((s) => `${s.uni_code} (${s.course_name})`).join(', ')}</strong>. Please remove or replace them before final submission.
          </p>
        </div>
      )}

      {/* Smart "Preference Order Conflict" Auditor Banner */}
      {conflicts.length > 0 ? (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <span>
                ⚠️ {conflicts.length} Preference Order Conflict{conflicts.length > 1 ? 's' : ''} Detected!
              </span>
            </div>
            <button
              type="button"
              onClick={autoOptimizePlan}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0"
            >
              Fix Order Automatically
            </button>
          </div>

          <ul className="space-y-1.5 text-xs sm:text-sm text-amber-900">
            {conflicts.map((c) => (
              <li key={`${c.upperUniCode}-${c.lowerUniCode}`} className="leading-relaxed">
                • {c.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        resolvedList.length > 1 && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Optimal UGC Preference Order! Your choices are properly ordered from highest Z-score difficulty to safest fallback (respecting any locked hometown overrides).
            </span>
          </div>
        )
      )}

      {/* Ordered Preference List */}
      <div className="space-y-2.5">
        {resolvedList.map((item, idx) => {
          const isSimulatedWinner = idx === simulatedAssignedIndex;
          const hasConflictHere = conflicts.some((c) => c.upperIndex === idx || c.lowerIndex === idx);
          const match = classifyProgramMatch({
            studentZ: studentZScore,
            minZScore: item.min_z_score,
            status: item.status,
            allIslandMeritOnly: item.all_island_merit_only,
          });

          return (
            <div
              key={item.uni_code}
              className={`rounded-xl border p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSimulatedWinner
                  ? 'border-2 border-emerald-600 ring-2 ring-emerald-500/20'
                  : hasConflictHere
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Preference Number Badge */}
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-tabular font-extrabold text-sm flex items-center justify-center shrink-0">
                  #{idx + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openCourseProfile(item.uni_code)}
                      className="font-tabular font-extrabold text-xs px-2 py-0.5 rounded bg-[var(--color-brand-primary)] text-amber-300"
                    >
                      {item.uni_code}
                    </button>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {item.course_name}
                    </h4>
                    <span className="text-xs font-semibold text-slate-600">
                      ({item.institution_name} · {item.institution_code})
                    </span>
                    {isSimulatedWinner && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold">
                        🎯 UGC Computer Assigns You Here (at Z = {studentZScore.toFixed(4)})
                      </span>
                    )}
                    {item.locked && (
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px] font-bold">
                        🔒 Hometown / Manual Priority Locked
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-tabular text-slate-700">
                    <span>
                      {district.district_name} Cutoff:{' '}
                      <strong className="text-slate-950">
                        {item.min_z_score !== null ? item.min_z_score.toFixed(4) : 'NQC'}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Tier:{' '}
                      <strong
                        className={
                          match.tier === 'SAFE'
                            ? 'text-emerald-700'
                            : match.tier === 'TARGET'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }
                      >
                        {match.tier}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reorder, Lock & Remove Controls */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 no-print">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => movePlanItem(idx, 'up')}
                  aria-label={`Move ${item.uni_code} up`}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ArrowUp className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  disabled={idx === resolvedList.length - 1}
                  onClick={() => movePlanItem(idx, 'down')}
                  aria-label={`Move ${item.uni_code} down`}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ArrowDown className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleLockPlanItem(item.uni_code)}
                  title={
                    item.locked
                      ? 'Unlock position so Auto-Optimize can sort this item'
                      : 'Lock position (e.g. hometown university preference override)'
                  }
                  aria-label={item.locked ? `Unlock ${item.uni_code}` : `Lock ${item.uni_code}`}
                  className={`p-2 rounded-lg border ${
                    item.locked
                      ? 'border-amber-500 bg-amber-100 text-amber-900'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeFromPlan(item.uni_code)}
                  aria-label={`Remove ${item.uni_code} from plan`}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick-Add More uni_code Options */}
      {!compact && quickAddCandidates.length > 0 && (
        <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 no-print">
          <h3 className="text-xs font-extrabold text-slate-700 mb-2.5">
            Quick-Add More UGC uni_code Options to Your Preference Sheet:
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickAddCandidates.map((cand) => (
              <button
                key={cand.uni_code}
                type="button"
                onClick={() => addToPlan(cand.uni_code)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-amber-500 text-xs font-semibold text-slate-800"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-tabular font-bold">{cand.uni_code}</span>
                <span>
                  {cand.course_name} ({cand.institution_code})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Official UGC Submission & Post-Submission Rules Checklist (Section 3 & 5) */}
      <section className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 space-y-4 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-extrabold text-sm sm:text-base text-amber-300 flex items-center gap-2">
            <span>📜 Official UGC Submission & Post-Submission Rules Checklist</span>
          </h3>
          <span className="text-[11px] font-tabular px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            Handbook Sections 3 & 5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="text-amber-400">1.</span> Registered Post Mandatory (Section 5.9)
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Submitting online is only for data entry verification. You <strong>MUST print</strong> the generated application, sign it with your parent/guardian, and send the hardcopy with certified copies of A/L and O/L certificates via <strong>Registered Post</strong> to the UGC Admissions Division before the deadline.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="text-amber-400">2.</span> One-Time 2-Week Amendment Window (Section 3.3)
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Candidates are permitted to log in to reorder, add, or remove <code className="font-tabular text-amber-300">uni_code</code> choices only <strong>ONCE</strong> within two weeks of the initial closing date. The revised signed printout must again be mailed by Registered Post.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="text-amber-400">3.</span> Automatic Promotion on Vacancies (Section 3.2)
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              You must register for whatever course you are offered in Round 1 to remain eligible for automatic upgrading to higher preference courses as vacancies open. <em>Mutual transfers between students are strictly prohibited by law.</em>
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="text-amber-400">4.</span> 1-Year Maximum Postponement Rule
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Postponing admission is granted for medical or national reasons for a maximum of 1 academic year. Postponement locks you into the same selected <code className="font-tabular text-amber-300">uni_code</code> and permanently forfeits applying using a later year's A/L sitting.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const PreferenceSimulatorView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      <div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
          Vuzopedia "Мой план" + Sri Lankan UGC Preference Sheet Auditor
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          My UGC Admission Plan & Preference Order Simulator
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Order your <code className="font-tabular bg-slate-100 px-1.5 py-0.5 rounded">uni_code</code> choices before submitting on <code className="font-tabular">ugc.ac.lk</code>. Instant conflict detection protects you from locking out higher-cutoff dream degrees.
        </p>
      </div>
      <PreferenceSimulatorContent />
    </div>
  );
};

export const PreferenceSimulatorDrawer: React.FC = () => {
  const { isPlanDrawerOpen, setIsPlanDrawerOpen, setRoute } = useApp();

  if (!isPlanDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-drawer-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end no-print"
    >
      <div className="bg-slate-50 w-full max-w-2xl h-full flex flex-col shadow-2xl border-l border-slate-200 drawer-transition">
        <div className="px-5 py-4 bg-[var(--color-brand-primary)] text-white flex items-center justify-between">
          <div>
            <h2 id="plan-drawer-title" className="text-base sm:text-lg font-extrabold">
              My UGC Admission Plan & Preference Order Auditor
            </h2>
            <p className="text-xs text-slate-300">
              Reorder your uni_code sequence or click Auto-Optimize to fix cutoff conflicts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPlanDrawerOpen(false)}
            aria-label="Close preference drawer"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <PreferenceSimulatorContent compact />
        </div>

        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsPlanDrawerOpen(false);
              setRoute('my-plan');
            }}
            className="text-xs sm:text-sm font-bold text-amber-700 hover:underline"
          >
            Open Full Printable UGC Code Sheet View →
          </button>
          <button
            type="button"
            onClick={() => setIsPlanDrawerOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
