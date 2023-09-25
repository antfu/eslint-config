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
      'style/spaced-comment': OFF,

      'yml/block-mapping': 'error',
      'yml/block-mapping-question-indicator-newline': 'error',
      'yml/block-sequence': 'error',
      'yml/block-sequence-hyphen-indicator-newline': 'error',
      'yml/flow-mapping-curly-newline': 'error',
      'yml/flow-mapping-curly-spacing': 'error',
      'yml/flow-sequence-bracket-newline': 'error',
      'yml/flow-sequence-bracket-spacing': 'error',
      'yml/indent': ['error', 2],
      'yml/key-spacing': 'error',
      'yml/no-empty-key': 'error',
      'yml/no-empty-sequence-entry': 'error',
      'yml/no-irregular-whitespace': 'error',
      'yml/no-tab-indent': 'error',
      'yml/plain-scalar': 'error',

      'yml/quotes': ['error', { avoidEscape: false, prefer: 'single' }],
      'yml/spaced-comment': 'error',

      'yml/vue-custom-block/no-parsing-error': 'error',
    },
  },
]
