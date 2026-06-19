import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/presets/angular.mjs';

const config = createConfig();
const preset = config.findLast((entry) => entry.languageOptions?.globals?.window !== undefined);
const importsEntry = config.find((entry) => entry.plugins?.import && entry.plugins?.['unused-imports']);
const ignoresEntry = config.find((entry) => Array.isArray(entry.ignores));

describe('angular config', () => {
  test('includes browser globals', () => {
    expect(preset.languageOptions.globals.window).toBeDefined();
  });

  test('has ecmaVersion >= 2022', () => {
    expect(preset.languageOptions.ecmaVersion).toBeGreaterThanOrEqual(2022);
  });

  test('limits classes to one per file', () => {
    expect(preset.rules['max-classes-per-file']).toEqual(['error', 1]);
  });

  test('enforces prefer-arrow-callback', () => {
    expect(preset.rules['prefer-arrow-callback']).toBe('error');
  });

  test('disallows duplicate imports', () => {
    expect(preset.rules['no-duplicate-imports']).toBe('error');
  });

  test('enforces prefer-const', () => {
    expect(preset.rules['prefer-const']).toBe('error');
  });

  test('includes imports config with import and unused-imports plugins', () => {
    expect(importsEntry).toBeDefined();
    expect(importsEntry.rules['unused-imports/no-unused-imports']).toBe('error');
    expect(importsEntry.rules['import/order'][0]).toBe('error');
  });

  test('includes default ignores', () => {
    expect(ignoresEntry).toBeDefined();
    expect(ignoresEntry.ignores).toEqual([
      'node_modules/',
      'dist/',
      'coverage/',
      '.angular/',
      '.turbo/',
    ]);
  });

  describe('angular-eslint TypeScript rules', () => {
    const tsBaseEntry = config.find((entry) => entry.plugins?.['@angular-eslint']);

    test('includes @angular-eslint plugin', () => {
      expect(tsBaseEntry).toBeDefined();
      expect(tsBaseEntry.plugins['@angular-eslint']).toBeDefined();
    });

    test('includes recommended TypeScript rules', () => {
      const tsRecommendedEntry = config.find(
        (entry) => entry.name === 'angular-eslint/ts-recommended',
      );
      expect(tsRecommendedEntry).toBeDefined();
      expect(tsRecommendedEntry.rules['@angular-eslint/contextual-lifecycle']).toBe('error');
      expect(tsRecommendedEntry.rules['@angular-eslint/no-empty-lifecycle-method']).toBe('error');
      expect(tsRecommendedEntry.rules['@angular-eslint/no-input-rename']).toBe('error');
      expect(tsRecommendedEntry.rules['@angular-eslint/no-output-rename']).toBe('error');
      expect(tsRecommendedEntry.rules['@angular-eslint/use-pipe-transform-interface']).toBe('error');
      expect(tsRecommendedEntry.rules['@angular-eslint/use-lifecycle-interface']).toBe('warn');
    });
  });

  describe('angular-eslint template rules', () => {
    const templateEntry = config.find(
      (entry) => entry.plugins?.['@angular-eslint/template'] && entry.files?.includes('**/*.html'),
    );

    test('includes @angular-eslint/template plugin scoped to .html files', () => {
      expect(templateEntry).toBeDefined();
      expect(templateEntry.plugins['@angular-eslint/template']).toBeDefined();
    });

    test('uses angular-eslint template parser for .html files', () => {
      expect(templateEntry.languageOptions.parser).toBeDefined();
    });

    test('includes recommended template rules', () => {
      expect(templateEntry.rules['@angular-eslint/template/banana-in-box']).toBe('error');
      expect(templateEntry.rules['@angular-eslint/template/eqeqeq']).toBe('error');
      expect(templateEntry.rules['@angular-eslint/template/no-negated-async']).toBe('error');
    });

    test('includes accessibility rules', () => {
      expect(templateEntry.rules['@angular-eslint/template/alt-text']).toBe('error');
      expect(templateEntry.rules['@angular-eslint/template/click-events-have-key-events']).toBe('error');
      expect(templateEntry.rules['@angular-eslint/template/valid-aria']).toBe('error');
    });
  });

  describe('inline template processing', () => {
    test('includes processor for .ts files', () => {
      const processorEntry = config.find(
        (entry) => entry.processor && entry.files?.includes('**/*.ts'),
      );
      expect(processorEntry).toBeDefined();
      expect(processorEntry.processor).toBeDefined();
    });
  });

  describe('with tsConfig option', () => {
    const customConfig = createConfig({ tsConfig: 'tsconfig.app.json' });

    test('passes tsConfig to typescript config', () => {
      const tsEntry = customConfig.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.app.json'] });
    });

    test('passes tsConfig to imports config', () => {
      const iEntry = customConfig.find((entry) => entry.plugins?.import);
      expect(iEntry.settings['import-x/resolver'].typescript.project).toContain('tsconfig.app.json');
    });
  });
});
