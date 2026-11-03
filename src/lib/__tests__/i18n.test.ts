import { describe, it, expect } from 'vitest';
import i18n, {
  I18N_DICT,
  getLocalizedDistrictName,
  isValidLanguageCode,
  normalizeLangCode,
} from '../i18n';
import enJson from '../../locales/en/translation.json';
import siJson from '../../locales/si/translation.json';
import taJson from '../../locales/ta/translation.json';
import { SRI_LANKA_DISTRICTS } from '../../data/sriLankaUgcSnapshot';

describe('i18next & Localization Engine', () => {
  it('validates and normalizes supported language codes', () => {
    expect(isValidLanguageCode('en')).toBe(true);
    expect(isValidLanguageCode('SI')).toBe(true);
    expect(isValidLanguageCode('ta')).toBe(true);
    expect(isValidLanguageCode('fr')).toBe(false);

    expect(normalizeLangCode('SI')).toBe('si');
    expect(normalizeLangCode('TA')).toBe('ta');
    expect(normalizeLangCode('EN')).toBe('en');
    expect(normalizeLangCode('unknown')).toBe('en');
  });

  it('guarantees key parity across en, si, and ta JSON translation files', () => {
    const enSections = Object.keys(enJson).sort();
    const siSections = Object.keys(siJson).sort();
    const taSections = Object.keys(taJson).sort();

    expect(siSections).toEqual(enSections);
    expect(taSections).toEqual(enSections);

    for (const section of enSections) {
      const enKeys = Object.keys((enJson as Record<string, Record<string, string>>)[section]).sort();
      const siKeys = Object.keys((siJson as Record<string, Record<string, string>>)[section]).sort();
      const taKeys = Object.keys((taJson as Record<string, Record<string, string>>)[section]).sort();

      expect(siKeys).toEqual(enKeys);
      expect(taKeys).toEqual(enKeys);
    }
  });

  it('translates dynamically with i18n.t() across languages', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('nav.predictor')).toBe('Course & Cutoff Finder');

    await i18n.changeLanguage('si');
    expect(i18n.t('nav.predictor')).toBe('පාඨමාලා සහ Z-Score සීමා ලකුණු');

    await i18n.changeLanguage('ta');
    expect(i18n.t('nav.predictor')).toBe('பாடநெறிகள் மற்றும் Z-புள்ளி வெட்டுப்புள்ளிகள்');
  });

  it('correctly localizes district names for all 25 districts', () => {
    const colombo = SRI_LANKA_DISTRICTS.find((d) => d.district_id === 1)!;
    expect(getLocalizedDistrictName(colombo, 'en')).toBe('Colombo');
    expect(getLocalizedDistrictName(colombo, 'si')).toBe('කොළඹ');
    expect(getLocalizedDistrictName(colombo, 'ta')).toBe('கொழும்பு');

    const jaffna = SRI_LANKA_DISTRICTS.find((d) => d.district_id === 10)!;
    expect(getLocalizedDistrictName(jaffna, 'en')).toBe('Jaffna');
    expect(getLocalizedDistrictName(jaffna, 'si')).toBe('යාපනය');
    expect(getLocalizedDistrictName(jaffna, 'ta')).toBe('யாழ்ப்பாணம்');
  });
});
