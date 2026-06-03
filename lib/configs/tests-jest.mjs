import jest from 'eslint-plugin-jest';

const TEST_FILES = [
  '**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx,mts,cts}',
  '**/tests/**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}',
  '**/__tests__/**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}',
];

export default [
  {
    files: TEST_FILES,
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    settings: {
      jest: {
        version: 30,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      'jest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/expect-expect': 'error',
      'jest/valid-expect': 'error',
    },
  },
  {
    files: TEST_FILES,
    rules: {
      'no-magic-numbers': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
    },
  },
];
