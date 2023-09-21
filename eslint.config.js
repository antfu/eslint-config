import { defineFlatConfig } from 'eslint-define-config'
import { presetAuto } from '@antfu/eslint-config'
import stylisticMigrate from '@stylistic/eslint-plugin-migrate'
import sortKeys from 'eslint-plugin-sort-keys'

export default defineFlatConfig([
  ...presetAuto,
  {
    files: ['**/eslint-config/src/**/*.ts'],
    plugins: {
      '@stylistic/migrate': stylisticMigrate,
      'sort-keys': sortKeys,
    },
    rules: {
      '@stylistic/migrate/rules': 'error',
      'sort-keys/sort-keys-fix': 'error',
    },
  },
])
