import type { SubjectRequirementsSpec } from '../lib/ugcLogic';

export interface DistrictInfo {
  district_id: number;
  district_name: string;
  name_si: string;
  name_ta: string;
  province: string;
  difficulty_offset: number;
}

export const SRI_LANKA_DISTRICTS: DistrictInfo[] = [
  { district_id: 1, district_name: 'Colombo', name_si: 'කොළඹ', name_ta: 'கொழும்பு', province: 'Western', difficulty_offset: 0.0 },
  { district_id: 2, district_name: 'Gampaha', name_si: 'ගම්පහ', name_ta: 'கம்பஹா', province: 'Western', difficulty_offset: -0.035 },
  { district_id: 3, district_name: 'Kalutara', name_si: 'කළුතර', name_ta: 'களுத்துறை', province: 'Western', difficulty_offset: -0.045 },
  { district_id: 4, district_name: 'Matale', name_si: 'මාතලේ', name_ta: 'மாத்தளை', province: 'Central', difficulty_offset: -0.095 },
  { district_id: 5, district_name: 'Kandy', name_si: 'මහනුවර', name_ta: 'கண்டி', province: 'Central', difficulty_offset: -0.025 },
  { district_id: 6, district_name: 'Nuwara Eliya', name_si: 'නුවරඑළිය', name_ta: 'நுவரெலியா', province: 'Central', difficulty_offset: -0.185 },
  { district_id: 7, district_name: 'Galle', name_si: 'ගාල්ල', name_ta: 'காலி', province: 'Southern', difficulty_offset: -0.015 },
  { district_id: 8, district_name: 'Matara', name_si: 'මාතර', name_ta: 'மாத்தறை', province: 'Southern', difficulty_offset: -0.01 },
  { district_id: 9, district_name: 'Hambantota', name_si: 'හම්බන්තොට', name_ta: 'அம்பாந்தோட்டை', province: 'Southern', difficulty_offset: -0.065 },
  { district_id: 10, district_name: 'Jaffna', name_si: 'යාපනය', name_ta: 'யாழ்ப்பாணம்', province: 'Northern', difficulty_offset: -0.02 },
  { district_id: 11, district_name: 'Kilinochchi', name_si: 'කිලිනොච්චිය', name_ta: 'கிளிநොச்சி', province: 'Northern', difficulty_offset: -0.21 },
  { district_id: 12, district_name: 'Mannar', name_si: 'මන්නාරම', name_ta: 'மன்னார்', province: 'Northern', difficulty_offset: -0.195 },
  { district_id: 13, district_name: 'Mullaitivu', name_si: 'මුලතිව්', name_ta: 'முல்லைத்தீவு', province: 'Northern', difficulty_offset: -0.24 },
  { district_id: 14, district_name: 'Vavuniya', name_si: 'වවුනියාව', name_ta: 'வவுனியா', province: 'Northern', difficulty_offset: -0.14 },
  { district_id: 15, district_name: 'Trincomalee', name_si: 'ත්‍රිකුණාමලය', name_ta: 'திருகோணமலை', province: 'Eastern', difficulty_offset: -0.165 },
  { district_id: 16, district_name: 'Batticaloa', name_si: 'මඩකලපුව', name_ta: 'மட்டக்களப்பு', province: 'Eastern', difficulty_offset: -0.11 },
  { district_id: 17, district_name: 'Ampara', name_si: 'අම්පාර', name_ta: 'அம்பாறை', province: 'Eastern', difficulty_offset: -0.125 },
  { district_id: 18, district_name: 'Puttalam', name_si: 'පුත්තලම', name_ta: 'புத்தளம்', province: 'North Western', difficulty_offset: -0.135 },
  { district_id: 19, district_name: 'Kurunegala', name_si: 'කුරුණෑගල', name_ta: 'குருநாகல்', province: 'North Western', difficulty_offset: -0.03 },
  { district_id: 20, district_name: 'Anuradhapura', name_si: 'අනුරාධපුරය', name_ta: 'அனுராதபுரம்', province: 'North Central', difficulty_offset: -0.085 },
  { district_id: 21, district_name: 'Polonnaruwa', name_si: 'පොළොන්නරුව', name_ta: 'பொலன்னறுவை', province: 'North Central', difficulty_offset: -0.145 },
  { district_id: 22, district_name: 'Badulla', name_si: 'බදුල්ල', name_ta: 'பதுளை', province: 'Uva', difficulty_offset: -0.09 },
  { district_id: 23, district_name: 'Monaragala', name_si: 'මොණරාගල', name_ta: 'மொனராகலை', province: 'Uva', difficulty_offset: -0.175 },
  { district_id: 24, district_name: 'Kegalle', name_si: 'කෑගල්ල', name_ta: 'கேகாலை', province: 'Sabaragamuwa', difficulty_offset: -0.05 },
  { district_id: 25, district_name: 'Ratnapura', name_si: 'රත්නපුර', name_ta: 'இரத்தினபுரி', province: 'Sabaragamuwa', difficulty_offset: -0.055 },
];

export interface InstitutionRecord {
  institution_code: string;
  ugc_letter: string;
  name: string;
  type: 'University' | 'Campus' | 'Institute';
  location: string;
  website: string;
  established: number;
  hostel_monthly_lkr: number;
}

