import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building2,
  BookOpen,
  Compass,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ListChecks,
  Scale,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UGC_INSTITUTIONS, UGC_COURSES } from '../services/ugcDataService';
import { ProgramChanceCard } from './ProgramChanceCard';

type HeroTab = 'zscore' | 'universities' | 'courses' | 'careers';

const CAREER_FIELD_CARDS = [
  { id: 'IT & Computing', title: 'IT, AI & Computing', count: '14 UGC Programs + SLIIT/NSBM IFSLS', salary: 'LKR 150k – 950k/mo' },
  { id: 'Engineering & Tech', title: 'Engineering & Technology', count: '12 UGC Engineering & BET Options', salary: 'LKR 120k – 650k/mo' },
  { id: 'Medicine & Allied Health', title: 'Medicine, Dental & Allied Health', count: '11 MBBS, BDS & Health Sciences', salary: 'LKR 165k – 850k/mo' },
  { id: 'Business & Finance', title: 'Management, Finance & Commerce', count: '16 BBM, BCom & Finance Degrees', salary: 'LKR 95k – 620k/mo' },
  { id: 'Agriculture & Food Science', title: 'Agriculture, Food & Biosystems', count: '9 BSc AgTech & BBST Degrees', salary: 'LKR 90k – 480k/mo' },
  { id: 'Architecture & Design', title: 'Architecture & Quantity Surveying', count: 'UOM BArch, QS & Design Options', salary: 'LKR 110k – 900k/mo' },
  { id: 'Law & Governance', title: 'Law (LLB) & Policy', count: 'UOC, UOP & UOJ LLB (Hons)', salary: 'LKR 95k – 750k/mo' },
  { id: 'Physical & Natural Sciences', title: 'Physical & Natural Sciences', count: 'Physics, Stats, Applied Math', salary: 'LKR 90k – 450k/mo' },
  { id: 'Humanities & Languages', title: 'Humanities, Economics & Media', count: 'BA (Hons) & Mass Media', salary: 'LKR 75k – 340k/mo' },
  { id: 'Indigenous Medicine', title: 'Ayurveda, Unani & Siddha Medicine', count: 'IIM & GWUIM Clinical Degrees', salary: 'LKR 110k – 390k/mo' },
  { id: 'Performing & Visual Arts', title: 'Visual & Performing Arts', count: 'UVPA, SVIAS & SCPC Degrees', salary: 'LKR 80k – 320k/mo' },
  { id: 'Vocational & NVQ Level 7', title: 'TVEC NVQ 5/6/7 & IFSLS Loans', count: 'SLIATE HND, UoVT BTech & IFSLS', salary: 'LKR 95k – 500k/mo' },
];

