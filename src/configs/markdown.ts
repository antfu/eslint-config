import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '../globs'
import { pluginMarkdown, pluginTs } from '../plugins'
import { OFF } from '../flags'
import type { OptionsComponentExts } from '../types'

export function markdown(options: OptionsComponentExts = {}): FlatESLintConfigItem[] {
  const {
    componentExts = [],
  } = options

  return [
    {
      files: [GLOB_MARKDOWN],
      plugins: {
        markdown: pluginMarkdown,
      },
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
      plugins: {
        ts: pluginTs as any,
      },
      rules: {
        ...pluginMarkdown.configs.recommended.overrides[1].rules,

        'antfu/no-cjs-exports': OFF,
        'antfu/no-ts-export-equal': OFF,

        'import/no-unresolved': OFF,

        'no-alert': OFF,
        'no-console': OFF,
        'no-restricted-imports': OFF,
        'no-undef': OFF,
        'no-unused-expressions': OFF,
        'no-unused-vars': OFF,

        'node/prefer-global/process': OFF,

        'ts/comma-dangle': OFF,
        'ts/consistent-type-imports': OFF,
        'ts/no-namespace': OFF,
        'ts/no-redeclare': OFF,
        'ts/no-require-imports': OFF,
        'ts/no-unused-vars': OFF,
        'ts/no-use-before-define': OFF,
        'ts/no-var-requires': OFF,

        'unused-imports/no-unused-imports': OFF,
        'unused-imports/no-unused-vars': OFF,
      },
    },
  ]
}
