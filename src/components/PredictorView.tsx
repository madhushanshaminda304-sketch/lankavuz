import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Building2,
  GraduationCap,
  DollarSign,
  Clock,
  BookOpen,
  Award,
  ArrowUpDown,
  Share2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Table as TableIcon,
  ExternalLink,
  Check,
  Plus,
  X,
  ShieldCheck,
  Briefcase,
  Layers,
  HelpCircle,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedDistrictName } from '../lib/i18n';
import {
  SRI_LANKA_DISTRICTS,
  NON_STATE_IFSLS_PATHWAYS,
  type NonStatePathway,
  type ProgramCutoffViewRow,
} from '../data/sriLankaUgcSnapshot';
import {
  checkSubjectEligibility,
  checkSubjectCombinationEligibility,
  classifyProgramMatch,
  type ALGrade,
} from '../lib/ugcLogic';
import { ProgramChanceCard } from './ProgramChanceCard';

// ==========================================
// Types & Constants
// ==========================================

export type StudyFieldCategory =
  | 'COMPUTING'
  | 'ENGINEERING'
  | 'MEDICINE'
  | 'BUSINESS'
  | 'BUILT_ENV'
  | 'AGRI'
  | 'SCIENCE'
  | 'LAW_HUMANITIES';

export type SectorType = 'STATE_UGC' | 'STATE_NON_UGC' | 'MOHE_IFSLS_PRIVATE' | 'DIRECT_PRIVATE_FOREIGN';

export interface UnifiedDiscoveryItem {
  id: string;
  kind: 'STATE_UGC' | 'NON_STATE';
  stateRow?: ProgramCutoffViewRow;
  pathway?: NonStatePathway;

  title: string;
  instituteName: string;
  instituteAbbr: string;
  code: string;
  sector: SectorType;
  streamEligible: string[];
  durationYears: number;
  medium: ('E' | 'S' | 'T')[];
  tuitionBand: 'FREE_STATE' | 'IFSLS_ZERO_UPFRONT' | 'UNDER_500K' | '500K_TO_1_5M' | '1_5M_TO_3_5M';
  totalFeeLkr: number;
  cutoffZ: number | null;
  isNqc: boolean;
  isMeritOnly: boolean;
  studyField: StudyFieldCategory;
  entryStages: string[];
  studyModes: ('FULL_TIME_WEEKDAY' | 'WEEKEND_PART_TIME' | 'DISTANCE_ONLINE')[];
  accreditations: string[];
  aptitudeRequired: boolean;
  requiresOlSpecial: boolean;
  hasInternship: boolean;
  hasMeritScholarship: boolean;
  hasHostel: boolean;
  province: string;
  campusHub: string;
  proposedIntake: number;
  website: string;
  programUrl: string;
  applyUrl: string;
  loanPortalUrl?: string;
  specializations: string[];
}

const STREAM_SUBJECT_POOL: Record<string, string[]> = {
  'Physical Science': [
    'Combined Mathematics',
    'Physics',
    'Chemistry',
    'Information & Communication Technology',
    'Higher Mathematics',
  ],
  'Biological Science': [
    'Biology',
    'Chemistry',
    'Physics',
    'Agricultural Science',
  ],
  Commerce: [
    'Accounting',
    'Business Studies',
    'Economics',
    'Information & Communication Technology',
    'Business Statistics',
  ],
  Technology: [
    'Engineering Technology',
    'Biosystems Technology',
    'Science for Technology',
    'Information & Communication Technology',
    'Agricultural Science',
  ],
  Arts: [
    'Economics',
    'Geography',
    'Political Science',
    'Sinhala / Tamil / English Literature',
    'History',
    'Logic & Scientific Method',
    'Mass Media & Communication',
  ],
};

function categorizeStudyField(courseName: string, stream: string): StudyFieldCategory {
  const n = courseName.toLowerCase();
  if (
    n.includes('computer') ||
    n.includes('software') ||
    n.includes('information tech') ||
    n.includes('artificial int') ||
    n.includes('data sci') ||
    n.includes('cyber') ||
    n.includes('computing')
  ) {
    return 'COMPUTING';
  }
  if (
    n.includes('engineering') ||
    n.includes('technology') ||
    n.includes('mechatronics') ||
    n.includes('electronics') ||
    n.includes('electrical') ||
    n.includes('mechanical') ||
    n.includes('civil') ||
    n.includes('surveying')
  ) {
    return 'ENGINEERING';
  }
  if (
    n.includes('medicine') ||
    n.includes('mbbs') ||
    n.includes('dental') ||
    n.includes('veterinary') ||
    n.includes('nursing') ||
    n.includes('pharmacy') ||
    n.includes('physiotherapy') ||
    n.includes('biomedical') ||
    n.includes('medical') ||
    n.includes('allied health')
  ) {
    return 'MEDICINE';
  }
  if (
    n.includes('business') ||
    n.includes('management') ||
    n.includes('commerce') ||
    n.includes('accounting') ||
    n.includes('finance') ||
    n.includes('marketing') ||
    n.includes('human resource') ||
    n.includes('logistics') ||
    n.includes('supply chain') ||
    n.includes('transportation')
  ) {
    return 'BUSINESS';
  }
  if (
    n.includes('architecture') ||
    n.includes('quantity survey') ||
    n.includes('town') ||
    n.includes('facilities') ||
    n.includes('design') ||
    n.includes('landscape')
  ) {
    return 'BUILT_ENV';
  }
  if (
    n.includes('agriculture') ||
    n.includes('food') ||
    n.includes('animal') ||
    n.includes('aquatic') ||
    n.includes('fisheries') ||
    n.includes('agri')
  ) {
    return 'AGRI';
  }
  if (
    n.includes('law') ||
    n.includes('llb') ||
    n.includes('arts') ||
    n.includes('social') ||
    n.includes('humanities') ||
    n.includes('languages') ||
    n.includes('fine arts') ||
    n.includes('music') ||
    n.includes('drama') ||
    n.includes('communication')
  ) {
    return 'LAW_HUMANITIES';
  }
  if (stream === 'Commerce') return 'BUSINESS';
  if (stream === 'Arts') return 'LAW_HUMANITIES';
  if (stream === 'Technology') return 'ENGINEERING';
  return 'SCIENCE';
}

function getInstitutionProvince(instCode: string): string {
  switch (instCode) {
    case 'UOM':
    case 'UOC':
    case 'USJ':
    case 'UOK':
    case 'UCSC':
    case 'UVPA':
    case 'VPA':
    case 'GWU':
    case 'KDU':
      return 'Western';
    case 'UOP':
      return 'Central';
    case 'RUH':
      return 'Southern';
    case 'JFN':
    case 'TCU':
      return 'Northern';
    case 'EUSL':
    case 'SEUSL':
      return 'Eastern';
    case 'RUSL':
      return 'North Central';
    case 'WUSL':
      return 'North Western';
    case 'SUSL':
      return 'Sabaragamuwa';
    case 'UWU':
      return 'Uva';
    case 'OUSL':
      return 'Island-Wide Regional Centers';
    default:
      return 'Western';
  }
}

