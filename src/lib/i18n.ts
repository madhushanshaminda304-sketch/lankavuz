import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { DistrictInfo } from '../data/sriLankaUgcSnapshot';

import enTranslation from '../locales/en/translation.json';
import siTranslation from '../locales/si/translation.json';
import taTranslation from '../locales/ta/translation.json';

export type LanguageCode = 'en' | 'si' | 'ta' | 'EN' | 'SI' | 'TA';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', upper: 'EN', label: 'EN', nativeName: 'English' },
  { code: 'si', upper: 'SI', label: 'සිං', nativeName: 'සිංහල' },
  { code: 'ta', upper: 'TA', label: 'தமிழ்', nativeName: 'தமிழ்' },
] as const;

export function normalizeLangCode(code?: string | null): 'en' | 'si' | 'ta' {
  if (!code) return 'en';
  const lower = code.toLowerCase();
  if (lower === 'si') return 'si';
  if (lower === 'ta') return 'ta';
  return 'en';
}

export function isValidLanguageCode(code: string): boolean {
  const lower = code.toLowerCase();
  return lower === 'en' || lower === 'si' || lower === 'ta';
}

export function getLocalizedDistrictName(district: DistrictInfo, lang?: string): string {
  const normalized = normalizeLangCode(lang || i18n.language);
  if (normalized === 'si') return district.name_si || district.district_name;
  if (normalized === 'ta') return district.name_ta || district.district_name;
  return district.district_name;
}

const resources = {
  en: { translation: enTranslation },
  si: { translation: siTranslation },
  ta: { translation: taTranslation },
};

const savedLang = (() => {
  try {
    const saved = localStorage.getItem('lankavuz_lang');
    return normalizeLangCode(saved);
  } catch {
    return 'en';
  }
})();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Keep document.documentElement.lang and localStorage in sync
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

i18n.on('languageChanged', (lng) => {
  const norm = normalizeLangCode(lng);
  try {
    localStorage.setItem('lankavuz_lang', norm);
  } catch {
    // Ignore storage failure
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = norm;
  }
});

