import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/presets/ts-library.mjs';

const getEntries = (config) => ({
  preset: config.findLast((entry) => entry.languageOptions?.globals?.process !== undefined),
  importsEntry: config.find((entry) => entry.plugins?.import && entry.plugins?.['unused-imports']),
  typescriptEntry: config.findLast(
    (entry) => entry.files?.includes('**/*.{ts,mts,cts}') && entry.rules?.['no-shadow'] === 'off',
  ),
  ignoresEntry: config.find((entry) => Array.isArray(entry.ignores)),
  vitestEntry: config.find((entry) => entry.plugins?.vitest),
  jestEntry: config.find((entry) => entry.plugins?.jest),
});

describe('typescript library config', () => {
  describe('factory function', () => {
    test('is a function', () => {
      expect(typeof createConfig).toBe('function');
    });

    test('returns an array', () => {
      expect(Array.isArray(createConfig())).toBe(true);
    });

    test('throws for unknown testRunner', () => {
      expect(() => createConfig({ testRunner: 'mocha' })).toThrow(
        '[eslint-config-multistack] Unknown testRunner "mocha"',
      );
    });
  });

  describe('with vitest (default)', () => {
    const config = createConfig();
    const { preset, importsEntry, typescriptEntry, ignoresEntry, vitestEntry, jestEntry } = getEntries(config);

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
      expect(ignoresEntry.ignores).toEqual(['node_modules/', 'dist/', 'coverage/', '.turbo/']);
    });

    test('includes vitest plugin', () => {
      expect(vitestEntry).toBeDefined();
      expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
    });

    test('does not include jest plugin', () => {
      expect(jestEntry).toBeUndefined();
    });
  });

  describe('with jest', () => {
    const config = createConfig({ testRunner: 'jest' });
    const { vitestEntry, jestEntry } = getEntries(config);

    test('includes jest plugin', () => {
      expect(jestEntry).toBeDefined();
      expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
    });

    test('does not include vitest plugin', () => {
      expect(vitestEntry).toBeUndefined();
    });
  });

  describe('with tsConfig option', () => {
    const config = createConfig({ tsConfig: 'tsconfig.app.json' });
    const { importsEntry } = getEntries(config);

    test('passes tsConfig to typescript config', () => {
      const tsEntry = config.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.app.json'] });
    });

    test('passes tsConfig to imports config', () => {
      expect(importsEntry.settings['import-x/resolver'].typescript.project).toContain('tsconfig.app.json');
    });
  });

  describe('with both tsConfig and testRunner', () => {
    const config = createConfig({ tsConfig: 'tsconfig.jest.json', testRunner: 'jest' });

    test('includes jest plugin', () => {
      const jestEntry = config.find((entry) => entry.plugins?.jest);
      expect(jestEntry).toBeDefined();
    });

    test('uses custom tsConfig in typescript config', () => {
      const tsEntry = config.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.jest.json'] });
    });
  });
});
