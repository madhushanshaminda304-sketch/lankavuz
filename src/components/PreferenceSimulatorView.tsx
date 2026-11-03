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
  FileCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auditPreferenceOrder, type PreferencePlanItem } from '../lib/ugcLogic';
import { getLocalizedDistrictName } from '../lib/i18n';

export const PreferenceSimulatorContent: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    district,
    studentZScore,
    studentStream,
    districtPrograms,
    planEntries,
    addToPlan,
    removeFromPlan,
    movePlanItem,
    toggleLockPlanItem,
    autoOptimizePlan,
    openCourseProfile,
    t,
    lang,
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
        medium: prog?.medium ? prog.medium.join(', ') : 'English',
        proposed_intake: prog?.proposed_intake ?? 100,
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

  // Simulate which preference the UGC algorithm will assign
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Screen Top Action & Status Bar */}
      <div className="bg-[var(--primitive-obsidian-900)] text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800 no-print">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-amber-400">Official UGC Preference Sequence Simulator</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{district.district_name} District</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] border border-amber-400/30">
              {planEntries.length} / 125 Choices Used
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            The UGC computer evaluates preferences top-to-bottom (#1 → #N). Once you qualify for a higher choice, all lower choices are permanently eliminated.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={autoOptimizePlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md interactive-surface"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.autoOptimize || "Auto-Optimize by Cutoff"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 interactive-surface"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.printSchedule || "Print Official Preference Sheet"}</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold interactive-surface"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Suspended Course Warning Banner */}
      {suspendedItems.length > 0 && (
        <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-400 text-rose-950 space-y-1 no-print">
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

      {/* Smart Conflict Auditor Banner */}
      {conflicts.length > 0 ? (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2.5 no-print"
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

          <ul className="space-y-1 text-xs sm:text-sm text-amber-900">
            {conflicts.map((c) => (
              <li key={`${c.upperUniCode}-${c.lowerUniCode}`} className="leading-relaxed">
                • {c.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        resolvedList.length > 1 && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-2.5 text-xs sm:text-sm font-semibold no-print">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Optimal UGC Preference Order! Your choices are properly ordered from highest Z-score difficulty to safest fallback.
            </span>
          </div>
        )
      )}

      {/* Screen Preference Items List */}
      <div className="space-y-2.5 no-print">
        {resolvedList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700">Your UGC Preference Order is empty.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Browse the Course & Cutoff Finder and click <strong>"+ Add to My UGC Plan"</strong> on any degree to start building your verified sequence.
            </p>
          </div>
        ) : (
          resolvedList.map((item, idx) => {
            const isAssigned = idx === simulatedAssignedIndex;
            return (
              <div
                key={item.uni_code}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isAssigned
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--primitive-obsidian-900)] text-amber-300 font-mono font-black text-sm flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {item.uni_code}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900 truncate">
                        {item.course_name}
                      </span>
                      {isAssigned && (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                          Simulated Assignment
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {item.institution_name} ({item.institution_code}) · Cutoff: {item.min_z_score !== null ? item.min_z_score.toFixed(4) : 'NQC'}
                    </p>
                  </div>
                </div>

                {/* Move & Lock Controls */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => movePlanItem(idx, 'up')}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === resolvedList.length - 1}
                    onClick={() => movePlanItem(idx, 'down')}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLockPlanItem(item.uni_code)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold ${
                      item.locked
                        ? 'border-amber-400 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                    title={item.locked ? 'Locked (won’t move in Auto-Optimize)' : 'Unlocked'}
                  >
                    {item.locked ? <Lock className="w-4 h-4 text-amber-700" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromPlan(item.uni_code)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove from plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================
          OFFICIAL PRINT-ONLY SCHEDULE (Format matching UGC handbook)
         ======================================================== */}
      <div className="hidden print:block space-y-6 pt-4 text-black">
        {/* Official Letterhead Header */}
        <div className="border-b-2 border-black pb-4 text-center space-y-1">
          <div className="text-xs uppercase tracking-widest font-bold">University Grants Commission — Sri Lanka</div>
          <h1 className="text-lg font-black uppercase">
            Official Higher Education Preference Order & Submission Verification Schedule
          </h1>
          <div className="text-xs text-slate-600 font-mono">
            Generated via LankaVuz Verified UGC Decision Engine · Academic Cycle 2024/2025
          </div>
        </div>

        {/* Candidate & District Metadata Schedule */}
        <div className="grid grid-cols-2 gap-4 border border-black p-3 text-xs font-mono">
          <div>
            <div><strong>Candidate Quota District:</strong> {district.district_name} (#{district.district_id})</div>
            <div><strong>G.C.E. A/L Stream:</strong> {studentStream}</div>
          </div>
          <div>
            <div><strong>Official G.C.E. A/L Z-Score:</strong> {studentZScore.toFixed(4)}</div>
            <div><strong>Date of Verification:</strong> {new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        {/* Official Numbered Table */}
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border border-black p-1.5 text-center w-12">Pref #</th>
              <th className="border border-black p-1.5 text-center w-16">Code</th>
              <th className="border border-black p-1.5">Degree Title & Course of Study</th>
              <th className="border border-black p-1.5">University / Campus</th>
              <th className="border border-black p-1.5 text-center">Medium</th>
              <th className="border border-black p-1.5 text-center">2024/25 Cutoff</th>
              <th className="border border-black p-1.5 text-center">Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {resolvedList.map((item, idx) => (
              <tr key={item.uni_code}>
                <td className="border border-black p-1.5 text-center font-bold">{idx + 1}</td>
                <td className="border border-black p-1.5 text-center font-mono font-bold">{item.uni_code}</td>
                <td className="border border-black p-1.5">
                  <div className="font-bold">{item.course_name}</div>
                  {item.aptitude_test_required && (
                    <span className="text-[10px] text-amber-800">[Aptitude Test Required]</span>
                  )}
                </td>
                <td className="border border-black p-1.5">{item.institution_name} ({item.institution_code})</td>
                <td className="border border-black p-1.5 text-center">{item.medium}</td>
                <td className="border border-black p-1.5 text-center font-mono font-bold">
                  {item.min_z_score !== null ? item.min_z_score.toFixed(4) : 'NQC'}
                </td>
                <td className="border border-black p-1.5 text-center text-[10px] font-bold">
                  {item.is_suspended ? '⛔ SUSPENDED' : 'VALID'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* UGC Postal Submission Checklist */}
        <div className="border border-black p-3 space-y-2 text-xs">
          <div className="font-bold uppercase tracking-wider text-[11px]">
            Statutory UGC Postal Submission Checklist (Section 3.1.6):
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div>[ ] 1. Entered identical preference numbers (#1 → #{resolvedList.length}) on the official online admission portal (admission.ugc.ac.lk).</div>
            <div>[ ] 2. Downloaded and signed the hardcopy of the online application form.</div>
            <div>[ ] 3. Certified copies of G.C.E. A/L and O/L result sheets attached and certified by school Principal / Justice of Peace.</div>
            <div>[ ] 4. Grama Niladhari residency certificate confirming 3-year residency for {district.district_name} quota eligibility.</div>
            <div>[ ] 5. Posted via REGISTERED POST to Senior Assistant Secretary (University Admissions), UGC, No. 20, Ward Place, Colombo 07 before the published deadline.</div>
          </div>
        </div>

        {/* Official Signatures Schedule */}
        <div className="grid grid-cols-2 gap-8 pt-6 text-xs">
          <div className="border-t border-black pt-1 text-center">
            Candidate Signature & Date
          </div>
          <div className="border-t border-black pt-1 text-center">
            Certifying Officer / Parent Signature & Date
          </div>
        </div>
      </div>
    </div>
  );
};

export const PreferenceSimulatorView: React.FC = () => {
  const { t } = useApp();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      <div className="no-print">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
          Official Sri Lanka UGC Preference Order Simulator
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {t.myPlan}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Order your <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">uni_code</code> choices before submitting on <code className="font-mono">admission.ugc.ac.lk</code>. Instant conflict detection protects you from locking out higher-cutoff choices.
        </p>
      </div>

      <PreferenceSimulatorContent />
    </div>
  );
};

export const PreferenceSimulatorDrawer: React.FC = () => {
  const { isPlanDrawerOpen, setIsPlanDrawerOpen, setRoute, t } = useApp();

  if (!isPlanDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-drawer-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end no-print animate-fade-in-up"
    >
      <div className="bg-slate-50 w-full max-w-2xl h-full flex flex-col shadow-2xl border-l border-slate-200">
        <div className="px-5 py-4 bg-[var(--primitive-obsidian-900)] text-white flex items-center justify-between">
          <div>
            <h2 id="plan-drawer-title" className="text-base sm:text-lg font-extrabold">
              {t.myPlan}
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
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
