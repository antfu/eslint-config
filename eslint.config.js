// @ts-check
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import antfu from './dist/index.js'

export default antfu(
  {
    vue: true,
    // react: true,
    typescript: true,
    ignores: [
      'fixtures',
      '_fixtures',
    ],
    prettier: {
      html: true,
      css: true,
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
)
