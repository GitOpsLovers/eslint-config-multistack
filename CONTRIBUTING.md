# Contributing

Thanks for your interest in improving `eslint-config-multistack`. This document explains how to set up the project locally, the conventions we follow, and how a change reaches a published release.

## Requirements

- Node `>= 24.15.0`
- pnpm `>= 11.1.2`
- Git

## Getting started

```bash
git clone https://github.com/GitOpsLovers/eslint-config-multistack.git
cd eslint-config-multistack
pnpm install
```

`pnpm install` also installs the Husky `commit-msg` hook, which validates that every commit message follows Conventional Commits.

## Scripts

- `pnpm lint` — Runs ESLint on the whole repo.
- `pnpm test` — Runs the Vitest suite with coverage.

Both must be green before opening a pull request.

## Trying the plugin in another project

Sometimes you want to validate a change against a real Angular, React or Express project before opening a PR. Three options, from fastest to most reliable:

### 1. `pnpm link` (live link)

From your target project, point `pnpm` at the local plugin folder:

```bash
pnpm link /absolute/path/to/eslint-config-multistack
```

Any change you save in `lib/` or `index.mjs` is picked up the next time ESLint runs in the target project. When you are done, remove the link from the target project:

```bash
pnpm unlink eslint-config-multistack
pnpm install
```

> Tip: the old `pnpm link --global` flow was removed in pnpm 9+. Always pass the absolute path to the plugin folder.

### 2. `pnpm pack` (closest to a real install)

Builds the same tarball that would be published to npm. Best to catch packaging bugs (missing files in the `files` array of `package.json`).

```bash
# in the plugin folder
pnpm pack
# produces eslint-config-multistack-<version>.tgz

# in the target project
pnpm add -D /absolute/path/to/eslint-config-multistack-<version>.tgz
```

Reinstall the tarball every time you want to test a new change.

### 3. `file:` dependency

Quick alternative without packing:

```bash
# in the target project
pnpm add -D file:/absolute/path/to/eslint-config-multistack
```

Then add the preset to your `eslint.config.mjs`:

```js
import multistack from '@gitopslovers/eslint-config-multistack';

export default [
  ...multistack.configs.react,
];
```

Run ESLint in the target project to see the rules in action:

```bash
pnpm exec eslint .
```

## Project layout

- `index.mjs` — Plugin entry point. Exports `configs.angular`, `configs.react`, `configs.express`, `configs.next` and `configs.tsLibrary`.
- `lib/configs/` — Shared flat-config layers (`base`, `jsdoc`, `prefer-arrow`, `regex`, `security`, `typescript`) used by every preset.
- `lib/presets/` — Framework presets that compose the shared layers and add framework-specific rules.
- `tests/` — Vitest tests for the entry point, every shared config and every preset.

When you change a config or preset, add or update the matching test under `tests/`.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/) because `semantic-release` derives the next version from them.

- `fix: ...` → patch release
- `feat: ...` → minor release
- `feat!: ...` or `BREAKING CHANGE:` in the footer → major release
- `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, `build:`, `perf:`, `style:` → no release

Examples:

```
feat(react): enable react/jsx-no-leaked-render
fix(typescript): scope strict rules to .ts files only
docs(readme): clarify how to extend presets
```

The Husky hook will reject commits that do not follow this format.

## Pull requests

1. Create a branch from `main`.
2. Make your change. Keep the diff focused.
3. Run `pnpm lint` and `pnpm test`.
4. Open a pull request against `main`. Describe the motivation and any rule additions or rule changes.
5. A maintainer will review and merge.

## Releases

Releases are fully automated with `semantic-release`. Maintainers trigger them on demand:

1. GitHub → **Actions** → **Release** workflow → **Run workflow** on `main`.
2. `semantic-release` analyzes the commits since the last release and, if there is anything releasable, publishes to npm, creates the GitHub release with notes, and commits the updated `CHANGELOG.md` and `package.json` back to `main`.

Contributors do not need to bump versions or edit the changelog manually.

## License

By contributing you agree that your contributions will be licensed under the [MIT License](LICENSE).
