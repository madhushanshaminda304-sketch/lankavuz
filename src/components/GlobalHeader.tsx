import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  ListChecks,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Building2,
  Compass,
  Command,
  X,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp, type ActiveRoute } from '../context/AppContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, getLocalizedDistrictName, normalizeLangCode, type LanguageCode } from '../lib/i18n';
import { SRI_LANKA_DISTRICTS, UGC_INSTITUTIONS, NON_STATE_IFSLS_PATHWAYS } from '../data/sriLankaUgcSnapshot';

export const GlobalHeader: React.FC = () => {
  const { t: translate } = useTranslation();
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
    openInstitutionProfile,
    openCourseProfile,
    setIsWelcomeOpen,
  } = useApp();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Focus input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setPaletteQuery('');
    }
  }, [isCommandPaletteOpen]);

  // Command palette search results
  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) {
      return {
        courses: districtPrograms.slice(0, 4),
        institutions: UGC_INSTITUTIONS.slice(0, 3),
        privateUnis: NON_STATE_IFSLS_PATHWAYS.slice(0, 3),
      };
    }

    const courses = districtPrograms
      .filter(
        (p) =>
          p.uni_code.toLowerCase().includes(q) ||
          p.course_name.toLowerCase().includes(q) ||
          p.institution_code.toLowerCase().includes(q) ||
          p.institution_name.toLowerCase().includes(q) ||
          p.stream.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const institutions = UGC_INSTITUTIONS.filter(
      (i) =>
        i.institution_code.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    ).slice(0, 3);

    const privateUnis = NON_STATE_IFSLS_PATHWAYS.filter(
      (p) =>
        p.institute_abbr.toLowerCase().includes(q) ||
        p.institute_name.toLowerCase().includes(q) ||
        p.degree_title.toLowerCase().includes(q)
    ).slice(0, 3);

    return { courses, institutions, privateUnis };
  }, [paletteQuery, districtPrograms]);

  // District filter
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

  // 4 Core Hubs Navigation (Streamlined concise titles to prevent navbar overflow in Sinhala/Tamil)
  const navItems: { id: ActiveRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'predictor',
      label: t.navPredictorShort || t.navPredictor,
      icon: <Search className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'my-plan',
      label: t.myPlanShort || t.myPlan,
      icon: <ListChecks className="w-3.5 h-3.5 shrink-0" />,
      badge: planEntries.length,
    },
    {
      id: 'private-unis',
      label: t.navPrivateUnisShort || t.navPrivateUnis,
      icon: <Building2 className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'careers',
      label: t.navCareersShort || t.navCareers,
      icon: <Compass className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[var(--primitive-obsidian-900)] text-white shadow-md no-print">
        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Quota Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setRoute('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-sm group-hover:scale-105 transition-transform">
                LV
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block leading-none text-white">
                  Lanka<span className="text-amber-400">Vuz</span>
                </span>
                <span className="text-[11px] text-slate-400 hidden 2xl:block leading-tight font-medium truncate max-w-[180px]">
                  {t.brandSubtitle}
                </span>
              </div>
            </button>

            {/* Quota District Switcher */}
            <button
              type="button"
              onClick={() => setIsDistrictModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold interactive-surface"
              title="Change G.C.E. A/L Quota District"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[120px] font-bold">{getLocalizedDistrictName(district, lang)}</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-tabular text-[11px]">
                #{district.district_id}
              </span>
            </button>
          </div>

          {/* Desktop 4 Core Hubs Navigation (Responsive with truncation to protect layout borders) */}
          <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-1 min-w-0">
            {navItems.map((item) => {
              const isActive = route === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRoute(item.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span className="truncate max-w-[110px] 2xl:max-w-none">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-tabular shrink-0 ${
                        isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: ⌘K Palette Button, Language, Setup */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Global ⌘K Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 text-xs interactive-surface"
              title="Search uni_codes, courses & campuses (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden 2xl:inline text-slate-400 truncate max-w-[140px]">{t.searchNavPlaceholder}</span>
              <span className="hidden sm:inline 2xl:hidden">{t.search}</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Language Switcher (Always visible on mobile & desktop) */}
            <div
              role="group"
              aria-label="Language selector"
              className="inline-flex rounded-lg bg-slate-950/80 p-0.5 border border-slate-800 text-[11px] font-bold shrink-0"
            >
              {SUPPORTED_LANGUAGES.map((l) => {
                const isActive = normalizeLangCode(lang) === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLang(l.upper);
                      toast.success(
                        l.code === 'si'
                          ? 'භාෂාව සාර්ථකව සිංහලට මාරු කරන ලදී'
                          : l.code === 'ta'
                          ? 'மொழி வெற்றிகரமாக தமிழுக்கு மாற்றப்பட்டது'
                          : 'Language switched to English',
                        { duration: 2500 }
                      );
                    }}
                    title={l.nativeName}
                    aria-pressed={isActive}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Setup Modal Replay */}
            <button
              type="button"
              onClick={() => setIsWelcomeOpen(true)}
              title="Replay Personalization Setup"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-semibold interactive-surface"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.setup}</span>
            </button>

            {/* "My Plan" Counter Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsPlanDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm interactive-surface"
            >
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">{t.myPlanShort}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-tabular text-xs">
                {planEntries.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Fixed Bottom Hub Navigation Bar */}
      <nav
        aria-label="Mobile bottom navigation"
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--primitive-obsidian-900)] border-t border-slate-800 text-white grid grid-cols-4 h-14 no-print shadow-xl"
      >
        <button
          type="button"
          onClick={() => setRoute('predictor')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] min-w-0 px-1 overflow-hidden ${
            route === 'predictor' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-full text-center leading-tight">{t.navPredictorShort}</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('my-plan')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] min-w-0 px-1 overflow-hidden relative ${
            route === 'my-plan' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ListChecks className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-full text-center leading-tight">{t.myPlanShort} ({planEntries.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('private-unis')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] min-w-0 px-1 overflow-hidden ${
            route === 'private-unis' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-full text-center leading-tight">{t.navPrivateUnisShort}</span>
        </button>
        <button
          type="button"
          onClick={() => setRoute('careers')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] min-w-0 px-1 overflow-hidden ${
            route === 'careers' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-full text-center leading-tight">{t.navCareersShort}</span>
        </button>
      </nav>

      {/* Global ⌘K Command Palette Modal */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Search by uni_code (008G, 012T), course name, university..."
                className="w-full bg-transparent text-sm font-semibold outline-hidden placeholder:text-slate-400 text-slate-900"
              />
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Body */}
            <div className="overflow-y-auto p-3 space-y-4 text-xs divide-y divide-slate-100">
              {/* Courses Results */}
              <div>
                <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>UGC Degree Programs ({paletteResults.courses.length})</span>
                </div>
                <div className="mt-1 space-y-1">
                  {paletteResults.courses.map((c) => (
                    <button
                      key={c.uni_code}
                      type="button"
                      onClick={() => {
                        openCourseProfile(c.uni_code);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[var(--primitive-obsidian-900)] text-amber-300 font-mono font-bold text-xs">
                            {c.uni_code}
                          </span>
                          <span className="font-bold text-slate-900 group-hover:text-amber-700 truncate text-xs sm:text-sm">
                            {c.course_name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {c.institution_name} ({c.institution_code}) · {c.stream}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">
                        {c.min_z_score !== null ? `Z: ${c.min_z_score.toFixed(4)}` : 'NQC'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* State Universities */}
              {paletteResults.institutions.length > 0 && (
                <div className="pt-3">
                  <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>State Universities</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {paletteResults.institutions.map((inst) => (
                      <button
                        key={inst.institution_code}
                        type="button"
                        onClick={() => {
                          openInstitutionProfile(inst.institution_code);
                          setIsCommandPaletteOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {inst.name} ({inst.institution_code})
                          </div>
                          <p className="text-[11px] text-slate-500">{inst.location} · {inst.type}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Private & Non-State Campuses */}
              {paletteResults.privateUnis.length > 0 && (
                <div className="pt-3">
                  <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Private & IFSLS Campuses</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {paletteResults.privateUnis.map((p) => (
                      <a
                        key={p.id}
                        href={p.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {p.degree_title}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {p.institute_name} ({p.institute_abbr}) · {p.tuition_note_lkr}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Hint */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">ESC</kbd> to close</span>
              <span>LankaVuz Quick Command Engine</span>
            </div>
          </div>
        </div>
      )}

      {/* 25-District Quota Switcher Modal */}
      {isDistrictModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in-up"
          onClick={() => setIsDistrictModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>{t.districtModalTitle}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  UGC applies 40% Merit + 55% District Quota + 5% Underprivileged quota formulas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDistrictModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter for districts */}
            <input
              type="text"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              placeholder={t.districtSearchPlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:border-amber-500 outline-hidden"
            />

            {/* District list grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pr-1 flex-1">
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
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold">{d.district_name}</span>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        #{d.district_id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">{d.province} Prov.</div>
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
