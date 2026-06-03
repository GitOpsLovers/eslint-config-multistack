import { describe, expect, test } from 'vitest';

import config from '../../lib/configs/tests-vitest.mjs';

const TEST_FILE_GLOB = '**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx,mts,cts}';

describe('tests config', () => {
  test('exports an array of flat-config entries', () => {
    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
  });

  test('first entry registers the vitest plugin scoped to test files', () => {
    const [entry] = config;
    expect(entry.files).toContain(TEST_FILE_GLOB);
    expect(entry.plugins).toBeDefined();
    expect(entry.plugins.vitest).toBeDefined();
    expect(typeof entry.plugins.vitest).toBe('object');
  });

  test('exposes Vitest globals via languageOptions', () => {
    const [entry] = config;
    expect(entry.languageOptions?.globals).toBeDefined();
    expect(entry.languageOptions.globals.describe).toBeDefined();
    expect(entry.languageOptions.globals.test).toBeDefined();
    expect(entry.languageOptions.globals.expect).toBeDefined();
  });

  test('enforces key vitest rules', () => {
    const [entry] = config;
    expect(entry.rules['vitest/no-focused-tests']).toBe('error');
    expect(entry.rules['vitest/no-identical-title']).toBe('error');
    expect(entry.rules['vitest/expect-expect']).toBe('error');
    expect(entry.rules['vitest/valid-expect']).toBe('error');
  });

  test('relaxes overly strict base rules in test files', () => {
    const relaxEntry = config.at(-1);
    expect(relaxEntry.files).toContain(TEST_FILE_GLOB);
    expect(relaxEntry.rules['no-magic-numbers']).toBe('off');
    expect(relaxEntry.rules['max-lines-per-function']).toBe('off');
    expect(relaxEntry.rules['max-nested-callbacks']).toBe('off');
  });
});

