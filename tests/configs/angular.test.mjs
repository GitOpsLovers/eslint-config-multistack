import { describe, expect, test } from 'vitest';

import config from '../../lib/configs/angular.mjs';

describe('angular config', () => {
  test('exports an array', () => {
    expect(Array.isArray(config)).toBe(true);
  });

  test('registers @angular-eslint plugin', () => {
    const entry = config.find((e) => e.plugins?.['@angular-eslint']);
    expect(entry).toBeDefined();
  });

  test('includes recommended TypeScript rules', () => {
    const entry = config.find((e) => e.name === 'angular-eslint/ts-recommended');
    expect(entry).toBeDefined();
    expect(entry.rules['@angular-eslint/contextual-lifecycle']).toBe('error');
    expect(entry.rules['@angular-eslint/no-empty-lifecycle-method']).toBe('error');
    expect(entry.rules['@angular-eslint/no-input-rename']).toBe('error');
    expect(entry.rules['@angular-eslint/no-output-rename']).toBe('error');
    expect(entry.rules['@angular-eslint/use-pipe-transform-interface']).toBe('error');
    expect(entry.rules['@angular-eslint/use-lifecycle-interface']).toBe('warn');
  });

  test('includes inline template processor for .ts files', () => {
    const entry = config.find((e) => e.processor && e.files?.includes('**/*.ts'));
    expect(entry).toBeDefined();
    expect(entry.processor).toBeDefined();
  });

  test('does not include template rules (those belong in angular-template config)', () => {
    const entry = config.find((e) => e.files?.includes('**/*.html'));
    expect(entry).toBeUndefined();
  });
});
