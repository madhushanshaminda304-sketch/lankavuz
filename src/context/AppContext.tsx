import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  SRI_LANKA_DISTRICTS,
  fetchProgramCutoffsByDistrict,
  type DistrictInfo,
  type ProgramCutoffViewRow,
} from '../services/ugcDataService';
import { optimizePreferenceOrder, type PreferencePlanItem } from '../lib/ugcLogic';

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
  | 'course';

interface Translations {
  selectDistrict: string;
  heroTitle: string;
  heroSub: string;
  myPlan: string;
  navPredictor: string;
  navCatalog: string;
  navCompare: string;
  navCareers: string;
  navCalendar: string;
  backupCta: string;
}

const I18N_DICT: Record<LanguageCode, Translations> = {
  EN: {
    selectDistrict: 'Select Your District',
    heroTitle: 'Find Your Sri Lankan State University & Degree Path',
    heroSub: 'Official 25-District UGC Z-Score Cutoff Atlas, 3-Subject A/L Matcher, Preference Order Simulator & MOHE Interest-Free Loan Bridge.',
    myPlan: 'My UGC Plan',
    navPredictor: 'Z-Score Predictor',
    navCatalog: 'Universities & Courses',
    navCompare: 'Compare (4-Way)',
    navCareers: 'Career Compass',
    navCalendar: 'Admissions Calendar',
    backupCta: '1-Click Backup & Loan Form',
  },
  SI: {
    selectDistrict: 'ඔබේ දිස්ත්‍රික්කය තෝරන්න',
    heroTitle: 'ශ්‍රී ලංකා රාජ්‍ය විශ්වවිද්‍යාල සහ උපාධි මාර්ගෝපදේශය',
    heroSub: 'දිස්ත්‍රික්ක 25 සඳහාම නිල UGC Z-ලකුණු කඩඉම්, A/L විෂය ගැලපුම සහ පොලී රහිත ශිෂ්‍ය ණය (IFSLS) විකල්ප.',
    myPlan: 'මගේ UGC සැලැස්ම',
    navPredictor: 'Z-ලකුණු පුරෝකථනය',
    navCatalog: 'විශ්වවිද්‍යාල සහ පාඨමාලා',
    navCompare: 'සංසන්දනය (4-Way)',
    navCareers: 'වෘත්තීය මාර්ගෝපදේශය',
    navCalendar: 'ඇතුළත් කිරීමේ දින දර්ශනය',
    backupCta: 'පොලී රහිත ණය / විකල්ප අයදුම්පත',
  },
  TA: {
    selectDistrict: 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
    heroTitle: 'இலங்கை அரச பல்கலைக்கழக மற்றும் பட்டப்படிப்பு வழிகாட்டி',
    heroSub: '25 மாவட்ட UGC Z-புள்ளி வெட்டுப்புள்ளிகள், க.பொ.த உயர்தரப் பாடப் பொருத்தம் மற்றும் வட்டியில்லா மாணவர் கடன் (IFSLS) வழிகாட்டி.',
    myPlan: 'எனது UGC திட்டம்',
    navPredictor: 'Z-புள்ளி கணிப்பான்',
    navCatalog: 'பல்கலைக்கழகங்கள் & கற்கைகள்',
    navCompare: 'ஒப்பிடுக (4-Way)',
    navCareers: 'தொழில் வழிகாட்டி',
    navCalendar: 'அனுமதி நாட்காட்டி',
    backupCta: 'மாற்று பட்டப்படிப்பு விண்ணப்பம்',
  },
};

export interface SavedPreferenceEntry {
  uni_code: string;
  locked: boolean;
}

interface AppContextValue {
  district: DistrictInfo;
  setDistrictId: (id: number) => void;
  isDistrictModalOpen: boolean;
  setIsDistrictModalOpen: (v: boolean) => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: Translations;
  route: ActiveRoute;
  setRoute: (r: ActiveRoute) => void;
  selectedInstitutionCode: string;
  setSelectedInstitutionCode: (code: string) => void;
  selectedUniCode: string;
  setSelectedUniCode: (code: string) => void;
  districtPrograms: ProgramCutoffViewRow[];
  studentZScore: number;
  setStudentZScore: (z: number) => void;
  studentStream: string;
  setStudentStream: (s: string) => void;
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
  isCafDrawerOpen: boolean;
  setIsCafDrawerOpen: (v: boolean) => void;
  openInstitutionProfile: (code: string) => void;
  openCourseProfile: (uniCode: string) => void;
}

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
  const [lang, setLang] = useState<LanguageCode>('EN');
  const [route, setRoute] = useState<ActiveRoute>('home');
  const [selectedInstitutionCode, setSelectedInstitutionCode] = useState<string>('UOM');
  const [selectedUniCode, setSelectedUniCode] = useState<string>('008A');

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
      { uni_code: '008A', locked: false },
      { uni_code: '012A', locked: false },
      { uni_code: '013B', locked: false },
      { uni_code: '013A', locked: false },
    ];
  });

  const [compareList, setCompareList] = useState<string[]>(['012A', '008A', '026A', '012F']);
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [isCafDrawerOpen, setIsCafDrawerOpen] = useState(false);
  const [districtPrograms, setDistrictPrograms] = useState<ProgramCutoffViewRow[]>([]);

  const district = useMemo(
    () => SRI_LANKA_DISTRICTS.find((d) => d.district_id === districtId) ?? SRI_LANKA_DISTRICTS[0],
    [districtId]
  );

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
    setPlanEntries((prev) => {
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
    setRoute('institution');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCourseProfile = (uniCode: string) => {
    setSelectedUniCode(uniCode);
    setRoute('course');
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
        isCafDrawerOpen,
        setIsCafDrawerOpen,
        openInstitutionProfile,
        openCourseProfile,
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