function getInstitutionCampusHub(instCode: string): string {
  switch (instCode) {
    case 'UOM':
    case 'KDU':
    case 'UoVT':
      return 'Moratuwa / Ratmalana';
    case 'UOC':
    case 'UCSC':
    case 'UVPA':
      return 'Colombo City';
    case 'UOP':
      return 'Peradeniya / Kandy';
    case 'OUSL':
    case 'SLIATE':
      return 'Island-Wide Regional Centers';
    default:
      return 'Colombo City';
  }
}

// ==========================================
// Main Component
// ==========================================

export const PredictorView: React.FC = () => {
  const {
    district,
    setDistrictId,
    setIsDistrictModalOpen,
    studentZScore,
    setStudentZScore,
    studentStream,
    setStudentStream,
    districtPrograms,
    planEntries,
    addToPlan,
    removeFromPlan,
    compareList,
    toggleCompare,
    openCourseProfile,
    openInstitutionProfile,
    t,
    lang,
  } = useApp();

  // Search & Presets
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Guided Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStage, setWizardStage] = useState<string>('3_AL_PASSES');
  const [wizardArea, setWizardArea] = useState<string>('COMPUTING');
  const [wizardFunding, setWizardFunding] = useState<string>('FREE_PLUS_IFSLS');

  // Sidebar Facet 1: Entry Stage
  const [selectedEntryStages, setSelectedEntryStages] = useState<string[]>([]);

  // Sidebar Facet 2: Sector
  const [selectedSectors, setSelectedSectors] = useState<SectorType[]>([]);

  // Sidebar Facet 3: Stream & 3-Subject Combinator
  const [streamFilter, setStreamFilter] = useState<string>('ALL');
  const [subjects, setSubjects] = useState<[string, string, string]>([
    'Combined Mathematics',
    'Physics',
    'Chemistry',
  ]);
  const [grades, setGrades] = useState<[ALGrade, ALGrade, ALGrade]>(['A', 'B', 'B']);
  const [cgtScore, setCgtScore] = useState<number>(65);
  const [subjectFilterMode, setSubjectFilterMode] = useState<'SHOW_ALL' | 'ELIGIBLE_ONLY' | 'HIGHLIGHT_MISSING'>('SHOW_ALL');

  // Sidebar Facet 4: Cutoff Range & District
  const [minCutoffZ, setMinCutoffZ] = useState<string>('');
  const [maxCutoffZ, setMaxCutoffZ] = useState<string>('');
  const [onlyBelowMyZ, setOnlyBelowMyZ] = useState(false);
  const [includeNqc, setIncludeNqc] = useState(true);
  const [meritOnlyFilter, setMeritOnlyFilter] = useState(false);

  // Sidebar Facet 5: Study Field & Tags
  const [selectedFields, setSelectedFields] = useState<StudyFieldCategory[]>([]);

  // Sidebar Facet 6: Tuition Budget
  const [selectedTuitionBands, setSelectedTuitionBands] = useState<string[]>([]);
  const [meritScholarshipOnly, setMeritScholarshipOnly] = useState(false);
  const [bursaryOnly, setBursaryOnly] = useState(false);

  // Sidebar Facet 7: Study Mode
  const [selectedStudyModes, setSelectedStudyModes] = useState<string[]>([]);

  // Sidebar Facet 8: Duration
  const [selectedDurations, setSelectedDurations] = useState<number[]>([]);

  // Sidebar Facet 9: Medium
  const [selectedMediums, setSelectedMediums] = useState<('E' | 'S' | 'T')[]>([]);

  // Sidebar Facet 10: Accreditation
  const [selectedAccreditations, setSelectedAccreditations] = useState<string[]>([]);

  // Sidebar Facet 11: Admission Rules
  const [directNoAptitudeOnly, setDirectNoAptitudeOnly] = useState(false);
  const [aptitudeRequiredOnly, setAptitudeRequiredOnly] = useState(false);
  const [internshipOnly, setInternshipOnly] = useState(false);

  // Sidebar Facet 12: Province & Campus Hub
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [selectedCampusHub, setSelectedCampusHub] = useState<string>('ALL');
  const [hostelOnly, setHostelOnly] = useState(false);

  // Mobile Drawer & Workspace View
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<
    'CUTOFF_DESC' | 'CUTOFF_ASC' | 'FEE_ASC' | 'INTAKE_DESC' | 'CODE_ASC'
  >('CUTOFF_DESC');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Collapsible Accordion sections in left sidebar
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    stage: true,
    sector: true,
    stream: true,
    cutoff: true,
    field: true,
    tuition: false,
    mode: false,
    duration: false,
    medium: false,
    accreditation: false,
    rules: false,
    location: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync stream default subjects
  useEffect(() => {
    if (streamFilter !== 'ALL' && STREAM_SUBJECT_POOL[streamFilter]) {
      const pool = STREAM_SUBJECT_POOL[streamFilter];
      setSubjects([pool[0], pool[1] ?? pool[0], pool[2] ?? pool[0]]);
    }
  }, [streamFilter]);

  // Convert State UGC Rows + NonStatePathways into Unified Items
  const unifiedItems = useMemo<UnifiedDiscoveryItem[]>(() => {
    const stateItems: UnifiedDiscoveryItem[] = districtPrograms.map((row) => {
      const isComputer = row.course_name.toLowerCase().includes('computer');
      const isMedicine = row.course_name.toLowerCase().includes('medicine') || row.course_name.toLowerCase().includes('mbbs');
      const isEngineering = row.course_name.toLowerCase().includes('engineering');

      const accreditations = ['UGC'];
      if (isEngineering) accreditations.push('IESL');
      if (isMedicine) accreditations.push('SLMC');

      return {
        id: row.uni_code,
        kind: 'STATE_UGC',
        stateRow: row,
        title: `${row.course_name} (${row.degree_awarded})`,
        instituteName: row.institution_name,
        instituteAbbr: row.institution_code,
        code: row.uni_code,
        sector: 'STATE_UGC',
        streamEligible: [row.stream],
        durationYears: row.duration_years || 4,
        medium: row.medium,
        tuitionBand: 'FREE_STATE',
        totalFeeLkr: 0,
        cutoffZ: row.status === 'NQC' ? null : row.min_z_score,
        isNqc: row.status === 'NQC' || row.min_z_score === null,
        isMeritOnly: row.all_island_merit_only,
        studyField: categorizeStudyField(row.course_name, row.stream),
        entryStages: ['3_AL_PASSES'],
        studyModes: ['FULL_TIME_WEEKDAY'],
        accreditations,
        aptitudeRequired: row.aptitude_test_required,
        requiresOlSpecial: Boolean(row.requires_ol_special),
        hasInternship: isComputer || isEngineering || isMedicine,
        hasMeritScholarship: false,
        hasHostel: true,
        province: getInstitutionProvince(row.institution_code),
        campusHub: getInstitutionCampusHub(row.institution_code),
        proposedIntake: row.proposed_intake,
        website: row.institution_website || 'https://www.ugc.ac.lk',
        programUrl: 'https://www.ugc.ac.lk',
        applyUrl: 'https://www.ugc.ac.lk',
        specializations: [],
      };
    });

    const nonStateItems: UnifiedDiscoveryItem[] = NON_STATE_IFSLS_PATHWAYS.map((p) => {
      const accreditations: string[] = [];
      if (p.ugc_recognized) accreditations.push('UGC');
      if (p.mohe_dai) accreditations.push('MOHE_DAI');
      if (p.foreign_partner) accreditations.push('FOREIGN');
      if (p.tvec_nvq_level) accreditations.push('TVEC');

      return {
        id: p.id,
        kind: 'NON_STATE',
        pathway: p,
        title: p.degree_title,
        instituteName: p.institute_name,
        instituteAbbr: p.institute_abbr,
        code: p.institute_abbr,
        sector: p.sector,
        streamEligible: p.stream_eligible,
        durationYears: p.duration_years,
        medium: ['E'],
        tuitionBand: p.tuition_band,
        totalFeeLkr: p.total_fee_lkr,
        cutoffZ: null,
        isNqc: true,
        isMeritOnly: false,
        studyField: categorizeStudyField(p.degree_title, p.stream_eligible[0] || 'Physical Science'),
        entryStages: p.entry_stage,
        studyModes: p.study_mode,
        accreditations,
        aptitudeRequired: false,
        requiresOlSpecial: false,
        hasInternship: p.has_internship,
        hasMeritScholarship: p.has_merit_scholarship,
        hasHostel: p.institute_abbr === 'SLIIT' || p.institute_abbr === 'NSBM',
        province: p.province,
        campusHub: p.campus_hub,
        proposedIntake: 250,
        website: p.website,
        programUrl: p.program_url,
        applyUrl: p.apply_url,
        loanPortalUrl: p.loan_portal_url,
        specializations: p.specializations,
      };
    });

    return [...stateItems, ...nonStateItems];
  }, [districtPrograms]);

  // Subject requirement eligibility evaluator for State UGC rows
  const subjectEligibilityMap = useMemo(() => {
    const map = new Map<string, { eligible: boolean; reason?: string }>();
    const subjectPairs = [
      { subject: subjects[0], grade: grades[0] },
      { subject: subjects[1], grade: grades[1] },
      { subject: subjects[2], grade: grades[2] },
    ];
    for (const item of unifiedItems) {
      if (item.kind === 'STATE_UGC' && item.stateRow) {
        const check = checkSubjectEligibility(
          subjectPairs,
          cgtScore,
          item.stateRow.subject_requirements
        );
        map.set(item.id, check);
      }
    }
    return map;
  }, [unifiedItems, subjects, grades, cgtScore]);

  // Unified Filter Function
  const matchesFilters = useCallback(
    (item: UnifiedDiscoveryItem): boolean => {
      // 1. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.code.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.instituteName.toLowerCase().includes(q) ||
          item.instituteAbbr.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q) ||
          item.campusHub.toLowerCase().includes(q) ||
          item.specializations.some((s) => s.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Entry stage
      if (selectedEntryStages.length > 0) {
        const hasStage = selectedEntryStages.some((stage) => {
          if (stage === '3_AL_PASSES') return item.entryStages.includes('3_AL_PASSES');
          if (stage === 'DIRECT_NON_UGC')
            return item.sector === 'MOHE_IFSLS_PRIVATE' || item.sector === 'STATE_NON_UGC';
          return item.entryStages.includes(stage);
        });
        if (!hasStage) return false;
      }

      // 3. Sector
      if (selectedSectors.length > 0) {
        if (!selectedSectors.includes(item.sector)) return false;
      }

      // 4. Stream & 3-subject combinator
      if (streamFilter !== 'ALL') {
        const streamMatches =
          item.streamEligible.includes(streamFilter) ||
          item.streamEligible.includes('Universal') ||
          item.streamEligible.includes('Other');
        if (!streamMatches) return false;
      }

      if (subjectFilterMode === 'ELIGIBLE_ONLY' && item.kind === 'STATE_UGC') {
        const check = subjectEligibilityMap.get(item.id);
        if (check && !check.eligible) return false;
      }

      // 5. Cutoff range & District
      if (minCutoffZ !== '' && !isNaN(Number(minCutoffZ))) {
        if (item.cutoffZ === null || item.cutoffZ < Number(minCutoffZ)) return false;
      }
      if (maxCutoffZ !== '' && !isNaN(Number(maxCutoffZ))) {
        if (item.cutoffZ === null || item.cutoffZ > Number(maxCutoffZ)) return false;
      }

      if (onlyBelowMyZ && studentZScore !== null) {
        if (item.cutoffZ === null || item.cutoffZ > studentZScore) return false;
      }

      if (!includeNqc && item.isNqc) return false;
      if (meritOnlyFilter && !item.isMeritOnly) return false;

      // 6. Study Field
      if (selectedFields.length > 0) {
        if (!selectedFields.includes(item.studyField)) return false;
      }

      // 7. Tuition Band & Scholarships
      if (selectedTuitionBands.length > 0) {
        if (!selectedTuitionBands.includes(item.tuitionBand)) return false;
      }
      if (meritScholarshipOnly && !item.hasMeritScholarship) return false;
      if (bursaryOnly && item.tuitionBand !== 'FREE_STATE') return false;

      // 8. Study Mode
      if (selectedStudyModes.length > 0) {
        const matchesMode = selectedStudyModes.some((m) =>
          item.studyModes.includes(m as UnifiedDiscoveryItem['studyModes'][number])
        );
        if (!matchesMode) return false;
      }

      // 9. Duration
      if (selectedDurations.length > 0) {
        if (!selectedDurations.includes(item.durationYears)) return false;
      }

      // 10. Medium
      if (selectedMediums.length > 0) {
        const hasMedium = selectedMediums.some((m) => item.medium.includes(m));
        if (!hasMedium) return false;
      }

      // 11. Accreditations
      if (selectedAccreditations.length > 0) {
        const hasAccreditation = selectedAccreditations.every((acc) =>
          item.accreditations.includes(acc)
        );
        if (!hasAccreditation) return false;
      }

      // 12. Admission Rules
      if (directNoAptitudeOnly && item.aptitudeRequired) return false;
      if (aptitudeRequiredOnly && !item.aptitudeRequired) return false;
      if (internshipOnly && !item.hasInternship) return false;

      // 13. Location & Hub
      if (selectedProvince !== 'ALL' && item.province !== selectedProvince) return false;
      if (selectedCampusHub !== 'ALL' && item.campusHub !== selectedCampusHub) return false;
      if (hostelOnly && !item.hasHostel) return false;

      return true;
    },
    [
      searchQuery,
      selectedEntryStages,
      selectedSectors,
      streamFilter,
      subjectFilterMode,
      subjectEligibilityMap,
      minCutoffZ,
      maxCutoffZ,
      onlyBelowMyZ,
      studentZScore,
      includeNqc,
      meritOnlyFilter,
      selectedFields,
      selectedTuitionBands,
      meritScholarshipOnly,
      bursaryOnly,
      selectedStudyModes,
      selectedDurations,
      selectedMediums,
      selectedAccreditations,
      directNoAptitudeOnly,
      aptitudeRequiredOnly,
      internshipOnly,
      selectedProvince,
      selectedCampusHub,
      hostelOnly,
    ]
  );

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    const list = unifiedItems.filter(matchesFilters);

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'CUTOFF_DESC':
          if (a.cutoffZ === null && b.cutoffZ === null) return 0;
          if (a.cutoffZ === null) return 1;
          if (b.cutoffZ === null) return -1;
          return b.cutoffZ - a.cutoffZ;
        case 'CUTOFF_ASC':
          if (a.cutoffZ === null && b.cutoffZ === null) return 0;
          if (a.cutoffZ === null) return 1;
          if (b.cutoffZ === null) return -1;
          return a.cutoffZ - b.cutoffZ;
        case 'FEE_ASC':
          return a.totalFeeLkr - b.totalFeeLkr;
        case 'INTAKE_DESC':
          return b.proposedIntake - a.proposedIntake;
        case 'CODE_ASC':
          return a.code.localeCompare(b.code);
        default:
          return 0;
      }
    });
  }, [unifiedItems, matchesFilters, sortBy]);

  // Live count helper for sidebar facets
  const countMatching = useCallback(
    (predicate: (item: UnifiedDiscoveryItem) => boolean) => {
      return unifiedItems.filter(predicate).length;
    },
    [unifiedItems]
  );

  // Quick Preset Activator (Layer 1)
  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    // Reset other specific facets
    setSelectedEntryStages([]);
    setSelectedSectors([]);
    setSelectedFields([]);
    setSelectedTuitionBands([]);
    setSelectedStudyModes([]);
    setDirectNoAptitudeOnly(false);
    setAptitudeRequiredOnly(false);

    switch (presetName) {
      case 'STATE_UGC':
        setSelectedSectors(['STATE_UGC']);
        break;
      case 'IFSLS_LOAN':
        setSelectedSectors(['MOHE_IFSLS_PRIVATE']);
        setSelectedTuitionBands(['IFSLS_ZERO_UPFRONT']);
        break;
      case 'COMPUTING':
        setSelectedFields(['COMPUTING']);
        break;
      case 'ENGINEERING':
        setSelectedFields(['ENGINEERING', 'BUILT_ENV']);
        break;
      case 'MEDICINE':
        setSelectedFields(['MEDICINE']);
        break;
      case 'PENDING_AL':
        setSelectedEntryStages(['PENDING_AL', 'AFTER_OL_FOUNDATION']);
        break;
      case 'DIRECT_ENTRY':
        setDirectNoAptitudeOnly(true);
        break;
      case 'WEEKEND_DISTANCE':
        setSelectedStudyModes(['WEEKEND_PART_TIME', 'DISTANCE_ONLINE']);
        break;
      default:
        break;
    }
  };

  // Guided Wizard Submitter (Layer 2)
  const applyGuidedWizard = () => {
    // 1. Stage
    setSelectedEntryStages([wizardStage]);
    // 2. Area
    setSelectedFields([wizardArea as StudyFieldCategory]);
    // 3. Funding
    if (wizardFunding === 'FREE_ONLY') {
      setSelectedSectors(['STATE_UGC', 'STATE_NON_UGC']);
      setSelectedTuitionBands(['FREE_STATE']);
    } else if (wizardFunding === 'FREE_PLUS_IFSLS') {
      setSelectedSectors(['STATE_UGC', 'MOHE_IFSLS_PRIVATE', 'STATE_NON_UGC']);
      setSelectedTuitionBands(['FREE_STATE', 'IFSLS_ZERO_UPFRONT']);
    } else {
      setSelectedSectors(['STATE_UGC', 'MOHE_IFSLS_PRIVATE', 'DIRECT_PRIVATE_FOREIGN', 'STATE_NON_UGC']);
    }

    setIsWizardOpen(false);
    const resultsElement = document.getElementById('discovery-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery('');
    setActivePreset(null);
    setSelectedEntryStages([]);
    setSelectedSectors([]);
    setStreamFilter('ALL');
    setSubjectFilterMode('SHOW_ALL');
    setMinCutoffZ('');
    setMaxCutoffZ('');
    setOnlyBelowMyZ(false);
    setIncludeNqc(true);
    setMeritOnlyFilter(false);
    setSelectedFields([]);
    setSelectedTuitionBands([]);
    setMeritScholarshipOnly(false);
    setBursaryOnly(false);
    setSelectedStudyModes([]);
    setSelectedDurations([]);
    setSelectedMediums([]);
    setSelectedAccreditations([]);
    setDirectNoAptitudeOnly(false);
    setAptitudeRequiredOnly(false);
    setInternshipOnly(false);
    setSelectedProvince('ALL');
    setSelectedCampusHub('ALL');
    setHostelOnly(false);
  };

  // Share Filtered View link to clipboard
  const handleShareView = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      {/* Page Title & Quota District Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Official Sri Lanka UGC Admissions & Higher Education Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t.navPredictor}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {t.heroSub}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDistrictModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs sm:text-sm font-bold self-start md:self-auto shrink-0 shadow-xs hover:bg-slate-800 transition-colors max-w-full"
        >
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate max-w-[260px] sm:max-w-none">{t.quotaBadge}: {getLocalizedDistrictName(district, lang)} (#{district.district_id})</span>
        </button>
      </div>

      {/* ========================================================
          LAYER 1: Instant Search Bar + 8 Quick Preset Pills
         ======================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Instant Multi-Field Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 8 One-Click Quick Preset Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-thin">
          <span className="text-slate-500 uppercase tracking-wider text-[11px] shrink-0 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t.quickPresets}:
          </span>

          <button
            type="button"
            onClick={() => applyPreset('STATE_UGC')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'STATE_UGC'
                ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {t.allFreeStateUgcs}
          </button>

          <button
            type="button"
            onClick={() => applyPreset('IFSLS_LOAN')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'IFSLS_LOAN'
                ? 'bg-emerald-900 text-emerald-200 border-emerald-900 shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}
          >
            💰 LKR 0 Upfront (MOHE Loan)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('COMPUTING')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'COMPUTING'
                ? 'bg-sky-900 text-sky-200 border-sky-900 shadow-xs'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200'
            }`}
          >
            💻 Computing & Software Eng
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ENGINEERING')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'ENGINEERING'
                ? 'bg-indigo-900 text-indigo-200 border-indigo-900 shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
            }`}
          >
            ⚙️ Engineering & QS
          </button>

          <button
            type="button"
            onClick={() => applyPreset('MEDICINE')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'MEDICINE'
                ? 'bg-rose-900 text-rose-200 border-rose-900 shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200'
            }`}
          >
            🩺 Medicine & Allied Health
          </button>

          <button
            type="button"
            onClick={() => applyPreset('PENDING_AL')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'PENDING_AL'
                ? 'bg-amber-900 text-amber-200 border-amber-900 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
            }`}
          >
            ⚡ Pending A/L or Post O/L
          </button>

          <button
            type="button"
            onClick={() => applyPreset('DIRECT_ENTRY')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'DIRECT_ENTRY'
                ? 'bg-teal-900 text-teal-200 border-teal-900 shadow-xs'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200'
            }`}
          >
            🚫 Direct (No Aptitude Test)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('WEEKEND_DISTANCE')}
            className={`px-3 py-1.5 rounded-full shrink-0 border transition-all ${
              activePreset === 'WEEKEND_DISTANCE'
                ? 'bg-purple-900 text-purple-200 border-purple-900 shadow-xs'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
            }`}
          >
            🗓️ Weekend & Distance (OUSL)
          </button>
        </div>
      </section>

      {/* ========================================================
          LAYER 2: Collapsible 3-Step Guided Finder Wizard
         ======================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-[#0F2942] to-slate-900 text-white rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-md transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
              <CompassIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                <span>🧭 Help Me Find in 3 Simple Steps</span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  15-Second Guided Wizard
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                New to UGC cutoffs or overwhelmed? Answer 3 quick questions to discover your best-fit paths.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWizardOpen(!isWizardOpen)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 shrink-0 inline-flex items-center gap-1.5"
          >
            <span>{isWizardOpen ? 'Hide Wizard' : 'Open Guided Wizard'}</span>
            {isWizardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isWizardOpen && (
          <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px]">
                1. Your Qualification Stage
              </div>
              <div className="space-y-1.5">
                {[
                  { id: '3_AL_PASSES', label: 'Passed 3 A/L Subjects (Have Z-Score)' },
                  { id: 'PENDING_AL', label: 'Sat A/Ls (Awaiting Results)' },
                  { id: 'AFTER_OL_FOUNDATION', label: 'After O/Ls (Foundation Track)' },
                  { id: 'NVQ_HND_TOPUP', label: 'HND / NVQ Level 5 Holder (Top-Up)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWizardStage(item.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-colors ${
                      wizardStage === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px]">
                2. Career / Study Field
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'COMPUTING', label: '💻 IT, AI & Software Engineering' },
                  { id: 'ENGINEERING', label: '⚙️ Engineering, QS & Tech' },
                  { id: 'MEDICINE', label: '🩺 Medicine, Nursing & Health' },
                  { id: 'BUSINESS', label: '📊 Business, Accounting & Finance' },
                  { id: 'LAW_HUMANITIES', label: '⚖️ Law (LLB) & Humanities' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWizardArea(item.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-colors ${
                      wizardArea === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px]">
                3. Tuition & Funding
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'FREE_ONLY', label: '🆓 100% Free State University Only' },
                  { id: 'FREE_PLUS_IFSLS', label: '💰 Free State + MOHE 0% Loan (IFSLS)' },
                  { id: 'ALL_FUNDING', label: '🌏 Open to All (State + Private + Foreign)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWizardFunding(item.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-colors ${
                      wizardFunding === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={applyGuidedWizard}
                  className="w-full mt-3 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Apply Guided Filters & Find Courses →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          LAYER 3 & 4: 2-Column Responsive Layout
          (12-Facet Sticky Sidebar + Results Workspace)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Filter Drawer Button */}
        <div className="lg:hidden col-span-1 flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--color-brand-primary)] text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Open All 12 Filter Facets</span>
          </button>
          <button
            type="button"
            onClick={resetAllFilters}
            className="p-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            LAYER 3: Sticky 12-Facet Left Sidebar (lg:col-span-4 xl:col-span-3)
           ======================================================== */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 space-y-3 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1 scrollbar-thin ${
            isMobileFilterOpen
              ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto block'
              : 'hidden lg:block'
          }`}
        >
          {/* Mobile Drawer Close Header */}
          {isMobileFilterOpen && (
            <div className="lg:hidden flex items-center justify-between border-b pb-4 mb-4">
              <div className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-600" />
                <span>Filters & Facets</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Sidebar Top Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              Filters ({filteredItems.length} Matches)
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Facet 1: Qualification & Entry Stage */}
          <FacetSection
            title="1. Qualification & Entry Stage"
            expanded={expandedSections.stage}
            onToggle={() => toggleSection('stage')}
          >
            <div className="space-y-1 text-xs">
              {[
                { id: '3_AL_PASSES', label: '3 A/L Passes (UGC Z-Score)' },
                { id: 'DIRECT_NON_UGC', label: '3 A/L Passes (Direct Private / IFSLS)' },
                { id: 'PENDING_AL', label: 'Pending A/L Results Accepted' },
                { id: 'AFTER_OL_FOUNDATION', label: 'After O/L (Foundation Track)' },
                { id: 'NVQ_HND_TOPUP', label: 'NVQ Level 5 / HND (Degree Top-Up)' },
              ].map((opt) => {
                const count = countMatching((item) => {
                  if (opt.id === '3_AL_PASSES') return item.entryStages.includes('3_AL_PASSES');
                  if (opt.id === 'DIRECT_NON_UGC')
                    return item.sector === 'MOHE_IFSLS_PRIVATE' || item.sector === 'STATE_NON_UGC';
                  return item.entryStages.includes(opt.id);
                });
                const checked = selectedEntryStages.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedEntryStages((prev) =>
                            checked ? prev.filter((s) => s !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 2: Sector & Ownership */}
          <FacetSection
            title="2. Institution Sector"
            expanded={expandedSections.sector}
            onToggle={() => toggleSection('sector')}
          >
            <div className="space-y-1 text-xs">
              {[
                { id: 'STATE_UGC' as SectorType, label: '🏛️ State UGC (21 Campuses)' },
                { id: 'MOHE_IFSLS_PRIVATE' as SectorType, label: '💰 MOHE IFSLS Loan Campuses' },
                { id: 'STATE_NON_UGC' as SectorType, label: '🎓 State Non-UGC (OUSL / UoVT / SLIATE)' },
                { id: 'DIRECT_PRIVATE_FOREIGN' as SectorType, label: '🌏 Private & Foreign (UK/Aus)' },
              ].map((opt) => {
                const count = countMatching((i) => i.sector === opt.id);
                const checked = selectedSectors.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedSectors((prev) =>
                            checked ? prev.filter((s) => s !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 3: Stream & 3-Subject Combinator */}
          <FacetSection
            title="3. A/L Stream & 3 Subjects"
            expanded={expandedSections.stream}
            onToggle={() => toggleSection('stream')}
          >
            <div className="space-y-3 text-xs">
              {/* Stream Select */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">A/L Stream</label>
                <select
                  value={streamFilter}
                  onChange={(e) => {
                    setStreamFilter(e.target.value);
                    if (e.target.value !== 'ALL') setStudentStream(e.target.value);
                  }}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="ALL">All Streams</option>
                  <option value="Physical Science">Physical Science (Maths)</option>
                  <option value="Biological Science">Biological Science (Bio)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>

              {/* 3 Subjects Picker */}
              {streamFilter !== 'ALL' && STREAM_SUBJECT_POOL[streamFilter] && (
                <div className="space-y-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">Your 3 Subject Combination:</div>
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex gap-2">
                      <select
                        value={subjects[idx]}
                        onChange={(e) => {
                          const next = [...subjects] as [string, string, string];
                          next[idx] = e.target.value;
                          setSubjects(next);
                        }}
                        className="flex-1 p-1.5 rounded border border-slate-300 text-[11px] bg-white"
                      >
                        {STREAM_SUBJECT_POOL[streamFilter].map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                      <select
                        value={grades[idx]}
                        onChange={(e) => {
                          const next = [...grades] as [ALGrade, ALGrade, ALGrade];
                          next[idx] = e.target.value as ALGrade;
                          setGrades(next);
                        }}
                        className="w-14 p-1.5 rounded border border-slate-300 text-[11px] font-bold bg-white text-center"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="S">S</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  ))}

                  {/* Common General Test */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-600 font-semibold">Common Gen Test (CGT):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={cgtScore}
                      onChange={(e) => setCgtScore(Number(e.target.value))}
                      className="w-14 p-1 rounded border border-slate-300 text-center text-xs font-bold font-tabular"
                    />
                  </div>

                  {/* 3-Way Subject Filter Radio */}
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="subjectFilterMode"
                        checked={subjectFilterMode === 'SHOW_ALL'}
                        onChange={() => setSubjectFilterMode('SHOW_ALL')}
                      />
                      <span className="text-[11px]">Show All Courses</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="subjectFilterMode"
                        checked={subjectFilterMode === 'ELIGIBLE_ONLY'}
                        onChange={() => setSubjectFilterMode('ELIGIBLE_ONLY')}
                      />
                      <span className="text-[11px] font-bold text-emerald-800">
                        ✅ Only Matching My 3 Subjects
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </FacetSection>

          {/* Facet 4: Cutoff Range & District */}
          <FacetSection
            title="4. District & 2024/25 Cutoff Range"
            expanded={expandedSections.cutoff}
            onToggle={() => toggleSection('cutoff')}
          >
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Quota District</label>
                <select
                  value={district.district_id}
                  onChange={(e) => setDistrictId(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d.district_id} value={d.district_id}>
                      {d.district_id}. {d.district_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student's Official Z-Score Input */}
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-xs">Your Official Z-Score:</span>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 1.6500"
                    value={studentZScore}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setStudentZScore(isNaN(v) ? 0 : v);
                    }}
                    className="w-24 p-1.5 rounded border border-amber-300 bg-white font-tabular font-bold text-xs text-center"
                  />
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-900">
                  <input
                    type="checkbox"
                    checked={onlyBelowMyZ}
                    disabled={studentZScore === null}
                    onChange={(e) => setOnlyBelowMyZ(e.target.checked)}
                    className="rounded border-amber-400 text-amber-700"
                  />
                  <span>Show only courses where Cutoff ≤ My Z</span>
                </label>
              </div>

              {/* Min & Max Cutoff inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 text-[11px] font-semibold mb-1">Min Cutoff Z</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="-0.50"
                    value={minCutoffZ}
                    onChange={(e) => setMinCutoffZ(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs font-tabular"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-semibold mb-1">Max Cutoff Z</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2.60"
                    value={maxCutoffZ}
                    onChange={(e) => setMaxCutoffZ(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs font-tabular"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeNqc}
                    onChange={(e) => setIncludeNqc(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span>Include NQC / Direct Entry Courses</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={meritOnlyFilter}
                    onChange={(e) => setMeritOnlyFilter(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span>100% All-Island Merit Only</span>
                </label>
              </div>
            </div>
          </FacetSection>

          {/* Facet 5: Study Field */}
          <FacetSection
            title="5. Study Field & Specialization"
            expanded={expandedSections.field}
            onToggle={() => toggleSection('field')}
          >
            <div className="space-y-1 text-xs">
              {[
                { id: 'COMPUTING' as StudyFieldCategory, label: '💻 IT, AI & Computing' },
                { id: 'ENGINEERING' as StudyFieldCategory, label: '⚙️ Engineering & Tech' },
                { id: 'MEDICINE' as StudyFieldCategory, label: '🩺 Medicine & Health' },
                { id: 'BUSINESS' as StudyFieldCategory, label: '📊 Business & Finance' },
                { id: 'BUILT_ENV' as StudyFieldCategory, label: '📐 Architecture & QS' },
                { id: 'AGRI' as StudyFieldCategory, label: '🌾 Agriculture & Food' },
                { id: 'SCIENCE' as StudyFieldCategory, label: '🔬 Physical & Bio Science' },
                { id: 'LAW_HUMANITIES' as StudyFieldCategory, label: '⚖️ Law & Humanities' },
              ].map((opt) => {
                const count = countMatching((i) => i.studyField === opt.id);
                const checked = selectedFields.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedFields((prev) =>
                            checked ? prev.filter((f) => f !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 6: Tuition Budget */}
          <FacetSection
            title="6. Tuition Budget & Aid"
            expanded={expandedSections.tuition}
            onToggle={() => toggleSection('tuition')}
          >
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'FREE_STATE', label: '🆓 100% Free Tuition (State / SLIATE)' },
                { id: 'IFSLS_ZERO_UPFRONT', label: '💰 LKR 0 Upfront — MOHE Loan' },
                { id: 'UNDER_500K', label: '💵 Under LKR 500k (OUSL)' },
                { id: '500K_TO_1_5M', label: '💳 LKR 500k – 1.5M' },
                { id: '1_5M_TO_3_5M', label: '💳 LKR 1.5M – 3.5M' },
              ].map((opt) => {
                const count = countMatching((i) => i.tuitionBand === opt.id);
                const checked = selectedTuitionBands.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedTuitionBands((prev) =>
                            checked ? prev.filter((b) => b !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={meritScholarshipOnly}
                    onChange={(e) => setMeritScholarshipOnly(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span>🏆 A/L Merit Scholarships</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={bursaryOnly}
                    onChange={(e) => setBursaryOnly(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span>Mahapola / Bursary Eligible</span>
                </label>
              </div>
            </div>
          </FacetSection>

          {/* Facet 7: Study Mode */}
          <FacetSection
            title="7. Study Mode & Schedule"
            expanded={expandedSections.mode}
            onToggle={() => toggleSection('mode')}
          >
            <div className="space-y-1 text-xs">
              {[
                { id: 'FULL_TIME_WEEKDAY', label: 'Full-Time Weekday (On-Campus)' },
                { id: 'WEEKEND_PART_TIME', label: 'Weekend / Part-Time (Working)' },
                { id: 'DISTANCE_ONLINE', label: 'Distance / Online Hybrid (OUSL)' },
              ].map((opt) => {
                const count = countMatching((i) =>
                  i.studyModes.includes(opt.id as UnifiedDiscoveryItem['studyModes'][number])
                );
                const checked = selectedStudyModes.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedStudyModes((prev) =>
                            checked ? prev.filter((m) => m !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 8: Duration */}
          <FacetSection
            title="8. Degree Duration"
            expanded={expandedSections.duration}
            onToggle={() => toggleSection('duration')}
          >
            <div className="space-y-1 text-xs">
              {[
                { years: 3, label: '3 Years (General / HND)' },
                { years: 4, label: '4 Years (Honours / BEng)' },
                { years: 5, label: '5 Years (Clinical MBBS / BDS)' },
              ].map((opt) => {
                const count = countMatching((i) => i.durationYears === opt.years);
                const checked = selectedDurations.includes(opt.years);
                return (
                  <label
                    key={opt.years}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedDurations((prev) =>
                            checked ? prev.filter((y) => y !== opt.years) : [...prev, opt.years]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 9: Medium */}
          <FacetSection
            title="9. Medium of Instruction"
            expanded={expandedSections.medium}
            onToggle={() => toggleSection('medium')}
          >
            <div className="space-y-1 text-xs">
              {[
                { id: 'E' as const, label: 'English (E)' },
                { id: 'S' as const, label: 'Sinhala (S)' },
                { id: 'T' as const, label: 'Tamil (T)' },
              ].map((opt) => {
                const count = countMatching((i) => i.medium.includes(opt.id));
                const checked = selectedMediums.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedMediums((prev) =>
                            checked ? prev.filter((m) => m !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 10: Accreditation */}
          <FacetSection
            title="10. Accreditation & Recognition"
            expanded={expandedSections.accreditation}
            onToggle={() => toggleSection('accreditation')}
          >
            <div className="space-y-1 text-xs">
              {[
                { id: 'UGC', label: '✅ UGC Recognized' },
                { id: 'MOHE_DAI', label: '✅ MOHE Degree Awarding (DAI)' },
                { id: 'FOREIGN', label: '✅ Foreign UK / Aus Partner' },
                { id: 'IESL', label: '✅ IESL Accredited (Engineering)' },
                { id: 'SLMC', label: '✅ SLMC Recognized (Medical)' },
                { id: 'TVEC', label: '✅ TVEC NVQ Level 6/7' },
              ].map((opt) => {
                const count = countMatching((i) => i.accreditations.includes(opt.id));
                const checked = selectedAccreditations.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedAccreditations((prev) =>
                            checked ? prev.filter((a) => a !== opt.id) : [...prev, opt.id]
                          );
                        }}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span className={checked ? 'font-bold text-slate-900' : ''}>{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tabular">({count})</span>
                  </label>
                );
              })}
            </div>
          </FacetSection>

          {/* Facet 11: Admission Rules */}
          <FacetSection
            title="11. Admission Rules & Internship"
            expanded={expandedSections.rules}
            onToggle={() => toggleSection('rules')}
          >
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={directNoAptitudeOnly}
                  onChange={(e) => setDirectNoAptitudeOnly(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600"
                />
                <span>Direct Entry (No Aptitude Test)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={aptitudeRequiredOnly}
                  onChange={(e) => setAptitudeRequiredOnly(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600"
                />
                <span>Requires Aptitude Test</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={internshipOnly}
                  onChange={(e) => setInternshipOnly(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600"
                />
                <span>Mandatory Internship (6–12 Mo)</span>
              </label>
            </div>
          </FacetSection>

          {/* Facet 12: Province, Campus Hub & Hostel */}
          <FacetSection
            title="12. Province, Hub & Hostel"
            expanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
          >
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Province</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="ALL">All 9 Provinces</option>
                  <option value="Western">Western</option>
                  <option value="Central">Central</option>
                  <option value="Southern">Southern</option>
                  <option value="Northern">Northern</option>
                  <option value="Eastern">Eastern</option>
                  <option value="North Western">North Western</option>
                  <option value="North Central">North Central</option>
                  <option value="Uva">Uva</option>
                  <option value="Sabaragamuwa">Sabaragamuwa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Campus Hub</label>
                <select
                  value={selectedCampusHub}
                  onChange={(e) => setSelectedCampusHub(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="ALL">All Campus Hubs</option>
                  <option value="Colombo City">Colombo City</option>
                  <option value="Malabe Tech Corridor">Malabe Tech Corridor</option>
                  <option value="Moratuwa / Ratmalana">Moratuwa / Ratmalana</option>
                  <option value="Homagama / Pitipana">Homagama / Pitipana</option>
                  <option value="Peradeniya / Kandy">Peradeniya / Kandy</option>
                  <option value="Island-Wide Regional Centers">Island-Wide Regional Centers</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={hostelOnly}
                  onChange={(e) => setHostelOnly(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600"
                />
                <span>On-Campus Hostel Available (&lt; LKR 2k/mo)</span>
              </label>
            </div>
          </FacetSection>
        </aside>

        {/* ========================================================
            LAYER 4: Results Workspace (lg:col-span-8 xl:col-span-9)
           ======================================================== */}
        <main id="discovery-results-section" className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Active Filter Chips Bar & Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  Showing <span className="text-amber-600 font-tabular">{filteredItems.length}</span> Matching Offerings
                </div>
                <div className="text-xs text-slate-500">
                  Across 21 State Universities & 14 Government-Approved Non-State Pathways
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="p-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="CUTOFF_DESC">2024/25 Cutoff: High → Low</option>
                    <option value="CUTOFF_ASC">2024/25 Cutoff: Low → High</option>
                    <option value="FEE_ASC">Tuition Fee: Free / Lowest First</option>
                    <option value="INTAKE_DESC">Annual Seats: Most First</option>
                    <option value="CODE_ASC">Course Code (001 → 140)</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-lg border border-slate-300 p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    title="Grid Cards View"
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-white shadow-xs text-amber-700 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    title="Compact Cutoff & Fee Table View"
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white shadow-xs text-amber-700 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={handleShareView}
                  title="Share Filtered View"
                  className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 relative"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedNotification && (
                    <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] whitespace-nowrap shadow-md">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Removable Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>

              {searchQuery && (
                <Chip label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery('')} />
              )}
              {selectedSectors.map((s) => (
                <Chip
                  key={s}
                  label={`Sector: ${s}`}
                  onRemove={() => setSelectedSectors((prev) => prev.filter((x) => x !== s))}
                />
              ))}
              {streamFilter !== 'ALL' && (
                <Chip label={`Stream: ${streamFilter}`} onRemove={() => setStreamFilter('ALL')} />
              )}
              {subjectFilterMode === 'ELIGIBLE_ONLY' && (
                <Chip
                  label="Subject Combination: Eligible Only"
                  onRemove={() => setSubjectFilterMode('SHOW_ALL')}
                />
              )}
              {onlyBelowMyZ && (
                <Chip
                  label={`Cutoff <= ${studentZScore?.toFixed(4)}`}
                  onRemove={() => setOnlyBelowMyZ(false)}
                />
              )}
              {minCutoffZ !== '' && (
                <Chip label={`Min Z: ${minCutoffZ}`} onRemove={() => setMinCutoffZ('')} />
              )}
              {maxCutoffZ !== '' && (
                <Chip label={`Max Z: ${maxCutoffZ}`} onRemove={() => setMaxCutoffZ('')} />
              )}
              {selectedFields.map((f) => (
                <Chip
                  key={f}
                  label={`Field: ${f}`}
                  onRemove={() => setSelectedFields((prev) => prev.filter((x) => x !== f))}
                />
              ))}
              {selectedTuitionBands.map((b) => (
                <Chip
                  key={b}
                  label={`Tuition: ${b}`}
                  onRemove={() => setSelectedTuitionBands((prev) => prev.filter((x) => x !== b))}
                />
              ))}
              {directNoAptitudeOnly && (
                <Chip label="Direct Entry (No Aptitude)" onRemove={() => setDirectNoAptitudeOnly(false)} />
              )}

              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-rose-700 hover:underline font-bold ml-1"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Results: Cards View or Table View */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No degrees match your exact filter combination</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Try widening your cutoff range, unchecking strict subject combination requirements, or including State Non-UGC / IFSLS pathways.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white text-xs font-bold hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                if (item.kind === 'STATE_UGC' && item.stateRow) {
                  return (
                    <ProgramChanceCard
                      key={item.id}
                      program={item.stateRow}
                      studentZ={studentZScore}
                    />
                  );
                }

                // Non-State Pathway Card with Direct External Links
                if (item.pathway) {
                  return (
                    <NonStatePathwayCard
                      key={item.id}
                      pathway={item.pathway}
                    />
                  );
                }

                return null;
              })}
            </div>
          ) : (
            /* High-Density Compact Cutoff & Fee Table View */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3.5">Code / Inst</th>
                      <th className="py-3 px-3.5">Degree & Course</th>
                      <th className="py-3 px-3.5">Sector</th>
                      <th className="py-3 px-3.5 font-tabular">2024/25 Cutoff / Entry</th>
                      <th className="py-3 px-3.5">Duration & Medium</th>
                      <th className="py-3 px-3.5">Tuition / Loan</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Code / Inst */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {item.kind === 'STATE_UGC' ? (
                            <button
                              type="button"
                              onClick={() => openCourseProfile(item.code)}
                              className="font-tabular font-extrabold text-xs px-2 py-0.5 rounded bg-[var(--color-brand-primary)] text-amber-300 hover:bg-slate-800"
                            >
                              {item.code}
                            </button>
                          ) : (
                            <span className="font-bold text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-950">
                              {item.instituteAbbr}
                            </span>
                          )}
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.instituteAbbr}</div>
                        </td>

                        {/* Degree & Course */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {item.streamEligible[0]}
                            </span>
                            {item.aptitudeRequired && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                Aptitude Test
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Sector */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {item.sector === 'STATE_UGC' && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[11px]">
                              State UGC
                            </span>
                          )}
                          {item.sector === 'MOHE_IFSLS_PRIVATE' && (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                              MOHE IFSLS
                            </span>
                          )}
                          {item.sector === 'STATE_NON_UGC' && (
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold text-[11px]">
                              State Non-UGC
                            </span>
                          )}
                          {item.sector === 'DIRECT_PRIVATE_FOREIGN' && (
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[11px]">
                              Private Foreign
                            </span>
                          )}
                        </td>

                        {/* 2024/25 Cutoff / Entry */}
                        <td className="py-3 px-3.5 whitespace-nowrap font-tabular">
                          {item.cutoffZ !== null ? (
                            <span className="font-extrabold text-slate-900 text-xs">
                              {item.cutoffZ.toFixed(4)}
                              {item.isMeritOnly && (
                                <span className="text-[10px] text-sky-700 ml-1 block font-normal">All-Island</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium text-[11px]">
                              {item.kind === 'STATE_UGC' ? 'NQC' : 'Direct Entry'}
                            </span>
                          )}
                        </td>

                        {/* Duration & Medium */}
                        <td className="py-3 px-3.5 whitespace-nowrap text-slate-600">
                          {item.durationYears} Yrs · {item.medium.join('/')}
                        </td>

                        {/* Tuition / Loan */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {item.tuitionBand === 'FREE_STATE' && (
                            <span className="text-emerald-700 font-bold">100% Free State</span>
                          )}
                          {item.tuitionBand === 'IFSLS_ZERO_UPFRONT' && (
                            <span className="text-emerald-800 font-bold">LKR 0 Upfront Loan</span>
                          )}
                          {item.tuitionBand === 'UNDER_500K' && (
                            <span className="text-slate-700 font-semibold">&lt; LKR 500k</span>
                          )}
                          {item.tuitionBand === '500K_TO_1_5M' && (
                            <span className="text-slate-700 font-semibold">LKR 500k–1.5M</span>
                          )}
                          {item.tuitionBand === '1_5M_TO_3_5M' && (
                            <span className="text-slate-700 font-semibold">LKR 1.5M–3.5M</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          {item.kind === 'STATE_UGC' && item.stateRow ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => addToPlan(item.code)}
                                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                                  planEntries.some((p) => p.uni_code === item.code)
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300'
                                }`}
                              >
                                {planEntries.some((p) => p.uni_code === item.code) ? 'In Plan ✓' : '+ Plan'}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleCompare(item.code)}
                                className={`p-1 rounded text-xs font-semibold ${
                                  compareList.includes(item.code)
                                    ? 'bg-sky-100 text-sky-900'
                                    : 'hover:bg-slate-100 text-slate-600'
                                }`}
                                title="Compare"
                              >
                                {compareList.includes(item.code) ? 'Compared' : 'Compare'}
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5">
                              {item.loanPortalUrl && (
                                <a
                                  href={item.loanPortalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold"
                                >
                                  Loan ↗
                                </a>
                              )}
                              <a
                                href={item.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded bg-[var(--color-brand-primary)] hover:bg-slate-800 text-white text-[11px] font-bold"
                              >
                                Apply ↗
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ==========================================
// Helper Subcomponents
// ==========================================

const FacetSection: React.FC<{
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, expanded, onToggle, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
    <button
      type="button"
      onClick={onToggle}
      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
    >
      <span className="font-extrabold text-xs text-slate-900">{title}</span>
      {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {expanded && <div className="p-3 pt-0 border-t border-slate-100">{children}</div>}
  </div>
);

const Chip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
    <span>{label}</span>
    <button type="button" onClick={onRemove} className="p-0.5 hover:text-rose-600 rounded">
      <X className="w-3 h-3" />
    </button>
  </span>
);

const NonStatePathwayCard: React.FC<{ pathway: NonStatePathway }> = ({ pathway }) => {
  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 flex flex-col justify-between gap-4">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded font-bold text-xs bg-amber-100 text-amber-950">
              {pathway.institute_abbr}
            </span>
            {pathway.sector === 'MOHE_IFSLS_PRIVATE' && (
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[11px] font-bold">
                💰 MOHE IFSLS 0% Loan
              </span>
            )}
            {pathway.sector === 'STATE_NON_UGC' && (
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-950 text-[11px] font-bold">
                🎓 State Non-UGC
              </span>
            )}
            {pathway.sector === 'DIRECT_PRIVATE_FOREIGN' && (
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 text-[11px] font-bold">
                🌏 Foreign Partner Degree
              </span>
            )}
          </div>

          <span className="text-[11px] font-semibold text-slate-500 font-tabular">
            {pathway.duration_years} Years · On-Campus / Weekend
          </span>
        </div>

        {/* Title & Institute */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {pathway.degree_title}
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          <strong>{pathway.institute_name}</strong> · {pathway.location}
        </p>

        {/* Specializations pills */}
        {pathway.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {pathway.specializations.map((spec) => (
              <span
                key={spec}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Tuition / Loan Information */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="font-semibold text-emerald-800">{pathway.tuition_note_lkr}</div>
          {pathway.foreign_partner && (
            <div className="text-[11px] text-slate-600 mt-0.5">
              Awarded by: <strong>{pathway.foreign_partner}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Direct External Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary CTA */}
          <a
            href={pathway.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-lg bg-[var(--color-brand-primary)] hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
          >
            <span>Apply on {pathway.institute_abbr} Official Page ↗</span>
          </a>

          {/* Secondary CTA */}
          <a
            href={pathway.program_url}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <span>Official Program Page ↗</span>
          </a>
        </div>

        {/* Conditional MOHE 0% Loan Portal */}
        {pathway.ifsls_loan_eligible && (
          <a
            href={pathway.loan_portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>MOHE 0% Interest Student Loan Portal (IFSLS) ↗</span>
          </a>
        )}
      </div>
    </article>
  );
};

// Simple compass icon helper
const CompassIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
