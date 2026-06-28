import globals from 'globals';

import { jstsOnly, JS_TS_FILES } from '../utils/jsts-only.mjs';
import angularConfig from '../configs/angular.mjs';
import angularTemplateConfig from '../configs/angular-template.mjs';
import createIgnoresConfig from '../configs/ignores-list.mjs';
import baseConfig from '../configs/base.mjs';
import createImportsConfig from '../configs/imports.mjs';
import jsdocConfig from '../configs/jsdoc.mjs';
import preferArrowConfig from '../configs/prefer-arrow.mjs';
import regexConfig from '../configs/regex.mjs';
import securityConfig from '../configs/security.mjs';
import testsConfig from '../configs/tests-vitest.mjs';
import createTypescriptConfig from '../configs/typescript.mjs';
import prettierConfig from '../configs/prettier.mjs';

/**
 * Angular preset
 */
const createAngularConfig = ({ tsConfig } = {}) => {
    const ignoresConfig = createIgnoresConfig({ extraIgnores: ['.angular/'] });
    const typescriptConfig = createTypescriptConfig({ tsConfig });
    const importsConfig = createImportsConfig({ tsConfig });

    return [
        ...ignoresConfig,
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

                // Not in base
                'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

                // Angular: classes with decorators make shadowing intentional
                'no-shadow': 'off',

                // Angular
                'valid-typeof': 'error',
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
