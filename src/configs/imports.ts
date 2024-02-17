import type { FlatConfigItem, OptionsIsInEditor, OptionsStylistic } from '../types'
import { pluginAntfu, pluginImport } from '../plugins'
import { GLOB_SRC_EXT } from '../globs'

export async function imports(options: OptionsIsInEditor & OptionsStylistic = {}): Promise<FlatConfigItem[]> {
  const {
    isInEditor = false,
    stylistic = true,
  } = options

  return [
    {
      name: 'antfu:imports',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': 'error',
        'unused-imports/no-unused-imports': isInEditor ? 'off' : 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
            }
          : {},
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'antfu:imports:bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
  ]
}
