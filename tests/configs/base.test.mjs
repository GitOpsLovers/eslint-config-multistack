import { describe, expect, test } from 'vitest';

import config from '../../lib/configs/base.mjs';

const rules = config[0].rules;

describe('base config', () => {
  test('exports an array with at least one config object', () => {
    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
  });

  test('config object has a rules property', () => {
    expect(typeof rules).toBe('object');
  });

  // Security
  test('forbids eval', () => {
    expect(rules['no-eval']).toBe('error');
  });

  test('forbids implied eval', () => {
    expect(rules['no-implied-eval']).toBe('error');
  });

  test('forbids new Function()', () => {
    expect(rules['no-new-func']).toBe('error');
  });

  test('forbids script URLs', () => {
    expect(rules['no-script-url']).toBe('error');
  });

  // Error-prone patterns
  test('forbids debugger statements', () => {
    expect(rules['no-debugger']).toBe('error');
  });

  test('requires strict equality (eqeqeq)', () => {
    expect(rules['eqeqeq'][0]).toBe('error');
    expect(rules['eqeqeq'][1]).toBe('always');
  });

  test('forbids return-await', () => {
    expect(rules['no-return-await']).toBe('error');
  });

  test('forbids fallthrough in switch cases', () => {
    expect(rules['no-fallthrough']).toBe('error');
  });

  test('forbids self-comparison', () => {
    expect(rules['no-self-compare']).toBe('error');
  });

  test('forbids loop functions', () => {
    expect(rules['no-loop-func']).toBe('error');
  });

  // Param reassign with framework-friendly exceptions
  test('restricts param reassign but allows common identifiers', () => {
    const rule = rules['no-param-reassign'];
    expect(rule[0]).toBe('error');
    expect(rule[1].props).toBe(true);
    const exceptions = rule[1].ignorePropertyModificationsFor;
    expect(exceptions).toContain('req');
    expect(exceptions).toContain('res');
    expect(exceptions).toContain('ctx');
    expect(exceptions).toContain('acc');
    expect(exceptions).toContain('staticContext');
  });

  // Style
  test('enforces end-of-line at end of file', () => {
    expect(rules['eol-last'][0]).toBe('error');
  });

  test('forbids trailing spaces', () => {
    expect(rules['no-trailing-spaces'][0]).toBe('error');
  });

  test('limits consecutive empty lines to 1', () => {
    expect(rules['no-multiple-empty-lines'][1].max).toBe(1);
  });

  test('enforces unix linebreak style', () => {
    expect(rules['linebreak-style']).toEqual(['error', 'unix']);
  });

  test('enforces max line length of 150', () => {
    expect(rules['max-len'][1]).toBe(150);
  });

  test('forbids nested ternaries', () => {
    expect(rules['no-nested-ternary']).toBe('error');
  });

  test('enforces curly braces for all blocks', () => {
    expect(rules['curly']).toEqual(['error', 'all']);
  });

  test('enforces camelCase naming', () => {
    expect(rules['camelcase'][0]).toBe('error');
  });

  test('enforces object shorthand (prefer-object-spread)', () => {
    expect(rules['prefer-object-spread']).toBe('error');
  });

  test('disables console (off — presets override per context)', () => {
    expect(rules['no-console']).toBe('off');
  });

  // Misc best practices
  test('forbids alert', () => {
    expect(rules['no-alert']).toBe('error');
  });

  test('forbids bitwise operators', () => {
    expect(rules['no-bitwise']).toBe('error');
  });

  test('forbids useless return', () => {
    expect(rules['no-useless-return']).toBe('error');
  });

  test('forbids var declarations', () => {
    expect(rules['no-var']).toBe('error');
  });

  test('enforces one variable declaration per line', () => {
    expect(rules['one-var']).toEqual(['error', 'never']);
  });

  test('forbids yoda conditions', () => {
    expect(rules['yoda']).toBe('error');
  });
});
