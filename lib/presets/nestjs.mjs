import globals from 'globals';

import createIgnoresConfig from '../configs/ignores-list.mjs';
import baseConfig from '../configs/base.mjs';
import createImportsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsVitestConfig from '../configs/tests-vitest.mjs';
import testsJestConfig from '../configs/tests-jest.mjs';
import createTypescriptConfig from '../configs/typescript.mjs';

const TEST_RUNNERS = { vitest: testsVitestConfig, jest: testsJestConfig };

/**
 * NestJS preset
 */
const createNestjsConfig = ({ testRunner = 'jest', tsConfig } = {}) => {
    const testsConfig = TEST_RUNNERS[testRunner];

    if (!testsConfig) {
        throw new Error(
            `[eslint-config-multistack] Unknown testRunner "${testRunner}". ` +
            `Valid options: ${Object.keys(TEST_RUNNERS).join(', ')}`,
        );
    }

    const ignoresConfig = createIgnoresConfig();
    const typescriptConfig = createTypescriptConfig({ tsConfig });
    const importsConfig = createImportsConfig({ tsConfig });

    return [
        ...ignoresConfig,
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
                sourceType: 'commonjs',
                globals: {
                    ...globals.es2021,
                    ...globals.node,
                },
            },
            rules: {
                // Overrides base
                'no-console': 'off',

                // Not in base
                'no-shadow': 'error',

                'no-unused-vars': ['error', {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                }],

                // Promise-based error handling
                'no-promise-executor-return': 'error',
                'no-async-promise-executor': 'error',
            },
        },
        {
            files: ['**/*.{ts,tsx,mts,cts}'],
            rules: {
                'no-redeclare': 'off',
                'no-shadow': 'off',
                'no-undef': 'off',
                'no-unused-expressions': 'off',
                'no-unused-vars': 'off',
                'require-await': 'off',
                '@typescript-eslint/no-redeclare': 'error',
                '@typescript-eslint/no-shadow': 'error',
                '@typescript-eslint/no-unused-expressions': 'error',
                '@typescript-eslint/no-unused-vars': ['error', {
                    vars: 'local',
                    args: 'after-used',
                    ignoreRestSiblings: false,
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                }],
                '@typescript-eslint/require-await': 'error',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/no-unsafe-argument': 'warn',
            },
        },
    ];
};

export default createNestjsConfig;
