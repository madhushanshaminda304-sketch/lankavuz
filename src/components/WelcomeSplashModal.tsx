import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Check,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Building2,
  Compass,
} from 'lucide-react';
import { useApp, type LanguageCode } from '../context/AppContext';
import { SRI_LANKA_DISTRICTS } from '../data/sriLankaUgcSnapshot';

interface WelcomeSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_DISTRICT_IDS = [1, 2, 5, 7, 8, 19, 10, 21, 25, 12]; // Colombo, Gampaha, Kandy, Galle, Matara, Kurunegala, Jaffna, Badulla, Ratnapura, Anuradhapura

export const WelcomeSplashModal: React.FC<WelcomeSplashModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLang, district, setDistrictId, setRoute } = useApp();
  const [selectedJourney, setSelectedJourney] = useState<'official_z' | 'subject_explorer' | 'private_unis' | 'home'>('official_z');
  const [isExiting, setIsExiting] = useState(false);
  const [counterCount, setCounterCount] = useState({ unis: 0, progs: 0, dists: 0 });

  // Animated stat counting effect over 600ms
  useEffect(() => {
    if (!isOpen) return;
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounterCount({
        unis: Math.floor(ease * 21),
        progs: Math.floor(ease * 276),
        dists: Math.floor(ease * 25),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleComplete = (targetRoute?: 'predictor' | 'home' | 'private-unis') => {
    try {
      localStorage.setItem('lankavuz_welcome_seen', 'v1');
    } catch {
      // Ignore storage errors
    }

    if (targetRoute) {
      setRoute(targetRoute);
    } else {
      if (selectedJourney === 'official_z' || selectedJourney === 'subject_explorer') {
        setRoute('predictor');
      } else if (selectedJourney === 'private_unis') {
        setRoute('private-unis');
      } else {
        setRoute('home');
      }
    }

    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 450);
  };

  const handleSkip = () => {
    handleComplete('home');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to LankaVuz"
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#091929] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-[#091929] to-[#040c15] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 ${
        isExiting ? 'curtain-exit' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sri Lanka's 360° Higher Education Atlas</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/60 font-semibold transition-colors"
        >
          Skip to Portal →
        </button>
      </div>

      {/* Main Content Stage */}
      <div className="max-w-4xl w-full mx-auto py-8 sm:py-12 space-y-8">
        {/* Animated Brand Crest & Headline */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/10 crest-animated mx-auto">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-9 h-9"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Lanka<span className="text-amber-400">Vuz</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Sri Lanka's Official UGC Cutoff Atlas, 3-Subject A/L Matcher, and MOHE Interest-Free Student Loan Bridge.
          </p>

          {/* Animated Counter Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-amber-300 font-tabular">
              🏛️ {counterCount.unis} State UGC Universities
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-emerald-300 font-tabular">
              🎓 {counterCount.progs} Official uni_code Degrees
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-sky-300 font-tabular">
              📊 {counterCount.dists} District Quota Cutoffs
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-purple-300 font-tabular">
              💰 MOHE Loan & Private Pathways
            </span>
          </div>
        </div>

        {/* 3-Step Interactive Personalization Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xs">
          {/* Step 1: Language */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
              Step 1 of 3 · Choose Your Language / භාෂාව / மொழி
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { code: 'EN', title: 'English' },
                  { code: 'SI', title: 'සිංහල' },
                  { code: 'TA', title: 'தமிழ்' },
                ] as { code: LanguageCode; title: string }[]
              ).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`py-3 px-4 rounded-xl text-center text-sm font-extrabold transition-all border ${
                    lang === item.code
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: District */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                Step 2 of 3 · Select Your G.C.E. A/L District
              </span>
              <span className="text-xs text-slate-400">
                Selected: <strong className="text-white">{district.district_name} (#{district.district_id})</strong>
              </span>
            </div>

            {/* Popular District Pills */}
            <div className="flex flex-wrap gap-2">
              {POPULAR_DISTRICT_IDS.map((id) => {
                const distObj = SRI_LANKA_DISTRICTS.find((d) => d.district_id === id);
                if (!distObj) return null;
                const isSelected = district.district_id === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDistrictId(id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {distObj.district_name}
                  </button>
                );
              })}
            </div>

            {/* Full 25 District Dropdown */}
            <select
              aria-label="All 25 UGC Districts"
              value={district.district_id}
              onChange={(e) => setDistrictId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white mt-1"
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  District #{d.district_id}: {d.district_name} ({d.name_si} / {d.name_ta}) — {d.province}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Where Are You in Your Journey? */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
              Step 3 of 3 · Where are you in your higher education journey?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A */}
              <button
                type="button"
                onClick={() => setSelectedJourney('official_z')}
                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                  selectedJourney === 'official_z'
                    ? 'bg-amber-500/15 border-amber-400 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>I Have My Official Z-Score</span>
                    {selectedJourney === 'official_z' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Match my Z-score with Safe, Target, and Reach state degrees in {district.district_name}.
                  </p>
                </div>
              </button>

              {/* Option B */}
              <button
                type="button"
                onClick={() => setSelectedJourney('subject_explorer')}
                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                  selectedJourney === 'subject_explorer'
                    ? 'bg-amber-500/15 border-amber-400 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>A/Ls Pending · 3-Subject Explorer</span>
                    {selectedJourney === 'subject_explorer' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Explore all UGC degrees unlocked by my 3 subjects & historical target cutoffs.
                  </p>
                </div>
              </button>

              {/* Option C */}
              <button
                type="button"
                onClick={() => setSelectedJourney('private_unis')}
                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                  selectedJourney === 'private_unis'
                    ? 'bg-amber-500/15 border-amber-400 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>Private, Foreign & MOHE Loans</span>
                    {selectedJourney === 'private_unis' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Explore SLIIT, NSBM, CINEC, IIT, and 0% interest government student loan pathways.
                  </p>
                </div>
              </button>

              {/* Option D */}
              <button
                type="button"
                onClick={() => setSelectedJourney('home')}
                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                  selectedJourney === 'home'
                    ? 'bg-amber-500/15 border-amber-400 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>Explore Full Higher Ed Portal</span>
                    {selectedJourney === 'home' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Browse all universities, compare 4 degrees, take the career quiz, or see key dates.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => handleComplete()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Launch My Personalized Atlas</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-slate-400 pb-2">
        Sri Lanka University Grants Commission (UGC) & Ministry of Higher Education data snapshot · You can change your district or replay setup anytime in the top bar.
      </div>
    </div>
  );
};
