import angularEslint from 'angular-eslint';

const angularConfig = [
    // TypeScript rules: plugin registration + recommended rules
    ...angularEslint.configs.tsRecommended,
    // Inline template processing for .ts component files
    {
        files: ['**/*.ts'],
        processor: angularEslint.processInlineTemplates,
    },
];

export default angularConfig;
