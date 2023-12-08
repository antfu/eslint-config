import * as parserPlain from 'eslint-parser-plain'
import { GLOB_CSS, GLOB_LESS, GLOB_MARKDOWN, GLOB_MDX, GLOB_POSTCSS, GLOB_SCSS } from '../globs'
import type { VendoredPrettierOptions } from '../vender/prettier-types'
import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsFormatters, StylisticConfig } from '../types'
import { StylisticConfigDefaults } from './stylistic'

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
): Promise<FlatConfigItem[]> {
  await ensurePackages([
    'eslint-plugin-format',
  ])

  if (options === true) {
    options = {
      css: true,
      graphql: true,
      html: true,
      markdown: true,
      toml: true,
    }
  }

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  }

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      endOfLine: 'auto',
      semi,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {},
  )

  const dprintOptions = Object.assign(
    {
      indentWidth: typeof indent === 'number' ? indent : 2,
      quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
      useTabs: indent === 'tab',
    },
    options.dprintOptions || {},
  )

  const pluginFormat = await interopDefault(import('eslint-plugin-format'))

  const configs: FlatConfigItem[] = [
    {
      name: 'antfu:formatters:setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ]

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'antfu:formatter:css',
        rules: {
          'format/prettier': [
            'error',
            {
              ...prettierOptions,
              parser: 'css',
            },
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'antfu:formatter:scss',
        rules: {
          'format/prettier': [
            'error',
            {
              ...prettierOptions,
              parser: 'scss',
            },
          ],
        },
      },
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'antfu:formatter:less',
        rules: {
          'format/prettier': [
            'error',
            {
              ...prettierOptions,
              parser: 'less',
            },
          ],
        },
      },
    )
  }

  if (options.html) {
    configs.push({
      files: ['**/*.html'],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'antfu:formatter:html',
      rules: {
        'format/prettier': [
          'error',
          {
            ...prettierOptions,
            parser: 'html',
          },
        ],
      },
    })
  }

  if (options.toml) {
    configs.push({
      files: ['**/*.toml'],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'antfu:formatter:toml',
      rules: {
        'format/dprint': [
          'error',
          {
            ...dprintOptions,
            language: 'toml',
          },
        ],
      },
    })
  }

  if (options.markdown) {
    const formatter = options.markdown === true
      ? 'prettier'
      : options.markdown

    configs.push(
      {
        files: [GLOB_MARKDOWN],
        name: 'antfu:formatter:markdown',
        rules: {
          [`format/${formatter}`]: [
            'error',
            formatter === 'prettier'
              ? {
                  ...prettierOptions,
                  embeddedLanguageFormatting: 'off',
                  parser: 'markdown',
                }
              : {
                  ...dprintOptions,
                  language: 'markdown',
                },
          ],
        },
      },
      {
        files: [GLOB_MDX],
        name: 'antfu:formatter:mdx',
        rules: {
          [`format/${formatter}`]: [
            'error',
            {
              ...prettierOptions,
              embeddedLanguageFormatting: 'off',
              parser: 'mdx',
            },
          ],
        },
      },
    )
  }

  if (options.graphql) {
    configs.push({
      files: ['**/*.graphql'],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'antfu:formatter:graphql',
      rules: {
        'format/prettier': [
          'error',
          {
            ...prettierOptions,
            parser: 'graphql',
          },
        ],
      },
    })
  }

  return configs
}
