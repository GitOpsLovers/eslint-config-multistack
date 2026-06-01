import globals from 'globals';

import baseConfig from '../configs/base.mjs';
import importsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsConfig from '../configs/tests.mjs';
import typescriptConfig from '../configs/typescript.mjs';

/**
 * Typescript library
 */
const tsLibraryConfig = [
    {
        ignores: [
            'node_modules/',
            'dist/',
            'coverage/',
            '.turbo/',
        ],
    },
    ...baseConfig,
    ...jsdocConfig,
    ...preferArrowConfig,
    ...regexConfig,
    ...securityConfig,
    ...typescriptConfig,
    ...importsConfig,
    ...testsConfig,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.es2021,
                ...globals.node,
            },
        },
        rules: {
            // Overrides base
            curly: ['error', 'all'],
            'no-console': 'off',

            // Not in base
            'prefer-const': 'error',
            'prefer-template': 'warn',
            'object-shorthand': ['warn', 'always'],
            'no-shadow': 'error',
            'no-undef': 'error',
            semi: ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'no-duplicate-case': 'error',
            'no-unreachable': 'error',
            'no-unused-expressions': 'error',
            'require-await': 'error',
            // Promise-based error handling
            'no-promise-executor-return': 'error',
            'no-async-promise-executor': 'error',
        },
    },
    {
        files: ['**/*.{ts,mts,cts}'],
        rules: {
            'no-shadow': 'off',
            'no-undef': 'off',
            'no-unused-expressions': 'off',
            'no-unused-vars': 'off',
            'require-await': 'off',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-unused-vars': ['error', {
                vars: 'local',
                args: 'after-used',
                ignoreRestSiblings: false,
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/require-await': 'error',
        },
    },
];

export default tsLibraryConfig;
