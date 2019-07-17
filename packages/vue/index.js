module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@antfu/eslint-config',
    'plugin:vue/recommended',
  ],
  plugins: [
    'vue'
  ],
  rules: {}
}
