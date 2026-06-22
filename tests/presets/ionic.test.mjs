import { describe, expect, test } from 'vitest';

import createConfig from '../../lib/presets/ionic.mjs';

describe('ionic config', () => {
  describe('factory function', () => {
    test('is a function', () => {
      expect(typeof createConfig).toBe('function');
    });

    test('returns an array', () => {
      expect(Array.isArray(createConfig())).toBe(true);
    });

    test('throws for unknown framework', () => {
      expect(() => createConfig({ framework: 'vue' })).toThrow(
        '[eslint-config-multistack] Unknown framework "vue"',
      );
    });

    test('throws for unknown testRunner', () => {
      expect(() => createConfig({ testRunner: 'mocha' })).toThrow(
        '[eslint-config-multistack] Unknown testRunner "mocha"',
      );
    });
  });

  describe('with React framework (default)', () => {
    const config = createConfig();
    const preset = config.at(-1);
    const ignoresEntry = config.find((entry) => Array.isArray(entry.ignores));
    const importsEntry = config.find((entry) => entry.plugins?.import && entry.plugins?.['unused-imports']);
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    const jestEntry = config.find((entry) => entry.plugins?.jest);

    test('includes browser globals', () => {
      expect(preset.languageOptions.globals.window).toBeDefined();
    });

    test('includes node globals', () => {
      expect(preset.languageOptions.globals.process).toBeDefined();
    });

    test('enables JSX parser options', () => {
      expect(preset.languageOptions.parserOptions.ecmaFeatures.jsx).toBe(true);
    });

    test('detects React version', () => {
      expect(preset.settings.react.version).toBe('detect');
    });

    test('enforces no-shadow', () => {
      expect(preset.rules['no-shadow']).toBe('error');
    });

    test('enforces prefer-arrow-callback', () => {
      expect(preset.rules['prefer-arrow-callback']).toBe('error');
    });

    test('includes React ESLint plugin config', () => {
      const reactEntry = config.find((entry) => entry.files?.includes('**/*.jsx') || entry.files?.includes('**/*.tsx'));
      expect(reactEntry).toBeDefined();
    });

    test('includes react-tests config (testing-library)', () => {
      const rtlEntry = config.find((entry) => entry.plugins?.['testing-library']);
      expect(rtlEntry).toBeDefined();
    });

    test('includes imports config', () => {
      expect(importsEntry).toBeDefined();
      expect(importsEntry.rules['unused-imports/no-unused-imports']).toBe('error');
    });

    test('includes default ignores without .angular/', () => {
      expect(ignoresEntry.ignores).toEqual([
        'node_modules/',
        'dist/',
        'coverage/',
        '.turbo/',
      ]);
    });

    test('includes vitest plugin by default', () => {
      expect(vitestEntry).toBeDefined();
    });

    test('does not include jest plugin by default', () => {
      expect(jestEntry).toBeUndefined();
    });

    test('does not include angular configs', () => {
      const angularEntry = config.find((entry) => entry.plugins?.['@angular-eslint']);
      expect(angularEntry).toBeUndefined();
    });

    test('does not include angular template configs', () => {
      const templateEntry = config.find((entry) => entry.plugins?.['@angular-eslint/template']);
      expect(templateEntry).toBeUndefined();
    });
  });

  describe('with Angular framework', () => {
    const config = createConfig({ framework: 'angular' });
    const preset = config.findLast((entry) => entry.languageOptions?.globals?.window !== undefined);
    const ignoresEntry = config.find((entry) => Array.isArray(entry.ignores));

    test('includes browser globals', () => {
      expect(preset.languageOptions.globals.window).toBeDefined();
    });

    test('disables no-shadow (Angular decorator pattern)', () => {
      expect(preset.rules['no-shadow']).toBe('off');
    });

    test('limits classes to one per file', () => {
      expect(preset.rules['max-classes-per-file']).toEqual(['error', 1]);
    });

    test('includes @angular-eslint plugin', () => {
      const angularEntry = config.find((entry) => entry.plugins?.['@angular-eslint']);
      expect(angularEntry).toBeDefined();
    });

    test('includes recommended TypeScript rules', () => {
      const tsRecommended = config.find((entry) => entry.name === 'angular-eslint/ts-recommended');
      expect(tsRecommended).toBeDefined();
      expect(tsRecommended.rules['@angular-eslint/contextual-lifecycle']).toBe('error');
    });

    test('includes @angular-eslint/template plugin scoped to .html files', () => {
      const templateEntry = config.find(
        (entry) => entry.plugins?.['@angular-eslint/template'] && entry.files?.includes('**/*.html'),
      );
      expect(templateEntry).toBeDefined();
    });

    test('includes template recommended and accessibility rules', () => {
      const templateEntry = config.find((entry) => entry.files?.includes('**/*.html'));
      expect(templateEntry.rules['@angular-eslint/template/banana-in-box']).toBe('error');
      expect(templateEntry.rules['@angular-eslint/template/alt-text']).toBe('error');
    });

    test('includes inline template processor for .ts files', () => {
      const processorEntry = config.find(
        (entry) => entry.processor && entry.files?.includes('**/*.ts'),
      );
      expect(processorEntry).toBeDefined();
    });

    test('includes .angular/ in ignores', () => {
      expect(ignoresEntry.ignores).toContain('.angular/');
    });

    test('does not include React config', () => {
      const reactEntry = config.find(
        (entry) => entry.files?.includes('**/*.jsx') || entry.files?.includes('**/*.tsx'),
      );
      expect(reactEntry).toBeUndefined();
    });

    test('does not include react-tests config', () => {
      const rtlEntry = config.find((entry) => entry.plugins?.['testing-library']);
      expect(rtlEntry).toBeUndefined();
    });

    test('wraps common configs to JS/TS files only', () => {
      const baseEntry = config.find((entry) => entry.rules?.['no-var']);
      expect(baseEntry.files).toEqual(['**/*.{js,mjs,cjs,ts}']);
    });

    test('includes prettier config', () => {
      const prettierEntry = config.find((entry) => entry.plugins?.prettier);
      expect(prettierEntry).toBeDefined();
    });
  });

  describe('with testRunner option', () => {
    test('react with jest includes jest plugin', () => {
      const config = createConfig({ framework: 'react', testRunner: 'jest' });
      const jestEntry = config.find((entry) => entry.plugins?.jest);
      expect(jestEntry).toBeDefined();
      expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
    });

    test('react with jest does not include vitest plugin', () => {
      const config = createConfig({ framework: 'react', testRunner: 'jest' });
      const vitestEntry = config.find((entry) => entry.plugins?.vitest);
      expect(vitestEntry).toBeUndefined();
    });

    test('angular with jest includes jest plugin', () => {
      const config = createConfig({ framework: 'angular', testRunner: 'jest' });
      const jestEntry = config.find((entry) => entry.plugins?.jest);
      expect(jestEntry).toBeDefined();
    });

    test('angular with vitest includes vitest plugin', () => {
      const config = createConfig({ framework: 'angular', testRunner: 'vitest' });
      const vitestEntry = config.find((entry) => entry.plugins?.vitest);
      expect(vitestEntry).toBeDefined();
    });
  });

  describe('with tsConfig option', () => {
    const customConfig = createConfig({ tsConfig: 'tsconfig.custom.json' });

    test('passes tsConfig to typescript config', () => {
      const tsEntry = customConfig.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
    });

    test('passes tsConfig to imports config', () => {
      const iEntry = customConfig.find((entry) => entry.plugins?.import);
      expect(iEntry.settings['import-x/resolver'].typescript.project).toContain('tsconfig.custom.json');
    });
  });

  describe('with all options combined', () => {
    test('angular + jest + custom tsConfig', () => {
      const config = createConfig({
        framework: 'angular',
        testRunner: 'jest',
        tsConfig: 'tsconfig.jest.json',
      });
      const jestEntry = config.find((entry) => entry.plugins?.jest);
      expect(jestEntry).toBeDefined();
      const tsEntry = config.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.jest.json'] });
      const angularEntry = config.find((entry) => entry.plugins?.['@angular-eslint']);
      expect(angularEntry).toBeDefined();
    });

    test('react + jest + custom tsConfig', () => {
      const config = createConfig({
        framework: 'react',
        testRunner: 'jest',
        tsConfig: 'tsconfig.jest.json',
      });
      const jestEntry = config.find((entry) => entry.plugins?.jest);
      expect(jestEntry).toBeDefined();
      const tsEntry = config.find((entry) => entry.plugins?.['@typescript-eslint']);
      expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.jest.json'] });
      const rtlEntry = config.find((entry) => entry.plugins?.['testing-library']);
      expect(rtlEntry).toBeDefined();
    });
  });
});
