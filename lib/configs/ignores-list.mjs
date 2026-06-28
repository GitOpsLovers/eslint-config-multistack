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