export const UGC_INSTITUTIONS: InstitutionRecord[] = [
  { institution_code: 'UOC', ugc_letter: 'A', name: 'University of Colombo', type: 'University', location: 'Colombo 03', website: 'https://cmb.ac.lk', established: 1921, hostel_monthly_lkr: 1500 },
  { institution_code: 'UOP', ugc_letter: 'B', name: 'University of Peradeniya', type: 'University', location: 'Peradeniya, Kandy', website: 'https://pdn.ac.lk', established: 1942, hostel_monthly_lkr: 1200 },
  { institution_code: 'UOM', ugc_letter: 'G', name: 'University of Moratuwa', type: 'University', location: 'Katubedda, Moratuwa', website: 'https://uom.lk', established: 1972, hostel_monthly_lkr: 1800 },
  { institution_code: 'USJP', ugc_letter: 'C', name: 'University of Sri Jayewardenepura', type: 'University', location: 'Gangodawila, Nugegoda', website: 'https://sjp.ac.lk', established: 1959, hostel_monthly_lkr: 1600 },
  { institution_code: 'UOK', ugc_letter: 'D', name: 'University of Kelaniya', type: 'University', location: 'Dalugama, Kelaniya', website: 'https://kln.ac.lk', established: 1959, hostel_monthly_lkr: 1500 },
  { institution_code: 'UOJ', ugc_letter: 'E', name: 'University of Jaffna', type: 'University', location: 'Thirunelveli, Jaffna', website: 'https://jfn.ac.lk', established: 1974, hostel_monthly_lkr: 1100 },
  { institution_code: 'UOR', ugc_letter: 'F', name: 'University of Ruhuna', type: 'University', location: 'Wellamadama, Matara', website: 'https://ruh.ac.lk', established: 1978, hostel_monthly_lkr: 1250 },
  { institution_code: 'EUSL', ugc_letter: 'H', name: 'Eastern University, Sri Lanka', type: 'University', location: 'Vantharumoolai, Batticaloa', website: 'https://esn.ac.lk', established: 1986, hostel_monthly_lkr: 1000 },
  { institution_code: 'SEUSL', ugc_letter: 'J', name: 'South Eastern University of Sri Lanka', type: 'University', location: 'Oluvil, Ampara', website: 'https://seu.ac.lk', established: 1995, hostel_monthly_lkr: 1000 },
  { institution_code: 'RUSL', ugc_letter: 'K', name: 'Rajarata University of Sri Lanka', type: 'University', location: 'Mihintale, Anuradhapura', website: 'https://rjt.ac.lk', established: 1996, hostel_monthly_lkr: 1050 },
  { institution_code: 'SUSL', ugc_letter: 'L', name: 'Sabaragamuwa University of Sri Lanka', type: 'University', location: 'Belihuloya, Ratnapura', website: 'https://sab.ac.lk', established: 1996, hostel_monthly_lkr: 1100 },
  { institution_code: 'WUSL', ugc_letter: 'M', name: 'Wayamba University of Sri Lanka', type: 'University', location: 'Kuliyapitiya & Makandura', website: 'https://wyb.ac.lk', established: 1999, hostel_monthly_lkr: 1150 },
  { institution_code: 'UWU', ugc_letter: 'U', name: 'Uva Wellassa University of Sri Lanka', type: 'University', location: 'Passara Road, Badulla', website: 'https://uwu.ac.lk', established: 2005, hostel_monthly_lkr: 1150 },
  { institution_code: 'UVPA', ugc_letter: 'Z', name: 'University of the Visual & Performing Arts', type: 'University', location: 'Horton Place, Colombo 07', website: 'https://vpa.ac.lk', established: 2005, hostel_monthly_lkr: 1650 },
  { institution_code: 'GWUIM', ugc_letter: 'P', name: 'Gampaha Wickramarachchi University of Indigenous Medicine', type: 'University', location: 'Yakkala, Gampaha', website: 'https://gwu.ac.lk', established: 2021, hostel_monthly_lkr: 1300 },
  { institution_code: 'UOV', ugc_letter: 'R', name: 'University of Vavuniya', type: 'University', location: 'Pampaimadu, Vavuniya', website: 'https://vau.ac.lk', established: 2021, hostel_monthly_lkr: 1000 },
  { institution_code: 'IIM', ugc_letter: 'A', name: 'Institute of Indigenous Medicine', type: 'Institute', location: 'Rajagiriya, Colombo', website: 'https://iim.cmb.ac.lk', established: 1977, hostel_monthly_lkr: 1450 },
  { institution_code: 'UCSC', ugc_letter: 'T', name: 'University of Colombo School of Computing', type: 'Institute', location: 'Reid Avenue, Colombo 07', website: 'https://ucsc.cmb.ac.lk', established: 2002, hostel_monthly_lkr: 1700 },
  { institution_code: 'SPC', ugc_letter: 'S', name: 'Sri Palee Campus', type: 'Campus', location: 'Wewala, Horana', website: 'https://spc.cmb.ac.lk', established: 1996, hostel_monthly_lkr: 1200 },
  { institution_code: 'TC', ugc_letter: 'W', name: 'Trincomalee Campus, Eastern University', type: 'Campus', location: 'Konesapuri, Trincomalee', website: 'https://tc.esn.ac.lk', established: 1993, hostel_monthly_lkr: 1050 },
  { institution_code: 'SVIAS', ugc_letter: 'Y', name: 'Swami Vipulananda Institute of Aesthetic Studies', type: 'Institute', location: 'Kallady, Batticaloa', website: 'https://svias.esn.ac.lk', established: 2005, hostel_monthly_lkr: 1000 },
];

export interface CourseRecord {
  course_code: string;
  name: string;
  stream: 'Biological Science' | 'Physical Science' | 'Commerce' | 'Arts' | 'Technology' | 'Other';
  faculty: string;
  degree_awarded: string;
  subject_requirements: SubjectRequirementsSpec;
  description: string;
  career_category: string;
}

