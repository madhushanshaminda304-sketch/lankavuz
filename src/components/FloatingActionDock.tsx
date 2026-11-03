import React from 'react';
import { ListChecks, Scale, ArrowRight, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingActionDock: React.FC = () => {
  const {
    compareList,
    setComparePreset,
    planEntries,
    setIsPlanDrawerOpen,
    setRoute,
    route,
    t,
  } = useApp();

  const hasCompare = compareList.length > 0;
  const hasPlan = planEntries.length > 0;

  // Only show if user has added items to compare or plan, and not on print
  if (!hasCompare && !hasPlan) {
    return null;
  }

  // If already on compare page or my-plan, hide to prevent redundancy
  if (route === 'compare' && !hasPlan) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Active plan and comparison dock"
      className="fixed bottom-16 sm:bottom-6 inset-x-4 sm:inset-x-0 mx-auto z-40 max-w-xl no-print animate-fade-in-up"
    >
      <div className="glass-dock rounded-2xl p-2.5 sm:p-3 text-white flex items-center justify-between gap-3 shadow-2xl">
        {/* Left: Active Badges */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {hasPlan && (
            <button
              type="button"
              onClick={() => setIsPlanDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors shrink-0"
            >
              <ListChecks className="w-4 h-4 text-amber-400" />
              <span>{t.myPlanShort}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[11px]">
                {planEntries.length}
              </span>
            </button>
          )}

          {hasCompare && (
            <button
              type="button"
              onClick={() => setRoute('compare')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold hover:bg-sky-500/30 transition-colors shrink-0"
            >
              <Scale className="w-4 h-4 text-sky-400" />
              <span>{t.comparing}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-sky-500 text-slate-950 font-mono text-[11px]">
                {compareList.length}
              </span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hasCompare && (
            <button
              type="button"
              onClick={() => setRoute('compare')}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>{t.compare}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {hasPlan && !hasCompare && (
            <button
              type="button"
              onClick={() => setRoute('my-plan')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Audit Preferences</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {hasCompare && (
            <button
              type="button"
              onClick={() => setComparePreset([])}
              title="Clear Comparison List"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
