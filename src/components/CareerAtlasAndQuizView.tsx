import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Briefcase,
  CheckCircle2,
  X,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CAREER_ATLAS,
  NON_STATE_IFSLS_PATHWAYS,
  submitStudentBackupApplication,
  type CareerAtlasItem,
} from '../services/ugcDataService';

interface QuizQuestion {
  id: number;
  question: string;
  klimov_type: CareerAtlasItem['klimov_type'];
  riasec_dim: string;
}

const CAREER_COMPASS_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: 'I enjoy designing software algorithms, analyzing datasets, or automating complex workflows.', klimov_type: 'Human-Sign/Data', riasec_dim: 'Investigative (I)' },
  { id: 2, question: 'I like building, troubleshooting, or optimizing physical machines, power grids, or civil structures.', klimov_type: 'Human-Tech', riasec_dim: 'Realistic (R)' },
  { id: 3, question: 'I want to diagnose patients, care for human health, or improve clinical wellbeing.', klimov_type: 'Human-Human', riasec_dim: 'Social / Investigative (S/I)' },
  { id: 4, question: 'I enjoy managing financial budgets, auditing corporate accounts, or leading business strategy.', klimov_type: 'Human-Sign/Data', riasec_dim: 'Enterprising / Conventional (E/C)' },
  { id: 5, question: 'I am fascinated by biotechnology, crop science, food security, and sustainable ecosystems.', klimov_type: 'Human-Nature', riasec_dim: 'Investigative / Realistic (I/R)' },
  { id: 6, question: 'I love spatial architecture, urban design, visual aesthetics, or performing arts.', klimov_type: 'Human-Art', riasec_dim: 'Artistic (A)' },
  { id: 7, question: 'I enjoy debating legal principles, constitutional rights, and representing people in disputes.', klimov_type: 'Human-Human', riasec_dim: 'Enterprising (E)' },
  { id: 8, question: 'I prefer working with mathematical models, statistics, and quantitative forecasting.', klimov_type: 'Human-Sign/Data', riasec_dim: 'Conventional / Investigative (C/I)' },
  { id: 9, question: 'I want hands-on laboratory or workshop experience with electronics, robotics, or mechatronics.', klimov_type: 'Human-Tech', riasec_dim: 'Realistic (R)' },
  { id: 10, question: 'I enjoy coordinating construction contracts, project timelines, and cost estimates.', klimov_type: 'Human-Sign/Data', riasec_dim: 'Conventional (C)' },
  { id: 11, question: 'I want to research food processing, export agriculture, or environmental conservation.', klimov_type: 'Human-Nature', riasec_dim: 'Investigative (I)' },
  { id: 12, question: 'I thrive when mentoring others, communicating across languages, or shaping public policy.', klimov_type: 'Human-Human', riasec_dim: 'Social (S)' },
];

