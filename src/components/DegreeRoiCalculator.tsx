import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Building2,
  DollarSign,
  GraduationCap,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type LivingArrangement = 'home' | 'hostel';
export type CareerStream = 'it_software' | 'engineering' | 'management_finance' | 'biotech_science';
export type ScholarshipTier = 'standard' | 'distinction';

interface CareerConfig {
  label: string;
  entrySalary: number; // monthly LKR
}

const CAREER_CONFIGS: Record<CareerStream, CareerConfig> = {
  it_software: {
    label: 'IT & Software Engineering / Data Science',
    entrySalary: 165000,
  },
  engineering: {
    label: 'Civil, Mechanical & Electrical Engineering',
    entrySalary: 135000,
  },
  management_finance: {
    label: 'Business, Accounting, Banking & Marketing',
    entrySalary: 115000,
  },
  biotech_science: {
    label: 'Biotechnology, Food Science & Healthcare',
    entrySalary: 105000,
  },
};

export const DegreeRoiCalculator: React.FC = () => {
  const { setRoute } = useApp();

  const [living, setLiving] = useState<LivingArrangement>('hostel');
  const [career, setCareer] = useState<CareerStream>('it_software');
  const [scholarship, setScholarship] = useState<ScholarshipTier>('standard');

  const selectedCareer = CAREER_CONFIGS[career];
  const monthlySalary = selectedCareer.entrySalary;

  // Monthly living cost
  // Home: LKR 6,000 transport
  // Hostel: LKR 15,000 boarding + LKR 15,000 food = LKR 30,000/mo
  const monthlyLiving = living === 'home' ? 6000 : 30000;
  const fourYearLiving = monthlyLiving * 48;

  // Column 1: State UGC
  const stateMahapolaTotal = 5000 * 48; // LKR 240,000
  const stateNetOutOfPocket = Math.max(0, fourYearLiving - stateMahapolaTotal);
  const stateMonthlyDebt = 0;

  // Column 2: MOHE IFSLS
  const ifslsMaxLoan = 1100000;
  const ifslsRepayMonths = 84; // 7 years over months 61 to 144
  const ifslsMonthlyRepayment = Math.round(ifslsMaxLoan / ifslsRepayMonths); // ~13,095
  const ifslsDebtPercentage = ((ifslsMonthlyRepayment / monthlySalary) * 100).toFixed(1);
  const ifslsNetSalary = monthlySalary - ifslsMonthlyRepayment;

  // Column 3: Self-Funded Private / UK Degree
  const basePrivateTuition = 3200000;
  const scholarshipDiscount = scholarship === 'distinction' ? 0.35 : 0;
  const netPrivateTuition = Math.round(basePrivateTuition * (1 - scholarshipDiscount));
  const internshipEarnings = 55000 * 12; // 1-year IP earnings: LKR 660,000
  const privateNetOverallCost = netPrivateTuition + fourYearLiving - internshipEarnings;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            Financial Decision Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            Sri Lankan 4-Year Degree Cost, IFSLS Loan Repayment & Salary ROI Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Compare actual 4-year financial out-of-pocket expenses, post-graduation debt burden, and entry-level salary repayment across State UGC, MOHE 0% Interest Loans, and Self-Funded Private Campuses.
          </p>
        </div>

        <a
          href="https://studentloans.mohe.gov.lk/loan_application/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-lg bg-[var(--color-brand-primary)] hover:bg-slate-800 text-white text-xs font-bold self-start md:self-auto shrink-0 shadow-xs inline-flex items-center gap-1.5"
        >
          MOHE 0% Loan Portal ↗
        </a>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        {/* Living Arrangement */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            1. Living & Boarding Arrangement
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setLiving('home')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                living === 'home'
                  ? 'bg-[var(--color-brand-primary)] text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              🏠 Commuting (Home)
            </button>
            <button
              type="button"
              onClick={() => setLiving('hostel')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                living === 'hostel'
                  ? 'bg-[var(--color-brand-primary)] text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              🏢 Outstation Hostel
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {living === 'home' ? 'Transport: ~LKR 6,000/mo' : 'Hostel + Boarding: ~LKR 30,000/mo'}
          </span>
        </div>

        {/* Target Career Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            2. Target Career Field (Benchmark Salary)
          </label>
          <select
            value={career}
            onChange={(e) => setCareer(e.target.value as CareerStream)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
          >
            {Object.entries(CAREER_CONFIGS).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 mt-1 block font-tabular">
            Expected Starting Salary: <strong>LKR {monthlySalary.toLocaleString()} / mo</strong>
          </span>
        </div>

        {/* Scholarship Tier */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            3. A/L Merit Scholarship Tier
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setScholarship('standard')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                scholarship === 'standard'
                  ? 'bg-[var(--color-brand-primary)] text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Standard (3S–3C)
            </button>
            <button
              type="button"
              onClick={() => setScholarship('distinction')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                scholarship === 'distinction'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              2A 1B / 3A (35% Off)
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {scholarship === 'distinction' ? '✨ 35% Private Merit Scholarship Applied' : 'Standard semester fee rates'}
          </span>
        </div>
      </div>

      {/* 3-Column Comparative Financial Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: State UGC Free Higher Education */}
        <div className="bg-slate-50 rounded-2xl border-2 border-slate-300 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[11px] font-extrabold">
                Tier 1: State UGC
              </span>
              <span className="text-xs font-bold text-emerald-700">100% Free Tuition</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                State University (UCSC / UOM / UOP)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Selected via 25-district A/L Z-score merit quotas
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">4-Year Tuition:</span>
                <span className="font-extrabold text-emerald-800">LKR 0 (Free)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Mahapola / Bursary Allowance:</span>
                <span className="font-bold text-emerald-700">+LKR 240,000 (Subsidized)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">4-Year Living & Boarding:</span>
                <span className="font-tabular font-bold text-slate-900">
                  LKR {fourYearLiving.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                <span className="text-slate-900">Net 4-Year Out-of-Pocket:</span>
                <span className="font-tabular text-sm text-slate-950">
                  LKR {stateNetOutOfPocket.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
            <div className="font-extrabold text-emerald-950 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Post-Graduation Loan Debt: LKR 0</span>
            </div>
            <p className="text-[11px] text-slate-600">
              You retain <strong>100%</strong> of your LKR {monthlySalary.toLocaleString()} starting salary from day 1 with zero debt obligations.
            </p>
          </div>
        </div>

        {/* Column 2: MOHE 0% Interest Student Loan Scheme (IFSLS) */}
        <div className="bg-amber-50/50 rounded-2xl border-2 border-amber-400 p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-extrabold">
                Tier 3: MOHE IFSLS Loan
              </span>
              <span className="text-xs font-bold text-amber-900">0% Interest Rate</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                MOHE Interest-Free Student Loan
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                SLIIT, NSBM, CINEC, Horizon (Bank of Ceylon / People’s Bank)
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-amber-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Upfront Tuition During Study:</span>
                <span className="font-extrabold text-emerald-800">LKR 0 (Bank Funded)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Interest Subsidized by Govt:</span>
                <span className="font-bold text-amber-800">100% (Zero Interest)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Grace Period:</span>
                <span className="font-bold text-slate-800">4 Yrs Study + 1 Yr Post-Grad</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-amber-200 font-bold">
                <span className="text-slate-900">Total Funded Loan:</span>
                <span className="font-tabular text-sm text-slate-950">
                  LKR {ifslsMaxLoan.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-amber-300 text-xs space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-extrabold text-slate-900">Monthly Repayment (Y6–Y12):</span>
              <span className="font-tabular font-extrabold text-sm text-amber-800">
                ~LKR {ifslsMonthlyRepayment.toLocaleString()} / mo
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Repayment is only <strong>{ifslsDebtPercentage}%</strong> of your entry-level salary (LKR {monthlySalary.toLocaleString()}), leaving you <strong>LKR {ifslsNetSalary.toLocaleString()} net take-home</strong> each month!
            </p>
          </div>
        </div>

        {/* Column 3: Self-Funded Private / Foreign UK Degree */}
        <div className="bg-sky-50/50 rounded-2xl border-2 border-sky-300 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-900 text-white text-[11px] font-extrabold">
                Tier 4: Foreign / Self-Funded
              </span>
              <span className="text-xs font-bold text-sky-800">Fast-Track 3-Yr UK</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Direct UK / Aus Degree (IIT / Curtin / SLIIT)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                University of Westminster, Curtin Perth, Robert Gordon
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-sky-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Net Tuition (After Scholarships):</span>
                <span className="font-tabular font-bold text-slate-900">
                  LKR {netPrivateTuition.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">1-Year Corporate Internship Earnings:</span>
                <span className="font-tabular font-bold text-emerald-700">
                  -LKR {internshipEarnings.toLocaleString()} (Earned)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">4-Year Living & Boarding:</span>
                <span className="font-tabular font-bold text-slate-900">
                  +LKR {fourYearLiving.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-sky-200 font-bold">
                <span className="text-slate-900">Calculated Net Cost:</span>
                <span className="font-tabular text-sm text-slate-950">
                  LKR {privateNetOverallCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-sky-200 text-xs space-y-1">
            <div className="font-extrabold text-sky-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>1 to 1.5 Years Earlier Graduation</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Zero state intake backlog waiting delay. You enter the workforce 18 months earlier and earn <strong>LKR 2.4M+ in salary</strong> before state batchmates finish!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
