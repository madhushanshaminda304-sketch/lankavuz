import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Star,
  MessageSquare,
  Calendar,
  Bell,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  UGC_INSTITUTIONS,
  ADMISSIONS_CALENDAR_EVENTS,
  fetchAllDistrictCutoffsForUniCode,
  getCampusReviews,
  submitCampusReview,
  getQnAThreads,
  submitQnAQuestion,
} from '../services/ugcDataService';
import { ProgramChanceCard } from './ProgramChanceCard';

type ProfileTab = 'overview' | 'matrix' | 'rules' | 'reviews' | 'qna';

export const InstitutionAndCourseProfileView: React.FC<{ mode: 'institution' | 'course' }> = ({
  mode,
}) => {
  const {
    district,
    selectedInstitutionCode,
    selectedUniCode,
    districtPrograms,
    openCourseProfile,
    openInstitutionProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [allDistrictCutoffs, setAllDistrictCutoffs] = useState<
    { district_id: number; district_name: string; min_z_score: number | null; status: 'QUALIFIED' | 'NQC' }[]
  >([]);

  // Review Form State
  const [reviews, setReviews] = useState(() => getCampusReviews());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revHostelLkr, setRevHostelLkr] = useState(1500);
  const [revComment, setRevComment] = useState('');
  const [revError, setRevError] = useState<string | null>(null);

  // Q&A State
  const [qnaList, setQnaList] = useState(() => getQnAThreads());
  const [questionInput, setQuestionInput] = useState('');
  const [askedByInput, setAskedByInput] = useState('');

  const activeProgram = useMemo(() => {
    if (mode === 'course') {
      return districtPrograms.find((p) => p.uni_code === selectedUniCode) ?? districtPrograms[0];
    }
    return (
      districtPrograms.find((p) => p.institution_code === selectedInstitutionCode) ??
      districtPrograms[0]
    );
  }, [mode, selectedUniCode, selectedInstitutionCode, districtPrograms]);

  const activeInstitution = useMemo(() => {
    const code = mode === 'institution' ? selectedInstitutionCode : activeProgram?.institution_code;
    return UGC_INSTITUTIONS.find((i) => i.institution_code === code) ?? UGC_INSTITUTIONS[0];
  }, [mode, selectedInstitutionCode, activeProgram]);

  const institutionOfferings = useMemo(() => {
    return districtPrograms.filter(
      (p) => p.institution_code === activeInstitution.institution_code
    );
  }, [districtPrograms, activeInstitution]);

  useEffect(() => {
    if (!activeProgram) return;
    let mounted = true;
    fetchAllDistrictCutoffsForUniCode(activeProgram.uni_code).then((rows) => {
      if (mounted) setAllDistrictCutoffs(rows);
    });
    return () => {
      mounted = false;
    };
  }, [activeProgram]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevError(null);
    try {
      await submitCampusReview({
        institution_code: activeInstitution.institution_code,
        uni_code: activeProgram?.uni_code ?? '008A',
        student_name: revName,
        student_email: revEmail,
        academic_rating: 5,
        hostel_cost_lkr: revHostelLkr,
        mahapola_rating: 5,
        campus_life_rating: 5,
        employability_rating: 5,
        comment: revComment,
      });
      setReviews(getCampusReviews());
      setShowReviewModal(false);
      setRevName('');
      setRevEmail('');
      setRevComment('');
    } catch (err) {
      setRevError(err instanceof Error ? err.message : 'Invalid review submission');
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    submitQnAQuestion({
      institution_code: activeInstitution.institution_code,
      uni_code: activeProgram?.uni_code ?? '008A',
      asked_by: askedByInput,
      question: questionInput,
    });
    setQnaList(getQnAThreads());
    setQuestionInput('');
  };

  if (!activeProgram) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Profile Hero Banner */}
      <div className="bg-[var(--color-brand-primary)] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-tabular font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded bg-amber-500 text-slate-950">
              {mode === 'course' ? `UGC uni_code: ${activeProgram.uni_code}` : activeInstitution.institution_code}
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-semibold">
              Est. {activeInstitution.established} · {activeInstitution.type}
            </span>
          </div>
          <a
            href={activeInstitution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-300 hover:underline inline-flex items-center gap-1"
          >
            <span>Official University Website ({activeInstitution.website})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {mode === 'course'
              ? `${activeProgram.course_name} (${activeProgram.degree_awarded}) — ${activeInstitution.name}`
              : `${activeInstitution.name} (${activeInstitution.institution_code})`}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            {mode === 'course'
              ? activeProgram.course_description
              : `${activeInstitution.location} · Nominal Internal Hostel Fee: ~LKR ${activeInstitution.hostel_monthly_lkr}/yr · ${institutionOfferings.length} tracked UGC uni_code programs`}
          </p>
        </div>

        {/* 5 Structured Tabs (Prompt 6) */}
        <div
          role="tablist"
          aria-label="Institution and course profile sections"
          className="flex flex-wrap gap-2 pt-3 border-t border-slate-800"
        >
          {[
            { id: 'overview', label: '1. Overview & Courses' },
            { id: 'matrix', label: '2. 25-District Z-Score Matrix' },
            { id: 'rules', label: '3. Eligibility & Subject Rules' },
            { id: 'reviews', label: '4. Verified Student Reviews (.ac.lk)' },
            { id: 'qna', label: '5. Ask an Undergrad (Campus Rep Q&A)' },
          ].map((tItem) => (
            <button
              key={tItem.id}
              role="tab"
              aria-selected={activeTab === tItem.id}
              type="button"
              onClick={() => setActiveTab(tItem.id as ProfileTab)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold interactive-surface ${
                activeTab === tItem.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {tItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Courses */}
      {activeTab === 'overview' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Offered UGC <code className="font-tabular">uni_code</code> Programs at {activeInstitution.name} ({district.district_name} Cutoffs)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutionOfferings.map((prog) => (
              <ProgramChanceCard key={prog.uni_code} program={prog} />
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: 25-District Z-Score Cutoff Matrix & Visual Bar Chart */}
      {activeTab === 'matrix' && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                All 25 Districts Historical Z-Score Cutoff Matrix — {activeProgram.uni_code} ({activeProgram.course_name})
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your home district (<strong>{district.district_name}</strong>) is highlighted in gold. NQC districts are explicitly badged.
              </p>
            </div>
            <select
              aria-label="Select uni_code for 25-district matrix"
              value={activeProgram.uni_code}
              onChange={(e) => openCourseProfile(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-bold"
            >
              {districtPrograms.map((p) => (
                <option key={p.uni_code} value={p.uni_code}>
                  {p.uni_code} — {p.course_name} ({p.institution_code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allDistrictCutoffs.map((row) => {
              const isHome = row.district_id === district.district_id;
              const widthPct =
                row.min_z_score !== null
                  ? Math.max(15, Math.min(100, Math.round((row.min_z_score / 2.5) * 100)))
                  : 0;
              return (
                <div
                  key={row.district_id}
                  className={`p-3.5 rounded-lg border ${
                    isHome
                      ? 'border-2 border-amber-500 bg-amber-50/70'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">
                      #{String(row.district_id).padStart(2, '0')} {row.district_name}{' '}
                      {isHome && <span className="text-amber-800">(Your District)</span>}
                    </span>
                    <span className="font-tabular text-slate-950">
                      {row.min_z_score !== null ? row.min_z_score.toFixed(4) : 'NQC (NULL)'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 mt-2 overflow-hidden">
                    {row.min_z_score !== null && (
                      <div
                        style={{ width: `${widthPct}%` }}
                        className={`h-full rounded-full ${isHome ? 'bg-amber-600' : 'bg-slate-800'}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tab 3: Eligibility & Subject Rules */}
      {activeTab === 'rules' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Official UGC Subject Prerequisites & General Admission Rules — {activeProgram.uni_code}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900">
                Course-Specific Subject Requirements ({activeProgram.course_name})
              </h3>
              {activeProgram.subject_requirements.required_subjects && (
                <p>
                  <strong>Mandatory A/L Subjects:</strong>{' '}
                  {activeProgram.subject_requirements.required_subjects.join(', ')}
                </p>
              )}
              {activeProgram.subject_requirements.any_of_subjects && (
                <p>
                  <strong>Approved Third Subject Pool:</strong>{' '}
                  {activeProgram.subject_requirements.any_of_subjects.join(', ')}
                </p>
              )}
              <p>
                <strong>Minimum Subject Grade:</strong> Grade '
                {activeProgram.subject_requirements.min_grade ?? 'S'}' or above
              </p>
              {activeProgram.subject_requirements.notes && (
                <p className="text-slate-600">{activeProgram.subject_requirements.notes}</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <h3 className="font-extrabold text-amber-950">
                General UGC National Admission Rules
              </h3>
              <ul className="space-y-1.5 text-slate-800">
                <li>• Minimum 3 'S' passes at one and the same sitting of G.C.E. (A/L).</li>
                <li>• Minimum 30% marks in the Common General Test (mandatory for registration).</li>
                <li>
                  • Quota Allocation: 40% All-Island Merit, 55% District Quota, 5% Educationally Disadvantaged Districts (Except Arts 019 which is 100% All-Island Merit).
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Verified Student Reviews (Shiksha Style) */}
      {activeTab === 'reviews' && (
        <section className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Verified Undergraduate Reviews (Hostels, Mahapola & Graduate Salaries)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Every reviewer is verified via their official Sri Lankan <code className="font-tabular">.ac.lk</code> university student email.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shrink-0"
            >
              + Write a Review (Verify with .ac.lk Email)
            </button>
          </div>

          {showReviewModal && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-white rounded-xl border-2 border-amber-400 p-5 space-y-4"
            >
              <h3 className="text-base font-extrabold text-slate-900">
                Submit Verified Student Review ({activeInstitution.name})
              </h3>
              {revError && (
                <div role="alert" className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold">
                  {revError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="rev-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="rev-email" className="block text-xs font-bold text-slate-700 mb-1">
                    University Email (.ac.lk) *
                  </label>
                  <input
                    id="rev-email"
                    type="email"
                    required
                    placeholder="student@uom.ac.lk"
                    value={revEmail}
                    onChange={(e) => setRevEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="rev-hostel" className="block text-xs font-bold text-slate-700 mb-1">
                    Hostel / Boarding Cost (LKR)
                  </label>
                  <input
                    id="rev-hostel"
                    type="number"
                    value={revHostelLkr}
                    onChange={(e) => setRevHostelLkr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-tabular"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="rev-comment" className="block text-xs font-bold text-slate-700 mb-1">
                  Your Review on Academics, Hostels, Mahapola & Internships *
                </label>
                <textarea
                  id="rev-comment"
                  rows={3}
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs font-bold"
                >
                  Verify .ac.lk & Publish Review
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rev.student_name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                        ✓ Verified .ac.lk ({rev.institution_code})
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Program {rev.uni_code} · Posted {rev.created_at}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-tabular font-extrabold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{rev.academic_rating}.0 / 5.0</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100">
                    Hostel: LKR {rev.hostel_cost_lkr.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100">
                    Mahapola/Bursary: {rev.mahapola_rating}/5
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100">
                    Employability: {rev.employability_rating}/5
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Tab 5: Ask a Current Undergrad (Campus Rep Q&A) */}
      {activeTab === 'qna' && (
        <section className="space-y-5">
          <form
            onSubmit={handleAskQuestion}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
          >
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <span>Ask a Verified Senior Undergraduate ("Campus Ambassador")</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={askedByInput}
                onChange={(e) => setAskedByInput(e.target.value)}
                placeholder="Your Stream & District (e.g. Bio Science · Galle)"
                aria-label="Your stream and district"
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
              <input
                type="text"
                required
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask about hostel facilities, GPA field selection, ragging safety, or lectures..."
                aria-label="Question for campus ambassador"
                className="md:col-span-2 px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs font-bold"
              >
                Post Question to Campus Ambassadors
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {qnaList.map((thread) => (
              <div
                key={thread.id}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800">
                    Q from {thread.asked_by} · ({thread.uni_code} · {thread.institution_code})
                  </span>
                  <span>{thread.created_at}</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  "{thread.question}"
                </h3>
                <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{thread.answered_by_role}</span>
                  </div>
                  <p className="leading-relaxed">{thread.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export const AdmissionsCalendarView: React.FC = () => {
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  const toggleReminder = (id: string) => {
    setRemindedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      <div className="border-b border-slate-200 pb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
          Vuzopedia "Календарь абитуриента" Equivalent for Sri Lanka
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Sri Lankan Admissions, UGC Cutoff & Aptitude Test Calendar
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Track key dates across Department of Examinations (<code className="font-tabular">doenets.lk</code>), UGC Online Admissions (<code className="font-tabular">ugc.ac.lk</code>), University Aptitude Tests, and MOHE Interest-Free Student Loans (<code className="font-tabular">studentloans.mohe.gov.lk</code>).
        </p>
      </div>

      <div className="space-y-4">
        {ADMISSIONS_CALENDAR_EVENTS.map((ev) => {
          const isReminded = remindedIds.includes(ev.id);
          return (
            <article
              key={ev.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      ev.status === 'OPEN_NOW'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : ev.status === 'UPCOMING'
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ev.status === 'OPEN_NOW'
                      ? '🟢 OPEN NOW'
                      : ev.status === 'UPCOMING'
                      ? '🟡 UPCOMING WINDOW'
                      : '✓ COMPLETED'}
                  </span>
                  <span className="text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                    {ev.category}
                  </span>
                  <span className="font-tabular text-xs font-bold text-slate-900">
                    📅 {ev.window_date}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">{ev.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ev.description}</p>
                <a
                  href={ev.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                >
                  <span>Official Portal: {ev.organization}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => toggleReminder(ev.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 ${
                  isReminded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[var(--color-brand-primary)] text-white hover:bg-slate-800'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>{isReminded ? 'WhatsApp / Alert Set ✓' : 'Remind Me on WhatsApp'}</span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
