import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import-x';

const createImportsConfig = ({ tsConfig } = {}) => {
  const projectPath = tsConfig || 'tsconfig.json';

  return [
    {
      plugins: {
        'unused-imports': unusedImports,
        import: importPlugin,
      },
      settings: {
        'import-x/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts'],
        },
        'import-x/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: [projectPath],
          },
          node: {
            project: [projectPath],
          },
        },
      },
      rules: {
        'unused-imports/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',

        'import/no-unresolved': 'error',
        'import/named': 'error',
        'import/default': 'off',
        'import/namespace': 'error',
        'import/no-restricted-paths': 'off',
        'import/no-absolute-path': 'error',
        'import/no-dynamic-require': 'error',
        'import/no-internal-modules': 'off',
        'import/no-webpack-loader-syntax': 'error',
        'import/no-self-import': 'error',
        'import/no-cycle': 'off',
        'import/no-useless-path-segments': 'error',
        'import/no-relative-parent-imports': 'off',
        'import/no-relative-packages': 'error',
        'import/export': 'error',
        'import/no-named-as-default': 'error',
        'import/no-named-as-default-member': 'error',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unused-modules': ['error', {
          missingExports: true,
          unusedExports: true,
          suppressMissingFileEnumeratorAPIWarning: true,
        }],
        'import/unambiguous': 'error',
        'import/no-nodejs-modules': 'off',
        'import/no-import-module-exports': 'error',
        'import/exports-last': 'error',
        'import/no-duplicates': 'error',
        'import/extensions': [
          'error',
          'never',
          {
            json: 'always',
          },
        ],
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'import/prefer-default-export': 'off',
        'import/max-dependencies': 'off',
        'import/no-unassigned-import': [
          'error',
          {
            allow: ['**/*.css', '**/*.scss'],
          },
        ],
        'import/no-named-default': 'off',
        'import/no-default-export': 'off',
        'import/no-named-export': 'off',
        'import/no-anonymous-default-export': 'error',
        'import/group-exports': 'off',
        'import/dynamic-import-chunkname': 'off',
      },
    },
  ];
};

export default createImportsConfig;
