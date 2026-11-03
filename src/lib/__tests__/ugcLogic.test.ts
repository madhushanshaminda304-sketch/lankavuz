import { describe, it, expect } from 'vitest';
import {
  classifyProgramMatch,
  auditPreferenceOrder,
  optimizePreferenceOrder,
  estimateZScoreFromGrades,
  checkSubjectEligibility,
} from '../ugcLogic';
import {
  fetchProgramCutoffsByDistrict,
  matchEligibleProgramsRpc,
  normalizeProgramCutoffRow,
} from '../../services/ugcDataService';

describe('ugcLogic — Sri Lankan UGC Z-Score & Preference Order Engine', () => {
  it('never treats NULL / NQC min_z_score as 0.0000', () => {
    const result = classifyProgramMatch({
      studentZ: 1.52,
      minZScore: null,
      status: 'NQC',
      allIslandMeritOnly: false,
    });
    expect(result.tier).toBe('NQC');
    expect(result.margin).toBeNull();
  });

  it('classifies SAFE (>= +0.0500), TARGET (-0.0500 to +0.0499), and REACH (-0.2000 to -0.0501) accurately', () => {
    const safe = classifyProgramMatch({
      studentZ: 1.52,
      minZScore: 1.4125,
      status: 'QUALIFIED',
      allIslandMeritOnly: false,
    });
    expect(safe.tier).toBe('SAFE');
    expect(safe.margin).toBeCloseTo(0.1075, 4);

    const target = classifyProgramMatch({
      studentZ: 1.4,
      minZScore: 1.425,
      status: 'QUALIFIED',
      allIslandMeritOnly: false,
    });
    expect(target.tier).toBe('TARGET');
    expect(target.margin).toBeCloseTo(-0.025, 4);

    const reach = classifyProgramMatch({
      studentZ: 1.3,
      minZScore: 1.45,
      status: 'QUALIFIED',
      allIslandMeritOnly: false,
    });
    expect(reach.tier).toBe('REACH');
    expect(reach.margin).toBeCloseTo(-0.15, 4);
  });

  it('detects Preference Order Conflicts when a lower-cutoff safety course is placed above a higher-cutoff dream course', () => {
    const preferences = [
      { uni_code: '013B', course_name: 'Physical Science', institution_code: 'UOP', min_z_score: 1.31, locked: false },
      { uni_code: '013A', course_name: 'Physical Science', institution_code: 'UOC', min_z_score: 1.485, locked: false },
    ];
    const conflicts = auditPreferenceOrder(preferences);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].upperIndex).toBe(0);
    expect(conflicts[0].lowerIndex).toBe(1);
    expect(conflicts[0].upperUniCode).toBe('013B');
    expect(conflicts[0].lowerUniCode).toBe('013A');
  });

  it('auto-optimizes preference order by descending Z-score while respecting locked hometown overrides', () => {
    const preferences = [
      { uni_code: '013B', course_name: 'Physical Science', institution_code: 'UOP', min_z_score: 1.31, locked: false },
      { uni_code: '008G', course_name: 'Engineering', institution_code: 'UOM', min_z_score: 1.985, locked: false },
      { uni_code: '013C', course_name: 'Physical Science', institution_code: 'UOJ', min_z_score: 1.12, locked: true },
      { uni_code: '013A', course_name: 'Physical Science', institution_code: 'UOC', min_z_score: 1.485, locked: false },
    ];
    const optimized = optimizePreferenceOrder(preferences);
    expect(optimized[0].uni_code).toBe('008G');
    expect(optimized[1].uni_code).toBe('013A');
    expect(optimized[2].uni_code).toBe('013C'); // Locked at index 2
    expect(optimized[3].uni_code).toBe('013B');
  });

  it('estimates realistic Z-score from 3 A/L grades and stream', () => {
    const highZ = estimateZScoreFromGrades(['A', 'A', 'A'], 'Physical Science');
    const midZ = estimateZScoreFromGrades(['B', 'B', 'C'], 'Physical Science');
    expect(highZ).toBeGreaterThan(1.7);
    expect(midZ).toBeGreaterThan(0.7);
    expect(highZ).toBeGreaterThan(midZ);
  });

  it('validates 3-subject eligibility and minimum Common General Test (>= 30%)', () => {
    const passCheck = checkSubjectEligibility(
      [
        { subject: 'Combined Mathematics', grade: 'A' },
        { subject: 'Physics', grade: 'B' },
        { subject: 'Chemistry', grade: 'B' },
      ],
      65,
      { required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'], min_grade: 'C' }
    );
    expect(passCheck.eligible).toBe(true);

    const failCgt = checkSubjectEligibility(
      [
        { subject: 'Combined Mathematics', grade: 'A' },
        { subject: 'Physics', grade: 'A' },
        { subject: 'Chemistry', grade: 'A' },
      ],
      24,
      { required_subjects: ['Combined Mathematics', 'Physics', 'Chemistry'], min_grade: 'C' }
    );
    expect(failCgt.eligible).toBe(false);
    expect(failCgt.reason).toContain('Common General Test');
  });

  it('returns deterministic 25-district offline snapshot rows and RPC matches without live DB credentials', async () => {
    const colomboRows = await fetchProgramCutoffsByDistrict(1);
    expect(colomboRows.length).toBeGreaterThanOrEqual(40);
    const nqcRow = colomboRows.find((r) => r.status === 'NQC');
    expect(nqcRow).toBeDefined();
    expect(nqcRow?.min_z_score).toBeNull();

    const matches = await matchEligibleProgramsRpc({
      p_district_id: 1,
      p_student_z: 1.52,
      p_stream: 'Physical Science',
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => m.stream === 'Physical Science' || m.stream === 'Other')).toBe(true);
  });

  it('normalizes both live Supabase SQL view columns and offline snapshot columns seamlessly', () => {
    // 1. Live Supabase v_program_cutoffs schema
    const supabaseRow = {
      uni_code: '008G',
      course_name_exact: 'Engineering',
      institution_code: 'UOM',
      institution_name_official: 'University of Moratuwa',
      stream: 'Physical Science',
      intake_capacity: '450',
      all_island_merit_only: false,
      requires_aptitude_test: false,
      z_score_numeric: '1.9850',
      cutoff_status: 'QUALIFIED',
      district_id: '1',
      district_name: 'Colombo',
      requires_special_ol: true,
      intake_suspended: false,
    };
    const normSupabase = normalizeProgramCutoffRow(supabaseRow);
    expect(normSupabase.uni_code).toBe('008G');
    expect(normSupabase.course_name).toBe('Engineering');
    expect(normSupabase.min_z_score).toBe(1.985);
    expect(normSupabase.status).toBe('QUALIFIED');
    expect(normSupabase.requires_ol_special).toBe(true);
    expect(normSupabase.is_suspended).toBe(false);

    // 2. Suspended course row
    const suspendedRow = {
      uni_code: '140P',
      course_name_exact: 'Service Management',
      institution_code: 'GWUIM',
      z_score_numeric: null,
      cutoff_status: 'NQC',
      intake_suspended: true,
    };
    const normSuspended = normalizeProgramCutoffRow(suspendedRow);
    expect(normSuspended.uni_code).toBe('140P');
    expect(normSuspended.is_suspended).toBe(true);
    expect(normSuspended.status).toBe('NQC');
    expect(normSuspended.min_z_score).toBeNull();

    // 3. Snapshot seed format
    const snapshotRow = {
      uni_code: '012T',
      course_name: 'Information Technology',
      institution_code: 'UCSC',
      min_z_score: 1.542,
      status: 'QUALIFIED',
      requires_ol_special: false,
      is_suspended: false,
    };
    const normSnapshot = normalizeProgramCutoffRow(snapshotRow);
    expect(normSnapshot.uni_code).toBe('012T');
    expect(normSnapshot.min_z_score).toBe(1.542);
    expect(normSnapshot.status).toBe('QUALIFIED');
    expect(normSnapshot.requires_ol_special).toBe(false);
    expect(normSnapshot.is_suspended).toBe(false);
  });
});
