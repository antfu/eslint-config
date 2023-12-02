import type { VendoredPrettierOptions } from '../vender/prettier-types'
import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsPrettier, StylisticConfig } from '../types'
import { StylisticConfigDefaults } from './stylistic'

export async function prettier(
  options: OptionsPrettier = {},
  stylistic: StylisticConfig = {},
): Promise<FlatConfigItem[]> {
  await ensurePackages([
    'eslint-plugin-prettier',
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
    rules.css ||= ['**/*.css', '**/*.pcss', '**/*.postcss']
    rules.less ||= ['**/*.less']
    rules.scss ||= ['**/*.scss', '**/*.sass']
  }

  if (options.html)
    rules.html ||= ['**/*.html', '**/*.htm']

  if (options.graphql)
    rules.graphql ||= ['**/*.graphql', '**/*.gql']

  if (options.markdown)
    rules.markdown ||= ['**/*.md', '**/*.markdown']

  if (!Object.keys(rules).length)
    throw new Error('No languages specified for Prettier')

  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'))
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
          { usePrettierrc },
        ],
      },
    })),
  ]
}
