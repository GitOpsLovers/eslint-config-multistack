const JS_TS_FILES = ['**/*.{js,mjs,cjs,ts}'];

/**
 * Wraps the given configurations to apply only to JS/TS files.
 */
const jstsOnly = (configs) =>
    configs.map((config) => ({
        ...config,
        files: config.files ?? JS_TS_FILES,
    }));

export { jstsOnly, JS_TS_FILES };
