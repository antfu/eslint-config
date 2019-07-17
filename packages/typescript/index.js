module.exports = {
  plugins: [
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  extends: [
    '@antfu/eslint-config',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // TS
    '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
    '@typescript-eslint/type-annotation-spacing': ['error', {}],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
}
