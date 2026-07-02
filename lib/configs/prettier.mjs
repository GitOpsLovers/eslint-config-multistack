import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const eslintPrettierConfig = [
    {
        files: ['**/*.html'],
        ...prettierConfig,
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': ['error', {
                parser: 'angular',
                printWidth: 120,
                tabWidth: 4,
                singleQuote: true,
                htmlWhitespaceSensitivity: 'ignore',
            }],
        },
    },
];

export default eslintPrettierConfig;
