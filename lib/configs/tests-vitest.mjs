import vitest from '@vitest/eslint-plugin';

const TEST_FILES = [
  '**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx,mts,cts}',
  '**/tests/**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}',
  '**/__tests__/**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}',
];

export default [
  {
    files: TEST_FILES,
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/expect-expect': 'error',
      'vitest/valid-expect': 'error',
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
