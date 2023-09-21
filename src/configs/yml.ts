import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_YAML } from '../globs'
import { parserYml, pluginYml } from '../plugins'
import { OFF } from '../flags'

export const yml: FlatESLintConfigItem[] = [
  {
    files: [GLOB_YAML],
    languageOptions: {
      parser: parserYml,
    },
    plugins: {
      yml: pluginYml as any,
    },
    rules: {
      ...pluginYml.configs.standard.rules as any,

      'style/spaced-comment': OFF,
      'yml/no-empty-document': OFF,
      'yml/no-empty-mapping-value': OFF,

      'yml/quotes': ['error', { avoidEscape: false, prefer: 'single' }],
    },
  },
]
