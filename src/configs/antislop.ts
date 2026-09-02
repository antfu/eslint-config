import type { OptionsAntislop, OptionsHasTypeScript, TypedFlatConfigItem } from '../types'

import { ensurePackages, interopDefault } from '../utils'

export async function antislop(
  options: OptionsAntislop & OptionsHasTypeScript = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    slop = true,
    sonarjs = true,
    typescript = false,
  } = options

  await ensurePackages([
    ...slop ? ['eslint-plugin-slop'] : [],
    ...sonarjs ? ['eslint-plugin-sonarjs'] : [],
  ])

  const [
    pluginSlop,
    pluginSonarjs,
  ] = await Promise.all([
    slop ? interopDefault(import('eslint-plugin-slop')) : undefined,
    sonarjs ? interopDefault(import('eslint-plugin-sonarjs')) : undefined,
  ])

  return [
    {
      name: 'antfu/antislop/rules',
      plugins: {
        ...slop ? { slop: pluginSlop } : {},
        ...sonarjs ? { sonarjs: pluginSonarjs } : {},
      },
      ...typeof slop === 'object'
        ? { settings: { slop } }
        : {},
      rules: {
        ...slop
          ? {
              'slop/max-comment-length': 'error',
              'slop/no-chained-type-assertions': 'error',
              'slop/no-em-dash': 'error',
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
              'sonarjs/cognitive-complexity': 'error',
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

        // `any` silently erases type safety, the typescript config leaves it off by default
        // but agents reach for it whenever typings get inconvenient
        ...typescript
          ? { 'ts/no-explicit-any': 'error' as const }
          : {},

        ...overrides,
      },
    },
  ]
}
