module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'plugin:vue/recommended',
    '@antfu/eslint-config-ts',
  ],
  plugins: [
    'vue'
  ],
  rules: {}
}
