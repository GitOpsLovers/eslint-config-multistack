import { describe, expect, test } from 'vitest';

import createIgnoresConfig from '../../lib/configs/ignores-list.mjs';

describe('ignores-list config', () => {
    test('exports a function', () => {
        expect(typeof createIgnoresConfig).toBe('function');
    });

    test('returns an array', () => {
        const config = createIgnoresConfig();
        expect(Array.isArray(config)).toBe(true);
    });

    test('returns a single entry with default ignores', () => {
        const config = createIgnoresConfig();
        expect(config).toHaveLength(1);
        expect(config[0].ignores).toEqual([
            'node_modules/',
            'dist/',
            'coverage/',
            '.turbo/',
        ]);
    });

    test('accepts extra ignores', () => {
        const config = createIgnoresConfig({ extraIgnores: ['.angular/'] });
        expect(config[0].ignores).toContain('.angular/');
        expect(config[0].ignores).toContain('node_modules/');
    });

    test('defaults to empty extra ignores when called without options', () => {
        const config = createIgnoresConfig();
        expect(config[0].ignores).toEqual([
            'node_modules/',
            'dist/',
            'coverage/',
            '.turbo/',
        ]);
    });
});
