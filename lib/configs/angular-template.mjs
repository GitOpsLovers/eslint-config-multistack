import angularEslint from 'angular-eslint';

const templateRecommendedRules = angularEslint.configs.templateRecommended.find(
    (c) => c.name === 'angular-eslint/template-recommended',
)?.rules ?? {};

const templateAccessibilityRules = angularEslint.configs.templateAccessibility.find(
    (c) => c.name === 'angular-eslint/template-accessibility',
)?.rules ?? {};

const angularTemplateConfig = [
    {
        files: ['**/*.html'],
        plugins: {
            '@angular-eslint/template': angularEslint.configs.templateRecommended.find(
                (c) => c.plugins?.['@angular-eslint/template'],
            )?.plugins?.['@angular-eslint/template'],
        },
        languageOptions: {
            parser: angularEslint.templateParser,
        },
        rules: {
            ...templateRecommendedRules,
            ...templateAccessibilityRules,
        },
    },
];

export default angularTemplateConfig;
