import { describe, expect, test } from 'vitest';

import config from '../../lib/configs/prettier.mjs';

const isOff = (rule) => rule === 'off' || rule === 0;

describe('prettier config', () => {
  test('exports an array', () => {
    expect(Array.isArray(config)).toBe(true);
  });

  test('has a single entry', () => {
    expect(config.length).toBe(1);
  });

  describe('html entry — eslint-config-prettier disables + prettier/prettier rule', () => {
    const entry = config[0];

    test('scopes to html files so JS/TS keep their stylistic rules', () => {
      expect(entry.files).toEqual(['**/*.html']);
    });

    test('disables semi rule (for html only)', () => {
      expect(isOff(entry.rules?.semi)).toBe(true);
    });

    test('disables quotes rule (for html only)', () => {
      expect(isOff(entry.rules?.quotes)).toBe(true);
    });

    test('disables comma-dangle rule (for html only)', () => {
      expect(isOff(entry.rules?.['comma-dangle'])).toBe(true);
    });

    test('registers prettier plugin', () => {
      expect(entry.plugins?.prettier).toBeDefined();
    });

    test('enables prettier/prettier as error', () => {
      expect(entry.rules?.['prettier/prettier'][0]).toBe('error');
    });

    test('uses angular parser', () => {
      expect(entry.rules?.['prettier/prettier'][1].parser).toBe('angular');
    });

    test('sets printWidth to 120', () => {
      expect(entry.rules?.['prettier/prettier'][1].printWidth).toBe(120);
    });

    test('sets tabWidth to 4', () => {
      expect(entry.rules?.['prettier/prettier'][1].tabWidth).toBe(4);
    });

    test('enables singleQuote', () => {
      expect(entry.rules?.['prettier/prettier'][1].singleQuote).toBe(true);
    });

    test('sets htmlWhitespaceSensitivity to ignore', () => {
      expect(entry.rules?.['prettier/prettier'][1].htmlWhitespaceSensitivity).toBe('ignore');
    });
  });
});
