import styleMigrate from '@stylistic/eslint-plugin-migrate'

import { antfu } from './src'

export default antfu(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: true,
    pnpm: true,
    type: 'lib',
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
    ],
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
