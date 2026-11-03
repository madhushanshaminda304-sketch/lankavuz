import React, { useState, useMemo } from 'react';
import {
  Building2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Calendar,
  Briefcase,
  Award,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DegreeRoiCalculator } from './DegreeRoiCalculator';
import {
  PRIVATE_AND_ALTERNATIVE_PROGRAMS,
  type PrivateAndAlternativeProgram,
  type HigherEdTier,
  type EntryQualification,
  type FinancialAidType,
} from '../services/ugcDataService';

export const PrivateUniversitiesView: React.FC = () => {
  const { setRoute, openCourseProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'ALL' | HigherEdTier>('ALL');
  const [selectedQual, setSelectedQual] = useState<'ALL' | EntryQualification>('ALL');
  const [selectedAid, setSelectedAid] = useState<'ALL' | FinancialAidType>('ALL');
  const [selectedAccreditation, setSelectedAccreditation] = useState<'ALL' | 'MOHE' | 'UGC_FOREIGN' | 'IESL' | 'TVEC'>('ALL');

  const filteredPrograms = useMemo(() => {
    return PRIVATE_AND_ALTERNATIVE_PROGRAMS.filter((prog) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          prog.degree_title.toLowerCase().includes(q) ||
          prog.institute_name.toLowerCase().includes(q) ||
          prog.institute_abbr.toLowerCase().includes(q) ||
          prog.awarding_body.toLowerCase().includes(q) ||
          prog.location.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Tier filter
      if (selectedTier !== 'ALL' && prog.tier !== selectedTier) return false;

      // Entry qualification filter
      if (selectedQual !== 'ALL' && !prog.entry_qualifications.includes(selectedQual)) return false;

      // Financial aid filter
      if (selectedAid !== 'ALL' && !prog.financial_aid_types.includes(selectedAid)) return false;

      // Accreditation filter
      if (selectedAccreditation === 'MOHE' && !prog.mohe_approved) return false;
      if (selectedAccreditation === 'UGC_FOREIGN' && !prog.ugc_recognized_foreign) return false;
      if (selectedAccreditation === 'IESL' && !prog.iesl_accredited) return false;
      if (selectedAccreditation === 'TVEC' && !prog.tvec_nvq_level) return false;

      return true;
    });
  }, [searchQuery, selectedTier, selectedQual, selectedAid, selectedAccreditation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-[#0F2942] to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sri Lanka 4-Tier Higher Education Atlas</span>
          </span>
          <span className="text-xs text-slate-300">
            Updated for 2025/2026 Academic Year
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Private, Foreign-Affiliated & Non-State Universities Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Each year, ~180,000 students pass G.C.E. A/Ls, but State UGC universities have capacity for only ~45,000 (25%). For the remaining 75%, LankaVuz maps every verified government-recognized degree: State Direct-Entry (OUSL / KDU / UoVT), MOHE Interest-Free Student Loan (IFSLS) Campuses, and Direct British / Australian Affiliated Degrees.
          </p>
        </div>

        {/* 4-Tier Visual Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tier 1</span>
            <div className="font-extrabold text-sm text-white">State UGC Free Degrees</div>
            <p className="text-[11px] text-slate-300">21 Universities · Cutoff Z-Scores</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Tier 2</span>
            <div className="font-extrabold text-sm text-emerald-200">State Non-UGC (Direct)</div>
            <p className="text-[11px] text-slate-300">OUSL · KDU · UoVT · SLIATE</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Tier 3</span>
            <div className="font-extrabold text-sm text-amber-200">MOHE DAIs & IFSLS Loans</div>
            <p className="text-[11px] text-slate-300">SLIIT · NSBM · CINEC · Horizon</p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-1">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">Tier 4</span>
            <div className="font-extrabold text-sm text-sky-200">Foreign UK / Aus Degrees</div>
            <p className="text-[11px] text-slate-300">IIT · Curtin · APIIT · Westminster</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by degree title, institute, awarding university, or town..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Showing <strong>{filteredPrograms.length}</strong> of {PRIVATE_AND_ALTERNATIVE_PROGRAMS.length} verified programs</span>
          </div>
        </div>

        {/* Multi-Angle Smart Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter 1: Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Higher Ed Tier
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as 'ALL' | HigherEdTier)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white"
            >
              <option value="ALL">All Tiers (Tiers 2, 3 & 4)</option>
              <option value="TIER_2_STATE_NON_UGC">Tier 2: State Non-UGC (OUSL/KDU/SLIATE)</option>
              <option value="TIER_3_MOHE_DAI_IFSLS">Tier 3: MOHE DAIs & IFSLS (SLIIT/NSBM/CINEC)</option>
              <option value="TIER_4_FOREIGN_AFFILIATED">Tier 4: Foreign UK / Aus Degrees (IIT/Curtin)</option>
            </select>
          </div>

          {/* Filter 2: Entry Qualification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Entry Qualification
            </label>
            <select
              value={selectedQual}
              onChange={(e) => setSelectedQual(e.target.value as 'ALL' | EntryQualification)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white"
            >
              <option value="ALL">All Entry Pathways</option>
              <option value="AL_PASS">3 A/L Passes (Any Stream)</option>
              <option value="PENDING_AL">Pending A/L Results (Provisional)</option>
              <option value="POST_OL_FOUNDATION">Post-O/L Foundation Track</option>
              <option value="NVQ_TOPUP">NVQ Level 5 / HND Top-Up</option>
            </select>
          </div>

          {/* Filter 3: Financial Aid & Funding */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Funding & Financial Aid
            </label>
            <select
              value={selectedAid}
              onChange={(e) => setSelectedAid(e.target.value as 'ALL' | FinancialAidType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white"
            >
              <option value="ALL">All Funding Models</option>
              <option value="IFSLS_LOAN">💰 MOHE 0% Interest Loan (IFSLS)</option>
              <option value="TUITION_FREE_STATE">🆓 100% Free State Tuition (UoVT/SLIATE)</option>
              <option value="MERIT_SCHOLARSHIP">🏆 A/L Merit Scholarships (3A / 2A1B)</option>
              <option value="INSTALLMENTS">💳 Semester / Monthly Installments</option>
            </select>
          </div>

          {/* Filter 4: Accreditation & Recognition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Accreditation
            </label>
            <select
              value={selectedAccreditation}
              onChange={(e) => setSelectedAccreditation(e.target.value as 'ALL' | 'MOHE' | 'UGC_FOREIGN' | 'IESL' | 'TVEC')}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white"
            >
              <option value="ALL">All Accreditations</option>
              <option value="MOHE">MOHE Approved Degree Awarding Institute</option>
              <option value="UGC_FOREIGN">UGC Recognized Foreign University</option>
              <option value="IESL">IESL / Washington Accord (Engineering)</option>
              <option value="TVEC">TVEC NVQ Level 6 / 7 Certified</option>
            </select>
          </div>
        </div>
      </section>

      {/* Program Cards Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <Building2 className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No programs match your selected filters
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Try resetting the qualification or accreditation filter, or search for a specific campus like SLIIT, NSBM, OUSL, or IIT.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTier('ALL');
              setSelectedQual('ALL');
              setSelectedAid('ALL');
              setSelectedAccreditation('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <article
              key={program.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between gap-5 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="space-y-3.5">
                {/* Top Badge: Tier + Duration */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                      program.tier === 'TIER_2_STATE_NON_UGC'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : program.tier === 'TIER_3_MOHE_DAI_IFSLS'
                        ? 'bg-amber-50 text-amber-950 border-amber-300'
                        : 'bg-sky-50 text-sky-950 border-sky-200'
                    }`}
                  >
                    {program.tier_name}
                  </span>

                  <span className="text-xs font-bold text-slate-500 font-tabular">
                    {program.duration_years} Years
                  </span>
                </div>

                {/* Degree Title & Institution */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {program.degree_title}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-semibold">
                    <span>🏛️ {program.institute_name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Awarded by: <strong>{program.awarding_body}</strong> ({program.country_of_award})
                  </div>
                </div>

                {/* Accreditation & Recognition Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {program.mohe_approved && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                      ✓ MOHE Approved DAI
                    </span>
                  )}
                  {program.ugc_recognized_foreign && (
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[10px] font-bold">
                      ✓ UGC Recognized Foreign Uni
                    </span>
                  )}
                  {program.iesl_accredited && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                      ✓ IESL / Washington Accord
                    </span>
                  )}
                  {program.tvec_nvq_level && (
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[10px] font-bold">
                      ✓ TVEC ({program.tvec_nvq_level})
                    </span>
                  )}
                  {program.financial_aid_types.includes('IFSLS_LOAN') && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-extrabold">
                      💰 0% Interest MOHE Loan
                    </span>
                  )}
                </div>

                {/* Practical Internship & Intake info */}
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Intakes: {program.intake_months.join(', ')}</span>
                  </div>

                  {program.mandatory_internship && (
                    <div className="flex items-start gap-1.5 text-slate-600 text-[11px] pt-1 border-t border-slate-200/60">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{program.internship_note ?? 'Mandatory industrial internship included'}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 pt-1">
                    📍 {program.location}
                  </div>
                </div>

                {/* Tuition & Financial Breakdown */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-amber-950">Total Tuition:</span>
                    <span className="text-sm font-extrabold text-slate-900 font-tabular">
                      {program.tuition_total_lkr === 0
                        ? 'LKR 0 (100% Free State Tuition)'
                        : program.tuition_total_lkr !== null
                        ? `LKR ${program.tuition_total_lkr.toLocaleString()}`
                        : 'Subsidized Fee'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {program.tuition_note}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  {program.state_equivalent_uni_code ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (program.state_equivalent_uni_code) {
                          openCourseProfile(program.state_equivalent_uni_code);
                        }
                      }}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                    >
                      ⇄ Compare with State ({program.state_equivalent_uni_code})
                    </button>
                  ) : (
                    <a
                      href={program.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      <span>Campus Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                    title="Visit Official Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-[var(--color-brand-primary)] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Apply on {program.institute_abbr} Official Page ↗</span>
                  </a>
                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Official Program Page ↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 4-Year Degree Cost, IFSLS Loan Repayment & Salary ROI Calculator */}
      <DegreeRoiCalculator />
    </div>
  );
};