export const UGC_COURSES: CourseRecord[] = [
  {
    course_code: '001',
    name: 'Medicine',
    stream: 'Biological Science',
    faculty: 'Faculty of Medicine',
    degree_awarded: 'MBBS',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry', 'Physics'],
      min_grade: 'C',
      notes: 'Requires minimum 2 C passes and 1 S pass in Biology, Chemistry, Physics at a single sitting.',
    },
    description: 'Five-year clinical degree leading to registration with the Sri Lanka Medical Council (SLMC) as a Medical Officer.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '002',
    name: 'Dental Surgery',
    stream: 'Biological Science',
    faculty: 'Faculty of Dental Sciences',
    degree_awarded: 'BDS',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry', 'Physics'],
      min_grade: 'S',
    },
    description: 'Five-year clinical Dental Surgery degree producing SLMC-registered Dental Surgeons.',
    career_category: 'Medicine & Allied Health',
  },
  {
    course_code: '004',
    name: 'Agriculture',
    stream: 'Biological Science',
    faculty: 'Faculty of Agriculture',
    degree_awarded: 'BSc (Hons) in Agricultural Technology & Management',
    subject_requirements: {
      required_subjects: ['Biology', 'Chemistry'],
      any_of_subjects: ['Physics', 'Agricultural Science'],
      min_grade: 'S',
    },
    description: 'Four-year honors program in agronomy, food security, agribusiness, and crop technology.',
    career_category: 'Agriculture & Food Science',
  },
  {
    course_code: '008',
    name: 'Engineering',
    stream: 'Physical Science',
    faculty: 'Faculty of Engineering',
    degree_awarded: 'BSc (Hons) in Engineering',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'],
      min_grade: 'C',
      notes: 'Requires at least 2 C passes and 1 S pass in Combined Mathematics, Physics, and Chemistry.',
    },
    description: 'IESL-accredited Washington Accord 4-year honors engineering degree covering Computer, Civil, Electrical, Mechanical, and Electronic specializations.',
    career_category: 'Engineering & Tech',
  },
  {
    course_code: '010',
    name: 'Quantity Surveying',
    stream: 'Physical Science',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BSc (Hons) in Quantity Surveying',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
      min_grade: 'S',
    },
    description: 'IQSSL and RICS accredited construction cost management, contract administration, and project economics degree.',
    career_category: 'Architecture & Design',
  },
  {
    course_code: '012',
    name: 'Computer Science',
    stream: 'Physical Science',
    faculty: 'School of Computing / Faculty of Science',
    degree_awarded: 'BSc (Hons) in Computer Science',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
      min_grade: 'C',
      notes: 'Requires at least a C grade in Combined Mathematics or Higher Mathematics.',
    },
    description: 'Flagship computer science degree covering algorithms, AI/ML, distributed systems, and software engineering.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '013',
    name: 'Physical Science',
    stream: 'Physical Science',
    faculty: 'Faculty of Science',
    degree_awarded: 'BSc / BSc (Hons) in Physical Science',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics'],
      any_of_subjects: ['Chemistry', 'Information & Communication Technology'],
      min_grade: 'S',
    },
    description: 'Core Physical Science degree offering honors specializations in Applied Mathematics, Statistics, Physics, Data Science, and Computer Science.',
    career_category: 'Physical & Natural Sciences',
  },
  {
    course_code: '016',
    name: 'Management',
    stream: 'Commerce',
    faculty: 'Faculty of Management Studies & Commerce',
    degree_awarded: 'BSc (Hons) in Business Administration / BBM',
    subject_requirements: {
      any_of_subjects: ['Accounting', 'Business Studies', 'Economics', 'Information & Communication Technology'],
      min_grade: 'S',
    },
    description: 'Flagship management and commerce program covering Finance, Accounting, Marketing, HR, and Business Analytics.',
    career_category: 'Business & Finance',
  },
  {
    course_code: '019',
    name: 'Arts',
    stream: 'Arts',
    faculty: 'Faculty of Arts & Humanities',
    degree_awarded: 'BA / BA (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Open to candidates passing 3 approved Arts stream subjects at G.C.E. A/L.',
    },
    description: 'Comprehensive Humanities and Social Sciences degree spanning Economics, International Relations, Sociology, Geography, and Languages.',
    career_category: 'Humanities & Languages',
  },
  {
    course_code: '020',
    name: 'Law',
    stream: 'Other',
    faculty: 'Faculty of Law',
    degree_awarded: 'LLB (Hons)',
    subject_requirements: {
      min_grade: 'C',
      notes: 'Open to Arts, Commerce, Biological & Physical Science streams subject to UGC Law subject rules.',
    },
    description: 'Four-year Bachelor of Laws honors degree preparing graduates for Sri Lanka Law College bar admission and corporate legal practice.',
    career_category: 'Law & Governance',
  },
  {
    course_code: '023',
    name: 'Architecture',
    stream: 'Other',
    faculty: 'Faculty of Architecture',
    degree_awarded: 'BArch (Hons)',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Must pass the University of Moratuwa Architecture Aptitude Test.',
    },
    description: 'SLIA-accredited five-year professional Architecture degree blending spatial design, structural engineering, and urban sustainability.',
    career_category: 'Architecture & Design',
  },
  {
    course_code: '026',
    name: 'Information Technology (IT)',
    stream: 'Other',
    faculty: 'Faculty of Information Technology',
    degree_awarded: 'BSc (Hons) in Information Technology',
    subject_requirements: {
      min_grade: 'C',
      notes: 'Open to Physical Science, Biological Science, Commerce, and ICT candidates with minimum C pass in high-priority subjects.',
    },
    description: 'Industry-aligned 4-year IT honors degree focusing on cloud engineering, enterprise software, cybersecurity, and full-stack development.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '038',
    name: 'Information Systems',
    stream: 'Other',
    faculty: 'School of Computing',
    degree_awarded: 'BSc (Hons) in Information Systems',
    subject_requirements: {
      min_grade: 'C',
    },
    description: 'Bridges software engineering, enterprise systems architecture, product management, and digital business transformation.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '096',
    name: 'Artificial Intelligence',
    stream: 'Physical Science',
    faculty: 'Faculty of Information Technology',
    degree_awarded: 'BSc (Hons) in Artificial Intelligence',
    subject_requirements: {
      required_subjects: ['Combined Mathematics', 'Physics'],
      any_of_subjects: ['Chemistry', 'Information & Communication Technology'],
      min_grade: 'C',
    },
    description: 'Specialized 4-year degree in deep learning, computer vision, natural language processing, and autonomous systems.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '102',
    name: 'Engineering Technology (ET)',
    stream: 'Technology',
    faculty: 'Faculty of Technology',
    degree_awarded: 'BET (Hons)',
    subject_requirements: {
      required_subjects: ['Engineering Technology', 'Science for Technology'],
      min_grade: 'S',
    },
    description: 'Four-year Sydney Accord-aligned Bachelor of Engineering Technology honors degree in electromechanical, automotive, and civil technology.',
    career_category: 'Engineering & Tech',
  },
  {
    course_code: '103',
    name: 'Biosystems Technology (BST)',
    stream: 'Technology',
    faculty: 'Faculty of Technology',
    degree_awarded: 'BBST (Hons)',
    subject_requirements: {
      required_subjects: ['Biosystems Technology', 'Science for Technology'],
      min_grade: 'S',
    },
    description: 'Four-year honors program in food bioprocessing, environmental technology, and smart agricultural automation.',
    career_category: 'Agriculture & Food Science',
  },
  {
    course_code: '136',
    name: 'Data Science',
    stream: 'Physical Science',
    faculty: 'Faculty of Applied Sciences',
    degree_awarded: 'BSc (Hons) in Data Science',
    subject_requirements: {
      required_subjects: ['Combined Mathematics'],
      any_of_subjects: ['Physics', 'Chemistry', 'Information & Communication Technology'],
      min_grade: 'C',
    },
    description: 'Interdisciplinary degree in statistical modeling, machine learning, big data analytics, and computational data science.',
    career_category: 'IT & Computing',
  },
  {
    course_code: '140',
    name: 'Service Management',
    stream: 'Other',
    faculty: 'Faculty of Indigenous Health Sciences & Technology',
    degree_awarded: 'BSc (Hons) in Service Management',
    subject_requirements: {
      min_grade: 'S',
      notes: 'Open to all A/L streams subject to UGC general admission criteria.',
    },
    description: 'Healthcare administration, indigenous wellness service management, and hospital operations.',
    career_category: 'Management & Administration',
  },
];