export const HomeDiscoveryView: React.FC = () => {
  const {
    district,
    setIsDistrictModalOpen,
    t,
    districtPrograms,
    studentZScore,
    setStudentZScore,
    studentStream,
    setStudentStream,
    setRoute,
    openInstitutionProfile,
    openCourseProfile,
    setIsCafDrawerOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<HeroTab>('zscore');
  const [selectedStreamFilter, setSelectedStreamFilter] = useState<string>('ALL');
  const [selectedCareerCategory, setSelectedCareerCategory] = useState<string>('ALL');

  const quickMatches = useMemo(() => {
    return districtPrograms
      .filter((p) => studentStream === 'ALL' || p.stream === studentStream || p.stream === 'Other')
      .slice(0, 6);
  }, [districtPrograms, studentStream]);

  const filteredCourses = useMemo(() => {
    return UGC_COURSES.filter(
      (c) =>
        (selectedStreamFilter === 'ALL' || c.stream === selectedStreamFilter) &&
        (selectedCareerCategory === 'ALL' || c.career_category === selectedCareerCategory)
    );
  }, [selectedStreamFilter, selectedCareerCategory]);

  const institutionSummaries = useMemo(() => {
    return UGC_INSTITUTIONS.map((inst) => {
      const offerings = districtPrograms.filter((p) => p.institution_code === inst.institution_code);
      const validCutoffs = offerings
        .map((o) => o.min_z_score)
        .filter((z): z is number => z !== null);
      const totalSeats = offerings.reduce((acc, o) => acc + o.proposed_intake, 0);
      const minZ = validCutoffs.length ? Math.min(...validCutoffs) : null;
      const maxZ = validCutoffs.length ? Math.max(...validCutoffs) : null;
      return {
        ...inst,
        uniCodeCount: offerings.length,
        totalSeats,
        minZ,
        maxZ,
      };
    });
  }, [districtPrograms]);

  return (
    <div className="space-y-10 pb-20">
      {/* Vuzopedia-inspired Stage Hero with 25-District Quota Context & 4-Tab Discovery Bar */}
      <section className="bg-[var(--color-brand-primary)] text-white border-b border-slate-800 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-amber-300 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                Active Quota District: <strong>{district.district_name}</strong> ({district.name_si} · {district.name_ta})
              </span>
              <button
                type="button"
                onClick={() => setIsDistrictModalOpen(true)}
                className="underline text-white hover:text-amber-300 ml-1 font-semibold"
              >
                Change
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.heroSub}
            </p>
          </div>

          {/* 4-Tab Hero Discovery Bar */}
          <div className="mt-7 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div
              role="tablist"
              aria-label="Discovery modes"
              className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-200 bg-slate-100"
            >
              <button
                role="tab"
                aria-selected={activeTab === 'zscore'}
                type="button"
                onClick={() => setActiveTab('zscore')}
                className={`flex items-center justify-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 interactive-surface ${
                  activeTab === 'zscore'
                    ? 'bg-white border-amber-600 text-slate-950'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-4 h-4 text-amber-600 shrink-0" />
                <span>1. By Z-Score & A/L Subjects</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'universities'}
                type="button"
                onClick={() => setActiveTab('universities')}
                className={`flex items-center justify-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 interactive-surface ${
                  activeTab === 'universities'
                    ? 'bg-white border-amber-600 text-slate-950'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>2. By University (21 State)</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'courses'}
                type="button"
                onClick={() => setActiveTab('courses')}
                className={`flex items-center justify-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 interactive-surface ${
                  activeTab === 'courses'
                    ? 'bg-white border-amber-600 text-slate-950'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                <span>3. By Degree Course (UGC)</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'careers'}
                type="button"
                onClick={() => setActiveTab('careers')}
                className={`flex items-center justify-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 interactive-surface ${
                  activeTab === 'careers'
                    ? 'bg-white border-amber-600 text-slate-950'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                <span>4. By Career & Salary Field</span>
              </button>
            </div>

            {/* Tab 1 Content: Quick Z-Score + A/L Stream Matcher */}
            {activeTab === 'zscore' && (
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label htmlFor="hero-district-btn" className="block text-xs font-bold text-slate-700 mb-1">
                      G.C.E. A/L District (55% Quota)
                    </label>
                    <button
                      id="hero-district-btn"
                      type="button"
                      onClick={() => setIsDistrictModalOpen(true)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-left text-sm font-semibold flex items-center justify-between"
                    >
                      <span>
                        {district.district_name} (#{district.district_id})
                      </span>
                      <MapPin className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>

                  <div>
                    <label htmlFor="hero-stream-select" className="block text-xs font-bold text-slate-700 mb-1">
                      G.C.E. A/L Stream
                    </label>
                    <select
                      id="hero-stream-select"
                      value={studentStream}
                      onChange={(e) => setStudentStream(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
                    >
                      <option value="Physical Science">Physical Science (Maths)</option>
                      <option value="Biological Science">Biological Science (Bio)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Technology">Engineering / Biosystems Tech</option>
                      <option value="Arts">Arts</option>
                      <option value="ALL">All Streams / Multidisciplinary</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hero-z-input" className="block text-xs font-bold text-slate-700 mb-1">
                      Your Official or Expected Z-Score
                    </label>
                    <input
                      id="hero-z-input"
                      type="number"
                      step="0.01"
                      min="-1.5"
                      max="3.5"
                      value={studentZScore}
                      onChange={(e) => setStudentZScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-tabular font-bold"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setRoute('predictor')}
                      className="w-full px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm interactive-surface"
                    >
                      <span>Check Safe / Target / Reach</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Content: All 21 State Universities, Campuses & Institutes */}
            {activeTab === 'universities' && (
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    All 21 UGC State Universities, Campuses & Institutes — Cutoffs shown for <strong>{district.district_name}</strong>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {institutionSummaries.map((inst) => (
                    <button
                      key={inst.institution_code}
                      type="button"
                      onClick={() => openInstitutionProfile(inst.institution_code)}
                      className="p-3.5 rounded-lg border border-slate-200 hover:border-amber-500 bg-slate-50/70 hover:bg-white text-left flex flex-col justify-between gap-2 interactive-surface"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-tabular font-extrabold text-xs px-2 py-0.5 rounded bg-[var(--color-brand-primary)] text-amber-300">
                            {inst.institution_code}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-200/70">
                            {inst.type}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 mt-1.5">{inst.name}</h3>
                        <p className="text-xs text-slate-600">{inst.location}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-tabular text-slate-700">
                        <span>{inst.uniCodeCount > 0 ? `${inst.uniCodeCount} tracked codes` : 'View profile'}</span>
                        <span className="font-bold text-emerald-800">
                          {inst.minZ !== null && inst.maxZ !== null
                            ? `Z: ${inst.minZ.toFixed(2)}–${inst.maxZ.toFixed(2)}`
                            : 'UGC Portal'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3 Content: By UGC Degree Course */}
            {activeTab === 'courses' && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {['ALL', 'Biological Science', 'Physical Science', 'Commerce', 'Technology', 'Arts', 'Other'].map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSelectedStreamFilter(s);
                          setSelectedCareerCategory('ALL');
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold ${
                          selectedStreamFilter === s
                            ? 'bg-[var(--color-brand-primary)] text-amber-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {s === 'ALL' ? 'All Streams' : s}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {filteredCourses.map((course) => {
                    const matchingOption = districtPrograms.find((p) => p.course_code === course.course_code);
                    return (
                      <button
                        key={course.course_code}
                        type="button"
                        onClick={() => {
                          if (matchingOption) openCourseProfile(matchingOption.uni_code);
                        }}
                        className="p-3.5 rounded-lg border border-slate-200 hover:border-amber-500 bg-white text-left flex flex-col justify-between gap-2 interactive-surface"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-tabular font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                              Course {course.course_code}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-600">{course.stream}</span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 mt-1.5">{course.name}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{course.degree_awarded}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-700">
                          Inspect District Cutoffs & Prerequisites →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4 Content: By 12 Interest & Career Fields */}
            {activeTab === 'careers' && (
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {CAREER_FIELD_CARDS.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setRoute('careers')}
                      className="p-3.5 rounded-lg border border-slate-200 hover:border-amber-500 bg-slate-50/70 hover:bg-white text-left flex flex-col justify-between gap-1.5 interactive-surface"
                    >
                      <h3 className="font-bold text-sm text-slate-900">{card.title}</h3>
                      <p className="text-xs text-slate-600">{card.count}</p>
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70 text-xs">
                        <span className="font-tabular font-bold text-emerald-800">{card.salary}</span>
                        <span className="font-semibold text-amber-700">Explore →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vuzopedia "Top Services" Translated for Sri Lanka */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Your Complete Sri Lankan University Admission Toolkit
            </h2>
            <p className="text-sm text-slate-600">
              Every tool updates dynamically for <strong>{district.district_name} District</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setRoute('predictor')}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 text-left shadow-xs flex flex-col justify-between gap-3 interactive-surface"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">
                Flagship Tool
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2.5">
                Z-Score + 3-Subject A/L Matcher
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Classifies all UGC uni_codes into Safe, Target, and Reach with explicit NQC & Aptitude Test checks.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1">
              Open Predictor <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoute('my-plan')}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 text-left shadow-xs flex flex-col justify-between gap-3 interactive-surface"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
                UGC Conflict Auditor
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2.5">
                My UGC Preference Simulator
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Detects if you accidentally placed a lower-cutoff safety course above a higher-cutoff dream course.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1">
              Audit My Preference Order <ListChecks className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoute('compare')}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 text-left shadow-xs flex flex-col justify-between gap-3 interactive-surface"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 text-xs font-bold">
                State + IFSLS Bridge
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2.5">
                4-Way Degree & Loan Comparator
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Compare up to 4 state uni_code programs side-by-side plus MOHE Interest-Free Loan (IFSLS) backups.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1">
              Compare Programs <Scale className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoute('career-quiz')}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 text-left shadow-xs flex flex-col justify-between gap-3 interactive-surface"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 text-amber-300 text-xs font-bold">
                "Guru" Career Compass
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2.5">
                3-Minute RIASEC & Salary Roadmap
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Matches your personality, A/L stream, and Z-score to Sri Lankan salaries and NVQ/IFSLS pathways.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1">
              Take 12-Question Quiz <Sparkles className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Live Preview of District Cutoffs & Admission Chances */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Live {district.district_name} District Cutoffs ({studentStream})
            </h2>
            <p className="text-sm text-slate-600">
              Showing instant admission chances for Z-Score <strong className="font-tabular">{studentZScore.toFixed(4)}</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRoute('predictor')}
              className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs sm:text-sm font-bold hover:bg-slate-800"
            >
              View All {districtPrograms.length} Tracked Offerings →
            </button>
            <button
              type="button"
              onClick={() => setIsCafDrawerOpen(true)}
              className="px-4 py-2 rounded-lg border border-amber-600 bg-amber-50 text-amber-950 text-xs sm:text-sm font-bold hover:bg-amber-100 inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>IFSLS Loan Backups</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickMatches.map((program) => (
            <ProgramChanceCard key={program.uni_code} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
};
