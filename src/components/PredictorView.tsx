import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  matchEligibleProgramsRpc,
  NON_STATE_IFSLS_PATHWAYS,
  type MatchedProgramRow,
} from '../services/ugcDataService';
import {
  estimateZScoreFromGrades,
  checkSubjectEligibility,
  type ALGrade,
} from '../lib/ugcLogic';
import { ProgramChanceCard } from './ProgramChanceCard';

const STREAM_SUBJECT_POOL: Record<string, string[]> = {
  'Physical Science': [
    'Combined Mathematics',
    'Physics',
    'Chemistry',
    'Information & Communication Technology',
    'Higher Mathematics',
  ],
  'Biological Science': [
    'Biology',
    'Chemistry',
    'Physics',
    'Agricultural Science',
  ],
  Commerce: [
    'Accounting',
    'Business Studies',
    'Economics',
    'Information & Communication Technology',
    'Business Statistics',
  ],
  Technology: [
    'Engineering Technology',
    'Biosystems Technology',
    'Science for Technology',
    'Information & Communication Technology',
    'Agricultural Science',
  ],
  Arts: [
    'Economics',
    'Geography',
    'Political Science',
    'Sinhala / Tamil / English Literature',
    'History',
    'Logic & Scientific Method',
    'Mass Media & Communication',
  ],
};

type PredictorTab = 'SAFE' | 'TARGET' | 'REACH' | 'NQC_ALL';

