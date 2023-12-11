import { GLOB_MARKDOWN_OR_MDX } from '../globs'
import { interopDefault } from '../utils'
import type { FlatConfigItem, StylisticConfig } from '../types'
import { pluginAntfu } from '../plugins'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export async function stylistic(options: StylisticConfig = {}): Promise<FlatConfigItem[]> {
  const {
    indent,
    jsx,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  })

  return [
    {
      ignores: [
        GLOB_MARKDOWN_OR_MDX,
      ],
      name: 'antfu:stylistic',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        'antfu/consistent-list-newline': 'error',
        'antfu/if-newline': 'error',
        'antfu/top-level-function': 'error',

        'curly': ['error', 'multi-or-nest', 'consistent'],
      },
    },
  ]
}
