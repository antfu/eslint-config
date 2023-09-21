import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_YAML } from '../globs'
import { parserYml, pluginYml } from '../plugins'

export const yml: FlatESLintConfigItem[] = [
  {
    files: [GLOB_YAML],
    plugins: {
      yml: pluginYml,
    },
    languageOptions: {
      parser: parserYml,
    },
    rules: {
      ...pluginYml.configs.standard.rules as any,

      'yml/no-empty-mapping-value': 'off',
      'yml/quotes': ['error', { prefer: 'single', avoidEscape: false }],
      'yml/no-empty-document': 'off',

      '@stylistic/js/spaced-comment': 'off',
    },
  },
]
