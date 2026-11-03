import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GlobalHeader } from './components/GlobalHeader';
import { HomeDiscoveryView } from './components/HomeDiscoveryView';
import { PredictorView } from './components/PredictorView';
import {
  PreferenceSimulatorView,
  PreferenceSimulatorDrawer,
} from './components/PreferenceSimulatorView';
import { CompareEngineView } from './components/CompareEngineView';
import {
  CareerAtlasAndQuizView,
  SingleWindowCafDrawer,
} from './components/CareerAtlasAndQuizView';
import {
  InstitutionAndCourseProfileView,
  AdmissionsCalendarView,
} from './components/ProfileAndCalendarView';
import { WelcomeSplashModal } from './components/WelcomeSplashModal';
import { PrivateUniversitiesView } from './components/PrivateUniversitiesView';

const AppRouterContent: React.FC = () => {
  const { route, district, setRoute, setIsCafDrawerOpen, isWelcomeOpen, setIsWelcomeOpen } = useApp();

  useEffect(() => {
    const titles: Record<string, string> = {
      home: `LankaVuz (${district.district_name}) — Sri Lanka UGC Z-Score Cutoff Atlas & Higher Education Portal`,
      predictor: `Z-Score & 3-Subject A/L Predictor (${district.district_name}) — LankaVuz`,
      'my-plan': `My UGC Preference Order Simulator & Conflict Auditor — LankaVuz`,
      compare: `4-Way University & UGC uni_code Comparator — LankaVuz`,
      careers: `Sri Lanka Career-to-Degree Atlas & LKR Salary Guide — LankaVuz`,
      'career-quiz': `3-Minute RIASEC & Klimov Career Compass Quiz — LankaVuz`,
      calendar: `Sri Lanka UGC Admissions & Aptitude Test Calendar — LankaVuz`,
      'private-unis': `Sri Lanka Private, Foreign & Non-State University Hub (${district.district_name}) — LankaVuz`,
      institution: `State University Profile & 25-District Cutoffs — LankaVuz`,
      course: `UGC uni_code Course Cutoff Matrix & Reviews — LankaVuz`,
    };
    document.title = titles[route] ?? titles.home;
  }, [route, district]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <GlobalHeader />

      <main className="flex-1">
        {route === 'home' && <HomeDiscoveryView />}
        {route === 'predictor' && <PredictorView />}
        {route === 'my-plan' && <PreferenceSimulatorView />}
        {route === 'compare' && <CompareEngineView />}
        {route === 'careers' && <CareerAtlasAndQuizView initialTab="atlas" />}
        {route === 'career-quiz' && <CareerAtlasAndQuizView initialTab="quiz" />}
        {route === 'calendar' && <AdmissionsCalendarView />}
        {route === 'institution' && <InstitutionAndCourseProfileView mode="institution" />}
        {route === 'course' && <InstitutionAndCourseProfileView mode="course" />}
        {route === 'private-unis' && <PrivateUniversitiesView />}
      </main>

      <PreferenceSimulatorDrawer />
      <SingleWindowCafDrawer />
      <WelcomeSplashModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />

      {/* Authoritative Footer */}
      <footer className="bg-[var(--color-brand-primary)] text-slate-300 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2">
            <div className="font-extrabold text-base text-white">
              Lanka<span className="text-amber-400">Vuz</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sri Lanka's Higher Education Discovery, 25-District Z-Score Cutoff Atlas, UGC Preference Conflict Auditor, and MOHE Interest-Free Loan (IFSLS) Bridge.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white">Core UGC Admission Tools</div>
            <ul className="space-y-1">
              <li>
                <button type="button" onClick={() => setRoute('predictor')} className="hover:text-amber-300">
                  Z-Score + 3-Subject A/L Matcher
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('my-plan')} className="hover:text-amber-300">
                  My UGC Preference Order Simulator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('compare')} className="hover:text-amber-300">
                  4-Way Degree & Loan Comparator
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white">Pathways & Counseling</div>
            <ul className="space-y-1">
              <li>
                <button type="button" onClick={() => setRoute('careers')} className="hover:text-amber-300">
                  Reverse Career-to-Degree Atlas
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('career-quiz')} className="hover:text-amber-300">
                  3-Minute RIASEC & Klimov Quiz
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setRoute('private-unis')} className="hover:text-amber-300 text-amber-300 font-semibold">
                  🏛️ Private, Foreign & IFSLS Degrees
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setIsCafDrawerOpen(true)} className="hover:text-amber-300">
                  1-Click IFSLS & Non-State Backup Form
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white">Official Sri Lankan Portals</div>
            <ul className="space-y-1">
              <li>
                <a href="https://www.ugc.ac.lk" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  University Grants Commission (ugc.ac.lk)
                </a>
              </li>
              <li>
                <a href="https://studentloans.mohe.gov.lk" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  MOHE Interest-Free Student Loans (IFSLS)
                </a>
              </li>
              <li>
                <a href="https://www.doenets.lk" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                  Department of Examinations (doenets.lk)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppRouterContent />
    </AppProvider>
  );
}

export default App;
