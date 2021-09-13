// eslint-disable-next-line @typescript-eslint/no-var-requires
const basic = require('@antfu/eslint-config-basic')

module.exports = {
  extends: [
    '@antfu/eslint-config-basic',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: basic.overrides,
  rules: {
    'import/named': 'off',

    // TS
    'no-useless-constructor': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
    '@typescript-eslint/type-annotation-spacing': ['error', {}],

    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',

    // off
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
  },
}