// Provide a legacy-compatible dictionary getter for existing context consumers
export const I18N_DICT: Record<'EN' | 'SI' | 'TA', Record<string, string>> = {
  EN: {
    brandSubtitle: enTranslation.brand.subtitle,
    heroTitle: enTranslation.hero.title,
    heroSub: enTranslation.hero.subtitle,
    heroTag: enTranslation.hero.tag,
    navPredictor: enTranslation.nav.predictor,
    navPredictorShort: enTranslation.nav.predictorShort,
    navCatalog: enTranslation.nav.campuses,
    navCompare: enTranslation.nav.compare,
    navCareers: enTranslation.nav.careers,
    navCareersShort: enTranslation.nav.careersShort,
    navCalendar: enTranslation.nav.calendar,
    navPrivateUnis: enTranslation.nav.campuses,
    navPrivateUnisShort: enTranslation.nav.campusesShort,
    myPlan: enTranslation.plan.title,
    myPlanShort: enTranslation.nav.planShort,
    backupCta: enTranslation.finder.moheLoan,
    quotaBadge: enTranslation.finder.activeQuota,
    changeDistrict: enTranslation.common.change,
    search: enTranslation.nav.search,
    searchPlaceholder: enTranslation.finder.searchPlaceholder,
    searchNavPlaceholder: enTranslation.nav.searchPlaceholder,
    ctaSafeTargetReach: enTranslation.hero.cta,
    setup: enTranslation.nav.setup,
    districtModalTitle: enTranslation.districtModal.title,
    districtModalSub: enTranslation.districtModal.subtitle,
    districtSearchPlaceholder: enTranslation.districtModal.searchPlaceholder,
    addToPlan: enTranslation.plan.addToPlan,
    inPlan: enTranslation.plan.inPlan,
    removeFromPlan: enTranslation.plan.removeFromPlan,
    compare: enTranslation.nav.compare,
    comparing: enTranslation.compare.dockComparing,
    close: enTranslation.common.close,
    toastLanguageSwitched: enTranslation.toast.langSwitched,
    quickPresets: enTranslation.finder.quickPresets,
    allFreeStateUgcs: enTranslation.finder.allFreeState,
    ifslsLoans: enTranslation.finder.moheLoan,
    computingPill: enTranslation.finder.computing,
    engineeringPill: enTranslation.finder.engineering,
    medicinePill: enTranslation.finder.medicine,
    directEntryPill: enTranslation.finder.directEntry,
  },
  SI: {
    brandSubtitle: siTranslation.brand.subtitle,
    heroTitle: siTranslation.hero.title,
    heroSub: siTranslation.hero.subtitle,
    heroTag: siTranslation.hero.tag,
    navPredictor: siTranslation.nav.predictor,
    navPredictorShort: siTranslation.nav.predictorShort,
    navCatalog: siTranslation.nav.campuses,
    navCompare: siTranslation.nav.compare,
    navCareers: siTranslation.nav.careers,
    navCareersShort: siTranslation.nav.careersShort,
    navCalendar: siTranslation.nav.calendar,
    navPrivateUnis: siTranslation.nav.campuses,
    navPrivateUnisShort: siTranslation.nav.campusesShort,
    myPlan: siTranslation.plan.title,
    myPlanShort: siTranslation.nav.planShort,
    backupCta: siTranslation.finder.moheLoan,
    quotaBadge: siTranslation.finder.activeQuota,
    changeDistrict: siTranslation.common.change,
    search: siTranslation.nav.search,
    searchPlaceholder: siTranslation.finder.searchPlaceholder,
    searchNavPlaceholder: siTranslation.nav.searchPlaceholder,
    ctaSafeTargetReach: siTranslation.hero.cta,
    setup: siTranslation.nav.setup,
    districtModalTitle: siTranslation.districtModal.title,
    districtModalSub: siTranslation.districtModal.subtitle,
    districtSearchPlaceholder: siTranslation.districtModal.searchPlaceholder,
    addToPlan: siTranslation.plan.addToPlan,
    inPlan: siTranslation.plan.inPlan,
    removeFromPlan: siTranslation.plan.removeFromPlan,
    compare: siTranslation.nav.compare,
    comparing: siTranslation.compare.dockComparing,
    close: siTranslation.common.close,
    toastLanguageSwitched: siTranslation.toast.langSwitched,
    quickPresets: siTranslation.finder.quickPresets,
    allFreeStateUgcs: siTranslation.finder.allFreeState,
    ifslsLoans: siTranslation.finder.moheLoan,
    computingPill: siTranslation.finder.computing,
    engineeringPill: siTranslation.finder.engineering,
    medicinePill: siTranslation.finder.medicine,
    directEntryPill: siTranslation.finder.directEntry,
  },
  TA: {
    brandSubtitle: taTranslation.brand.subtitle,
    heroTitle: taTranslation.hero.title,
    heroSub: taTranslation.hero.subtitle,
    heroTag: taTranslation.hero.tag,
    navPredictor: taTranslation.nav.predictor,
    navPredictorShort: taTranslation.nav.predictorShort,
    navCatalog: taTranslation.nav.campuses,
    navCompare: taTranslation.nav.compare,
    navCareers: taTranslation.nav.careers,
    navCareersShort: taTranslation.nav.careersShort,
    navCalendar: taTranslation.nav.calendar,
    navPrivateUnis: taTranslation.nav.campuses,
    navPrivateUnisShort: taTranslation.nav.campusesShort,
    myPlan: taTranslation.plan.title,
    myPlanShort: taTranslation.nav.planShort,
    backupCta: taTranslation.finder.moheLoan,
    quotaBadge: taTranslation.finder.activeQuota,
    changeDistrict: taTranslation.common.change,
    search: taTranslation.nav.search,
    searchPlaceholder: taTranslation.finder.searchPlaceholder,
    searchNavPlaceholder: taTranslation.nav.searchPlaceholder,
    ctaSafeTargetReach: taTranslation.hero.cta,
    setup: taTranslation.nav.setup,
    districtModalTitle: taTranslation.districtModal.title,
    districtModalSub: taTranslation.districtModal.subtitle,
    districtSearchPlaceholder: taTranslation.districtModal.searchPlaceholder,
    addToPlan: taTranslation.plan.addToPlan,
    inPlan: taTranslation.plan.inPlan,
    removeFromPlan: taTranslation.plan.removeFromPlan,
    compare: taTranslation.nav.compare,
    comparing: taTranslation.compare.dockComparing,
    close: taTranslation.common.close,
    toastLanguageSwitched: taTranslation.toast.langSwitched,
    quickPresets: taTranslation.finder.quickPresets,
    allFreeStateUgcs: taTranslation.finder.allFreeState,
    ifslsLoans: taTranslation.finder.moheLoan,
    computingPill: taTranslation.finder.computing,
    engineeringPill: taTranslation.finder.engineering,
    medicinePill: taTranslation.finder.medicine,
    directEntryPill: taTranslation.finder.directEntry,
  },
};

export default i18n;
