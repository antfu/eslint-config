import { GLOB_CSS, GLOB_LESS, GLOB_POSTCSS, GLOB_SCSS } from '../globs'
import type { VendoredPrettierOptions } from '../vender/prettier-types'
import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsPrettier, StylisticConfig } from '../types'
import { StylisticConfigDefaults } from './stylistic'

/**
 * @deprecated
 */
export async function prettier(
  options: OptionsPrettier = {},
  stylistic: StylisticConfig = {},
): Promise<FlatConfigItem[]> {
  console.warn('@antfu/eslint-config: `prettier` option is deprecated, please do not use it anymore. We will find better formatters to support that in the future.')

  await ensurePackages([
    '@antfu/eslint-plugin-prettier',
  ])

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  }

  const {
    usePrettierrc = false,
  } = options

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      semi,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    } satisfies VendoredPrettierOptions,
    options.options || {},
  )

  const rules = {
    ...options.customFiles || {},
  }

  if (options.css) {
    rules.css ||= [GLOB_CSS, GLOB_POSTCSS]
    rules.less ||= [GLOB_LESS]
    rules.scss ||= [GLOB_SCSS]
  }

  if (options.html)
    rules.html ||= ['**/*.html', '**/*.htm']

  if (options.graphql)
    rules.graphql ||= ['**/*.graphql', '**/*.gql']

  if (!Object.keys(rules).length)
    throw new Error('No languages specified for Prettier')

  const pluginPrettier = await interopDefault(import('@antfu/eslint-plugin-prettier'))
  const parserPlain = await interopDefault(import('eslint-parser-plain'))

  return [
    {
      name: 'antfu:prettier:setup',
      plugins: {
        prettier: pluginPrettier,
      },
    },
    ...Object.entries(rules).map(([name, files]): FlatConfigItem => ({
      files,
      languageOptions: {
        parser: parserPlain,
      },
      name: `antfu:prettier:${name}`,
      rules: {
        'prettier/prettier': [
          'error',
          {
            ...prettierOptions,
            embeddedLanguageFormatting: name === 'html' ? 'auto' : 'off',
            parser: name,
          },
          {
            fullControl: true,
            usePrettierrc,
          },
        ],
      },
    })),
  ]
}