export interface AdmissionOptionSeed {
  uni_code: string;
  course_code: string;
  institution_code: string;
  duration_years: number;
  medium: ('E' | 'S' | 'T')[];
  proposed_intake: number;
  aptitude_test_required: boolean;
  all_island_merit_only: boolean;
  colombo_base_z: number;
  nqc_districts?: number[];
  requires_ol_special?: boolean;
  is_suspended?: boolean;
}

export const ADMISSION_OPTIONS_SEED: AdmissionOptionSeed[] = [
  // Medicine (001) - Official UGC Letters: A=UOC, B=UOP, C=USJP, D=UOK, E=UOJ, F=UOR, G=UOM, H=EUSL, K=RUSL, L=SUSL, M=WUSL, U=UWU
  { uni_code: '001A', course_code: '001', institution_code: 'UOC', duration_years: 5, medium: ['E'], proposed_intake: 215, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.4125, requires_ol_special: true },
  { uni_code: '001B', course_code: '001', institution_code: 'UOP', duration_years: 5, medium: ['E'], proposed_intake: 220, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.2450, requires_ol_special: true },
  { uni_code: '001C', course_code: '001', institution_code: 'USJP', duration_years: 5, medium: ['E'], proposed_intake: 185, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.2850, requires_ol_special: true },
  { uni_code: '001D', course_code: '001', institution_code: 'UOK', duration_years: 5, medium: ['E'], proposed_intake: 190, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.1980, requires_ol_special: true },
  { uni_code: '001E', course_code: '001', institution_code: 'UOJ', duration_years: 5, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.0110, requires_ol_special: true },
  { uni_code: '001F', course_code: '001', institution_code: 'UOR', duration_years: 5, medium: ['E'], proposed_intake: 205, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.1140, requires_ol_special: true },
  { uni_code: '001G', course_code: '001', institution_code: 'UOM', duration_years: 5, medium: ['E'], proposed_intake: 100, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.3850, requires_ol_special: true },
  { uni_code: '001H', course_code: '001', institution_code: 'EUSL', duration_years: 5, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9540, requires_ol_special: true },
  { uni_code: '001K', course_code: '001', institution_code: 'RUSL', duration_years: 5, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9950, requires_ol_special: true },
  { uni_code: '001L', course_code: '001', institution_code: 'SUSL', duration_years: 5, medium: ['E'], proposed_intake: 150, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9820, requires_ol_special: true },
  { uni_code: '001M', course_code: '001', institution_code: 'WUSL', duration_years: 5, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 2.0450, requires_ol_special: true },
  { uni_code: '001U', course_code: '001', institution_code: 'UWU', duration_years: 5, medium: ['E'], proposed_intake: 100, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9420, requires_ol_special: true },

  // Dental Surgery (002)
  { uni_code: '002B', course_code: '002', institution_code: 'UOP', duration_years: 5, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9450, requires_ol_special: true },

  // Agriculture (004)
  { uni_code: '004B', course_code: '004', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 260, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5420 },
  { uni_code: '004F', course_code: '004', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 210, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3850 },
  { uni_code: '004E', course_code: '004', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2950 },

  // Engineering (008) - Official UGC Letters: G=UOM, B=UOP, F=UOR, E=UOJ, C=USJP, J=SEUSL
  { uni_code: '008G', course_code: '008', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 900, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9850, requires_ol_special: true },
  { uni_code: '008B', course_code: '008', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 465, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7620, requires_ol_special: true },
  { uni_code: '008F', course_code: '008', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 525, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5940, requires_ol_special: true },
  { uni_code: '008E', course_code: '008', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 245, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4610, requires_ol_special: true },
  { uni_code: '008C', course_code: '008', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 180, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7150, requires_ol_special: true },
  { uni_code: '008J', course_code: '008', institution_code: 'SEUSL', duration_years: 4, medium: ['E'], proposed_intake: 160, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3890, requires_ol_special: true },

  // Quantity Surveying (010)
  { uni_code: '010G', course_code: '010', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 155, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5240, requires_ol_special: true },

  // Computer Science (012) - Official UGC Letters: T=UCSC, C=USJP, D=UOK, E=UOJ, F=UOR, W=TC
  { uni_code: '012T', course_code: '012', institution_code: 'UCSC', duration_years: 3, medium: ['E'], proposed_intake: 255, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7240, requires_ol_special: true },
  { uni_code: '012C', course_code: '012', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6450, requires_ol_special: true },
  { uni_code: '012D', course_code: '012', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 95, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5680, requires_ol_special: true },
  { uni_code: '012E', course_code: '012', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3920, requires_ol_special: true },
  { uni_code: '012F', course_code: '012', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4810, requires_ol_special: true },
  { uni_code: '012W', course_code: '012', institution_code: 'TC', duration_years: 3, medium: ['E'], proposed_intake: 95, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2840, nqc_districts: [11, 14], requires_ol_special: true },

  // Physical Science (013)
  { uni_code: '013A', course_code: '013', institution_code: 'UOC', duration_years: 3, medium: ['E', 'S'], proposed_intake: 325, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4850 },
  { uni_code: '013B', course_code: '013', institution_code: 'UOP', duration_years: 3, medium: ['E', 'S'], proposed_intake: 340, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3100 },
  { uni_code: '013C', course_code: '013', institution_code: 'USJP', duration_years: 3, medium: ['E', 'S'], proposed_intake: 360, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3650 },
  { uni_code: '013D', course_code: '013', institution_code: 'UOK', duration_years: 3, medium: ['E', 'S'], proposed_intake: 310, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2450 },
  { uni_code: '013E', course_code: '013', institution_code: 'UOJ', duration_years: 3, medium: ['E', 'T'], proposed_intake: 250, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 0.9850, nqc_districts: [23] },
  { uni_code: '013F', course_code: '013', institution_code: 'UOR', duration_years: 3, medium: ['E', 'S'], proposed_intake: 290, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.1420 },

  // Management (016)
  { uni_code: '016A', course_code: '016', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 615, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8120 },
  { uni_code: '016C', course_code: '016', institution_code: 'USJP', duration_years: 4, medium: ['E', 'S'], proposed_intake: 1210, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8640 },
  { uni_code: '016D', course_code: '016', institution_code: 'UOK', duration_years: 4, medium: ['E', 'S'], proposed_intake: 680, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6950 },
  { uni_code: '016B', course_code: '016', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 260, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6520 },

  // Arts (019) — All-Island Merit Only per UGC rules
  { uni_code: '019A', course_code: '019', institution_code: 'UOC', duration_years: 3, medium: ['E', 'S', 'T'], proposed_intake: 720, aptitude_test_required: false, all_island_merit_only: true, colombo_base_z: 1.5420 },
  { uni_code: '019B', course_code: '019', institution_code: 'UOP', duration_years: 3, medium: ['E', 'S', 'T'], proposed_intake: 950, aptitude_test_required: false, all_island_merit_only: true, colombo_base_z: 1.4880 },
  { uni_code: '019D', course_code: '019', institution_code: 'UOK', duration_years: 3, medium: ['E', 'S'], proposed_intake: 890, aptitude_test_required: false, all_island_merit_only: true, colombo_base_z: 1.4410 },

  // Law (020)
  { uni_code: '020A', course_code: '020', institution_code: 'UOC', duration_years: 4, medium: ['E', 'S', 'T'], proposed_intake: 315, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.9120, requires_ol_special: true },
  { uni_code: '020B', course_code: '020', institution_code: 'UOP', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8250, requires_ol_special: true },
  { uni_code: '020E', course_code: '020', institution_code: 'UOJ', duration_years: 4, medium: ['E', 'T'], proposed_intake: 105, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.7410, requires_ol_special: true },

  // Architecture (023) — Aptitude Test Required
  { uni_code: '023G', course_code: '023', institution_code: 'UOM', duration_years: 5, medium: ['E'], proposed_intake: 100, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.4250, requires_ol_special: true },

  // Information Technology (026)
  { uni_code: '026G', course_code: '026', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 250, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6890, requires_ol_special: true },

  // Information Systems (038)
  { uni_code: '038T', course_code: '038', institution_code: 'UCSC', duration_years: 3, medium: ['E'], proposed_intake: 120, aptitude_test_required: true, all_island_merit_only: false, colombo_base_z: 1.5120, requires_ol_special: true },
  { uni_code: '038C', course_code: '038', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 115, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4950, requires_ol_special: true },

  // Artificial Intelligence (096)
  { uni_code: '096G', course_code: '096', institution_code: 'UOM', duration_years: 4, medium: ['E'], proposed_intake: 75, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.8150, nqc_districts: [12, 14], requires_ol_special: true },

  // Data Science (136)
  { uni_code: '136L', course_code: '136', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 80, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6250, requires_ol_special: true },

  // Engineering Technology (102)
  { uni_code: '102A', course_code: '102', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 125, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6850 },
  { uni_code: '102C', course_code: '102', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 205, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.6420 },
  { uni_code: '102D', course_code: '102', institution_code: 'UOK', duration_years: 4, medium: ['E'], proposed_intake: 165, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5480 },
  { uni_code: '102E', course_code: '102', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3450 },
  { uni_code: '102F', course_code: '102', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 175, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.4620 },
  { uni_code: '102K', course_code: '102', institution_code: 'RUSL', duration_years: 4, medium: ['E'], proposed_intake: 150, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3180, nqc_districts: [1, 14] },
  { uni_code: '102L', course_code: '102', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 130, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3520 },
  { uni_code: '102M', course_code: '102', institution_code: 'WUSL', duration_years: 4, medium: ['E'], proposed_intake: 160, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3840 },
  { uni_code: '102U', course_code: '102', institution_code: 'UWU', duration_years: 4, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2950 },

  // Biosystems Technology (103)
  { uni_code: '103A', course_code: '103', institution_code: 'UOC', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5450 },
  { uni_code: '103C', course_code: '103', institution_code: 'USJP', duration_years: 4, medium: ['E'], proposed_intake: 140, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.5120 },
  { uni_code: '103E', course_code: '103', institution_code: 'UOJ', duration_years: 4, medium: ['E'], proposed_intake: 115, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3120 },
  { uni_code: '103F', course_code: '103', institution_code: 'UOR', duration_years: 4, medium: ['E'], proposed_intake: 135, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3740 },
  { uni_code: '103H', course_code: '103', institution_code: 'EUSL', duration_years: 4, medium: ['E'], proposed_intake: 110, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2450 },
  { uni_code: '103J', course_code: '103', institution_code: 'SEUSL', duration_years: 4, medium: ['E'], proposed_intake: 105, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2210 },
  { uni_code: '103K', course_code: '103', institution_code: 'RUSL', duration_years: 4, medium: ['E'], proposed_intake: 125, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2650 },
  { uni_code: '103L', course_code: '103', institution_code: 'SUSL', duration_years: 4, medium: ['E'], proposed_intake: 120, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2810 },
  { uni_code: '103M', course_code: '103', institution_code: 'WUSL', duration_years: 4, medium: ['E'], proposed_intake: 130, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.3150 },
  { uni_code: '103U', course_code: '103', institution_code: 'UWU', duration_years: 4, medium: ['E'], proposed_intake: 115, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.2720 },

  // Suspended Course (GWUIM 140P) for Section 5.3 & Suspension Guards
  { uni_code: '140P', course_code: '140', institution_code: 'GWUIM', duration_years: 4, medium: ['E'], proposed_intake: 0, aptitude_test_required: false, all_island_merit_only: false, colombo_base_z: 1.1500, is_suspended: true },
];

