import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const eslintPrettierConfig = [
    {
        ...prettierConfig,
    },
    {
        files: ['**/*.html'],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
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
