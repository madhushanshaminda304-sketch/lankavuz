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
import i18n, {
  I18N_DICT,
  isValidLanguageCode,
  normalizeLangCode,
  type LanguageCode,
} from '../lib/i18n';

export type { LanguageCode };
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
  const [lang, setLangState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('lankavuz_lang');
      if (saved && isValidLanguageCode(saved)) return (normalizeLangCode(saved).toUpperCase() as LanguageCode);
    } catch {
      // Ignore storage error
    }
    return 'EN';
  });

  const setLang = useCallback((newLang: LanguageCode) => {
    const norm = normalizeLangCode(newLang);
    setLangState(norm.toUpperCase() as LanguageCode);
    i18n.changeLanguage(norm);
  }, []);

  useEffect(() => {
    const handleLngChanged = (lng: string) => {
      const upper = normalizeLangCode(lng).toUpperCase() as LanguageCode;
      setLangState(upper);
    };
    i18n.on('languageChanged', handleLngChanged);
    return () => {
      i18n.off('languageChanged', handleLngChanged);
    };
  }, []);

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
        t: I18N_DICT[(normalizeLangCode(lang).toUpperCase() as 'EN' | 'SI' | 'TA')] || I18N_DICT.EN,
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