export const CareerAtlasAndQuizView: React.FC<{ initialTab?: 'atlas' | 'quiz' }> = ({
  initialTab = 'atlas',
}) => {
  const {
    district,
    studentZScore,
    studentStream,
    districtPrograms,
    addToPlan,
    openCourseProfile,
    setRoute,
  } = useApp();

  const [mode, setMode] = useState<'atlas' | 'quiz'>(initialTab);
  const [careerQuery, setCareerQuery] = useState('');
  const [klimovFilter, setKlimovFilter] = useState<string>('ALL');

  // 12-Question Quiz State (scores 0 = Disagree, 1 = Neutral, 2 = Strongly Agree)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const filteredCareers = useMemo(() => {
    const q = careerQuery.trim().toLowerCase();
    return CAREER_ATLAS.filter((c) => {
      const matchesKlimov = klimovFilter === 'ALL' || c.klimov_type === klimovFilter;
      const matchesQuery =
        !q ||
        c.role_title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q);
      return matchesKlimov && matchesQuery;
    });
  }, [careerQuery, klimovFilter]);

  const dominantKlimov = useMemo<CareerAtlasItem['klimov_type']>(() => {
    const tally: Record<CareerAtlasItem['klimov_type'], number> = {
      'Human-Sign/Data': 0,
      'Human-Tech': 0,
      'Human-Human': 0,
      'Human-Nature': 0,
      'Human-Art': 0,
    };
    for (const q of CAREER_COMPASS_QUESTIONS) {
      const score = answers[q.id] ?? 1;
      tally[q.klimov_type] += score;
    }
    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    return (sorted[0]?.[0] as CareerAtlasItem['klimov_type']) ?? 'Human-Sign/Data';
  }, [answers]);

  // Personalized 360 Roadmap based on Quiz + Stream + District + Z-Score
  const roadmapTopState = useMemo(() => {
    return districtPrograms
      .filter(
        (p) =>
          (p.stream === studentStream || p.stream === 'Other') &&
          (p.min_z_score === null || studentZScore >= p.min_z_score - 0.18)
      )
      .slice(0, 5);
  }, [districtPrograms, studentStream, studentZScore]);

  const roadmapTopBackups = useMemo(() => {
    return NON_STATE_IFSLS_PATHWAYS.filter((b) =>
      b.stream_eligible.includes(studentStream)
    ).slice(0, 3);
  }, [studentStream]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
            Vuzopedia "Дед Вузопед" + CollegeDekho Career Compass
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Sri Lankan Career-to-Degree Atlas & 3-Minute RIASEC Quiz
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Start with a Sri Lankan job role and monthly LKR salary range, or take the 12-question Klimov/RIASEC assessment for a personalized 360° Higher Education Roadmap.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-200 p-1 text-xs sm:text-sm font-extrabold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMode('atlas')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 ${
              mode === 'atlas' ? 'bg-[var(--color-brand-primary)] text-amber-300 shadow-xs' : 'text-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Reverse Career Atlas</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 ${
              mode === 'quiz' ? 'bg-[var(--color-brand-primary)] text-amber-300 shadow-xs' : 'text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>3-Min Career Compass Quiz</span>
          </button>
        </div>
      </div>

      {mode === 'atlas' ? (
        <div className="space-y-6">
          {/* Search & Klimov Type Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row gap-3 items-center justify-between">
            <input
              type="search"
              value={careerQuery}
              onChange={(e) => setCareerQuery(e.target.value)}
              placeholder="Search career role (e.g. Software Engineer, AI, Quantity Surveyor, Medical Officer, Legal)..."
              aria-label="Search career roles"
              className="w-full md:max-w-md px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {['ALL', 'Human-Sign/Data', 'Human-Tech', 'Human-Human', 'Human-Nature', 'Human-Art'].map(
                (k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKlimovFilter(k)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      klimovFilter === k
                        ? 'bg-slate-900 text-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {k === 'ALL' ? 'All Klimov Types' : k}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Career Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCareers.map((career) => (
              <article
                key={career.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-bold">
                      {career.category} · {career.klimov_type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {career.demand_trend}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900 mt-2.5">
                    {career.role_title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {career.summary}
                  </p>

                  {/* LKR Salary Bands */}
                  <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block">
                        Entry-Level Sri Lanka Salary
                      </span>
                      <span className="font-tabular font-extrabold text-xs sm:text-sm text-slate-900">
                        {career.entry_salary_lkr}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block">
                        3–5 Yrs Experience (SL / Export)
                      </span>
                      <span className="font-tabular font-extrabold text-xs sm:text-sm text-emerald-800">
                        {career.mid_salary_lkr}
                      </span>
                    </div>
                  </div>

                  {/* Direct State UGC uni_code Pathways */}
                  <div className="mt-4">
                    <span className="text-xs font-extrabold text-slate-800 block mb-1.5">
                      Direct State UGC <code className="font-tabular">uni_code</code> Pathways ({district.district_name} Cutoff):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.state_uni_codes.map((code) => {
                        const prog = districtPrograms.find((p) => p.uni_code === code);
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => openCourseProfile(code)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-brand-primary)] text-white text-xs font-semibold hover:bg-slate-800"
                          >
                            <span className="font-tabular font-bold text-amber-300">{code}</span>
                            <span>{prog?.institution_code ?? ''}</span>
                            <span className="font-tabular text-[11px] text-slate-300">
                              ({prog?.min_z_score !== null && prog?.min_z_score !== undefined ? prog.min_z_score.toFixed(2) : 'NQC'})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alternative Professional, IFSLS & NVQ Pathways */}
                  <div className="mt-3.5">
                    <span className="text-xs font-extrabold text-slate-800 block mb-1">
                      Parallel IFSLS Loan, Professional & TVEC NVQ Pathways:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.backup_pathways.map((bp) => (
                        <span
                          key={bp}
                          className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold"
                        >
                          {bp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-tabular">
                    RIASEC Profile: {career.riasec_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRoute('private-unis')}
                    className="text-xs font-extrabold text-amber-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Explore Private & IFSLS Degrees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        /* 12-Question Interactive Career Compass Psychometric Assessment */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  12-Question Holland RIASEC + Vuzopedia Klimov Psychometric Quiz
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Rate each statement to generate your personalized 360° Higher Education Roadmap for <strong>{district.district_name} District</strong> (Z-Score: <strong className="font-tabular">{studentZScore.toFixed(4)}</strong>, Stream: <strong>{studentStream}</strong>).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setQuizCompleted(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAREER_COMPASS_QUESTIONS.map((q) => {
                const currentVal = answers[q.id] ?? 1;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Question #{q.id} of 12</span>
                        <span>{q.klimov_type} · {q.riasec_dim}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 0, label: 'Not Me' },
                        { val: 1, label: 'Neutral' },
                        { val: 2, label: 'Strongly Me' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.val }))}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border ${
                            currentVal === opt.val
                              ? 'bg-[var(--color-brand-primary)] text-amber-300 border-slate-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setQuizCompleted(true)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My 360° Higher Education Roadmap</span>
              </button>
            </div>
          </div>

          {/* 360° Higher Education Roadmap Output */}
          {quizCompleted && (
            <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                  Personalized 360° Higher Education Roadmap
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold mt-2">
                  Dominant Aptitude Profile: <span className="text-amber-400">{dominantKlimov}</span> ({studentStream} · {district.district_name} · Z: {studentZScore.toFixed(4)})
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Matching State UGC Degrees */}
                <div className="space-y-3">
                  <h4 className="text-sm sm:text-base font-extrabold text-emerald-400">
                    1. Top 5 State UGC <code className="font-tabular">uni_code</code> Degrees You Qualify For:
                  </h4>
                  <div className="space-y-2.5">
                    {roadmapTopState.map((prog, i) => (
                      <div
                        key={prog.uni_code}
                        className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-tabular font-bold text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                              #{i + 1} · {prog.uni_code}
                            </span>
                            <span className="font-bold text-sm">{prog.course_name}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {prog.institution_name} · Cutoff: {prog.min_z_score !== null ? prog.min_z_score.toFixed(4) : 'NQC'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToPlan(prog.uni_code)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                        >
                          + Add to Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 3 IFSLS / Non-State / TVEC Backup Pathways */}
                <div className="space-y-3">
                  <h4 className="text-sm sm:text-base font-extrabold text-amber-400">
                    2. Top 3 IFSLS Interest-Free Loan & TVEC NVQ Backup Pathways:
                  </h4>
                  <div className="space-y-2.5">
                    {roadmapTopBackups.map((backup, i) => (
                      <div
                        key={backup.id}
                        className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-bold text-amber-300">
                            Backup #{i + 1} · {backup.institute_abbr}
                          </span>
                          <div className="font-bold text-sm mt-0.5">{backup.degree_title}</div>
                          <p className="text-xs text-slate-300 mt-0.5">{backup.tuition_note_lkr}</p>
                        </div>
                        <a
                          href={backup.apply_url || 'https://studentloans.mohe.gov.lk'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shrink-0 inline-flex items-center gap-1"
                        >
                          <span>Apply on {backup.institute_abbr} ↗</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