export interface ProgramCutoffViewRow {
  uni_code: string;
  course_code: string;
  course_name: string;
  stream: string;
  faculty: string;
  degree_awarded: string;
  subject_requirements: SubjectRequirementsSpec;
  course_description: string;
  career_category: string;
  institution_code: string;
  institution_name: string;
  institution_type: string;
  institution_location: string;
  institution_website: string;
  duration_years: number;
  medium: ('E' | 'S' | 'T')[];
  proposed_intake: number;
  aptitude_test_required: boolean;
  all_island_merit_only: boolean;
  district_id: number;
  district_name: string;
  academic_year: string;
  min_z_score: number | null;
  status: 'QUALIFIED' | 'NQC';
  all_island_min_z: number;
  all_island_max_z: number;
  requires_ol_special?: boolean;
  is_suspended?: boolean;
}

export function buildProgramCutoffRowsForDistrict(districtId: number): ProgramCutoffViewRow[] {
  const district = SRI_LANKA_DISTRICTS.find((d) => d.district_id === districtId) ?? SRI_LANKA_DISTRICTS[0];

  return ADMISSION_OPTIONS_SEED.map((opt) => {
    const course = UGC_COURSES.find((c) => c.course_code === opt.course_code)!;
    const inst = UGC_INSTITUTIONS.find((i) => i.institution_code === opt.institution_code)!;
    const isNqc = opt.nqc_districts?.includes(districtId) ?? false;

    const computedZ = opt.all_island_merit_only
      ? opt.colombo_base_z
      : Number((opt.colombo_base_z + district.difficulty_offset).toFixed(4));

    return {
      uni_code: opt.uni_code,
      course_code: opt.course_code,
      course_name: course.name,
      stream: course.stream,
      faculty: course.faculty,
      degree_awarded: course.degree_awarded,
      subject_requirements: course.subject_requirements,
      course_description: course.description,
      career_category: course.career_category,
      institution_code: inst.institution_code,
      institution_name: inst.name,
      institution_type: inst.type,
      institution_location: inst.location,
      institution_website: inst.website,
      duration_years: opt.duration_years,
      medium: opt.medium,
      proposed_intake: opt.proposed_intake,
      aptitude_test_required: opt.aptitude_test_required,
      all_island_merit_only: opt.all_island_merit_only,
      district_id: district.district_id,
      district_name: district.district_name,
      academic_year: '2024/2025',
      min_z_score: isNqc ? null : computedZ,
      status: isNqc ? 'NQC' : 'QUALIFIED',
      all_island_min_z: Number((opt.colombo_base_z - 0.24).toFixed(4)),
      all_island_max_z: opt.colombo_base_z,
      requires_ol_special: opt.requires_ol_special ?? false,
      is_suspended: opt.is_suspended ?? false,
    };
  });
}

