import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/configs/typescript.mjs';

describe('typescript config', () => {
  describe('factory function', () => {
    test('is a function', () => {
      expect(typeof createConfig).toBe('function');
    });

    test('returns an array', () => {
      expect(Array.isArray(createConfig())).toBe(true);
    });
  });

  describe('without tsConfig (default)', () => {
    const config = createConfig();
    const entry = config[0];

    test('exports an array with a config object', () => {
      expect(config).toHaveLength(1);
      expect(entry).toBeDefined();
    });

    test('targets only TypeScript files', () => {
      expect(entry.files).toEqual(['**/*.{ts,tsx,mts,cts}']);
    });

    test('uses projectService by default', () => {
      expect(entry.languageOptions.parserOptions).toEqual({ projectService: true });
    });

    test('registers the TypeScript parser and plugins', () => {
      expect(entry.languageOptions).toBeDefined();
      expect(entry.languageOptions.parser).toBeDefined();
      expect(entry.plugins).toBeDefined();
      expect(entry.plugins['@typescript-eslint']).toBeDefined();
      expect(entry.plugins['@stylistic/ts']).toBeDefined();
    });

    test('enforces representative TypeScript rules', () => {
      expect(entry.rules).toBeDefined();
      expect(entry.rules['@typescript-eslint/adjacent-overload-signatures']).toBe('error');
      expect(entry.rules['@typescript-eslint/no-unused-vars']).toBeDefined();
      expect(entry.rules['@stylistic/ts/semi']).toEqual(['error', 'always']);
      expect(entry.rules['@typescript-eslint/no-deprecated']).toBe('error');
    });
  });

  describe('with tsConfig option', () => {
    const config = createConfig({ tsConfig: 'tsconfig.app.json' });
    const entry = config[0];

    test('uses the provided tsConfig path', () => {
      expect(entry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.app.json'] });
    });

    test('still targets TypeScript files', () => {
      expect(entry.files).toEqual(['**/*.{ts,tsx,mts,cts}']);
    });

    test('still registers plugins', () => {
      expect(entry.plugins['@typescript-eslint']).toBeDefined();
    });
  });
});