export const PredictorView: React.FC = () => {
  const {
    district,
    setIsDistrictModalOpen,
    studentZScore,
    setStudentZScore,
    studentStream,
    setStudentStream,
    setIsCafDrawerOpen,
  } = useApp();

  const [zMode, setZMode] = useState<'official' | 'estimate'>('official');
  const [subjects, setSubjects] = useState<[string, string, string]>([
    'Combined Mathematics',
    'Physics',
    'Chemistry',
  ]);
  const [grades, setGrades] = useState<[ALGrade, ALGrade, ALGrade]>(['A', 'B', 'B']);
  const [cgtScore, setCgtScore] = useState<number>(68);
  const [englishGrade, setEnglishGrade] = useState<ALGrade>('B');
  const [activeTierTab, setActiveTierTab] = useState<PredictorTab>('SAFE');
  const [showNonStateBridge, setShowNonStateBridge] = useState<boolean>(false);
  const [matchedRows, setMatchedRows] = useState<MatchedProgramRow[]>([]);

  // Update default 3 subjects when stream changes
  useEffect(() => {
    const pool = STREAM_SUBJECT_POOL[studentStream] ?? STREAM_SUBJECT_POOL['Physical Science'];
    setSubjects([pool[0], pool[1] ?? pool[0], pool[2] ?? pool[0]]);
  }, [studentStream]);

  // Estimate Z-Score automatically when in estimate mode
  const estimatedZ = useMemo(
    () => estimateZScoreFromGrades(grades, studentStream),
    [grades, studentStream]
  );

  const activeZ = zMode === 'official' ? studentZScore : estimatedZ;

  useEffect(() => {
    let mounted = true;
    matchEligibleProgramsRpc({
      p_district_id: district.district_id,
      p_student_z: activeZ,
      p_stream: studentStream,
    }).then((rows) => {
      if (mounted) setMatchedRows(rows);
    });
    return () => {
      mounted = false;
    };
  }, [district.district_id, activeZ, studentStream]);

  // Filter rows by 3-subject eligibility + CGT >= 30%
  const evaluatedRows = useMemo(() => {
    const subjectPairs = [
      { subject: subjects[0], grade: grades[0] },
      { subject: subjects[1], grade: grades[1] },
      { subject: subjects[2], grade: grades[2] },
    ];
    return matchedRows.map((row) => {
      const check = checkSubjectEligibility(subjectPairs, cgtScore, row.subject_requirements);
      return {
        ...row,
        subjectEligible: check.eligible,
        subjectReason: check.reason,
      };
    });
  }, [matchedRows, subjects, grades, cgtScore]);

  const safePrograms = evaluatedRows.filter((r) => r.chance_tier === 'SAFE' && r.subjectEligible);
  const targetPrograms = evaluatedRows.filter((r) => r.chance_tier === 'TARGET' && r.subjectEligible);
  const reachPrograms = evaluatedRows.filter((r) => r.chance_tier === 'REACH' && r.subjectEligible);
  const nqcAndOtherPrograms = evaluatedRows.filter(
    (r) => r.chance_tier === 'NQC' || r.chance_tier === 'OUT_OF_RANGE' || !r.subjectEligible
  );

  const displayedPrograms =
    activeTierTab === 'SAFE'
      ? safePrograms
      : activeTierTab === 'TARGET'
      ? targetPrograms
      : activeTierTab === 'REACH'
      ? reachPrograms
      : nqcAndOtherPrograms;

  const subjectPool = STREAM_SUBJECT_POOL[studentStream] ?? STREAM_SUBJECT_POOL['Physical Science'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
            Vuzopedia EGE Calculator + Shiksha Predictor Equivalent
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Z-Score & 3-Subject A/L Admission Predictor
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Calls <code className="font-tabular bg-slate-100 px-1.5 py-0.5 rounded">supabase.rpc('match_eligible_programs')</code> and validates your 3 A/L subjects, Common General Test (&ge;30%), NQC status, and Aptitude Test rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDistrictModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs sm:text-sm font-bold self-start md:self-auto"
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Quota District: {district.district_name} (#{district.district_id})</span>
        </button>
      </div>

      {/* Student Input Panel */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Step 1: Enter Your G.C.E. A/L Stream, 3 Subjects & Z-Score
          </h2>

          {/* Z-Score Input Mode Toggle */}
          <div
            role="group"
            aria-label="Z-score input mode"
            className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-bold"
          >
            <button
              type="button"
              onClick={() => setZMode('official')}
              className={`px-3 py-1.5 rounded-md ${
                zMode === 'official' ? 'bg-[var(--color-brand-primary)] text-amber-300' : 'text-slate-700'
              }`}
            >
              I Have My Official Z-Score
            </button>
            <button
              type="button"
              onClick={() => setZMode('estimate')}
              className={`px-3 py-1.5 rounded-md ${
                zMode === 'estimate' ? 'bg-[var(--color-brand-primary)] text-amber-300' : 'text-slate-700'
              }`}
            >
              Estimate Z-Score from Grades
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stream Selector */}
          <div>
            <label htmlFor="pred-stream" className="block text-xs font-bold text-slate-700 mb-1">
              A/L Stream
            </label>
            <select
              id="pred-stream"
              value={studentStream}
              onChange={(e) => setStudentStream(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            >
              <option value="Physical Science">Physical Science (Combined Maths)</option>
              <option value="Biological Science">Biological Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Technology">Engineering / Biosystems Technology</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          {/* Official or Estimated Z-Score */}
          <div>
            <label htmlFor="pred-zscore" className="block text-xs font-bold text-slate-700 mb-1">
              {zMode === 'official' ? 'Official Z-Score (e.g. 1.6425)' : 'Estimated Z-Score (Auto-Calculated)'}
            </label>
            {zMode === 'official' ? (
              <input
                id="pred-zscore"
                type="number"
                step="0.0025"
                min="-1.5"
                max="3.2"
                value={studentZScore}
                onChange={(e) => setStudentZScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-tabular font-extrabold"
              />
            ) : (
              <div className="px-3.5 py-2.5 rounded-lg bg-amber-50 border border-amber-300 text-sm font-tabular font-extrabold text-amber-950 flex items-center justify-between">
                <span>Est. Z: {estimatedZ.toFixed(4)}</span>
                <span className="text-xs font-sans font-semibold text-amber-800">From Grades ({grades.join('/')})</span>
              </div>
            )}
          </div>

          {/* Common General Test + General English */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="pred-cgt" className="block text-xs font-bold text-slate-700 mb-1">
                Common Gen. Test (%)
              </label>
              <input
                id="pred-cgt"
                type="number"
                min="0"
                max="100"
                value={cgtScore}
                onChange={(e) => setCgtScore(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-tabular font-bold"
              />
            </div>
            <div>
              <label htmlFor="pred-eng" className="block text-xs font-bold text-slate-700 mb-1">
                General English
              </label>
              <select
                id="pred-eng"
                value={englishGrade}
                onChange={(e) => setEnglishGrade(e.target.value as ALGrade)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-bold"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="S">Grade S</option>
                <option value="F">Grade F</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3 A/L Subject Picker & Grade Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <label
                htmlFor={`sub-select-${idx}`}
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                A/L Subject #{idx + 1} & Grade
              </label>
              <div className="flex gap-2">
                <select
                  id={`sub-select-${idx}`}
                  value={subjects[idx]}
                  onChange={(e) => {
                    const next = [...subjects] as [string, string, string];
                    next[idx] = e.target.value;
                    setSubjects(next);
                  }}
                  className="flex-1 px-2.5 py-2 rounded-md border border-slate-300 bg-white text-xs sm:text-sm font-semibold"
                >
                  {subjectPool.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

                <select
                  aria-label={`Subject ${idx + 1} grade`}
                  value={grades[idx]}
                  onChange={(e) => {
                    const next = [...grades] as [ALGrade, ALGrade, ALGrade];
                    next[idx] = e.target.value as ALGrade;
                    setGrades(next);
                  }}
                  className="w-20 px-2.5 py-2 rounded-md border border-slate-300 bg-white text-xs sm:text-sm font-tabular font-bold"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="S">S</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* CGT Warning if < 30% */}
        {cgtScore < 30 && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-950 flex items-start gap-3 text-xs sm:text-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Common General Test Below 30% Threshold!</strong>
              Per official UGC admission rules, candidates with less than 30% in the Common General Test are not eligible for state university registration even if they meet the Z-score cutoff. Consider MOHE IFSLS or TVEC NVQ pathways below.
            </div>
          </div>
        )}
      </section>

      {/* "Chances of Admission" Tabs (Safe / Target / Reach / NQC) */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Admission probability tiers"
            className="flex flex-wrap gap-2"
          >
            <button
              role="tab"
              aria-selected={activeTierTab === 'SAFE'}
              type="button"
              onClick={() => setActiveTierTab('SAFE')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border interactive-surface ${
                activeTierTab === 'SAFE'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-emerald-50'
              }`}
            >
              🟢 Safe Match (Margin &ge; +0.0500) · {safePrograms.length}
            </button>

            <button
              role="tab"
              aria-selected={activeTierTab === 'TARGET'}
              type="button"
              onClick={() => setActiveTierTab('TARGET')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border interactive-surface ${
                activeTierTab === 'TARGET'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-50'
              }`}
            >
              🟡 Target Match (-0.0500 to +0.0499) · {targetPrograms.length}
            </button>

            <button
              role="tab"
              aria-selected={activeTierTab === 'REACH'}
              type="button"
              onClick={() => setActiveTierTab('REACH')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border interactive-surface ${
                activeTierTab === 'REACH'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-rose-50'
              }`}
            >
              🔴 Reach / Dream (-0.2000 to -0.0501) · {reachPrograms.length}
            </button>

            <button
              role="tab"
              aria-selected={activeTierTab === 'NQC_ALL'}
              type="button"
              onClick={() => setActiveTierTab('NQC_ALL')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold border interactive-surface ${
                activeTierTab === 'NQC_ALL'
                  ? 'bg-slate-800 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              ⚪ NQC / Higher Cutoffs · {nqcAndOtherPrograms.length}
            </button>
          </div>

          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer bg-amber-50 border border-amber-300 px-3.5 py-2 rounded-lg">
            <input
              type="checkbox"
              checked={showNonStateBridge}
              onChange={(e) => setShowNonStateBridge(e.target.checked)}
              className="rounded border-amber-400"
            />
            <span>Show Non-State & MOHE Interest-Free Loan (IFSLS) Options</span>
          </label>
        </div>

        {/* Results Grid */}
        {displayedPrograms.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
            <Info className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              No programs in the {activeTierTab} tier for Z-Score {activeZ.toFixed(4)} in {district.district_name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Switch to another tier tab above, adjust your Z-score, or explore the government-backed MOHE Interest-Free Student Loan Scheme (IFSLS) and TVEC NVQ Level 6/7 degree pathways below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedPrograms.map((program) => (
              <ProgramChanceCard
                key={program.uni_code}
                program={program}
                studentZ={activeZ}
              />
            ))}
          </div>
        )}
      </section>

      {/* State + Non-State & IFSLS Student Loan Bridge */}
      {(showNonStateBridge || safePrograms.length === 0 || activeZ < 1.35) && (
        <section className="bg-gradient-to-br from-slate-900 to-[var(--color-brand-primary)] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                MOHE Interest-Free Student Loan Scheme (IFSLS) & TVEC NVQ Bridge
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-2">
                Didn't Get the State Cutoff You Wanted? Explore Accredited Zero-Interest Loan & NVQ Degrees
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                Students who passed 3 A/L subjects at a single sitting qualify for the Government's Interest-Free Student Loan Scheme (<code className="text-amber-300">studentloans.mohe.gov.lk</code>) and free state SLIATE / UoVT NVQ Level 6 & 7 programs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCafDrawerOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shrink-0"
            >
              Apply to Backup Degrees with 1 Form →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NON_STATE_IFSLS_PATHWAYS.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.ugc_recognized && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                        ✅ UGC Recognized
                      </span>
                    )}
                    {item.mohe_dai && (
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
                        ✅ MOHE DAI
                      </span>
                    )}
                    {item.tvec_nvq_level && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                        ✅ TVEC ({item.tvec_nvq_level})
                      </span>
                    )}
                    {item.ifsls_loan_eligible && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                        💰 IFSLS Interest-Free Loan
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.degree_title}</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {item.institute_name} · {item.location}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-700/80 flex items-center justify-between gap-2">
                  <span className="text-xs text-amber-300 font-semibold">{item.tuition_note_lkr}</span>
                  <button
                    type="button"
                    onClick={() => setIsCafDrawerOpen(true)}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
