import { describe, expect, test } from 'vitest';

import config from '../../lib/presets/ts-library.mjs';

const preset = config.findLast((entry) => entry.languageOptions?.globals?.process !== undefined);
const importsEntry = config.find((entry) => entry.plugins?.import && entry.plugins?.['unused-imports']);
const typescriptEntry = config.findLast(
  (entry) => entry.files?.includes('**/*.{ts,mts,cts}') && entry.rules?.['no-shadow'] === 'off',
);
const ignoresEntry = config.find((entry) => Array.isArray(entry.ignores));

describe('typescript library config', () => {
  test('includes node globals', () => {
    expect(preset.languageOptions.globals.process).toBeDefined();
  });

  test('does not include browser globals', () => {
    expect(preset.languageOptions.globals.window).toBeUndefined();
  });

  test('allows console (turns off no-console)', () => {
    expect(preset.rules['no-console']).toBe('off');
  });

  test('enforces require-await', () => {
    expect(preset.rules['require-await']).toBe('error');
  });

  test('enforces no-promise-executor-return', () => {
    expect(preset.rules['no-promise-executor-return']).toBe('error');
  });

  test('enforces no-async-promise-executor', () => {
    expect(preset.rules['no-async-promise-executor']).toBe('error');
  });

  test('includes imports config with import and unused-imports plugins', () => {
    expect(importsEntry).toBeDefined();
    expect(importsEntry.rules['unused-imports/no-unused-imports']).toBe('error');
    expect(importsEntry.rules['import/order'][0]).toBe('error');
  });

  test('overrides conflicting core rules for TypeScript files', () => {
    expect(typescriptEntry).toBeDefined();
    expect(typescriptEntry.rules['no-shadow']).toBe('off');
    expect(typescriptEntry.rules['no-undef']).toBe('off');
    expect(typescriptEntry.rules['no-unused-expressions']).toBe('off');
    expect(typescriptEntry.rules['no-unused-vars']).toBe('off');
    expect(typescriptEntry.rules['require-await']).toBe('off');
    expect(typescriptEntry.rules['@typescript-eslint/no-shadow']).toBe('error');
    expect(typescriptEntry.rules['@typescript-eslint/no-unused-expressions']).toBe('error');
    expect(typescriptEntry.rules['@typescript-eslint/require-await']).toBe('error');
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
});
