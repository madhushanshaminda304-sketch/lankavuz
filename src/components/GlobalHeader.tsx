import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  ListChecks,
  Scale,
  Compass,
  Calendar,
  Calculator,
  GraduationCap,
  X,
  Check,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useApp, type LanguageCode, type ActiveRoute } from '../context/AppContext';
import { SRI_LANKA_DISTRICTS, UGC_INSTITUTIONS } from '../services/ugcDataService';

export const GlobalHeader: React.FC = () => {
  const {
    district,
    setDistrictId,
    isDistrictModalOpen,
    setIsDistrictModalOpen,
    lang,
    setLang,
    t,
    route,
    setRoute,
    districtPrograms,
    planEntries,
    setIsPlanDrawerOpen,
    compareList,
    openInstitutionProfile,
    openCourseProfile,
    setIsWelcomeOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [districtFilter, setDistrictFilter] = useState('');

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { programs: [], institutions: [] };

    const programs = districtPrograms
      .filter(
        (p) =>
          p.uni_code.toLowerCase().includes(q) ||
          p.course_name.toLowerCase().includes(q) ||
          p.institution_code.toLowerCase().includes(q) ||
          p.institution_name.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const institutions = UGC_INSTITUTIONS.filter(
      (i) =>
        i.institution_code.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    ).slice(0, 3);

    return { programs, institutions };
  }, [searchQuery, districtPrograms]);

  const filteredDistricts = useMemo(() => {
    const q = districtFilter.trim().toLowerCase();
    if (!q) return SRI_LANKA_DISTRICTS;
    return SRI_LANKA_DISTRICTS.filter(
      (d) =>
        d.district_name.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q) ||
        d.name_si.includes(q) ||
        d.name_ta.includes(q)
    );
  }, [districtFilter]);

  const navItems: { id: ActiveRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'predictor', label: t.navPredictor, icon: <Calculator className="w-4 h-4" /> },
    { id: 'home', label: t.navCatalog, icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'compare', label: t.navCompare, icon: <Scale className="w-4 h-4" />, badge: compareList.length },
    { id: 'careers', label: t.navCareers, icon: <Compass className="w-4 h-4" /> },
    { id: 'private-unis', label: t.navPrivateUnis ?? 'Private Campuses', icon: <Building2 className="w-4 h-4" /> },
    { id: 'calendar', label: t.navCalendar, icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[var(--color-brand-primary)] text-white shadow-md no-print">
        {/* Top Utility Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo + 25-District Switcher */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setRoute('home')}
              className="flex items-center gap-2.5 text-left group shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-accent)] text-slate-950 font-extrabold flex items-center justify-center text-lg shadow-sm">
                LV
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block leading-none">
                  Lanka<span className="text-amber-400">Vuz</span>
                </span>
                <span className="text-xs text-slate-300 hidden sm:block leading-tight">
                  Sri Lanka UGC & Degree Atlas
                </span>
              </div>
            </button>

            {/* Vuzopedia-style Global District Quota Switcher */}
            <button
              type="button"
              onClick={() => setIsDistrictModalOpen(true)}
              aria-label="Select Your G.C.E. A/L District"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-xs sm:text-sm font-medium interactive-surface shrink-0"
            >
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[170px]">
                {district.district_name} <span className="text-slate-300 hidden xl:inline">({district.name_si})</span>
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-tabular">
                #{district.district_id}
              </span>
            </button>
          </div>

          {/* Global Instant Search Bar (uni_code, Course, University) */}
          <div className="relative flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Search uni_code (001A, 008A), Medicine, CS, UOM..."
                aria-label="Search uni_code, course name, or university"
                className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-400 focus:border-amber-400"
              />
            </div>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 rounded-lg bg-white text-slate-900 shadow-xl border border-slate-200 overflow-hidden z-50">
                {searchResults.programs.length === 0 && searchResults.institutions.length === 0 ? (
                  <div className="p-3 text-xs text-slate-600">
                    No matching UGC uni_code or institution found for "{searchQuery}".
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {searchResults.programs.map((p) => (
                      <button
                        key={p.uni_code}
                        type="button"
                        onMouseDown={() => {
                          openCourseProfile(p.uni_code);
                          setSearchQuery('');
                        }}
                        className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-tabular font-bold text-xs px-1.5 py-0.5 rounded bg-slate-900 text-amber-300">
                              {p.uni_code}
                            </span>
                            <span className="font-semibold text-sm text-slate-900 truncate">
                              {p.course_name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 truncate">
                            {p.institution_name} ({p.institution_code})
                          </p>
                        </div>
                        <span className="font-tabular text-xs font-semibold text-emerald-700 shrink-0">
                          {p.min_z_score !== null ? `Z: ${p.min_z_score.toFixed(4)}` : 'NQC'}
                        </span>
                      </button>
                    ))}
                    {searchResults.institutions.map((inst) => (
                      <button
                        key={inst.institution_code}
                        type="button"
                        onMouseDown={() => {
                          openInstitutionProfile(inst.institution_code);
                          setSearchQuery('');
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between gap-2 bg-slate-50/60"
                      >
                        <span className="text-xs font-semibold text-slate-800">
                          🏛️ {inst.name} ({inst.institution_code})
                        </span>
                        <span className="text-xs text-slate-600">{inst.location}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions: Trilingual Switcher + 1-Click Backup CTA + My Admission Plan Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Trilingual Switcher (EN | සිං | தமிழ்) */}
            <div
              role="group"
              aria-label="Language switcher"
              className="hidden sm:inline-flex rounded-md bg-slate-900/90 p-0.5 border border-slate-700 text-xs"
            >
              {(['EN', 'SI', 'TA'] as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-1 rounded font-medium ${
                    lang === code
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {code === 'EN' ? 'EN' : code === 'SI' ? 'සිං' : 'தமிழ்'}
                </button>
              ))}
            </div>

            {/* Quick Setup Modal Replay */}
            <button
              type="button"
              onClick={() => setIsWelcomeOpen(true)}
              title="Replay Onboarding & Personalization Setup"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-amber-300 text-xs font-semibold interactive-surface"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Setup</span>
            </button>

            <button
              type="button"
              onClick={() => setRoute('private-unis')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-semibold interactive-surface"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.backupCta}</span>
            </button>

            {/* "My Admission Plan" (Мой план) Counter Pill */}
            <button
              type="button"
              onClick={() => setIsPlanDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-sm interactive-surface"
            >
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">{t.myPlan}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-tabular text-xs">
                {planEntries.length}
              </span>
            </button>
          </div>
        </div>

        {/* Clean 5-Link Navigation Bar (Replaces Vuzopedia's 12-link + 20-pill clutter) */}
        <nav
          aria-label="Primary navigation"
          className="border-t border-slate-800/80 bg-[var(--color-brand-secondary)] hidden sm:block"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = route === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRoute(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold interactive-surface ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[11px] font-tabular ${
                          isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => setRoute('my-plan')}
                className="hover:text-amber-300 underline underline-offset-4 font-medium"
              >
                Open Full Preference Simulator →
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile 375px Fixed Bottom App Bar (Vuzopedia Mobile Pattern) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-brand-primary)] border-t border-slate-800 text-white grid grid-cols-5 h-14 no-print"
      >
        <button
          type="button"
          onClick={() => setRoute('predictor')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            route === 'predictor' ? 'text-amber-400 font-bold' : 'text-slate-300'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Predictor</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('my-plan')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] relative ${
            route === 'my-plan' ? 'text-amber-400 font-bold' : 'text-slate-300'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>My Plan ({planEntries.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('home')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            route === 'home' ? 'text-amber-400 font-bold' : 'text-slate-300'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Catalog</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('compare')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            route === 'compare' ? 'text-amber-400 font-bold' : 'text-slate-300'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Compare</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('careers')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            route === 'careers' || route === 'career-quiz' ? 'text-amber-400 font-bold' : 'text-slate-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Careers</span>
        </button>
      </nav>

      {/* Global 25-District Quota Switcher Modal */}
      {isDistrictModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="district-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[var(--color-brand-primary)] text-white flex items-center justify-between">
              <div>
                <h2 id="district-modal-title" className="text-lg font-bold">
                  Select Your G.C.E. A/L School District (25 Administrative Districts)
                </h2>
                <p className="text-xs text-slate-300">
                  ඔබේ දිස්ත්‍රික්කය තෝරන්න · உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும் — Dynamically updates all UGC 55% district quota Z-scores across the site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDistrictModalOpen(false)}
                aria-label="Close district selector"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <input
                type="search"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                placeholder="Filter by district name or province (e.g. Colombo, Kandy, Jaffna, Southern)..."
                aria-label="Filter districts"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
              />
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredDistricts.map((d) => {
                const isSelected = d.district_id === district.district_id;
                return (
                  <button
                    key={d.district_id}
                    type="button"
                    onClick={() => {
                      setDistrictId(d.district_id);
                      setIsDistrictModalOpen(false);
                    }}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between interactive-surface ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/90 text-slate-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-tabular text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          #{String(d.district_id).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold">{d.district_name}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {d.name_si} · {d.name_ta}
                      </p>
                      <span className="text-[11px] text-slate-500">{d.province} Province</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
