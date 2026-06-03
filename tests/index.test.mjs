import { describe, expect, test } from 'vitest';

import plugin from '../index.mjs';

describe('eslint-config-multistack', () => {
  test('exports a meta object with name and version', () => {
    expect(plugin.meta).toBeDefined();
    expect(plugin.meta.name).toBe('eslint-config-multistack');
    expect(typeof plugin.meta.version).toBe('string');
  });

  test('exports a rules object', () => {
    expect(plugin.rules).toBeDefined();
    expect(typeof plugin.rules).toBe('object');
  });

  test('exports flat configs for all presets', () => {
    const expected = ['angular', 'react', 'express'];
    expect(Object.keys(plugin.configs)).toEqual(expect.arrayContaining(expected));
  });

  test('keeps flatConfigs alias for backwards compatibility', () => {
    const expected = ['angular', 'react', 'express'];
    expect(Object.keys(plugin.flatConfigs)).toEqual(expect.arrayContaining(expected));
  });

  test.each(['angular', 'react', 'express'])(
    'flat config "%s" is an array and includes multistack in plugins object',
    (preset) => {
      expect(Array.isArray(plugin.configs[preset])).toBe(true);
      expect(plugin.configs[preset][0].plugins).toBeDefined();
      expect(plugin.configs[preset][0].plugins.multistack).toBe(plugin);
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" has a name field',
    (preset) => {
      expect(plugin.configs[preset][0].name).toBe(`multistack/${preset}`);
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" has a rules object',
    (preset) => {
      expect(plugin.configs[preset].at(-1).rules).toBeDefined();
      expect(typeof plugin.configs[preset].at(-1).rules).toBe('object');
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes jsdoc plugin config',
    (preset) => {
      const jsdocEntry = plugin.configs[preset].find((entry) => entry.plugins?.jsdoc);
      expect(jsdocEntry).toBeDefined();
      expect(jsdocEntry.rules['jsdoc/no-types']).toBe('error');
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes prefer-arrow plugin config',
    (preset) => {
      const preferArrowEntry = plugin.configs[preset].find((entry) => entry.plugins?.['prefer-arrow']);
      expect(preferArrowEntry).toBeDefined();
      expect(preferArrowEntry.rules['prefer-arrow/prefer-arrow-functions']).toBeDefined();
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes optimize-regex plugin config',
    (preset) => {
      const regexEntry = plugin.configs[preset].find((entry) => entry.plugins?.['optimize-regex']);
      expect(regexEntry).toBeDefined();
      expect(regexEntry.rules['optimize-regex/optimize-regex']).toBe('error');
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes security plugin config',
    (preset) => {
      const securityEntry = plugin.configs[preset].find(
        (entry) => entry.plugins?.['no-secrets'] && entry.plugins?.security,
      );
      expect(securityEntry).toBeDefined();
      expect(securityEntry.rules['no-secrets/no-secrets']).toBe('error');
      expect(securityEntry.rules['security/detect-eval-with-expression']).toBe('error');
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes typescript plugin config scoped to TS files',
    (preset) => {
      const typescriptEntry = plugin.configs[preset].find(
        (entry) => entry.plugins?.['@typescript-eslint'],
      );
      expect(typescriptEntry).toBeDefined();
      expect(typescriptEntry.files).toEqual(['**/*.{ts,tsx,mts,cts}']);
      expect(typescriptEntry.rules['@typescript-eslint/no-unused-vars']).toBeDefined();
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes vitest test config scoped to test files',
    (preset) => {
      const vitestEntry = plugin.configs[preset].find(
        (entry) => entry.plugins?.vitest,
      );
      expect(vitestEntry).toBeDefined();
      expect(vitestEntry.files.some((glob) => glob.includes('test'))).toBe(true);
      expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
    },
  );

  test('config "react" includes testing-library and jest-dom for test files', () => {
    const rtlEntry = plugin.configs.react.find(
      (entry) => entry.plugins?.['testing-library'] && entry.plugins?.['jest-dom'],
    );
    expect(rtlEntry).toBeDefined();
    const ruleKeys = Object.keys(rtlEntry.rules);
    expect(ruleKeys.some((key) => key.startsWith('testing-library/'))).toBe(true);
    expect(ruleKeys.some((key) => key.startsWith('jest-dom/'))).toBe(true);
  });

  test.each(['angular', 'express'])(
    'config "%s" does not include the react-tests plugin config',
    (preset) => {
      const rtlEntry = plugin.configs[preset].find(
        (entry) => entry.plugins?.['testing-library'],
      );
      expect(rtlEntry).toBeUndefined();
    },
  );

  test('tsLibrary config is a function', () => {
    expect(typeof plugin.configs.tsLibrary).toBe('function');
  });

  test('tsLibrary() without options returns an array with vitest config', () => {
    const config = plugin.configs.tsLibrary();
    expect(Array.isArray(config)).toBe(true);
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeDefined();
    expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
  });

  test('tsLibrary({ testRunner: "vitest" }) includes vitest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'vitest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeDefined();
    expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
  });

  test('tsLibrary({ testRunner: "jest" }) includes jest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'jest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeDefined();
    expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
  });

  test('tsLibrary({ testRunner: "jest" }) does not include vitest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'jest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeUndefined();
  });

  test('tsLibrary({ testRunner: "vitest" }) does not include jest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'vitest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeUndefined();
  });

  test('tsLibrary() result has name and multistack plugin in first entry', () => {
    const config = plugin.configs.tsLibrary();
    expect(config[0].name).toBe('multistack/ts-library');
    expect(config[0].plugins.multistack).toBe(plugin);
  });

  test('tsLibrary() with unknown testRunner throws an error', () => {
    expect(() => plugin.configs.tsLibrary({ testRunner: 'mocha' })).toThrow(
      '[eslint-config-multistack] Unknown testRunner "mocha"',
    );
  });
});
