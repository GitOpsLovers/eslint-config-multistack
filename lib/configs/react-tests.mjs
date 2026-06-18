import jestDom from 'eslint-plugin-jest-dom-ya';
import testingLibrary from 'eslint-plugin-testing-library';

const REACT_TEST_FILES = [
  '**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}',
  '**/tests/**/*.{js,mjs,cjs,jsx,ts,tsx}',
  '**/__tests__/**/*.{js,mjs,cjs,jsx,ts,tsx}',
];

export default [
  {
    files: REACT_TEST_FILES,
    plugins: {
      'testing-library': testingLibrary,
      'jest-dom-ya': jestDom,
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...jestDom.configs['flat/recommended'].rules,
    },
  },
];
