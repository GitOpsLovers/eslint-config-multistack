import { describe, expect, test } from 'vitest';

import config from '../../lib/presets/next.mjs';

const preset = config.at(-1);
const importsEntry = config.find((entry) => entry.plugins?.import && entry.plugins?.['unused-imports']);
const nextEntry = config.find((entry) => entry.plugins?.['@next/next']);
const ignoresEntry = config.find((entry) => Array.isArray(entry.ignores));

describe('next config', () => {
  test('includes browser globals', () => {
    expect(preset.languageOptions.globals.window).toBeDefined();
  });

  test('does not have leading or trailing whitespaces in globals keys', () => {
    const globalKeys = Object.keys(preset.languageOptions.globals);

    globalKeys.forEach((key) => {
      expect(key).toBe(key.trim());
    });
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

  test('includes next plugin config layer', () => {
    expect(nextEntry).toBeDefined();
    expect(nextEntry.files).toEqual(['**/*.{js,jsx,ts,tsx}']);
    expect(
      Object.keys(nextEntry.rules).some((ruleName) => ruleName.startsWith('@next/next/')),
    ).toBe(true);
  });

  test('includes core-web-vitals rules', () => {
    expect(nextEntry.rules['@next/next/no-sync-scripts']).toBeDefined();
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

  test('includes next-specific ignores', () => {
    expect(ignoresEntry).toBeDefined();
    expect(ignoresEntry.ignores).toContain('.next/**');
    expect(ignoresEntry.ignores).toContain('out/**');
    expect(ignoresEntry.ignores).toContain('build/**');
    expect(ignoresEntry.ignores).toContain('next-env.d.ts');
  });

  test('includes base ignores', () => {
    expect(ignoresEntry.ignores).toContain('node_modules/');
    expect(ignoresEntry.ignores).toContain('dist/');
    expect(ignoresEntry.ignores).toContain('coverage/');
    expect(ignoresEntry.ignores).toContain('.turbo/');
  });
});
