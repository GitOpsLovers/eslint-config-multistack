import globals from 'globals';

import angularConfig from '../configs/angular.mjs';
import angularTemplateConfig from '../configs/angular-template.mjs';
import baseConfig from '../configs/base.mjs';
import createImportsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import prettierConfig from '../configs/prettier.mjs';
import reactBaseConfig from '../configs/react.mjs';
import reactTestsConfig from '../configs/react-tests.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsVitestConfig from '../configs/tests-vitest.mjs';
import testsJestConfig from '../configs/tests-jest.mjs';
import createTypescriptConfig from '../configs/typescript.mjs';

const TEST_RUNNERS = { vitest: testsVitestConfig, jest: testsJestConfig };
const FRAMEWORKS = ['react', 'angular'];

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
 * Returns framework-specific configs for React.
 */
const getReactConfigs = () => ({
    frameworkConfigs: [
        ...reactBaseConfig,
    ],
    testExtras: [
        ...reactTestsConfig,
    ],
    presetOverrides: {
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
            curly: ['error', 'all'],

            // Not in base
            'prefer-const': 'error',
            'prefer-template': 'warn',
            'object-shorthand': ['warn', 'always'],
            'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
            'no-shadow': 'error',
            'no-undef': 'error',
            semi: ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'no-duplicate-case': 'error',
            'no-unreachable': 'error',
            'no-unused-expressions': 'error',

            // React-specific
            'prefer-arrow-callback': 'error',
            'require-await': 'error',
            'no-duplicate-imports': 'error',
        },
    },
});

/**
 * Returns framework-specific configs for Angular.
 */
const getAngularConfigs = () => ({
    frameworkConfigs: [
        ...angularConfig,
        ...angularTemplateConfig,
    ],
    testExtras: [],
    prettierExtras: [
        ...prettierConfig,
    ],
    wrapCommon: jstsOnly,
    presetOverrides: {
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
});

/**
 * Ionic preset
 */
const createIonicConfig = ({ framework = 'react', testRunner = 'vitest', tsConfig } = {}) => {
    if (!FRAMEWORKS.includes(framework)) {
        throw new Error(
            `[eslint-config-multistack] Unknown framework "${framework}". ` +
            `Valid options: ${FRAMEWORKS.join(', ')}`,
        );
    }

    const testsConfig = TEST_RUNNERS[testRunner];

    if (!testsConfig) {
        throw new Error(
            `[eslint-config-multistack] Unknown testRunner "${testRunner}". ` +
            `Valid options: ${Object.keys(TEST_RUNNERS).join(', ')}`,
        );
    }

    const typescriptConfig = createTypescriptConfig({ tsConfig });
    const importsConfig = createImportsConfig({ tsConfig });

    const {
        frameworkConfigs,
        testExtras,
        prettierExtras = [],
        wrapCommon,
        presetOverrides,
    } = framework === 'angular' ? getAngularConfigs() : getReactConfigs();

    const wrap = wrapCommon ?? ((configs) => configs);

    return [
        {
            ignores: [
                'node_modules/',
                'dist/',
                'coverage/',
                ...(framework === 'angular' ? ['.angular/'] : []),
                '.turbo/',
            ],
        },
        ...wrap(baseConfig),
        ...wrap(jsdocConfig),
        ...wrap(preferArrowConfig),
        ...wrap(regexConfig),
        ...wrap(securityConfig),
        ...wrap(typescriptConfig),
        ...wrap(importsConfig),
        ...frameworkConfigs,
        ...testsConfig,
        ...testExtras,
        ...prettierExtras,
        presetOverrides,
    ];
};

export default createIonicConfig;
