import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_YAML } from '../globs'
import { parserYaml, pluginYaml } from '../plugins'
import { OFF } from '../flags'
import type { OptionsOverrides, OptionsStylistic } from '../types'

export function yaml(
  options: OptionsOverrides & OptionsStylistic = {},
): FlatESLintConfigItem[] {
  const {
    overrides = {},
    stylistic = true,
  } = options

  return [
    {
      plugins: {
        yaml: pluginYaml as any,
      },
    },
    {
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserYaml,
      },
      rules: {
        'style/spaced-comment': OFF,

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'yaml/block-mapping-question-indicator-newline': 'error',
              'yaml/block-sequence-hyphen-indicator-newline': 'error',
              'yaml/flow-mapping-curly-newline': 'error',
              'yaml/flow-mapping-curly-spacing': 'error',
              'yaml/flow-sequence-bracket-newline': 'error',
              'yaml/flow-sequence-bracket-spacing': 'error',
              'yaml/indent': ['error', 2],
              'yaml/key-spacing': 'error',
              'yaml/no-tab-indent': 'error',
              'yaml/quotes': ['error', { avoidEscape: false, prefer: 'single' }],
              'yaml/spaced-comment': 'error',
            }
          : {},

        ...overrides,
      },
    },
  ]
}
