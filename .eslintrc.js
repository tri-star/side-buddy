module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    // "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'standard-with-typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
    // "plugin:jest/recommended",
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: '.',
    project: [
      './tsconfig.json',
      './tsconfig.node.json',
      './packages/app/tsconfig.json',
      './packages/app/tsconfig.node.json',
    ],
    sourceType: 'module',
  },
  plugins: [
    'react',
    // "jest",
    'jsx-a11y',
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    'no-console': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    // {
    //   "files": [
    //     "src/**/__tests__/**/*.(ts,tsx)",
    //   ],
    //   env: {
    //     "jest/globals": true,
    //   },
    //   "extends": [
    //     "plugin:jest/recommended",
    //     "plugin:jest/style"
    //   ],
    //   "plugins": ["jest"]
    // }
  ],
}