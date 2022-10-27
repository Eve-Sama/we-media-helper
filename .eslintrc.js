module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: { ecmaVersion: 2021 },
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['import', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'import/no-duplicates': 'error',
    'import/no-unused-modules': 'error',
    'import/no-unassigned-import': 'error',
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: false },
        'newlines-between': 'always',
        groups: ['external', 'builtin', 'internal', ['parent', 'sibling', 'index']],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array-simple',
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: {
            message: 'Use {} instead.',
          },
          String: {
            message: 'Use string instead.',
          },
          Number: {
            message: 'Use number instead.',
          },
          Boolean: {
            message: 'Use boolean instead.',
          },
          Function: {
            message: 'Use specific callable interface instead.',
          },
        },
      },
    ],
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit',
      },
    ],
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true,
        ignoreProperties: true,
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-bitwise': 'off',
    'no-duplicate-imports': 'error',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'error',
    'no-magic-numbers': 'off',
    'no-multiple-empty-lines': 'error',
    'no-redeclare': 'off',
    'no-underscore-dangle': 'off',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'off',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',
    yoda: 'error',
  },
};
