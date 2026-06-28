import { describe, expect, test } from 'vitest';

import { jstsOnly, JS_TS_FILES } from '../../lib/utils/jsts-only.mjs';

describe('jstsOnly', () => {
    test('adds JS_TS_FILES to configs without files', () => {
        const configs = [{ rules: { 'no-console': 'error' } }];
        const result = jstsOnly(configs);
        expect(result[0].files).toEqual(JS_TS_FILES);
        expect(result[0].rules['no-console']).toBe('error');
    });

    test('preserves existing files on a config', () => {
        const configs = [{ files: ['*.ts'], rules: {} }];
        const result = jstsOnly(configs);
        expect(result[0].files).toEqual(['*.ts']);
    });

    test('handles multiple config entries', () => {
        const configs = [
            { rules: { a: 'error' } },
            { files: ['*.ts'], rules: { b: 'error' } },
        ];
        const result = jstsOnly(configs);
        expect(result[0].files).toEqual(JS_TS_FILES);
        expect(result[1].files).toEqual(['*.ts']);
    });

    test('returns an empty array for empty input', () => {
        expect(jstsOnly([])).toEqual([]);
    });
});

describe('JS_TS_FILES', () => {
    test('matches js, mjs, cjs, ts files', () => {
        expect(JS_TS_FILES).toEqual(['**/*.{js,mjs,cjs,ts}']);
    });
});
