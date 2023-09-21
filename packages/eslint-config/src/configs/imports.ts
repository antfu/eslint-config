import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginImport } from '../plugins'

export const imports: FlatESLintConfigItem[] = [
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/export': 'error',
      'import/first': 'error',
      'import/named': 'off',
      'import/newline-after-import': ['error', { count: 1, considerComments: true }],
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/order': 'error',
    },
  },
]
