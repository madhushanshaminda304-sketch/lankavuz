import type { DistrictInfo } from '../data/sriLankaUgcSnapshot';

export type LanguageCode = 'EN' | 'SI' | 'TA';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; nativeName: string }[] = [
  { code: 'EN', label: 'EN', nativeName: 'English' },
  { code: 'SI', label: 'සිං', nativeName: 'සිංහල' },
  { code: 'TA', label: 'தமிழ்', nativeName: 'தமிழ்' },
];

export function isValidLanguageCode(code: string): code is LanguageCode {
  return code === 'EN' || code === 'SI' || code === 'TA';
}

export function getLocalizedDistrictName(district: DistrictInfo, lang: LanguageCode): string {
  if (lang === 'SI') return district.name_si || district.district_name;
  if (lang === 'TA') return district.name_ta || district.district_name;
  return district.district_name;
}

export const I18N_DICT: Record<LanguageCode, Record<string, string>> = {
  EN: {
    brandSubtitle: 'Sri Lanka UGC & Degree Atlas',
    heroTitle: 'Official 25-District Sri Lanka UGC Z-Score Cutoff Atlas',
    heroSub:
      'Zero-prediction, 100% factual cutoff matching across 21 State UGC Universities, MOHE Interest-Free Student Loans (IFSLS), and Direct Private / Foreign Degree Pathways.',
    heroTag:
      'Official 25-District UGC Z-Score Cutoff Atlas, 3-Subject A/L Matcher, Preference Order Simulator & MOHE Interest-Free Loan Bridge.',
    navPredictor: 'Course & Cutoff Finder',
    navPredictorShort: 'Cutoffs',
    navCatalog: 'Universities & Courses',
    navCompare: 'Compare (4-Way)',
    navCareers: 'Career Compass',
    navCareersShort: 'Careers & ROI',
    navCalendar: 'Admissions Calendar',
    navPrivateUnis: 'Universities & Hubs',
    navPrivateUnisShort: 'Campuses',
    myPlan: 'My UGC Plan',
    myPlanShort: 'My Plan',
    backupCta: 'Private & IFSLS Degrees',
    quotaBadge: 'Active Quota District',
    changeDistrict: 'Change',
    search: 'Search',
    searchPlaceholder: 'Search uni_code (001A, 008G), Medicine, CS, UOM...',
    searchNavPlaceholder: 'Search code, degree, campus...',
    ctaSafeTargetReach: 'Open Course & Cutoff Finder →',
    setup: 'Setup',
    districtModalTitle: 'Select Your G.C.E. A/L Quota District',
    districtModalSub:
      'UGC applies 40% Merit + 55% District Quota + 5% Underprivileged quota formulas.',
    districtSearchPlaceholder: 'Search district name (e.g. Colombo, Kandy, යාපනය, யாழ்ப்பாணம்)...',
    addToPlan: 'Add to Plan',
    inPlan: 'In Plan',
    removeFromPlan: 'Remove',
    compare: 'Compare',
    comparing: 'Comparing',
    close: 'Close',
    toastLanguageSwitched: 'Language switched to English',
    quickPresets: 'Quick Presets',
    allFreeStateUgcs: '🏛️ All Free State UGC Degrees',
    ifslsLoans: '🎓 MOHE 0% Interest Loans (IFSLS)',
    computingPill: '💻 Computing & AI Degrees',
    engineeringPill: '⚙️ Engineering & Built Env',
    medicinePill: '🩺 Medicine & Allied Health',
    directEntryPill: '⚡ Direct Entry (No Aptitude Test)',
  },
  SI: {
    brandSubtitle: 'ශ්‍රී ලංකා විශ්වවිද්‍යාල ප්‍රවේශ සහ Z-Score මාර්ගෝපදේශය',
    heroTitle: 'ශ්‍රී ලංකා විශ්වවිද්‍යාල ප්‍රතිපාදන කොමිෂන් සභාවේ (UGC) නිල 2024/25 Z-Score සීමා ලකුණු නාමාවලිය',
    heroSub:
      'රාජ්‍ය විශ්වවිද්‍යාල 21ක්, උසස් අධ්‍යාපන අමාත්‍යාංශයේ (MOHE) පොලී රහිත ශිෂ්‍ය ණය (IFSLS) සහ සෘජු පෞද්ගලික/විදේශීය උපාධි සඳහා වන නිල සීමා ලකුණු සසඳා බලන්න.',
    heroTag:
      'දිස්ත්‍රික්ක 25 නිල UGC Z-Score සීමා, A/L විෂය 3 පරීක්ෂාව, මනාප ගැටුම් විග්‍රහය සහ MOHE පොලී රහිත ණය පාලම.',
    navPredictor: 'පාඨමාලා සහ Z-Score සීමා ලකුණු',
    navPredictorShort: 'සීමා ලකුණු',
    navCatalog: 'රාජ්‍ය විශ්වවිද්‍යාල සහ පාඨමාලා',
    navCompare: 'උපාධි සංසන්දනය (4-ක්‍රම)',
    navCareers: 'වෘත්තීය මාලිමාව',
    navCareersShort: 'වෘත්තීන් සහ ආදායම්',
    navCalendar: 'ඇතුළත් කිරීම් දින දර්ශනය',
    navPrivateUnis: 'විශ්වවිද්‍යාල සහ මණ්ඩප',
    navPrivateUnisShort: 'මණ්ඩප',
    myPlan: 'මගේ UGC මනාප ලැයිස්තුව',
    myPlanShort: 'මගේ මනාප',
    backupCta: 'පොලී රහිත ණය සහ රාජ්‍ය නොවන උපාධි',
    quotaBadge: 'තේරීම් දිස්ත්‍රික්කය',
    changeDistrict: 'වෙනස් කරන්න',
    search: 'සොයන්න',
    searchPlaceholder: 'uni_code (001A, 008G), වෛද්‍ය (MBBS), ඉංජිනේරු, CS, UOM සොයන්න...',
    searchNavPlaceholder: 'කේතය, උපාධිය, විශ්වවිද්‍යාලය සොයන්න...',
    ctaSafeTargetReach: 'පාඨමාලා සහ සීමා ලකුණු සෙවුම විවෘත කරන්න →',
    setup: 'සැකසුම',
    districtModalTitle: 'ඔබගේ G.C.E. A/L කෝටා දිස්ත්‍රික්කය තෝරන්න',
    districtModalSub:
      'UGC නීති අනුව 40% කුසලතා + 55% දිස්ත්‍රික් කෝටා + 5% විශේෂ කෝටා ක්‍රමවේදයට ප්‍රවේශය ලබාදේ.',
    districtSearchPlaceholder: 'දිස්ත්‍රික්කයේ නම සොයන්න (කොළඹ, මහනුවර, Colombo, யாழ்ப்பாணம்)...',
    addToPlan: 'මනාපයට එක් කරන්න',
    inPlan: 'මනාපයේ ඇත',
    removeFromPlan: 'ඉවත් කරන්න',
    compare: 'සසඳන්න',
    comparing: 'සංසන්දනය',
    close: 'වසන්න',
    toastLanguageSwitched: 'භාෂාව සාර්ථකව සිංහලට මාරු කරන ලදී',
    quickPresets: 'ක්ෂණික පෙරහන්',
    allFreeStateUgcs: '🏛️ නොමිලේ රාජ්‍ය UGC උපාධි සියල්ල',
    ifslsLoans: '🎓 MOHE පොලී රහිත ශිෂ්‍ය ණය (IFSLS)',
    computingPill: '💻 පරිගණක සහ AI උපාධි',
    engineeringPill: '⚙️ ඉංජිනේරු සහ වාස්තු විද්‍යා',
    medicinePill: '🩺 වෛද්‍ය සහ සෞඛ්‍ය විද්‍යා',
    directEntryPill: '⚡ සෘජු ප්‍රවේශය (අභියෝග්‍යතා පරීක්ෂණ රහිත)',
  },
  TA: {
    brandSubtitle: 'இலங்கை பல்கலைக்கழக அனுமதி மற்றும் Z-புள்ளி வழிகாட்டி',
    heroTitle: 'இலங்கை பல்கலைக்கழக மானியங்கள் ஆணைக்குழுவின் (UGC) உத்தியோகபூர்வ 2024/25 Z-புள்ளி வெட்டுப்புள்ளி அட்டவணை',
    heroSub:
      '21 அரச பல்கலைக்கழகங்கள், உயர்கல்வி அமைச்சின் (MOHE) வட்டியற்ற மாணவர் கடன் (IFSLS) மற்றும் நேரடி தனியார்/வெளிநாட்டு பட்டப்படிப்புகளுக்கான உத்தியோகபூர்வ வெட்டுப்புள்ளிகளை ஒப்பிட்டுப் பாருங்கள்.',
    heroTag:
      '25 மாவட்ட உத்தியோகபூர்வ UGC Z-புள்ளி வெட்டுப்புள்ளிகள், 3-பாட A/L தகுதி, விருப்ப ஒழுங்கு சரிபார்ப்பு மற்றும் MOHE வட்டியற்ற கடன் பாலம்.',
    navPredictor: 'பாடநெறிகள் மற்றும் Z-புள்ளி வெட்டுப்புள்ளிகள்',
    navPredictorShort: 'வெட்டுப்புள்ளிகள்',
    navCatalog: 'அரச பல்கலைக்கழகங்கள் & பாடநெறிகள்',
    navCompare: 'பட்டப்படிப்பு ஒப்பீடு (4-வழி)',
    navCareers: 'தொழில் வழிகாட்டி',
    navCareersShort: 'தொழில் & வருமானம்',
    navCalendar: 'சேர்க்கை நாட்காட்டி',
    navPrivateUnis: 'பல்கலைக்கழகங்கள் & வளாகங்கள்',
    navPrivateUnisShort: 'வளாகங்கள்',
    myPlan: 'எனது UGC தெரிவு ஒழுங்கு',
    myPlanShort: 'எனது தெரிவு',
    backupCta: 'வட்டியற்ற கடன் & அரச சார்பற்ற பட்டங்கள்',
    quotaBadge: 'ஒதுக்கீட்டு மாவட்டம்',
    changeDistrict: 'மாற்று',
    search: 'தேடுக',
    searchPlaceholder: 'uni_code (001A, 008G), மருத்துவம் (MBBS), பொறியியல், CS, UOM தேடுக...',
    searchNavPlaceholder: 'குறியீடு, பட்டம், வளாகம் தேடுக...',
    ctaSafeTargetReach: 'பாடநெறிகள் மற்றும் வெட்டுப்புள்ளிகள் தேடலைத் திறக்குக →',
    setup: 'அமைப்புகள்',
    districtModalTitle: 'உங்கள் G.C.E. A/L ஒதுக்கீட்டு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
    districtModalSub:
      'UGC விதிகளின்படி 40% திறமை + 55% மாவட்ட ஒதுக்கீடு + 5% விசேட ஒதுக்கீட்டின் கீழ் அனுமதி வழங்கப்படும்.',
    districtSearchPlaceholder: 'மாவட்டத்தின் பெயரை தேடுக (கொழும்பு, கண்டி, யாழ்ப்பாணம், Colombo)...',
    addToPlan: 'தெரிவில் சேர்க்கவும்',
    inPlan: 'தெரிவில் உள்ளது',
    removeFromPlan: 'நீக்குக',
    compare: 'ஒப்பிடுக',
    comparing: 'ஒப்பீடு',
    close: 'மூடுக',
    toastLanguageSwitched: 'மொழி வெற்றிகரமாக தமிழுக்கு மாற்றப்பட்டது',
    quickPresets: 'விரைவு வடிகட்டிகள்',
    allFreeStateUgcs: '🏛️ இலவச அரச UGC பட்டங்கள் அனைத்தும்',
    ifslsLoans: '🎓 MOHE வட்டியற்ற மாணவர் கடன் (IFSLS)',
    computingPill: '💻 கணினி & AI பட்டங்கள்',
    engineeringPill: '⚙️ பொறியியல் & கட்டிடக்கலை',
    medicinePill: '🩺 மருத்துவம் & சுகாதார அறிவியல்',
    directEntryPill: '⚡ நேரடி அனுமதி (உளச்சார்பு தேர்வு இல்லை)',
  },
};
