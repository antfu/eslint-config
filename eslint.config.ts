// @ts-expect-error missing types
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
  .removeRules(
    'ts/no-unsafe-member-access',
    'ts/no-unsafe-argument',
    'ts/no-unsafe-assignment',
  )
