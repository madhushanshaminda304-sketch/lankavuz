import React, { useState, useMemo } from 'react';
import {
  Scale,
  Plus,
  X,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NON_STATE_IFSLS_PATHWAYS } from '../services/ugcDataService';

const POPULAR_PRESETS = [
  {
    label: 'Computing: UCSC CS vs UOM IT vs USJP CS vs UOM AI',
    codes: ['012A', '026A', '012F', '096A'],
  },
  {
    label: 'Engineering: UOM vs UOP vs UOR vs USJP',
    codes: ['008A', '008B', '008C', '008F'],
  },
  {
    label: 'Medicine: Colombo vs Peradeniya vs Jayewardenepura vs Kelaniya',
    codes: ['001A', '001B', '001C', '001D'],
  },
  {
    label: 'Engineering Tech (ET): USJP vs Kelaniya vs Ruhuna vs Wayamba',
    codes: ['102A', '102B', '102C', '102E'],
  },
];

export const CompareEngineView: React.FC = () => {
  const {
    district,
    districtPrograms,
    compareList,
    toggleCompare,
    setComparePreset,
    addToPlan,
    setIsCafDrawerOpen,
    openCourseProfile,
  } = useApp();

  const [highlightDiffsOnly, setHighlightDiffsOnly] = useState(false);
  const [selectedAddCode, setSelectedAddCode] = useState('');

  const comparedPrograms = useMemo(() => {
    return compareList
      .map((code) => districtPrograms.find((p) => p.uni_code === code))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [compareList, districtPrograms]);

  const availableToAdd = useMemo(() => {
    return districtPrograms.filter((p) => !compareList.includes(p.uni_code));
  }, [districtPrograms, compareList]);

  const rowsSame = (extractor: (p: (typeof comparedPrograms)[number]) => string) => {
    if (comparedPrograms.length <= 1) return false;
    const first = extractor(comparedPrograms[0]);
    return comparedPrograms.every((p) => extractor(p) === first);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
            Vuzopedia + Shiksha 4-Way College & Course Comparator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            4-Way University & UGC <code className="font-tabular">uni_code</code> Comparison Matrix
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Compare up to 4 state programs side-by-side for <strong>{district.district_name} District</strong>, or bridge directly to MOHE Interest-Free Loan (IFSLS) & TVEC NVQ backups.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer self-start md:self-auto">
          <input
            type="checkbox"
            checked={highlightDiffsOnly}
            onChange={(e) => setHighlightDiffsOnly(e.target.checked)}
            className="rounded border-slate-400"
          />
          <span>Highlight Differences Only</span>
        </label>
      </div>

      {/* Popular Pre-Built Comparisons + Add Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold text-slate-700 block">
              Popular Pre-Built Sri Lankan Comparisons:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setComparePreset(preset.codes)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 text-xs font-semibold border border-slate-200"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {compareList.length < 4 && (
            <div className="flex items-center gap-2">
              <select
                aria-label="Add program to comparison"
                value={selectedAddCode}
                onChange={(e) => setSelectedAddCode(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold"
              >
                <option value="">+ Add uni_code to Compare ({compareList.length}/4)...</option>
                {availableToAdd.map((p) => (
                  <option key={p.uni_code} value={p.uni_code}>
                    {p.uni_code} — {p.course_name} ({p.institution_code})
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedAddCode}
                onClick={() => {
                  if (selectedAddCode) {
                    toggleCompare(selectedAddCode);
                    setSelectedAddCode('');
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4-Column Comparison Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 text-xs font-extrabold uppercase tracking-wider w-48 border-r border-slate-800">
                Comparison Criterion
              </th>
              {comparedPrograms.map((p) => (
                <th key={p.uni_code} className="p-4 border-r border-slate-800 align-top">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <button
                      type="button"
                      onClick={() => openCourseProfile(p.uni_code)}
                      className="font-tabular font-extrabold text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950"
                    >
                      {p.uni_code}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.uni_code)}
                      aria-label={`Remove ${p.uni_code} from comparison`}
                      className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-extrabold text-sm text-white leading-snug">
                    {p.course_name}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {p.institution_name} ({p.institution_code})
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {/* Selected District Min Z-Score */}
            {(!highlightDiffsOnly || !rowsSame((p) => String(p.min_z_score))) && (
              <tr className="bg-amber-50/40">
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                  {district.district_name} District Min Z-Score
                </td>
                {comparedPrograms.map((p) => (
                  <td key={p.uni_code} className="p-4 font-tabular font-extrabold text-slate-950 border-r border-slate-100">
                    {p.min_z_score !== null ? p.min_z_score.toFixed(4) : 'NQC (NULL)'}
                    <span className="block text-[11px] font-sans font-normal text-slate-600 mt-0.5">
                      All-Island Range: {p.all_island_min_z.toFixed(2)} – {p.all_island_max_z.toFixed(2)}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Degree Awarded & Duration */}
            {(!highlightDiffsOnly || !rowsSame((p) => `${p.degree_awarded}-${p.duration_years}`)) && (
              <tr>
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                  Degree Awarded & Duration
                </td>
                {comparedPrograms.map((p) => (
                  <td key={p.uni_code} className="p-4 text-slate-800 border-r border-slate-100">
                    <strong className="font-bold block text-slate-900">{p.degree_awarded}</strong>
                    <span className="font-tabular text-xs text-slate-600">{p.duration_years} Years Full-Time</span>
                  </td>
                ))}
              </tr>
            )}

            {/* Medium of Instruction */}
            {(!highlightDiffsOnly || !rowsSame((p) => p.medium.join(','))) && (
              <tr>
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                  Medium of Instruction
                </td>
                {comparedPrograms.map((p) => (
                  <td key={p.uni_code} className="p-4 text-slate-800 border-r border-slate-100 font-semibold">
                    {p.medium.map((m: string) => (m === 'E' ? 'English' : m === 'S' ? 'Sinhala' : 'Tamil')).join(', ')}
                  </td>
                ))}
              </tr>
            )}

            {/* Annual Proposed Seat Intake */}
            {(!highlightDiffsOnly || !rowsSame((p) => String(p.proposed_intake))) && (
              <tr>
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                  Annual Proposed Seat Intake
                </td>
                {comparedPrograms.map((p) => (
                  <td key={p.uni_code} className="p-4 font-tabular font-bold text-slate-900 border-r border-slate-100">
                    {p.proposed_intake} Seats
                  </td>
                ))}
              </tr>
            )}

            {/* Subject Prerequisites */}
            {(!highlightDiffsOnly || !rowsSame((p) => JSON.stringify(p.subject_requirements))) && (
              <tr>
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                  Subject Prerequisites & Min Grades
                </td>
                {comparedPrograms.map((p) => (
                  <td key={p.uni_code} className="p-4 text-xs text-slate-700 border-r border-slate-100 space-y-1">
                    {p.subject_requirements.required_subjects && (
                      <div>
                        <strong>Mandatory:</strong> {p.subject_requirements.required_subjects.join(', ')}
                      </div>
                    )}
                    {p.subject_requirements.any_of_subjects && (
                      <div>
                        <strong>Plus any of:</strong> {p.subject_requirements.any_of_subjects.join(', ')}
                      </div>
                    )}
                    <div>
                      <strong>Min Grade:</strong> Grade '{p.subject_requirements.min_grade ?? 'S'}'
                    </div>
                  </td>
                ))}
              </tr>
            )}

            {/* Aptitude Test Requirement */}
            {(!highlightDiffsOnly || !rowsSame((p) => String(p.aptitude_test_required))) && (
              <tr>
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                  Aptitude Test Requirement
                </td>
                {comparedPrograms.map((p) => (
                  <td key={p.uni_code} className="p-4 border-r border-slate-100">
                    {p.aptitude_test_required ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 text-amber-950 text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        Yes (Required)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        No
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Action Row */}
            <tr className="bg-slate-50">
              <td className="p-4 font-bold text-slate-900 border-r border-slate-200">
                Shortlist Action
              </td>
              {comparedPrograms.map((p) => (
                <td key={p.uni_code} className="p-4 border-r border-slate-100">
                  <button
                    type="button"
                    onClick={() => addToPlan(p.uni_code)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-brand-primary)] hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    + Add {p.uni_code} to My UGC Plan
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* State + Non-State / IFSLS Student Loan Bridge */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Alternative Pathways & MOHE Interest-Free Student Loan Scheme (IFSLS) Bridge
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Parallel Non-State, IFSLS Interest-Free Govt Loan & TVEC NVQ Level 6/7 Comparables
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Verified accreditation badges help students and parents distinguish UGC/MOHE Degree Awarding Institutes (DAI) and TVEC-registered programs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCafDrawerOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shrink-0"
          >
            Request Free Counseling / Apply with 1 Form →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NON_STATE_IFSLS_PATHWAYS.map((pathway) => (
            <div
              key={pathway.id}
              className="rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-3 bg-slate-50/60"
            >
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {pathway.ugc_recognized && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                      ✅ UGC Recognized
                    </span>
                  )}
                  {pathway.mohe_dai && (
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[11px] font-bold">
                      ✅ MOHE Degree Awarding Institute (DAI)
                    </span>
                  )}
                  {pathway.tvec_nvq_level && (
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[11px] font-bold">
                      ✅ TVEC Registered ({pathway.tvec_nvq_level})
                    </span>
                  )}
                  {pathway.ifsls_loan_eligible && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[11px] font-bold">
                      💰 IFSLS Interest-Free Govt Loan Eligible
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900">{pathway.degree_title}</h3>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{pathway.institute_name}</strong> · {pathway.location}
                </p>
                <p className="text-xs text-emerald-800 font-semibold mt-2">{pathway.tuition_note_lkr}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <a
                  href={pathway.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsCafDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs font-bold"
                >
                  Add to 1-Click Backup Form
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
