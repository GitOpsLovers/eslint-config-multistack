import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/presets/react.mjs';

const config = createConfig();
const preset = config.at(-1);
const importsEntry = config.find((entry) => entry.plugins?.import && entry.plugins?.['unused-imports']);
const reactEntry = config.find(
  (entry) => entry.plugins?.['@eslint-react'],
);
const ignoresEntry = config.find((entry) => Array.isArray(entry.ignores));

describe('react config', () => {
  test('includes browser globals', () => {
    expect(preset.languageOptions.globals.window).toBeDefined();
  });

  test('enables JSX in languageOptions', () => {
    expect(preset.languageOptions.parserOptions.ecmaFeatures.jsx).toBe(true);
  });

  test('has ecmaVersion >= 2022', () => {
    expect(preset.languageOptions.ecmaVersion).toBeGreaterThanOrEqual(2022);
  });

  test('includes react version detection in settings', () => {
    expect(preset.settings.react.version).toBe('detect');
  });

  test('includes react plugin config layer', () => {
    expect(reactEntry).toBeDefined();
    expect(reactEntry.files).toEqual(['**/*.jsx', '**/*.tsx']);
    expect(reactEntry.rules['@eslint-react/no-missing-key']).toBe('warn');
    expect(
      Object.keys(reactEntry.rules).some((ruleName) => ruleName.startsWith('@eslint-react/')),
    ).toBe(true);
  });

  test('enforces prefer-arrow-callback', () => {
    expect(preset.rules['prefer-arrow-callback']).toBe('error');
  });

  test('disallows duplicate imports', () => {
    expect(preset.rules['no-duplicate-imports']).toBe('error');
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
      '.turbo/',
    ]);
  });

  describe('with tsConfig option', () => {
    const customConfig = createConfig({ tsConfig: 'tsconfig.custom.json' });

    test('passes tsConfig to typescript config', () => {
      const tsEntry = customConfig.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
    });

    test('passes tsConfig to imports config', () => {
      const iEntry = customConfig.find((entry) => entry.plugins?.import);
      expect(iEntry.settings['import-x/resolver'].typescript.project).toContain('tsconfig.custom.json');
    });
  });
});
