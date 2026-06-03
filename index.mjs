import { readFileSync } from 'node:fs';

import angularConfig from './lib/presets/angular.mjs';
import expressConfig from './lib/presets/express.mjs';
import reactConfig from './lib/presets/react.mjs';
import nextConfig from './lib/presets/next.mjs';
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
  angular: [
    { name: 'multistack/angular', plugins: { multistack: plugin } },
    ...angularConfig,
  ],
  react: [
    { name: 'multistack/react', plugins: { multistack: plugin } },
    ...reactConfig,
  ],
  next: [
    { name: 'multistack/next', plugins: { multistack: plugin } },
    ...nextConfig,
  ],
  express: [
    { name: 'multistack/express', plugins: { multistack: plugin } },
    ...expressConfig,
  ],
  tsLibrary: (options) => [
    { name: 'multistack/ts-library', plugins: { multistack: plugin } },
    ...createTsLibraryConfig(options),
  ],
};

// Backward-compatible alias.
plugin.flatConfigs = plugin.configs;

export default plugin;
