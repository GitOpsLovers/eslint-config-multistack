import globals from 'globals';

import angularConfig from '../configs/angular.mjs';
import angularTemplateConfig from '../configs/angular-template.mjs';
import baseConfig from '../configs/base.mjs';
import createImportsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsConfig from '../configs/tests-vitest.mjs';
import createTypescriptConfig from '../configs/typescript.mjs';
import prettierConfig from '../configs/prettier.mjs';

const JS_TS_FILES = ['**/*.{js,mjs,cjs,ts}'];

/**
 * Restricts a config array to JS/TS files only.
 * If a config already has `files`, it is preserved (defensive merge).
 */
const jstsOnly = (configs) =>
    configs.map((config) => ({
        ...config,
        files: config.files ?? JS_TS_FILES,
    }));

/**
 * Angular preset
 */
const createAngularConfig = ({ tsConfig } = {}) => {
    const typescriptConfig = createTypescriptConfig({ tsConfig });
    const importsConfig = createImportsConfig({ tsConfig });

    return [
        {
            ignores: [
                'node_modules/',
                'dist/',
                'coverage/',
                '.angular/',
                '.turbo/',
            ],
        },
        ...jstsOnly(baseConfig),
        ...jstsOnly(jsdocConfig),
        ...jstsOnly(preferArrowConfig),
        ...jstsOnly(regexConfig),
        ...jstsOnly(securityConfig),
        ...jstsOnly(typescriptConfig),
        ...jstsOnly(importsConfig),
        ...angularConfig,
        ...angularTemplateConfig,
        ...testsConfig,
        ...prettierConfig,
        {
            files: JS_TS_FILES,
            languageOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                globals: {
                    ...globals.es2021,
                    ...globals.node,
                    ...globals.browser,
                },
            },
            rules: {
                // Overrides base
                'no-console': 'warn',
                curly: ['error', 'all'],

                // Not in base
                'prefer-const': 'error',
                'prefer-template': 'warn',
                'object-shorthand': ['warn', 'always'],
                'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
                'no-undef': 'error',
                semi: ['error', 'always'],
                quotes: ['error', 'single', { avoidEscape: true }],
                'comma-dangle': ['error', 'always-multiline'],
                'no-duplicate-case': 'error',
                'no-unreachable': 'error',
                'no-unused-expressions': 'error',

                // Angular: classes with decorators make shadowing intentional
                'no-shadow': 'off',

                // Angular-specific
                'valid-typeof': 'error',
                'require-await': 'error',
                'prefer-arrow-callback': 'error',
                'max-classes-per-file': ['error', 1],
                'no-underscore-dangle': ['warn', { allowAfterThis: true }],
                'no-invalid-this': 'off',
                'no-duplicate-imports': 'error',
            },
        },
    ];
};

export default createAngularConfig;
