import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/configs/imports.mjs';

describe('imports config', () => {
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

    test('registers import and unused-imports plugins', () => {
      expect(entry.plugins).toBeDefined();
      expect(entry.plugins.import).toBeDefined();
      expect(entry.plugins['unused-imports']).toBeDefined();
    });

    test('sets import resolver to use default tsconfig.json', () => {
      expect(entry.settings['import-x/resolver']).toBeDefined();
      expect(entry.settings['import-x/resolver'].typescript.project).toContain('tsconfig.json');
      expect(entry.settings['import-x/resolver'].node.project).toContain('tsconfig.json');
    });

    test('registers TypeScript parser for supported TS extensions', () => {
      expect(entry.settings['import-x/parsers']).toBeDefined();
      expect(entry.settings['import-x/parsers']['@typescript-eslint/parser']).toEqual([
        '.ts',
        '.tsx',
        '.mts',
        '.cts',
      ]);
    });

    test('enables TypeScript resolver type lookup', () => {
      expect(entry.settings['import-x/resolver'].typescript.alwaysTryTypes).toBe(true);
    });

    test('enforces unused import removal and import ordering', () => {
      expect(entry.rules['unused-imports/no-unused-imports']).toBe('error');
      expect(entry.rules['import/no-unresolved']).toBe('error');
      expect(entry.rules['import/no-unused-modules']).toEqual([
        'error',
        {
          missingExports: true,
          unusedExports: true,
          suppressMissingFileEnumeratorAPIWarning: true,
        },
      ]);
      expect(entry.rules['import/order'][0]).toBe('error');
      expect(entry.rules['import/order'][1]['newlines-between']).toBe('always');
    });
  });

  describe('with tsConfig option', () => {
    const config = createConfig({ tsConfig: 'tsconfig.app.json' });
    const entry = config[0];

    test('uses the provided tsConfig path in resolver', () => {
      expect(entry.settings['import-x/resolver'].typescript.project).toContain('tsconfig.app.json');
      expect(entry.settings['import-x/resolver'].node.project).toContain('tsconfig.app.json');
    });

    test('does not include default tsconfig.json', () => {
      expect(entry.settings['import-x/resolver'].typescript.project).not.toContain('tsconfig.json');
    });
  });
});
