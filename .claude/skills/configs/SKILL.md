---
name: configs
description: Use this skill when you're asked to work with the configurations used by the presets in lib/configs/.
---

# Configuration skill

## File location
Configs live in `lib/configs/{config-name}.mjs`


## What configurations are

Configs are **atomic, single-concern** ESLint configuration modules. They represent a specific plugin, tool, or rule set (e.g., security rules, TypeScript rules, React rules). Presets compose multiple configs together.

## Two configuration patterns

### Pattern A: static configuration (no options)

Used when the configuration has no dynamic behavior. Most configurations follow this pattern.

```js
import somePlugin from 'eslint-plugin-something';

const somethingConfig = [
    {
        files: ['**/*.{js,ts,tsx}'],
        plugins: {
            'plugin-name': somePlugin,
        },
        rules: {
            'plugin-name/rule-one': 'error',
            'plugin-name/rule-two': 'warn',
        },
    },
];

export default somethingConfig;
```

### Pattern B: factory function (accepts options)

Used when the configuration depends on user-provided options (e.g., `tsConfig` path).

```js
import somePlugin from 'eslint-plugin-something';
import someParser from 'some-parser';

const createSomethingConfig = ({ tsConfig } = {}) => [
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        languageOptions: {
            parser: someParser,
            parserOptions: tsConfig
                ? { project: [tsConfig] }
                : { projectService: true },
        },
        plugins: {
            'plugin-name': somePlugin,
        },
        rules: {
            'plugin-name/rule-one': 'error',
        },
    },
];

export default createSomethingConfig;
```

### Special configuration: `ignores-list.mjs`

The `ignores-list.mjs` configuration consolidates all global ignore patterns. It is a factory function that accepts an `extraIgnores` option:

```js
const createIgnoresConfig = ({ extraIgnores = [] } = {}) => [
    {
        ignores: [
            'node_modules/',
            'dist/',
            'coverage/',
            '.turbo/',
            ...extraIgnores,
        ],
    },
];

export default createIgnoresConfig;
```

Each preset calls it with its framework-specific patterns (e.g., `.angular/`, `.next/**`, `next-env.d.ts`).

## Key conventions

### Always export an array

Every configuration exports an **array** of configuration objects, even if there's only one entry.

### Plugin registration

```js
plugins: {
    'plugin-namespace': importedPlugin,
}
```

### File scoping

```js
files: ['**/*.{ts,tsx,mts,cts}']                                                                    // TypeScript
files: ['**/*.jsx', '**/*.tsx']                                                                     // React components
files: ['**/*.html']                                                                                // Angular templates
files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx,mts,cts}', '**/tests/**/*', '**/__tests__/**/*']   // Tests
```

### Using external plugin recommended configurations

```js
import somePlugin from 'some-eslint-plugin';
const recommended = somePlugin.configs['recommended'];

const config = [
    {
        files: ['**/*.{js,ts}'],
        plugins: { 'plugin-name': somePlugin },
        rules: {
            ...recommended.rules,
            'plugin-name/specific-rule': 'warn',  // override
        },
    },
];
export default config;
```

### Using packages with flat configuration arrays (e.g., angular-eslint)

```js
import angularEslint from 'angular-eslint';

const config = [
    ...angularEslint.configs.tsRecommended,
    {
        files: ['**/*.ts'],
        processor: angularEslint.processInlineTemplates,
    },
];
export default config;
```

### Multi-entry configurations

Some configurations have multiple entries (e.g., rules + relaxations for test files):

```js
const testsConfig = [
    {
        files: ['**/*.{test,spec}.{js,ts}', '**/tests/**/*'],
        plugins: { vitest: vitestPlugin },
        rules: { 'vitest/no-focused-tests': 'error' },
    },
    {
        files: ['**/*.{test,spec}.{js,ts}', '**/tests/**/*'],
        rules: { 'max-classes-per-file': 'off' },
    },
];
```

## Naming conventions

| Element                 | Convention                       | Example                                    |
|-------------------------|----------------------------------|--------------------------------------------|
| File name               | kebab-case.mjs                   | `angular-template.mjs`, `tests-vitest.mjs` |
| Static export variable  | camelCase + `Config`             | `angularConfig`, `securityConfig`          |
| Factory export variable | `create` + PascalCase + `Config` | `createTypescriptConfig`                   |
| Import alias (static)   | descriptiveNameConfig            | `testsVitestConfig`, `baseConfig`          |
| Import alias (factory)  | createDescriptiveConfig          | `createImportsConfig`                      |

## Dependencies

New external plugins are installed as **dependencies**:

```bash
pnpm add eslint-plugin-xxx
```

## Checklist for creating a new configuration

1. Create `lib/configs/{name}.mjs` following the appropriate pattern
2. Install any required plugin: `pnpm add eslint-plugin-xxx`
3. Create `tests/configs/{name}.test.mjs`
4. Import and spread the config in the relevant preset(s) in `lib/presets/`
5. Run `pnpm run test` to verify all tests pass

## Checklist for modifying an existing configuration

1. Make the change in `lib/configs/{name}.mjs`
2. Update the corresponding test in `tests/configs/{name}.test.mjs`
3. Check if the change affects any preset tests
4. Run `pnpm run test` to verify all tests pass