import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  Plus,
  Check,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  matchEligibleProgramsRpc,
  NON_STATE_IFSLS_PATHWAYS,
  type MatchedProgramRow,
} from '../services/ugcDataService';
import {
  checkSubjectEligibility,
  checkSubjectCombinationEligibility,
  type ALGrade,
} from '../lib/ugcLogic';
import type { ProgramCutoffViewRow } from '../data/sriLankaUgcSnapshot';
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
type SubjectExplorerFilter = 'ALL' | 'DIRECT' | 'APTITUDE';

interface PredictorViewProps {
  initialMode?: 'official_z' | 'subject_explorer';
}

export const PredictorView: React.FC<PredictorViewProps> = ({ initialMode = 'official_z' }) => {
  const {
    district,
    setIsDistrictModalOpen,
    studentZScore,
    setStudentZScore,
    studentStream,
    setStudentStream,
    setIsCafDrawerOpen,
    districtPrograms,
    addToPlan,
    planEntries,
    openCourseProfile,
  } = useApp();

  const [mode, setMode] = useState<'official_z' | 'subject_explorer'>(initialMode);
  const [subjects, setSubjects] = useState<[string, string, string]>([
    'Combined Mathematics',
    'Physics',
    'Chemistry',
  ]);
  const [grades, setGrades] = useState<[ALGrade, ALGrade, ALGrade]>(['A', 'B', 'B']);
  const [cgtScore, setCgtScore] = useState<number>(68);
  const [englishGrade, setEnglishGrade] = useState<ALGrade>('B');
  const [activeTierTab, setActiveTierTab] = useState<PredictorTab>('SAFE');
  const [explorerFilter, setExplorerFilter] = useState<SubjectExplorerFilter>('ALL');
  const [showNonStateBridge, setShowNonStateBridge] = useState<boolean>(false);
  const [matchedRows, setMatchedRows] = useState<MatchedProgramRow[]>([]);

  // Update default 3 subjects when stream changes
  useEffect(() => {
    const pool = STREAM_SUBJECT_POOL[studentStream] ?? STREAM_SUBJECT_POOL['Physical Science'];
    setSubjects([pool[0], pool[1] ?? pool[0], pool[2] ?? pool[0]]);
  }, [studentStream]);

  // Mode 1: Fetch matched programs via RPC for official Z-score
  useEffect(() => {
    if (mode !== 'official_z') return;
    let mounted = true;
    matchEligibleProgramsRpc({
      p_district_id: district.district_id,
      p_student_z: studentZScore,
      p_stream: studentStream,
    }).then((rows) => {
      if (mounted) setMatchedRows(rows);
    });
    return () => {
      mounted = false;
    };
  }, [mode, district.district_id, studentZScore, studentStream]);

  // Mode 1: Filter rows by 3-subject eligibility + CGT >= 30%
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

  // Mode 2: Subject Explorer — Every program the 3 subjects legally unlock, sorted by historical Z-score
  const eligibleSubjectPrograms = useMemo(() => {
    const subjectNames = [subjects[0], subjects[1], subjects[2]];
    return districtPrograms
      .filter((prog) => {
        // Stream filter: match stream or universal degrees
        if (prog.stream !== studentStream && prog.stream !== 'Other') return false;
        const check = checkSubjectCombinationEligibility(subjectNames, prog.subject_requirements);
        return check.eligible;
      })
      .sort((a, b) => {
        // Highest historical cutoff first; NQC to the end
        if (a.min_z_score === null && b.min_z_score === null) return 0;
        if (a.min_z_score === null) return 1;
        if (b.min_z_score === null) return -1;
        return b.min_z_score - a.min_z_score;
      });
  }, [districtPrograms, subjects, studentStream]);

  const filteredExplorerPrograms = useMemo(() => {
    if (explorerFilter === 'DIRECT') {
      return eligibleSubjectPrograms.filter((p) => !p.aptitude_test_required);
    }
    if (explorerFilter === 'APTITUDE') {
      return eligibleSubjectPrograms.filter((p) => p.aptitude_test_required);
    }
    return eligibleSubjectPrograms;
  }, [eligibleSubjectPrograms, explorerFilter]);

  const subjectPool = STREAM_SUBJECT_POOL[studentStream] ?? STREAM_SUBJECT_POOL['Physical Science'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
            Official Sri Lanka UGC Admissions Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {mode === 'official_z'
              ? 'Z-Score & 3-Subject A/L Admission Predictor'
              : 'A/L 3-Subject Eligibility & Target Cutoff Explorer'}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {mode === 'official_z'
              ? 'Matches your official G.C.E. A/L Z-score against 25-district quota cutoffs with Safe, Target, and Reach probability tiers.'
              : 'For students awaiting results or in A/L classes: explore every UGC degree legally unlocked by your 3 subjects paired with historical target cutoffs.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDistrictModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs sm:text-sm font-bold self-start md:self-auto shrink-0 shadow-xs"
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Quota District: {district.district_name} (#{district.district_id})</span>
        </button>
      </div>

      {/* Mode Selection Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Where are you in your A/L journey?
            </h2>
            <p className="text-xs text-slate-500">
              Select your status to get transparent, statistically honest recommendations.
            </p>
          </div>

          <div
            role="group"
            aria-label="Predictor mode"
            className="inline-flex rounded-xl bg-slate-100 p-1.5 border border-slate-200 text-xs font-bold shrink-0"
          >
            <button
              type="button"
              onClick={() => setMode('official_z')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                mode === 'official_z'
                  ? 'bg-[var(--color-brand-primary)] text-amber-300 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <span>🎯 I Have My Official Z-Score</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('subject_explorer')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                mode === 'subject_explorer'
                  ? 'bg-[var(--color-brand-primary)] text-amber-300 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <span>📚 Results Pending / 3-Subject Explorer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Student Input Panel */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {mode === 'official_z'
              ? 'Step 1: Enter Your Stream, 3 Subjects & Official Z-Score'
              : 'Step 1: Select Your Stream & 3 A/L Subjects'}
          </h2>
          {mode === 'subject_explorer' && (
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              No Guesswork · Zero Estimated Z-Scores
            </span>
          )}
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

          {/* Mode 1: Official Z-Score Input / Mode 2: Educational Explanation */}
          {mode === 'official_z' ? (
            <div>
              <label htmlFor="pred-zscore" className="block text-xs font-bold text-slate-700 mb-1">
                Official Z-Score (from doenets.lk)
              </label>
              <input
                id="pred-zscore"
                type="number"
                step="0.0025"
                min="-1.5"
                max="3.2"
                value={studentZScore}
                onChange={(e) => setStudentZScore(Number(e.target.value))}
                placeholder="1.5200"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-tabular font-extrabold text-slate-900"
              />
            </div>
          ) : (
            <div className="md:col-span-2 p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Why We Don't Fabricate Estimated Z-Scores:</strong>
                Sri Lankan A/L Z-scores depend on raw marks, national subject standard deviations, and subject difficulty pools. Instead, we show you every degree your 3 subjects legally unlock, paired with the <strong>exact historical cutoff you need to target</strong> in {district.district_name}!
              </div>
            </div>
          )}

          {/* Mode 1: Common General Test & General English */}
          {mode === 'official_z' && (
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
          )}
        </div>

        {/* 3 A/L Subject Picker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <label
                htmlFor={`sub-select-${idx}`}
                className="block text-xs font-bold text-slate-700"
              >
                A/L Subject #{idx + 1} {mode === 'official_z' && '& Grade'}
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

                {mode === 'official_z' && (
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
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CGT Warning if < 30% in official Z mode */}
        {mode === 'official_z' && cgtScore < 30 && (
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

      {/* MODE 1: Official Z-Score Probability Tiers */}
      {mode === 'official_z' && (
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
                ⚪ NQC / Other Cutoffs · {nqcAndOtherPrograms.length}
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
                No programs in the {activeTierTab} tier for Z-Score {studentZScore.toFixed(4)} in {district.district_name}
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
                  studentZ={studentZScore}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* MODE 2: 3-Subject Eligibility & Target Benchmark Explorer */}
      {mode === 'subject_explorer' && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Subject explorer filters"
              className="flex flex-wrap gap-2"
            >
              <button
                role="tab"
                aria-selected={explorerFilter === 'ALL'}
                type="button"
                onClick={() => setExplorerFilter('ALL')}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border interactive-surface ${
                  explorerFilter === 'ALL'
                    ? 'bg-[var(--color-brand-primary)] text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                All Eligible Degrees · {eligibleSubjectPrograms.length}
              </button>

              <button
                role="tab"
                aria-selected={explorerFilter === 'DIRECT'}
                type="button"
                onClick={() => setExplorerFilter('DIRECT')}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border interactive-surface ${
                  explorerFilter === 'DIRECT'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-emerald-50'
                }`}
              >
                ✓ Direct UGC Z-Score Entry · {eligibleSubjectPrograms.filter((p) => !p.aptitude_test_required).length}
              </button>

              <button
                role="tab"
                aria-selected={explorerFilter === 'APTITUDE'}
                type="button"
                onClick={() => setExplorerFilter('APTITUDE')}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border interactive-surface ${
                  explorerFilter === 'APTITUDE'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-50'
                }`}
              >
                ⚠️ Requires University Aptitude Test · {eligibleSubjectPrograms.filter((p) => p.aptitude_test_required).length}
              </button>
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Showing degrees sorted by highest historical cutoff in {district.district_name}
            </span>
          </div>

          {filteredExplorerPrograms.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
              <Info className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                No UGC programs found matching this 3-subject combination
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Check whether your selected subjects match the minimum A/L stream prerequisites, or explore non-state and vocational degree alternatives below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExplorerPrograms.map((program) => {
                const inPlan = planEntries.some((p) => p.uni_code === program.uni_code);

                return (
                  <article
                    key={program.uni_code}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-slate-400 transition-colors"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-tabular font-extrabold text-xs px-2.5 py-1 rounded bg-slate-900 text-amber-300">
                          {program.uni_code}
                        </span>
                        <span className="text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                          {program.institution_code} · {program.stream}
                        </span>
                      </div>

                      {/* Title & University */}
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                          {program.course_name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {program.institution_name} · {program.faculty}
                        </p>
                      </div>

                      {/* Target Benchmark Banner */}
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                        <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                          🎯 Target Benchmark for {district.district_name}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-700">Minimum Z-Score:</span>
                          <span className="font-tabular font-extrabold text-base text-slate-950">
                            {program.min_z_score !== null ? program.min_z_score.toFixed(4) : 'NQC (Quota Full)'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          Based on official 2024/2025 UGC intake cutoffs
                        </span>
                      </div>

                      {/* Rule Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {program.is_suspended && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[11px] font-bold">
                            ⛔ Suspended for 2025/2026 Intake
                          </span>
                        )}
                        {program.requires_ol_special && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold">
                            📋 Special O/L Credit Required — Section 5.3
                          </span>
                        )}
                        {program.aptitude_test_required ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[11px] font-bold">
                            ⚠️ Requires University Aptitude Test
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                            ✓ Direct UGC Z-Score Entry
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openCourseProfile(program.uni_code)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                      >
                        Cutoffs & Details →
                      </button>

                      <button
                        type="button"
                        disabled={program.is_suspended}
                        onClick={() => addToPlan(program.uni_code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 shrink-0 ${
                          program.is_suspended
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : inPlan
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[var(--color-brand-primary)] text-white hover:bg-slate-800'
                        }`}
                      >
                        {program.is_suspended ? (
                          '⛔ Intake Suspended'
                        ) : inPlan ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Your Plan</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Plan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* State + Non-State & IFSLS Student Loan Bridge */}
      {(showNonStateBridge || mode === 'subject_explorer' || safePrograms.length === 0) && (
        <section className="bg-gradient-to-br from-slate-900 to-[var(--color-brand-primary)] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                MOHE Interest-Free Student Loan Scheme (IFSLS) & TVEC NVQ Bridge
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-2">
                Exploring Degrees Beyond State UGC Cutoffs?
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
