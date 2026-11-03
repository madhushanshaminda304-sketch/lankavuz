import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  SRI_LANKA_DISTRICTS,
  type DistrictInfo,
  type ProgramCutoffViewRow,
} from '../data/sriLankaUgcSnapshot';
import { fetchProgramCutoffsByDistrict } from '../services/ugcDataService';
import {
  optimizePreferenceOrder,
  type PreferencePlanItem,
} from '../lib/ugcLogic';

export type LanguageCode = 'EN' | 'SI' | 'TA';
export type ActiveRoute =
  | 'home'
  | 'predictor'
  | 'my-plan'
  | 'compare'
  | 'careers'
  | 'career-quiz'
  | 'calendar'
  | 'institution'
  | 'course'
  | 'private-unis';

export interface SavedPreferenceEntry {
  uni_code: string;
  locked: boolean;
}

export interface AppContextValue {
  district: DistrictInfo;
  setDistrictId: (id: number) => void;
  isDistrictModalOpen: boolean;
  setIsDistrictModalOpen: (v: boolean) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: Record<string, string>;
  route: ActiveRoute;
  setRoute: (r: ActiveRoute) => void;
  selectedInstitutionCode: string;
  setSelectedInstitutionCode: (code: string) => void;
  selectedUniCode: string;
  setSelectedUniCode: (uniCode: string) => void;
  districtPrograms: ProgramCutoffViewRow[];
  studentZScore: number;
  setStudentZScore: (z: number) => void;
  studentStream: string;
  setStudentStream: (stream: string) => void;
  planEntries: SavedPreferenceEntry[];
  addToPlan: (uniCode: string) => void;
  removeFromPlan: (uniCode: string) => void;
  movePlanItem: (index: number, direction: 'up' | 'down') => void;
  toggleLockPlanItem: (uniCode: string) => void;
  autoOptimizePlan: () => void;
  isPlanDrawerOpen: boolean;
  setIsPlanDrawerOpen: (v: boolean) => void;
  compareList: string[];
  toggleCompare: (uniCode: string) => void;
  setComparePreset: (codes: string[]) => void;
  openInstitutionProfile: (code: string) => void;
  openCourseProfile: (uniCode: string) => void;
  isWelcomeOpen: boolean;
  setIsWelcomeOpen: (open: boolean) => void;
}

