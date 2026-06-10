import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/presets/angular.mjs';

const config = createConfig();
const preset = config.at(-1);
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
