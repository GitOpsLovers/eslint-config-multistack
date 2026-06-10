import { readFileSync } from 'node:fs';

import createAngularConfig from './lib/presets/angular.mjs';
import createExpressConfig from './lib/presets/express.mjs';
import createReactConfig from './lib/presets/react.mjs';
import createNextConfig from './lib/presets/next.mjs';
import createTsLibraryConfig from './lib/presets/ts-library.mjs';

const packageVersion = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
).version;

const plugin = {
  meta: {
    name: 'eslint-config-multistack',
    version: packageVersion,
  },
  rules: {},
  configs: {},
};

plugin.configs = {
  angular: (options) => [
    { name: 'multistack/angular', plugins: { multistack: plugin } },
    ...createAngularConfig(options),
  ],
  react: (options) => [
    { name: 'multistack/react', plugins: { multistack: plugin } },
    ...createReactConfig(options),
  ],
  next: (options) => [
    { name: 'multistack/next', plugins: { multistack: plugin } },
    ...createNextConfig(options),
  ],
  express: (options) => [
    { name: 'multistack/express', plugins: { multistack: plugin } },
    ...createExpressConfig(options),
  ],
  tsLibrary: (options) => [
    { name: 'multistack/ts-library', plugins: { multistack: plugin } },
    ...createTsLibraryConfig(options),
  ],
};

// Backward-compatible alias.
plugin.flatConfigs = plugin.configs;

export default plugin;
