import { describe, expect, test } from 'vitest';

import plugin from '../index.mjs';

describe('eslint-config-multistack', () => {
  test('exports a meta object with name and version', () => {
    expect(plugin.meta).toBeDefined();
    expect(plugin.meta.name).toBe('eslint-config-multistack');
    expect(typeof plugin.meta.version).toBe('string');
  });

  test('exports a rules object', () => {
    expect(plugin.rules).toBeDefined();
    expect(typeof plugin.rules).toBe('object');
  });

  test('exports flat configs for all presets', () => {
    const expected = ['angular', 'react', 'express', 'nestjs'];
    expect(Object.keys(plugin.configs)).toEqual(expect.arrayContaining(expected));
  });

  test('keeps flatConfigs alias for backwards compatibility', () => {
    const expected = ['angular', 'react', 'express', 'nestjs'];
    expect(Object.keys(plugin.flatConfigs)).toEqual(expect.arrayContaining(expected));
  });

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'flat config constructors are functions',
    (preset) => {
      expect(typeof plugin.configs[preset]).toBe('function');
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'flat config "%s" returns an array and includes multistack in plugins object',
    (preset) => {
      const cfg = plugin.configs[preset]();
      expect(Array.isArray(cfg)).toBe(true);
      expect(cfg[0].plugins).toBeDefined();
      expect(cfg[0].plugins.multistack).toBe(plugin);
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" has a name field',
    (preset) => {
      const cfg = plugin.configs[preset]();
      expect(cfg[0].name).toBe(`multistack/${preset}`);
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" has a rules object',
    (preset) => {
      const cfg = plugin.configs[preset]();
      expect(cfg.at(-1).rules).toBeDefined();
      expect(typeof cfg.at(-1).rules).toBe('object');
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" includes jsdoc plugin config',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const jsdocEntry = cfg.find((entry) => entry.plugins?.jsdoc);
      expect(jsdocEntry).toBeDefined();
      expect(jsdocEntry.rules['jsdoc/no-types']).toBe('error');
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" includes prefer-arrow plugin config',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const preferArrowEntry = cfg.find((entry) => entry.plugins?.['prefer-arrow']);
      expect(preferArrowEntry).toBeDefined();
      expect(preferArrowEntry.rules['prefer-arrow/prefer-arrow-functions']).toBeDefined();
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" includes optimize-regex plugin config',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const regexEntry = cfg.find((entry) => entry.plugins?.['optimize-regex']);
      expect(regexEntry).toBeDefined();
      expect(regexEntry.rules['optimize-regex/optimize-regex']).toBe('error');
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" includes security plugin config',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const securityEntry = cfg.find(
        (entry) => entry.plugins?.['no-secrets'] && entry.plugins?.security,
      );
      expect(securityEntry).toBeDefined();
      expect(securityEntry.rules['no-secrets/no-secrets']).toBe('error');
      expect(securityEntry.rules['security/detect-eval-with-expression']).toBe('error');
    },
  );

  test.each(['angular', 'react', 'express', 'nestjs'])(
    'config "%s" includes typescript plugin config scoped to TS files',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const typescriptEntry = cfg.find(
        (entry) => entry.plugins?.['@typescript-eslint'],
      );
      expect(typescriptEntry).toBeDefined();
      expect(typescriptEntry.files).toEqual(['**/*.{ts,tsx,mts,cts}']);
      expect(typescriptEntry.rules['@typescript-eslint/no-unused-vars']).toBeDefined();
    },
  );

  test.each(['angular', 'react', 'express'])(
    'config "%s" includes vitest test config scoped to test files',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const vitestEntry = cfg.find(
        (entry) => entry.plugins?.vitest,
      );
      expect(vitestEntry).toBeDefined();
      expect(vitestEntry.files.some((glob) => glob.includes('test'))).toBe(true);
      expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
    },
  );

  test('config "react" includes testing-library and jest-dom-ya for test files', () => {
    const cfg = plugin.configs.react();
    const rtlEntry = cfg.find(
      (entry) => entry.plugins?.['testing-library'] && entry.plugins?.['jest-dom-ya'],
    );
    expect(rtlEntry).toBeDefined();
    const ruleKeys = Object.keys(rtlEntry.rules);
    expect(ruleKeys.some((key) => key.startsWith('testing-library/'))).toBe(true);
    expect(ruleKeys.some((key) => key.startsWith('jest-dom-ya/'))).toBe(true);
  });

  test.each(['angular', 'express', 'nestjs'])(
    'config "%s" does not include the react-tests plugin config',
    (preset) => {
      const cfg = plugin.configs[preset]();
      const rtlEntry = cfg.find(
        (entry) => entry.plugins?.['testing-library'],
      );
      expect(rtlEntry).toBeUndefined();
    },
  );

  test('tsLibrary config is a function', () => {
    expect(typeof plugin.configs.tsLibrary).toBe('function');
  });

  test('tsLibrary() without options returns an array with vitest config', () => {
    const config = plugin.configs.tsLibrary();
    expect(Array.isArray(config)).toBe(true);
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeDefined();
    expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
  });

  test('tsLibrary({ testRunner: "vitest" }) includes vitest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'vitest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeDefined();
    expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
  });

  test('tsLibrary({ testRunner: "jest" }) includes jest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'jest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeDefined();
    expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
  });

  test('tsLibrary({ testRunner: "jest" }) does not include vitest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'jest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeUndefined();
  });

  test('tsLibrary({ testRunner: "vitest" }) does not include jest config', () => {
    const config = plugin.configs.tsLibrary({ testRunner: 'vitest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeUndefined();
  });

  test('tsLibrary() result has name and multistack plugin in first entry', () => {
    const config = plugin.configs.tsLibrary();
    expect(config[0].name).toBe('multistack/ts-library');
    expect(config[0].plugins.multistack).toBe(plugin);
  });

  test('tsLibrary() with unknown testRunner throws an error', () => {
    expect(() => plugin.configs.tsLibrary({ testRunner: 'mocha' })).toThrow(
      '[eslint-config-multistack] Unknown testRunner "mocha"',
    );
  });

  test('angular({ tsConfig }) passes tsConfig to underlying configs', () => {
    const cfg = plugin.configs.angular({ tsConfig: 'tsconfig.app.json' });
    const tsEntry = cfg.find((entry) => entry.plugins?.['@typescript-eslint']);
    expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.app.json'] });
  });

  test('angular config includes @angular-eslint plugin', () => {
    const cfg = plugin.configs.angular();
    const angularEntry = cfg.find((entry) => entry.plugins?.['@angular-eslint']);
    expect(angularEntry).toBeDefined();
  });

  test('angular config includes @angular-eslint/template plugin scoped to .html files', () => {
    const cfg = plugin.configs.angular();
    const templateEntry = cfg.find(
      (entry) => entry.plugins?.['@angular-eslint/template'] && entry.files?.includes('**/*.html'),
    );
    expect(templateEntry).toBeDefined();
  });

  test('angular config includes recommended TypeScript rules', () => {
    const cfg = plugin.configs.angular();
    const tsRecommended = cfg.find((entry) => entry.name === 'angular-eslint/ts-recommended');
    expect(tsRecommended).toBeDefined();
    expect(tsRecommended.rules['@angular-eslint/contextual-lifecycle']).toBe('error');
  });

  test('angular config includes recommended template rules for .html files', () => {
    const cfg = plugin.configs.angular();
    const templateEntry = cfg.find((entry) => entry.files?.includes('**/*.html'));
    expect(templateEntry).toBeDefined();
    expect(templateEntry.rules['@angular-eslint/template/banana-in-box']).toBe('error');
  });

  test('angular config includes template accessibility rules for .html files', () => {
    const cfg = plugin.configs.angular();
    const templateEntry = cfg.find((entry) => entry.files?.includes('**/*.html'));
    expect(templateEntry.rules['@angular-eslint/template/alt-text']).toBe('error');
  });

  test('angular config includes inline template processor for .ts files', () => {
    const cfg = plugin.configs.angular();
    const processorEntry = cfg.find((entry) => entry.processor && entry.files?.includes('**/*.ts'));
    expect(processorEntry).toBeDefined();
  });

  test('react({ tsConfig }) passes tsConfig to underlying configs', () => {
    const cfg = plugin.configs.react({ tsConfig: 'tsconfig.custom.json' });
    const tsEntry = cfg.find((entry) => entry.plugins?.['@typescript-eslint']);
    expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
  });

  test('next({ tsConfig }) passes tsConfig to underlying configs', () => {
    const cfg = plugin.configs.next({ tsConfig: 'tsconfig.custom.json' });
    const tsEntry = cfg.find((entry) => entry.plugins?.['@typescript-eslint']);
    expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
  });

  test('express({ tsConfig }) passes tsConfig to underlying configs', () => {
    const cfg = plugin.configs.express({ tsConfig: 'tsconfig.custom.json' });
    const tsEntry = cfg.find((entry) => entry.plugins?.['@typescript-eslint']);
    expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
  });

  test('express({ testRunner: "vitest" }) includes vitest config', () => {
    const config = plugin.configs.express({ testRunner: 'vitest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeDefined();
    expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
  });

  test('express({ testRunner: "jest" }) includes jest config', () => {
    const config = plugin.configs.express({ testRunner: 'jest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeDefined();
    expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
  });

  test('express({ testRunner: "jest" }) does not include vitest config', () => {
    const config = plugin.configs.express({ testRunner: 'jest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeUndefined();
  });

  test('express({ testRunner: "vitest" }) does not include jest config', () => {
    const config = plugin.configs.express({ testRunner: 'vitest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeUndefined();
  });

  test('express() with unknown testRunner throws an error', () => {
    expect(() => plugin.configs.express({ testRunner: 'mocha' })).toThrow(
      '[eslint-config-multistack] Unknown testRunner "mocha"',
    );
  });

  test('tsLibrary({ tsConfig }) passes tsConfig to underlying configs', () => {
    const cfg = plugin.configs.tsLibrary({ tsConfig: 'tsconfig.custom.json' });
    const tsEntry = cfg.find((entry) => entry.plugins?.['@typescript-eslint']);
    expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
  });

  test('nestjs config is a function', () => {
    expect(typeof plugin.configs.nestjs).toBe('function');
  });

  test('nestjs() without options returns an array with jest config (default)', () => {
    const config = plugin.configs.nestjs();
    expect(Array.isArray(config)).toBe(true);
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeDefined();
    expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
  });

  test('nestjs() without options does not include vitest config', () => {
    const config = plugin.configs.nestjs();
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeUndefined();
  });

  test('nestjs({ testRunner: "vitest" }) includes vitest config', () => {
    const config = plugin.configs.nestjs({ testRunner: 'vitest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeDefined();
    expect(vitestEntry.rules['vitest/no-focused-tests']).toBe('error');
  });

  test('nestjs({ testRunner: "jest" }) includes jest config', () => {
    const config = plugin.configs.nestjs({ testRunner: 'jest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeDefined();
    expect(jestEntry.rules['jest/no-focused-tests']).toBe('error');
  });

  test('nestjs({ testRunner: "vitest" }) does not include jest config', () => {
    const config = plugin.configs.nestjs({ testRunner: 'vitest' });
    const jestEntry = config.find((entry) => entry.plugins?.jest);
    expect(jestEntry).toBeUndefined();
  });

  test('nestjs({ testRunner: "jest" }) does not include vitest config', () => {
    const config = plugin.configs.nestjs({ testRunner: 'jest' });
    const vitestEntry = config.find((entry) => entry.plugins?.vitest);
    expect(vitestEntry).toBeUndefined();
  });

  test('nestjs() result has name and multistack plugin in first entry', () => {
    const config = plugin.configs.nestjs();
    expect(config[0].name).toBe('multistack/nestjs');
    expect(config[0].plugins.multistack).toBe(plugin);
  });

  test('nestjs() with unknown testRunner throws an error', () => {
    expect(() => plugin.configs.nestjs({ testRunner: 'mocha' })).toThrow(
      '[eslint-config-multistack] Unknown testRunner "mocha"',
    );
  });

  test('nestjs({ tsConfig }) passes tsConfig to underlying configs', () => {
    const cfg = plugin.configs.nestjs({ tsConfig: 'tsconfig.custom.json' });
    const tsEntry = cfg.find((entry) => entry.plugins?.['@typescript-eslint']);
    expect(tsEntry.languageOptions.parserOptions).toEqual({ project: ['tsconfig.custom.json'] });
  });

  test('nestjs() uses commonjs sourceType', () => {
    const cfg = plugin.configs.nestjs();
    const presetEntry = cfg.findLast((entry) => entry.languageOptions?.sourceType);
    expect(presetEntry.languageOptions.sourceType).toBe('commonjs');
  });
});
