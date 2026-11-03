import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building2,
  BookOpen,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Scale,
  Award,
  Globe,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  SRI_LANKA_DISTRICTS,
  UGC_COURSES,
  UGC_INSTITUTIONS,
  NON_STATE_IFSLS_PATHWAYS,
} from '../data/sriLankaUgcSnapshot';
import { ProgramChanceCard } from './ProgramChanceCard';

export const HomeDiscoveryView: React.FC = () => {
  const {
    district,
    setDistrictId,
    setIsDistrictModalOpen,
    districtPrograms,
    t,
    studentZScore,
    setStudentZScore,
    studentStream,
    setStudentStream,
    setRoute,
    openInstitutionProfile,
    openCourseProfile,
  } = useApp();

  const [heroZInput, setHeroZInput] = useState<string>(
    studentZScore !== null ? studentZScore.toFixed(4) : '1.5200'
  );

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(heroZInput);
    if (!isNaN(parsed)) {
      setStudentZScore(parsed);
    }
    setRoute('predictor');
  };

  // Quick 6 curated offerings for the active district
  const quickMatches = useMemo(() => {
    return districtPrograms
      .filter((p) => {
        if (studentStream !== 'ALL' && p.stream !== studentStream && p.stream !== 'Other') {
          return false;
        }
        return true;
      })
      .slice(0, 6);
  }, [districtPrograms, studentStream]);

  return (
    <div className="space-y-12 pb-24">
      {/* ========================================================
          PRESTIGIOUS HERO & INTERACTIVE STRATEGY DECK
         ======================================================== */}
      <section className="bg-gradient-to-b from-[var(--primitive-obsidian-950)] via-[var(--primitive-obsidian-900)] to-[var(--primitive-obsidian-850)] text-white border-b border-slate-800/80 pt-10 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background ambient light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          {/* Top Pill: District Quota Context */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-amber-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Active Quota District: <strong>{district.district_name}</strong> (#{district.district_id})
              </span>
              <button
                type="button"
                onClick={() => setIsDistrictModalOpen(true)}
                className="underline hover:text-white ml-1 font-bold text-amber-200"
              >
                Change
              </button>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official 2024/2025 Academic Cutoff Data Verified</span>
            </span>
          </div>

          {/* Hero Typography */}
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {t.heroTitle || 'Sri Lanka Higher Education & 2024/25 Cutoff Atlas'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {t.heroSub || 'Compare your official G.C.E. A/L Z-score directly against verified historical cutoffs across 21 State UGC Universities, MOHE Interest-Free Student Loans (IFSLS), and Direct Private / Foreign Degree Pathways.'}
            </p>
          </div>

          {/* ========================================================
              INTERACTIVE 3-INPUT QUICK-CHECK BAR (Hero Action Deck)
             ======================================================== */}
          <form
            onSubmit={handleHeroSubmit}
            className="p-3 sm:p-4 rounded-2xl glass-panel-dark border border-slate-700/80 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
          >
            {/* 1. District */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Quota District</span>
              </label>
              <select
                value={district.district_id}
                onChange={(e) => setDistrictId(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-semibold text-white focus:border-amber-400 focus:outline-hidden"
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d.district_id} value={d.district_id}>
                    {d.district_id}. {d.district_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Stream */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                <span>2. G.C.E. A/L Stream</span>
              </label>
              <select
                value={studentStream}
                onChange={(e) => setStudentStream(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-semibold text-white focus:border-amber-400 focus:outline-hidden"
              >
                <option value="Physical Science">Physical Science (Maths)</option>
                <option value="Biological Science">Biological Science (Bio)</option>
                <option value="Commerce">Commerce</option>
                <option value="Technology">Technology</option>
                <option value="Arts">Arts</option>
                <option value="ALL">All Streams / Multidisciplinary</option>
              </select>
            </div>

            {/* 3. Official Z-Score */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Official Z-Score (Optional)</span>
              </label>
              <input
                type="number"
                step="0.0001"
                min="-1.5"
                max="3.5"
                value={heroZInput}
                onChange={(e) => setHeroZInput(e.target.value)}
                placeholder="e.g. 1.6250"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono font-bold text-amber-300 placeholder:text-slate-500 focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md interactive-surface flex items-center justify-center gap-2"
              >
                <span>{t.ctaSafeTargetReach || 'Explore 2024/25 Cutoffs'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>140+ UGC Degree Codes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>25 District Quotas Tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>14 MOHE 0% Loan Campuses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-Prediction Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          THE 3 ARCHETYPE DOORS (High-Aesthetic Strategy Cards)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
            Choose Your Journey
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Explore Sri Lanka Higher Education Pathways
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select the door tailored to your current examination results and financial preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Door 1: State UGC Free Degrees */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-amber-400/80 transition-all flex flex-col justify-between gap-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                🏛️
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Tier 1</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  State UGC Universities (100% Free)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                21 State Universities & Campuses (UOM, UOC, UOP, UCSC). Admission based on the official 2024/25 district quota Z-score formula with Mahapola scholarships.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500">
                • ~45,000 Annual Quota Seats<br />
                • 140+ Course Codes with Merit Cutoffs
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRoute('predictor')}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--primitive-obsidian-900)] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Explore State Cutoffs ({district.district_name}) →</span>
            </button>
          </article>

          {/* Door 2: MOHE IFSLS 0% Govt Loan */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-emerald-500/80 transition-all flex flex-col justify-between gap-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                💰
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Tier 2</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  MOHE 0% Interest Loans (IFSLS)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% government-funded tuition by Bank of Ceylon / People's Bank at 0% interest for 3 A/L passes. No upfront tuition required; repaid over 7 years post-graduation.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500">
                • LKR 0 Upfront Out-of-Pocket<br />
                • SLIIT, NSBM, CINEC, Horizon & 14 Institutes
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRoute('private-unis')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Explore 14 IFSLS Degrees →</span>
            </button>
          </article>

          {/* Door 3: Direct Private, Foreign & Foundation Degrees */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-purple-400/80 transition-all flex flex-col justify-between gap-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-300 flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                🌏
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Tier 3 & 4</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Direct Private & Foreign Degrees
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct UK, Australian & State Non-UGC degrees (IIT, OUSL, UoVT, SLIATE). Flexible intakes with pending A/L results, O/L foundation tracks, or weekend working modes.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500">
                • British & Australian Partner Universities<br />
                • 1-Year Paid Corporate Internships
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRoute('private-unis')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Explore Private & Foreign Hub →</span>
            </button>
          </article>
        </div>
      </section>

      {/* ========================================================
          CURATED OFFERINGS FOR ACTIVE DISTRICT
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
              District Quota Matrix ({district.district_name})
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Top Tracked UGC Degrees in {studentStream === 'ALL' ? 'All Streams' : studentStream}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Published 2024/2025 cutoff Z-scores calculated specifically for {district.district_name} candidates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRoute('predictor')}
            className="px-4 py-2 rounded-xl bg-[var(--primitive-obsidian-900)] text-white text-xs sm:text-sm font-bold hover:bg-slate-800 shrink-0 self-start sm:self-auto"
          >
            Open Full Finder ({districtPrograms.length} Offerings) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickMatches.map((program) => (
            <ProgramChanceCard key={program.uni_code} program={program} studentZ={studentZScore} />
          ))}
        </div>
      </section>
    </div>
  );
};
