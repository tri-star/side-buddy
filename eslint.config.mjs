import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import love from 'eslint-config-love'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

const compat = new FlatCompat()

export default tseslint.config([
  {
    ignores: [
      'packages/app/dist/**/*',
      'eslint.config.mjs',
      'packages/app/vite.config.ts',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
        ...globals.es2022,
        Thenable: true,
      },
    },
  },
  eslint.configs.recommended,
  love,
  jsxA11y.flatConfigs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    languageOptions: {
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
    },
  },
  {
    rules: {
      complexity: ['warn', 6],
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
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off', // getElementByIdをasでキャストしたいときがあるのでoff
      'logical-assignment-operators': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off', // nullとの==比較で意図せずエラー判定となるためoff
      '@typescript-eslint/prefer-destructuring': 'off', // 分割代入が常に読みやすいと限らないのでoff
      '@typescript-eslint/no-unnecessary-type-parameters': 'off', // 型パラメータが1回参照されるだけのケースもあるためoff
      '@typescript-eslint/class-methods-use-this': 'off', // クラスメソッド内でthisを使わない時もあるためoff

      'promise/avoid-new': 'off',
      'no-unused-vars': [
        'warn',
        {
          reportUsedIgnorePattern: true,
        },
      ],
    },
  },
])
