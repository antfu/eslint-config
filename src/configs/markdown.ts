import type { FlatESLintConfigItem, OptionsComponentExts, OptionsOverrides } from '../types'
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '../globs'
import { pluginMarkdown } from '../plugins'
import { OFF } from '../flags'

export function markdown(options: OptionsComponentExts & OptionsOverrides = {}): FlatESLintConfigItem[] {
  const {
    componentExts = [],
    overrides = {},
  } = options

  return [
    {
      name: 'antfu:markdown:setup',
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      files: [GLOB_MARKDOWN],
      name: 'antfu:markdown:processor',
      processor: 'markdown/markdown',
    },
    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      name: 'antfu:markdown:rules',
      rules: {
        'antfu/no-cjs-exports': OFF,
        'antfu/no-ts-export-equal': OFF,

        'no-alert': OFF,
        'no-console': OFF,
        'no-undef': OFF,
        'no-unused-expressions': OFF,
        'no-unused-vars': OFF,

        'node/prefer-global/process': OFF,

        'style/comma-dangle': OFF,
        'style/eol-last': OFF,

        'ts/consistent-type-imports': OFF,
        'ts/no-namespace': OFF,
        'ts/no-redeclare': OFF,
        'ts/no-require-imports': OFF,
        'ts/no-unused-vars': OFF,
        'ts/no-use-before-define': OFF,
        'ts/no-var-requires': OFF,

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': OFF,
        'unused-imports/no-unused-vars': OFF,

        // Type aware rules
        ...{
          'ts/await-thenable': OFF,
          'ts/dot-notation': OFF,
          'ts/no-floating-promises': OFF,
          'ts/no-for-in-array': OFF,
          'ts/no-implied-eval': OFF,
          'ts/no-misused-promises': OFF,
          'ts/no-throw-literal': OFF,
          'ts/no-unnecessary-type-assertion': OFF,
          'ts/no-unsafe-argument': OFF,
          'ts/no-unsafe-assignment': OFF,
          'ts/no-unsafe-call': OFF,
          'ts/no-unsafe-member-access': OFF,
          'ts/no-unsafe-return': OFF,
          'ts/restrict-plus-operands': OFF,
          'ts/restrict-template-expressions': OFF,
          'ts/unbound-method': OFF,
        },

        ...overrides,
      },
    },
  ]
}
