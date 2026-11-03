import { describe, it, expect } from 'vitest';
import {
  I18N_DICT,
  type LanguageCode,
  getLocalizedDistrictName,
  isValidLanguageCode,
} from '../i18n';
import { SRI_LANKA_DISTRICTS } from '../../data/sriLankaUgcSnapshot';

describe('i18n Dictionary & Localization Engine', () => {
  it('validates supported language codes', () => {
    expect(isValidLanguageCode('EN')).toBe(true);
    expect(isValidLanguageCode('SI')).toBe(true);
    expect(isValidLanguageCode('TA')).toBe(true);
    expect(isValidLanguageCode('FR')).toBe(false);
    expect(isValidLanguageCode('')).toBe(false);
  });

  it('guarantees key parity across EN, SI, and TA dictionaries', () => {
    const enKeys = Object.keys(I18N_DICT.EN).sort();
    const siKeys = Object.keys(I18N_DICT.SI).sort();
    const taKeys = Object.keys(I18N_DICT.TA).sort();

    expect(siKeys).toEqual(enKeys);
    expect(taKeys).toEqual(enKeys);

    // Ensure every single translation is a non-empty string
    for (const key of enKeys) {
      expect(I18N_DICT.EN[key]?.trim().length).toBeGreaterThan(0);
      expect(I18N_DICT.SI[key]?.trim().length).toBeGreaterThan(0);
      expect(I18N_DICT.TA[key]?.trim().length).toBeGreaterThan(0);
    }
  });

  it('correctly localizes district names for all 25 districts', () => {
    const colombo = SRI_LANKA_DISTRICTS.find((d) => d.district_id === 1)!;
    expect(getLocalizedDistrictName(colombo, 'EN')).toBe('Colombo');
    expect(getLocalizedDistrictName(colombo, 'SI')).toBe('කොළඹ');
    expect(getLocalizedDistrictName(colombo, 'TA')).toBe('கொழும்பு');

    const jaffna = SRI_LANKA_DISTRICTS.find((d) => d.district_id === 10)!;
    expect(getLocalizedDistrictName(jaffna, 'EN')).toBe('Jaffna');
    expect(getLocalizedDistrictName(jaffna, 'SI')).toBe('යාපනය');
    expect(getLocalizedDistrictName(jaffna, 'TA')).toBe('யாழ்ப்பாணம்');
  });
});
