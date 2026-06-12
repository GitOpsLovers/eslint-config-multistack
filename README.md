# eslint-config-multistack

Opinionated ESLint configuration presets for modern JavaScript and TypeScript frameworks.

Install it, choose a preset, and get a solid default ruleset for JavaScript, TypeScript, tests, security and common code-style decisions.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Next](https://img.shields.io/badge/Next-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-ffffff?style=for-the-badge&logo=express&logoColor=black)

## Why use it

- One package with reusable configuration presets
- Ready for ESLint flat configuration
- Best Practices in JavaScript, TypeScript and security
- Easy to extend with your own rules on top

## Requirements

- Node `>= 24`
- ESLint `>= 10.3.0`

## Installation

```bash
npm install --save-dev eslint @gitopslovers/eslint-config-multistack
```

If you use `pnpm`:

```bash
pnpm add -D eslint @gitopslovers/eslint-config-multistack
```

## Quick start

Create an `eslint.config.mjs` file and spread the preset you want to use.

```js
import multistack from '@gitopslovers/eslint-config-multistack';

export default [
  ...multistack.configs.presetName(),
];
```

## Current presets

These are the presets currently available on the package:

| Preset                                  | Description                 |
|-----------------------------------------|-----------------------------|
| `multistack.configs.react()`            | React projects              |
| `multistack.configs.next()`             | Next projects               |
| `multistack.configs.angular()`          | Angular projects            |
| `multistack.configs.express()`          | Express and Node backends   |
| `multistack.configs.tsLibrary(options)` | TypeScript library projects |

Every preset accepts an optional `options` object with the following keys:

| Option     | Type     | Default           | Description                                    |
|------------|----------|-------------------|------------------------------------------------|
| `tsconfig` | `string` | `'tsconfig.json'` | Path to your project's TypeScript config file. |

The `tsLibrary` and `express` presets also accepts:

| Option       | Type                 | Default    | Description                 |
|--------------|----------------------|------------|-----------------------------|
| `testRunner` | `'vitest' \| 'jest'` | `'vitest'` | Which test framework to use |

Example:

```js
import multistack from '@gitopslovers/eslint-config-multistack';

export default [
  ...multistack.configs.tsLibrary({ testRunner: 'jest', tsconfig: 'tsconfig.app.json' }),
  ...multistack.configs.react({ tsconfig: 'tsconfig.web.json' }),
];
```

## What is included in every preset

Every preset already bundles rules for:

- JavaScript best practices
- JSDoc
- Arrow function preference
- Regex optimization
- Security and secret detection
- Vitest or Jest on `*.test.*`, `*.spec.*`, `tests/**` and `__tests__/**`
- TypeScript best practices on `*.ts`, `*.tsx`, `*.mts` and `*.cts`

## Customize it

Append your own configuration after the preset to override any rule.

```js
import multistack from '@gitopslovers/eslint-config-multistack';

export default [
  ...multistack.configs.angular(),
  {
    rules: {
      'no-console': 'off',
    },
  },
];
```

## License

[MIT](LICENSE) © GitOps Lovers