import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { ensurePackages, interopDefault } from '../utils'

export async function antiSlop(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  await ensurePackages([
    'eslint-plugin-slop',
    'eslint-plugin-sonarjs',
  ])

  const [
    pluginSlop,
    pluginSonarjs,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-slop')),
    interopDefault(import('eslint-plugin-sonarjs')),
  ] as const)

  return [
    {
      name: 'antfu/anti-slop/rules',
      plugins: {
        slop: pluginSlop,
        sonarjs: pluginSonarjs,
      },
      rules: {
        'slop/max-comment-length': 'error',
        'slop/no-chained-type-assertions': 'error',
        'slop/no-em-dash': 'error',
        'slop/no-trivial-functions': 'error',
        'slop/no-trivial-type-aliases': 'error',

        // Curated subset of SonarJS focusing on redundant and duplicated code,
        // picked to complement the rest of the config without requiring type information
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

        ...overrides,
      },
    },
  ]
}
