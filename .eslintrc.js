module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    "jest/globals": true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    'standard-with-typescript',
    "plugin:jsx-a11y/recommended",
    'plugin:react/recommended',
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: ".",
    project: ["./tsconfig.json"],
    sourceType: 'module'
  },
  plugins: [
    'react',
    "jest",
    "jsx-a11y",
    '@typescript-eslint',
    "react-hooks"
  ],
  settings: {
    "react": {
      "version": "detect"
    }
  },
  rules: {
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",

    "@typescript-eslint/naming-convention": "warn",
    "@typescript-eslint/semi": "warn",
    // "curly": "warn",
    // "eqeqeq": "warn",
    // "no-throw-literal": "warn",
    // "semi": "off"
  },
  ignorePatterns: [
    "out",
    "dist",
    "**/*.d.ts"
  ],
  "overrides": [
    {
      "files": ["*.tsx"],
      "rules": {
        "react/prop-types": "off"
      }
    },
    {
      "files": [
        "src/**/__tests__/**/*.(ts,tsx)",
      ],
      env: {
        "jest/globals": true,
      },
      "extends": [
        "plugin:jest/recommended",
        "plugin:jest/style"
      ],
      "plugins": ["jest"]
    }
  ]
};
