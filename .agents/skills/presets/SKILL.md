---
name: presets
description: Use this skill when you're asked to work with the presets provided by this library.
---

# Presets skill

## File location

Presets live in `lib/presets/{preset-name}.mjs`

## Preset template

```js
import globals from 'globals';

import createIgnoresConfig from '../configs/ignores-list.mjs';
import baseConfig from '../configs/base.mjs';
// Optional function for working only with JS/TS files
import { jstsOnly } from '../utils/jsts-only.mjs';
// + common configuration imports
// + framework specific configuration imports

/**
 * PresetName preset
 */
const createPresetNameConfig = ({ options } = {}) => {

  const ignoresConfig = createIgnoresConfig({ extraIgnores: ['framework-specific-pattern/'] });

  return [    
    ...ignoresConfig,
    // Common configuration blocks
    {
      // Common configuration overrides for this preset
    },
  ];
};

export default createPresetNameConfig;
```

## Configuration options

Presets can be configured to modify their behavior. The following table shows the available options:

| Option     | Purpose                                                      |
|------------|--------------------------------------------------------------|
| tsConfig   | Path to the tsconfig.json file that the preset will use      |
| testRunner | The test runner to use (`'vitest'` or `'jest'`)              |
| framework  | The framework to use (`'react'`, `'angular'`, `'vue'`, etc.) |

## Registration in `index.mjs`

After creating a preset, register it:

```js
import createPresetNameConfig from './lib/presets/preset-name.mjs';

presetName: (options) => [
  { name: 'multistack/preset-name', plugins: { multistack: plugin } },
  ...createPresetNameConfig(options),
],
```

## Reusable utilities in `lib/utils/`

Shared utility functions used by presets live in `lib/utils/`. Currently available:

- **`jstsOnly`** / **`JS_TS_FILES`** (`lib/utils/jsts-only.mjs`): scopes an array of config objects to JS/TS files only (`**/*.{js,mjs,cjs,ts}`). Configs that already have a `files` property are left unchanged.

```js
import { jstsOnly } from '../utils/jsts-only.mjs';

jstsOnly(baseConfig)
```

## Checklist for creating a new preset

1. Create `lib/presets/{name}.mjs` following the template
2. Register in `index.mjs` with import + config entry
3. Create `tests/presets/{name}.test.mjs`
4. Update `tests/index.test.mjs` (expected arrays + specific tests)
5. Update `README.md` (badge, preset table, options table if applicable)
6. Run `pnpm run test` to verify all tests pass