const I18N_DICT: Record<LanguageCode, Record<string, string>> = {
  EN: {
    brandSubtitle: 'Sri Lanka UGC & Degree Atlas',
    heroTitle: 'Official 25-District Sri Lanka UGC Z-Score Cutoff Atlas',
    heroSub:
      'Zero-prediction, 100% factual cutoff matching across 21 State UGC Universities, MOHE Interest-Free Student Loans (IFSLS), and Direct Private / Foreign Degree Pathways.',
    navPredictor: 'Course & Cutoff Finder',
    navCatalog: 'Universities & Courses',
    navCompare: 'Compare (4-Way)',
    navCareers: 'Career Compass',
    navCalendar: 'Admissions Calendar',
    navPrivateUnis: 'Private & Non-State Campuses',
    backupCta: 'Private & IFSLS Degrees',
    myPlan: 'My UGC Plan',
    quotaBadge: 'Active Quota District',
    changeDistrict: 'Change',
    heroTag:
      'Official 25-District UGC Z-Score Cutoff Atlas, 3-Subject A/L Matcher, Preference Order Simulator & MOHE Interest-Free Loan Bridge.',
    searchPlaceholder: 'Search uni_code (001A, 008G), Medicine, CS, UOM...',
    ctaSafeTargetReach: 'Open Course & Cutoff Finder →',
  },
  SI: {
    brandSubtitle: 'ශ්‍රී ලංකා විශ්වවිද්‍යාල ප්‍රවේශ සහ Z-Score මාර්ගෝපදේශය',
    heroTitle: 'ශ්‍රී ලංකා විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාවේ (UGC) නිල 2024/25 Z-Score සීමා ලකුණු නාමාවලිය',
    heroSub:
      'රාජ්‍ය විශ්වවිද්‍යාල 21ක්, උසස් අධ්‍යාපන අමාත්‍යාංශයේ (MOHE) පොලී රහිත ශිෂ්‍ය ණය (IFSLS) සහ සෘජු පෞද්ගලික/විදේශීය උපාධි සඳහා වන නිල සීමා ලකුණු සසඳා බලන්න.',
    navPredictor: 'පාඨමාලා සහ Z-Score සීමා ලකුණු',
    navCatalog: 'රාජ්‍ය විශ්වවිද්‍යාල සහ පාඨමාලා',
    navCompare: 'උපාධි සංසන්දනය (4-ක්‍රම)',
    navCareers: 'වෘත්තීය මාලිමාව සහ ආදායම් මාර්ග',
    navCalendar: 'ඇතුළත් කිරීම් සහ අභියෝග්‍යතා දින දර්ශනය',
    navPrivateUnis: 'රාජ්‍ය නොවන සහ IFSLS ශිෂ්‍ය ණය උපාධි',
    backupCta: 'පොලී රහිත ණය සහ රාජ්‍ය නොවන උපාධි',
    myPlan: 'මගේ UGC මනාප අනුපිළිවෙල',
    quotaBadge: 'තේරීම් දිස්ත්‍රික්කය',
    changeDistrict: 'වෙනස් කරන්න',
    heroTag:
      'දිස්ත්‍රික්ක 25 නිල UGC Z-Score සීමා, A/L විෂය 3 පරීක්ෂාව, මනාප ගැටුම් විග්‍රහය සහ MOHE පොලී රහිත ණය පාලම.',
    searchPlaceholder: 'uni_code (001A, 008G), වෛද්‍ය (MBBS), ඉංජිනේරු, CS, UOM සොයන්න...',
    ctaSafeTargetReach: 'පාඨමාලා සහ සීමා ලකුණු සෙවුම විවෘත කරන්න →',
  },
  TA: {
    brandSubtitle: 'இலங்கை பல்கலைக்கழக அனுமதி மற்றும் Z-புள்ளி வழிகாட்டி',
    heroTitle: 'இலங்கை பல்கலைக்கழக மானியங்கள் ஆணைக்குழுவின் (UGC) உத்தியோகபூர்வ 2024/25 Z-புள்ளி வெட்டுப்புள்ளி அட்டவணை',
    heroSub:
      '21 அரச பல்கலைக்கழகங்கள், உயர்கல்வி அமைச்சின் (MOHE) வட்டியற்ற மாணவர் கடன் (IFSLS) மற்றும் நேரடி தனியார்/வெளிநாட்டு பட்டப்படிப்புகளுக்கான உத்தியோகபூர்வ வெட்டுப்புள்ளிகளை ஒப்பிட்டுப் பாருங்கள்.',
    navPredictor: 'பாடநெறிகள் மற்றும் Z-புள்ளி வெட்டுப்புள்ளிகள்',
    navCatalog: 'அரச பல்கலைக்கழகங்கள் & பாடநெறிகள்',
    navCompare: 'பட்டப்படிப்பு ஒப்பீடு (4-வழி)',
    navCareers: 'தொழில் வழிகாட்டி & வருமான வழிகள்',
    navCalendar: 'சேர்க்கை மற்றும் உளச்சார்பு நாட்காட்டி',
    navPrivateUnis: 'அரச சார்பற்ற & IFSLS மாணவர் கடன் பட்டங்கள்',
    backupCta: 'வட்டியற்ற கடன் & அரச சார்பற்ற பட்டங்கள்',
    myPlan: 'எனது UGC தெரிவு ஒழுங்கு',
    quotaBadge: 'ஒதுக்கீட்டு மாவட்டம்',
    changeDistrict: 'மாற்று',
    heroTag:
      '25 மாவட்ட உத்தியோகபூர்வ UGC Z-புள்ளி வெட்டுப்புள்ளிகள், 3-பாட A/L தகுதி, விருப்ப ஒழுங்கு சரிபார்ப்பு மற்றும் MOHE வட்டியற்ற கடன் பாலம்.',
    searchPlaceholder: 'uni_code (001A, 008G), மருத்துவம் (MBBS), பொறியியல், CS, UOM தேடுக...',
    ctaSafeTargetReach: 'பாடநெறிகள் மற்றும் வெட்டுப்புள்ளிகள் தேடலைத் திறக்குக →',
  },
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [districtId, setDistrictIdState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lankavuz_district_id');
      return saved ? Number(saved) : 1; // Default Colombo
    } catch {
      return 1;
    }
  });

  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lankavuz_welcome_seen') !== 'v1';
    } catch {
      return false;
    }
  });
  const [lang, setLang] = useState<LanguageCode>('EN');

  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);
  const [route, setRouteState] = useState<ActiveRoute>('home');
  const [selectedInstitutionCode, setSelectedInstitutionCode] = useState<string>('UOM');
  const [selectedUniCode, setSelectedUniCode] = useState<string>('008G');

  const [studentZScore, setStudentZScore] = useState<number>(1.52);
  const [studentStream, setStudentStream] = useState<string>('Physical Science');

  // Pre-seed with an intentional preference conflict example (013B Peradeniya 1.3100 above 013A Colombo 1.4850)
  // so students immediately see the UGC Preference Order Conflict Auditor in action!
  const [planEntries, setPlanEntries] = useState<SavedPreferenceEntry[]>(() => {
    try {
      const saved = localStorage.getItem('lankavuz_plan_entries');
      if (saved) return JSON.parse(saved) as SavedPreferenceEntry[];
    } catch {
      // Fallback
    }
    return [
      { uni_code: '008G', locked: false },
      { uni_code: '012T', locked: false },
      { uni_code: '013B', locked: false },
      { uni_code: '013A', locked: false },
    ];
  });

  const [compareList, setCompareList] = useState<string[]>(['012T', '026G', '012C', '136L']);
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [districtPrograms, setDistrictPrograms] = useState<ProgramCutoffViewRow[]>([]);

  const district = useMemo(
    () => SRI_LANKA_DISTRICTS.find((d) => d.district_id === districtId) ?? SRI_LANKA_DISTRICTS[0],
    [districtId]
  );

  // Two-way URL hash routing synchronization
  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;

    if (hash.startsWith('institution/')) {
      const code = hash.split('/')[1]?.toUpperCase();
      if (code) {
        setSelectedInstitutionCode(code);
        setRouteState('institution');
      }
    } else if (hash.startsWith('course/')) {
      const code = hash.split('/')[1]?.toUpperCase();
      if (code) {
        setSelectedUniCode(code);
        setRouteState('course');
      }
    } else if (
      ['home', 'predictor', 'my-plan', 'compare', 'careers', 'career-quiz', 'calendar', 'private-unis'].includes(
        hash
      )
    ) {
      setRouteState(hash as ActiveRoute);
    }
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [syncFromHash]);

  const setRoute = (newRoute: ActiveRoute) => {
    setRouteState(newRoute);
    if (newRoute === 'institution') {
      window.location.hash = `institution/${selectedInstitutionCode}`;
    } else if (newRoute === 'course') {
      window.location.hash = `course/${selectedUniCode}`;
    } else {
      window.location.hash = newRoute;
    }
  };

  useEffect(() => {
    let active = true;
    fetchProgramCutoffsByDistrict(districtId).then((rows) => {
      if (active) setDistrictPrograms(rows);
    });
    return () => {
      active = false;
    };
  }, [districtId]);

  const setDistrictId = (id: number) => {
    setDistrictIdState(id);
    try {
      const d = SRI_LANKA_DISTRICTS.find((item) => item.district_id === id);
      localStorage.setItem('lankavuz_district_id', String(id));
      if (d) localStorage.setItem('lankavuz_district_name', d.district_name);
    } catch {
      // Ignore storage error
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('lankavuz_plan_entries', JSON.stringify(planEntries));
    } catch {
      // Ignore storage error
    }
  }, [planEntries]);

  const addToPlan = (uniCode: string) => {
    const prog = districtPrograms.find((p) => p.uni_code === uniCode);
    if (prog?.is_suspended) {
      alert(`Cannot add ${uniCode} (${prog.course_name}): Intake is currently suspended for 2025/2026 under UGC Curriculum Review.`);
      return;
    }

    setPlanEntries((prev) => {
      if (prev.length >= 125) {
        alert('Maximum 125 UGC preference choices allowed per candidate (UGC Rule Section 3.1.6).');
        return prev;
      }
      if (prev.some((p) => p.uni_code === uniCode)) return prev;
      return [...prev, { uni_code: uniCode, locked: false }];
    });
  };

  const removeFromPlan = (uniCode: string) => {
    setPlanEntries((prev) => prev.filter((p) => p.uni_code !== uniCode));
  };

  const movePlanItem = (index: number, direction: 'up' | 'down') => {
    setPlanEntries((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const toggleLockPlanItem = (uniCode: string) => {
    setPlanEntries((prev) =>
      prev.map((item) => (item.uni_code === uniCode ? { ...item, locked: !item.locked } : item))
    );
  };

  const autoOptimizePlan = () => {
    setPlanEntries((prev) => {
      const enriched: (PreferencePlanItem & { locked: boolean })[] = prev.map((entry) => {
        const found = districtPrograms.find((p) => p.uni_code === entry.uni_code);
        return {
          uni_code: entry.uni_code,
          course_name: found?.course_name ?? entry.uni_code,
          institution_code: found?.institution_code ?? '',
          min_z_score: found?.min_z_score ?? null,
          locked: entry.locked,
        };
      });
      const sorted = optimizePreferenceOrder(enriched);
      return sorted.map((s) => ({ uni_code: s.uni_code, locked: s.locked }));
    });
  };

  const toggleCompare = (uniCode: string) => {
    setCompareList((prev) => {
      if (prev.includes(uniCode)) return prev.filter((c) => c !== uniCode);
      if (prev.length >= 4) return [...prev.slice(1), uniCode];
      return [...prev, uniCode];
    });
  };

  const setComparePreset = (codes: string[]) => {
    setCompareList(codes.slice(0, 4));
  };

  const openInstitutionProfile = (code: string) => {
    setSelectedInstitutionCode(code);
    setRouteState('institution');
    window.location.hash = `institution/${code}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCourseProfile = (uniCode: string) => {
    setSelectedUniCode(uniCode);
    setRouteState('course');
    window.location.hash = `course/${uniCode}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        district,
        setDistrictId,
        isDistrictModalOpen,
        setIsDistrictModalOpen,
        lang,
        setLang,
        t: I18N_DICT[lang],
        route,
        setRoute,
        selectedInstitutionCode,
        setSelectedInstitutionCode,
        selectedUniCode,
        setSelectedUniCode,
        districtPrograms,
        studentZScore,
        setStudentZScore,
        studentStream,
        setStudentStream,
        planEntries,
        addToPlan,
        removeFromPlan,
        movePlanItem,
        toggleLockPlanItem,
        autoOptimizePlan,
        isPlanDrawerOpen,
        setIsPlanDrawerOpen,
        compareList,
        toggleCompare,
        setComparePreset,
        openInstitutionProfile,
        openCourseProfile,
        isWelcomeOpen,
        setIsWelcomeOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
