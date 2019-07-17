module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@antfu/eslint-config-ts',
    'plugin:vue/recommended',
  ],
  plugins: [
    'vue'
  ],
  rules: {}
}
