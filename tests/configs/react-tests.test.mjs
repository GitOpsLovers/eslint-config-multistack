import { describe, expect, test } from 'vitest';

import config from '../../lib/configs/react-tests.mjs';

describe('react-tests config', () => {
  test('exports an array with a single entry', () => {
    expect(Array.isArray(config)).toBe(true);
    expect(config).toHaveLength(1);
  });

  test('registers testing-library and jest-dom-ya plugins scoped to test files', () => {
    const [entry] = config;
    expect(entry.files.some((glob) => glob.includes('test'))).toBe(true);
    expect(entry.plugins['testing-library']).toBeDefined();
    expect(entry.plugins['jest-dom-ya']).toBeDefined();
  });

  test('applies recommended rules from testing-library and jest-dom-ya', () => {
    const [entry] = config;
    const ruleKeys = Object.keys(entry.rules);
    expect(ruleKeys.some((key) => key.startsWith('testing-library/'))).toBe(true);
    expect(ruleKeys.some((key) => key.startsWith('jest-dom-ya/'))).toBe(true);
  });
});
