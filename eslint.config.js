import stylisticMigrate from '@stylistic/eslint-plugin-migrate'
import sortKeys from 'eslint-plugin-sort-keys'
import antfu from '@antfu/eslint-config'

export default antfu(
  undefined,
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
)
