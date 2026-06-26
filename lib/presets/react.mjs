import globals from 'globals';

import baseConfig from '../configs/base.mjs';
import createImportsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import reactBaseConfig from '../configs/react.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import reactTestsConfig from '../configs/react-tests.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsConfig from '../configs/tests-vitest.mjs';
import createTypescriptConfig from '../configs/typescript.mjs';

/**
 * React preset
 */
const createReactConfig = ({ tsConfig } = {}) => {
    const typescriptConfig = createTypescriptConfig({ tsConfig });
    const importsConfig = createImportsConfig({ tsConfig });

    return [
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
        ...reactBaseConfig,
        ...testsConfig,
        ...reactTestsConfig,
        {
            languageOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                globals: {
                    ...globals.es2021,
                    ...globals.node,
                    ...globals.browser,
                },
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                },
            },
            settings: {
                react: {
                    version: 'detect',
                },
            },
            rules: {
                // Overrides base
                'no-console': 'warn',

                // Not in base
                'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
                'no-shadow': 'error',
                'no-duplicate-case': 'error',
                'no-unreachable': 'error',

                // React-specific
                'prefer-arrow-callback': 'error',
                'require-await': 'error',
                'no-duplicate-imports': 'error',
            },
        },
    ];
};

export default createReactConfig;