export interface NonStatePathway {
  id: string;
  institute_name: string;
  institute_abbr: string;
  degree_title: string;
  stream_eligible: string[];
  duration_years: number;
  ifsls_loan_eligible: boolean;
  ugc_recognized: boolean;
  mohe_dai: boolean;
  tvec_nvq_level: string | null;
  tuition_note_lkr: string;
  location: string;
  website: string;
}

export const NON_STATE_IFSLS_PATHWAYS: NonStatePathway[] = [
  {
    id: 'ifsls-sliit-se',
    institute_name: 'Sri Lanka Institute of Information Technology (SLIIT)',
    institute_abbr: 'SLIIT',
    degree_title: 'BSc (Hons) in Information Technology (Specializing in Software Engineering)',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Arts'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'LKR 0 Upfront under MOHE IFSLS (Repaid over 7 yrs post-graduation) or LKR 310,000/semester',
    location: 'Malabe / Colombo / Kandy / Jaffna',
    website: 'https://www.sliit.lk',
  },
  {
    id: 'ifsls-nsbm-cs',
    institute_name: 'NSBM Green University',
    institute_abbr: 'NSBM',
    degree_title: 'BSc (Hons) in Computer Science / Data Science (MOHE Approved)',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Eligible for LKR 1.1M MOHE Interest-Free Loan + LKR 300,000 Stipend',
    location: 'Pitipana, Homagama',
    website: 'https://www.nsbm.ac.lk',
  },
  {
    id: 'ifsls-cinec-eng',
    institute_name: 'CINEC Campus',
    institute_abbr: 'CINEC',
    degree_title: 'BSc (Hons) in Engineering (Civil / Automotive / Mechatronics)',
    stream_eligible: ['Physical Science', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: 'NVQ Level 7',
    tuition_note_lkr: '100% Interest-Free Government Loan via studentloans.mohe.gov.lk',
    location: 'Millennium Drive, Malabe',
    website: 'https://www.cinec.edu',
  },
  {
    id: 'ifsls-horizon-biotech',
    institute_name: 'Horizon Campus',
    institute_abbr: 'HORIZON',
    degree_title: 'BSc (Hons) in Biotechnology',
    stream_eligible: ['Biological Science', 'Technology'],
    duration_years: 4,
    ifsls_loan_eligible: true,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: null,
    tuition_note_lkr: 'Full Tuition Covered under MOHE IFSLS Scheme',
    location: 'Knowledge City, Malabe',
    website: 'https://www.horizoncampus.edu.lk',
  },
  {
    id: 'tvec-sliate-hndit',
    institute_name: 'Sri Lanka Institute of Advanced Technological Education (SLIATE)',
    institute_abbr: 'SLIATE',
    degree_title: 'Higher National Diploma in Information Technology (HNDIT) & HNDE',
    stream_eligible: ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Arts'],
    duration_years: 3,
    ifsls_loan_eligible: false,
    ugc_recognized: false,
    mohe_dai: true,
    tvec_nvq_level: 'NVQ Level 6',
    tuition_note_lkr: '100% Tuition-Free State Higher National Diploma + Mahapola/Bursary',
    location: 'Dehiwala, Colombo, Kandy, Galle, Jaffna (19 ATIs)',
    website: 'http://www.sliate.ac.lk',
  },
  {
    id: 'tvec-univotec-btech',
    institute_name: 'University of Vocational Technology (UoVT)',
    institute_abbr: 'UoVT',
    degree_title: 'BTech in Software Technology / Building Services / Food Process Technology',
    stream_eligible: ['Technology', 'Physical Science', 'Biological Science'],
    duration_years: 4,
    ifsls_loan_eligible: false,
    ugc_recognized: true,
    mohe_dai: true,
    tvec_nvq_level: 'NVQ Level 7',
    tuition_note_lkr: 'State NVQ Level 7 Degree (Free Weekday Intake for A/L & NVQ qualifiers)',
    location: 'Ratmalana',
    website: 'https://uovt.ac.lk',
  },
];

export interface CareerAtlasItem {
  id: string;
  role_title: string;
  category: string;
  klimov_type: 'Human-Tech' | 'Human-Sign/Data' | 'Human-Nature' | 'Human-Human' | 'Human-Art';
  riasec_code: string;
  entry_salary_lkr: string;
  mid_salary_lkr: string;
  demand_trend: 'High Growth' | 'Stable Core' | 'Global Remote & Local';
  state_uni_codes: string[];
  backup_pathways: string[];
  summary: string;
}

export const CAREER_ATLAS: CareerAtlasItem[] = [
  {
    id: 'software-engineer',
    role_title: 'Software Engineer / Cloud Architect',
    category: 'IT & Computing',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'IRC',
    entry_salary_lkr: 'LKR 140,000 – 260,000 / mo',
    mid_salary_lkr: 'LKR 450,000 – 950,000 / mo',
    demand_trend: 'Global Remote & Local',
    state_uni_codes: ['012T', '008G', '026G', '012C', '038T'],
    backup_pathways: ['SLIIT BSc (Hons) SE (IFSLS)', 'NSBM BSc CS (IFSLS)', 'SLIATE HNDIT (NVQ 6)'],
    summary: 'Designs and builds distributed applications, fintech platforms, and cloud systems for Colombo tech exporters and global engineering teams.',
  },
  {
    id: 'ai-data-scientist',
    role_title: 'AI & Machine Learning Engineer',
    category: 'IT & Computing',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'IRA',
    entry_salary_lkr: 'LKR 165,000 – 310,000 / mo',
    mid_salary_lkr: 'LKR 520,000 – 1,100,000 / mo',
    demand_trend: 'High Growth',
    state_uni_codes: ['096G', '012T', '008G', '136L', '013A'],
    backup_pathways: ['NSBM BSc Data Science (IFSLS)', 'SLIIT BSc AI & Data Science'],
    summary: 'Builds predictive models, LLM agents, and computer vision pipelines across healthcare, banking, and export software.',
  },
  {
    id: 'medical-officer',
    role_title: 'Medical Officer / Consultant Specialist',
    category: 'Medicine & Allied Health',
    klimov_type: 'Human-Human',
    riasec_code: 'ISR',
    entry_salary_lkr: 'LKR 165,000 – 240,000 / mo',
    mid_salary_lkr: 'LKR 380,000 – 850,000+ / mo',
    demand_trend: 'Stable Core',
    state_uni_codes: ['001A', '001B', '001C', '001D', '001E', '001F', '001G'],
    backup_pathways: ['KDU MBBS (Fee-levying)', 'Horizon BSc Biotechnology (IFSLS)'],
    summary: 'SLMC-registered clinical physician serving in Ministry of Health teaching hospitals and private specialist practice.',
  },
  {
    id: 'chartered-engineer',
    role_title: 'Chartered Engineer (Civil / Electrical / Mechanical)',
    category: 'Engineering & Tech',
    klimov_type: 'Human-Tech',
    riasec_code: 'RIC',
    entry_salary_lkr: 'LKR 115,000 – 195,000 / mo',
    mid_salary_lkr: 'LKR 320,000 – 650,000 / mo',
    demand_trend: 'High Growth',
    state_uni_codes: ['008G', '008B', '008F', '008C', '102A'],
    backup_pathways: ['CINEC BSc Engineering (IFSLS)', 'UoVT BTech (NVQ 7)', 'SLIATE HNDE'],
    summary: 'Plans and executes national renewable energy grids, infrastructure, industrial automation, and manufacturing systems.',
  },
  {
    id: 'quantity-surveyor',
    role_title: 'Chartered Quantity Surveyor',
    category: 'Architecture & Design',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'CEI',
    entry_salary_lkr: 'LKR 110,000 – 185,000 / mo',
    mid_salary_lkr: 'LKR 350,000 – 900,000 / mo (MENA/SL)',
    demand_trend: 'Global Remote & Local',
    state_uni_codes: ['010G', '023G'],
    backup_pathways: ['SLIIT BSc Quantity Surveying', 'CINEC Construction Management'],
    summary: 'Manages construction contracts, cost estimation, and arbitration in Sri Lanka and Middle East/UK infrastructure projects.',
  },
  {
    id: 'chartered-accountant-fin',
    role_title: 'Financial Analyst / Chartered Accountant',
    category: 'Business & Finance',
    klimov_type: 'Human-Sign/Data',
    riasec_code: 'CEI',
    entry_salary_lkr: 'LKR 95,000 – 160,000 / mo',
    mid_salary_lkr: 'LKR 290,000 – 620,000 / mo',
    demand_trend: 'Stable Core',
    state_uni_codes: ['016C', '016A', '016D', '016B'],
    backup_pathways: ['CA Sri Lanka / CIMA / ACCA', 'NSBM BBM Finance (IFSLS)'],
    summary: 'Leads corporate finance, investment banking, auditing, and treasury operations across CSE-listed conglomerates.',
  },
  {
    id: 'agritech-food-scientist',
    role_title: 'Food Technologist & Biosystems Specialist',
    category: 'Agriculture & Food Science',
    klimov_type: 'Human-Nature',
    riasec_code: 'IRS',
    entry_salary_lkr: 'LKR 90,000 – 145,000 / mo',
    mid_salary_lkr: 'LKR 240,000 – 480,000 / mo',
    demand_trend: 'High Growth',
    state_uni_codes: ['004B', '004F', '103A', '103C'],
    backup_pathways: ['Horizon BSc Biotechnology (IFSLS)', 'UoVT BTech Food Process Technology'],
    summary: 'Drives value-added food export quality, tea/spice biotechnology, and precision agriculture.',
  },
  {
    id: 'legal-counsel',
    role_title: 'Attorney-at-Law & Corporate Legal Counsel',
    category: 'Law & Governance',
    klimov_type: 'Human-Human',
    riasec_code: 'ESC',
    entry_salary_lkr: 'LKR 95,000 – 170,000 / mo',
    mid_salary_lkr: 'LKR 310,000 – 750,000 / mo',
    demand_trend: 'Stable Core',
    state_uni_codes: ['020A', '020B', '020E', '019A'],
    backup_pathways: ['Sri Lanka Law College Direct Entrance Exam', 'OUSL LLB (Hons)'],
    summary: 'Represents clients in commercial litigation, intellectual property, constitutional law, and corporate governance.',
  },
];

export interface CampusReviewItem {
  id: string;
  institution_code: string;
  uni_code: string;
  student_name: string;
  student_email: string;
  academic_rating: number;
  hostel_cost_lkr: number;
  mahapola_rating: number;
  campus_life_rating: number;
  employability_rating: number;
  comment: string;
  verified_ac_lk: boolean;
  created_at: string;
}

export const INITIAL_CAMPUS_REVIEWS: CampusReviewItem[] = [
  {
    id: 'rev-1',
    institution_code: 'UOM',
    uni_code: '008G',
    student_name: 'Kavindu Perera',
    student_email: 'kavindu.21@cse.mrt.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1800,
    mahapola_rating: 5,
    campus_life_rating: 5,
    employability_rating: 5,
    comment: 'CSE and ENTC industry placements are unmatched in Sri Lanka. Internal hostels cost under LKR 2,000/yr while outside boarding in Katubedda averages LKR 12,000–16,000/month.',
    verified_ac_lk: true,
    created_at: '2026-09-14',
  },
  {
    id: 'rev-2',
    institution_code: 'UCSC',
    uni_code: '012T',
    student_name: 'Tharushi Wijesinghe',
    student_email: '2022cs142@stu.ucsc.cmb.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1700,
    mahapola_rating: 4,
    campus_life_rating: 5,
    employability_rating: 5,
    comment: 'Located right at Reid Avenue in Colombo 07. Strong hackathon culture and 3rd-year industrial training places almost 100% of the batch before graduation.',
    verified_ac_lk: true,
    created_at: '2026-10-02',
  },
  {
    id: 'rev-3',
    institution_code: 'UOP',
    uni_code: '013B',
    student_name: 'Nadeesha Ekanayake',
    student_email: 's19412@sci.pdn.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1200,
    mahapola_rating: 5,
    campus_life_rating: 5,
    employability_rating: 4,
    comment: 'Almost 85% of outstation students receive residential hall facilities inside Peradeniya campus at nominal cost. Ideal environment for Statistics and CS honors.',
    verified_ac_lk: true,
    created_at: '2026-10-19',
  },
  {
    id: 'rev-4',
    institution_code: 'USJP',
    uni_code: '016C',
    student_name: 'Shenal Fernando',
    student_email: 'mgt21890@sjp.ac.lk',
    academic_rating: 5,
    hostel_cost_lkr: 1600,
    mahapola_rating: 4,
    campus_life_rating: 4,
    employability_rating: 5,
    comment: 'FMSC Jayewardenepura has direct exemptions for CA Sri Lanka, CIMA, and ACCA. Balancing degree lectures with professional exams in Year 3 is very well supported.',
    verified_ac_lk: true,
    created_at: '2026-10-25',
  },
];

export interface QnAThreadItem {
  id: string;
  institution_code: string;
  uni_code: string;
  asked_by: string;
  question: string;
  answer: string;
  answered_by_role: string;
  verified_ambassador: boolean;
  created_at: string;
}

export const INITIAL_QNA_THREADS: QnAThreadItem[] = [
  {
    id: 'qna-1',
    institution_code: 'UOM',
    uni_code: '008G',
    asked_by: 'A/L 2025 Physical Science Student (Gampaha)',
    question: 'How is the Engineering specialization (CSE vs ENTC vs Civil) decided at Moratuwa?',
    answer: 'All 008G students complete a common Semester 1 foundation. Field selection at the end of Semester 1 is 100% merit-based on your Semester 1 GPA, not your A/L Z-score!',
    answered_by_role: 'Final Year CSE Undergrad · UOM Campus Rep',
    verified_ambassador: true,
    created_at: '2026-10-12',
  },
  {
    id: 'qna-2',
    institution_code: 'UCSC',
    uni_code: '012T',
    asked_by: 'A/L Physical Science Applicant (Kandy)',
    question: 'Does UCSC 012T award a 3-year general degree or a 4-year Honors degree?',
    answer: 'Everyone enters the 3-year BSc in Computer Science track first. Based on your Year 1 & Year 2 GPA (typically top 40–50%), you are selected for the 4th-year BSc (Hons) in Computer Science or Software Engineering.',
    answered_by_role: '4th Year CS (Hons) Undergrad · UCSC Ambassador',
    verified_ambassador: true,
    created_at: '2026-10-20',
  },
  {
    id: 'qna-3',
    institution_code: 'UOC',
    uni_code: '013A',
    asked_by: 'A/L Student (Matara)',
    question: 'Why did the simulator warn me when I put 013B (Peradeniya) above 013A (Colombo)?',
    answer: 'Because the UGC computer algorithm checks your #1 choice first! If your Z-score clears 013B (#1), it assigns you to 013B immediately and never checks #2 (013A), even if your Z-score was high enough for Colombo.',
    answered_by_role: 'Senior Science Mentor · UOC Faculty of Science',
    verified_ambassador: true,
    created_at: '2026-10-28',
  },
];

export interface AdmissionsCalendarEvent {
  id: string;
  title: string;
  organization: string;
  window_date: string;
  status: 'OPEN_NOW' | 'UPCOMING' | 'COMPLETED';
  category: 'Exam & Results' | 'UGC Application' | 'Aptitude Test' | 'Cutoffs & Appeals' | 'IFSLS Loan';
  description: string;
  official_url: string;
}

export const ADMISSIONS_CALENDAR_EVENTS: AdmissionsCalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'G.C.E. A/L Examination Results & Official Z-Score Release',
    organization: 'Department of Examinations (doenets.lk)',
    window_date: 'May – June 2026',
    status: 'COMPLETED',
    category: 'Exam & Results',
    description: 'Official release of G.C.E. Advanced Level grades, district rank, island rank, and standardized Z-score.',
    official_url: 'https://www.doenets.lk',
  },
  {
    id: 'cal-2',
    title: 'UGC University Admissions Handbook & Online Application Window',
    organization: 'University Grants Commission (ugc.ac.lk)',
    window_date: 'June 15 – July 18, 2026',
    status: 'OPEN_NOW',
    category: 'UGC Application',
    description: 'Mandatory 3-week window to submit your ordered uni_code preference list online via ugc.ac.lk.',
    official_url: 'https://www.ugc.ac.lk',
  },
  {
    id: 'cal-3',
    title: 'UOM Architecture (023G), Design & Fashion Aptitude Tests',
    organization: 'University of Moratuwa',
    window_date: 'July 25 – August 10, 2026',
    status: 'UPCOMING',
    category: 'Aptitude Test',
    description: 'Mandatory on-campus aptitude exams required in addition to Z-score qualification.',
    official_url: 'https://uom.lk/admissions',
  },
  {
    id: 'cal-4',
    title: 'Official 1st Round 25-District UGC Cutoff Marks Release',
    organization: 'University Grants Commission (ugc.ac.lk)',
    window_date: 'September 2026',
    status: 'UPCOMING',
    category: 'Cutoffs & Appeals',
    description: 'Release of 25-district minimum Z-score cutoffs across all 129 degree programs.',
    official_url: 'https://www.ugc.ac.lk/cutoffs',
  },
  {
    id: 'cal-5',
    title: 'MOHE Interest-Free Student Loan Scheme (IFSLS) Intake 9',
    organization: 'Ministry of Higher Education (studentloans.mohe.gov.lk)',
    window_date: 'October – November 2026',
    status: 'UPCOMING',
    category: 'IFSLS Loan',
    description: 'Government 100% interest-free loan scheme for students who missed state university cutoffs (up to LKR 1.1M + LKR 300K stipend).',
    official_url: 'https://studentloans.mohe.gov.lk',
  },
  {
    id: 'cal-6',
    title: 'UGC 2nd Round Vacancy Promotion & Registration Deadlines',
    organization: 'University Grants Commission & All State Universities',
    window_date: 'November – December 2026',
    status: 'UPCOMING',
    category: 'Cutoffs & Appeals',
    description: 'Automatic upgrading to higher preference courses based on dropouts and vacancy allocations.',
    official_url: 'https://www.ugc.ac.lk',
  },
];
