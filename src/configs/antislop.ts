import type { OptionsAntislop, OptionsHasTypeScript, TypedFlatConfigItem } from '../types'

import { GLOB_ALL_SRC, GLOB_GRAPHQL, GLOB_JSONC, GLOB_MARKDOWN_CODE, GLOB_SRC, GLOB_TOML } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function antislop(
  options: OptionsAntislop & OptionsHasTypeScript = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    cognitiveComplexity = 15,
    overrides = {},
    slop = true,
    sonarjs = true,
  } = options

  await ensurePackages([
    ...slop
      ? ['eslint-plugin-slop']
      : [],
    ...sonarjs
      ? ['eslint-plugin-sonarjs']
      : [],
  ])

  const [
    pluginSlop,
    pluginSonarjs,
  ] = await Promise.all([
    slop
      ? interopDefault(import('eslint-plugin-slop'))
      : undefined,
    sonarjs
      ? interopDefault(import('eslint-plugin-sonarjs'))
      : undefined,
  ])

  return [
    {
      name: 'antfu/antislop/setup',
      plugins: {
        ...slop
          ? { slop: pluginSlop }
          : {},
        ...sonarjs
          ? { sonarjs: pluginSonarjs }
          : {},
      },
      ...typeof slop === 'object'
        ? {
            settings: { slop },
          }
        : {},
    },
    // `no-em-dash` supports any language, so it's applied across all
    // prose-bearing file types instead of being limited to JS/TS
    ...slop
      ? [
          {
            files: [
              ...GLOB_ALL_SRC,
              GLOB_JSONC,
              GLOB_TOML,
              GLOB_GRAPHQL,
            ],
            /**
             * Markdown code fences are already scanned as part of the raw
             * Markdown text, so exclude the virtual embedded-code files to
             * avoid reporting the same em dash twice
             */
            ignores: [GLOB_MARKDOWN_CODE],
            name: 'antfu/antislop/rules/universal',
            rules: {
              'slop/no-em-dash': 'error',
            },
          } as TypedFlatConfigItem,
        ]
      : [],
    {
      files: [GLOB_SRC],
      name: 'antfu/antislop/rules/javascript',
      rules: {
        ...slop
          ? {
              'slop/max-comment-length': 'error',
              'slop/no-chained-type-assertions': 'error',
              'slop/no-jargon': 'error',
              'slop/no-trivial-functions': 'error',
              'slop/no-trivial-type-aliases': 'error',
              'slop/prefer-jsdoc': 'error',
            } as const
          : {},

        // Curated subset of SonarJS focusing on redundant and duplicated code,
        // picked to complement the rest of the config without requiring type information
        ...sonarjs
          ? {
              ...cognitiveComplexity === false
                ? {}
                : {
                    'sonarjs/cognitive-complexity': ['error', cognitiveComplexity] as const,
                  },
              'sonarjs/no-all-duplicated-branches': 'error',
              'sonarjs/no-collapsible-if': 'error',
              'sonarjs/no-commented-code': 'error',
              'sonarjs/no-dead-store': 'error',
              'sonarjs/no-duplicated-branches': 'error',
              'sonarjs/no-element-overwrite': 'error',
              'sonarjs/no-empty-collection': 'error',
              'sonarjs/no-gratuitous-expressions': 'error',
              'sonarjs/no-identical-conditions': 'error',
              'sonarjs/no-identical-expressions': 'error',
              'sonarjs/no-identical-functions': 'error',
              'sonarjs/no-invariant-returns': 'error',
              'sonarjs/no-inverted-boolean-check': 'error',
              'sonarjs/no-redundant-boolean': 'error',
              'sonarjs/no-redundant-jump': 'error',
              'sonarjs/no-unused-collection': 'error',
              'sonarjs/no-use-of-empty-return-value': 'error',
              'sonarjs/prefer-single-boolean-return': 'error',
            } as const
          : {},

        ...overrides,
      },
    },
  ]
}
