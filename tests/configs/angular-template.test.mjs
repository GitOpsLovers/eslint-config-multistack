import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

describe('angular-template config', () => {
  describe('with valid angular-eslint package', () => {
    let config;

    beforeEach(async () => {
      config = (await import('../../lib/configs/angular-template.mjs')).default;
    });

    test('exports an array', () => {
      expect(Array.isArray(config)).toBe(true);
    });

    test('scopes template rules to .html files', () => {
      const entry = config.find((e) => e.files?.includes('**/*.html'));
      expect(entry).toBeDefined();
    });

    test('registers @angular-eslint/template plugin', () => {
      const entry = config.find((e) => e.plugins?.['@angular-eslint/template']);
      expect(entry).toBeDefined();
    });

    test('uses angular-eslint template parser', () => {
      const entry = config.find((e) => e.files?.includes('**/*.html'));
      expect(entry.languageOptions.parser).toBeDefined();
    });

    test('includes recommended template rules', () => {
      const entry = config.find((e) => e.files?.includes('**/*.html'));
      expect(entry.rules['@angular-eslint/template/banana-in-box']).toBe('error');
      expect(entry.rules['@angular-eslint/template/eqeqeq']).toBe('error');
      expect(entry.rules['@angular-eslint/template/no-negated-async']).toBe('error');
    });

    test('includes template accessibility rules', () => {
      const entry = config.find((e) => e.files?.includes('**/*.html'));
      expect(entry.rules['@angular-eslint/template/alt-text']).toBe('error');
      expect(entry.rules['@angular-eslint/template/click-events-have-key-events']).toBe('error');
      expect(entry.rules['@angular-eslint/template/valid-aria']).toBe('error');
    });
  });

  describe('with broken angular-eslint package (missing named configs)', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.doMock('angular-eslint', () => ({
            default: {
                configs: {
                    templateRecommended: [
                        { name: 'angular-eslint/other', rules: {}, plugins: {} },
                    ],
                    templateAccessibility: [
                        { name: 'angular-eslint/other', rules: {} },
                    ],
                },
                templateParser: {},
            },
        }));
    });

    afterEach(() => {
        vi.doUnmock('angular-eslint');
        vi.resetModules();
    });

    test('falls back to empty rules when templateRecommended entry is not found', async () => {
        const { default: config } = await import('../../lib/configs/angular-template.mjs');
        const entry = config.find((e) => e.files?.includes('**/*.html'));
        expect(
            Object.keys(entry.rules).filter((r) => r.startsWith('@angular-eslint/template/')),
        ).toHaveLength(0);
    });

    test('falls back to empty rules when templateAccessibility entry is not found', async () => {
        const { default: config } = await import('../../lib/configs/angular-template.mjs');
        const entry = config.find((e) => e.files?.includes('**/*.html'));
        expect(entry.rules['@angular-eslint/template/alt-text']).toBeUndefined();
    });
  });
});
