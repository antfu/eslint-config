import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginImport } from '../plugins'
import type { OptionsStylistic } from '../types'

export function imports(options: OptionsStylistic = {}): FlatESLintConfigItem[] {
  const {
    stylistic = true,
  } = options

  return [
    {
      plugins: {
        import: pluginImport,
      },
      rules: {
        'import/export': 'error',
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
            }
          : {},
      },
    },
  ]
}
