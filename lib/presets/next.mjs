import globals from 'globals';

import baseConfig from '../configs/base.mjs';
import createImportsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import nextBaseConfig from '../configs/next.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import reactTestsConfig from '../configs/react-tests.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsConfig from '../configs/tests-vitest.mjs';
import createTypescriptConfig from '../configs/typescript.mjs';

/**
 * Next preset
 */
const createNextConfig = ({ tsConfig } = {}) => {
    const typescriptConfig = createTypescriptConfig({ tsConfig });
    const importsConfig = createImportsConfig({ tsConfig });

    return [
        {
            ignores: [
                'node_modules/',
                'dist/',
                'coverage/',
                '.turbo/',
                '.next/**',
                'out/**',
                'build/**',
                'next-env.d.ts',
            ],
        },
        ...baseConfig,
        ...jsdocConfig,
        ...preferArrowConfig,
        ...regexConfig,
        ...securityConfig,
        ...typescriptConfig,
        ...nextBaseConfig,
        ...importsConfig,
        ...testsConfig,
        ...reactTestsConfig,
        {
            languageOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                globals: Object.fromEntries(
                    Object.entries({
                        ...globals.es2021,
                        ...globals.node,
                        ...globals.browser,
                    }).map(([key, value]) => [key.trim(), value]),
                ),
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

export default createNextConfig;
