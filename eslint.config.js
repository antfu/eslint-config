import sortKeys from 'eslint-plugin-sort-keys'
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'fixtures',
      '_fixtures',
    ],
    // typescript: {
    //   tsconfigPath: 'tsconfig.json',
    // },
  },
  {
    files: ['src/**/*.ts'],
    plugins: {
      'sort-keys': sortKeys,
    },
    rules: {
      'sort-keys/sort-keys-fix': 'error',
    },
  },
)
