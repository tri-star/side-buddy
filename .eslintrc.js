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
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],
    '@typescript-eslint/require-await': 'off',

    'jsx-a11y/click-events-have-key-events': 'off', // divタグなどにonClickを付けるがキーを割り当てないことがあるのでoff
    'jsx-a11y/no-static-element-interactions': 'off', // divタグなどにonClickを付けたいときがあるのでoff
    'jsx-a11y/anchor-is-valid': 'off', // aタグを使うときにhrefを付けないことがあるのでoff
    '@typescript-eslint/non-nullable-type-assertion-style': 'off', // 対処してもno-nonnull-assertionで引っかかってしまうため
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
