import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_HTML, GLOB_TS } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function angular(
  options: OptionsOverrides,
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  await ensurePackages([
    '@angular-eslint/eslint-plugin',
    '@angular-eslint/eslint-plugin-template',
  ])

  const [
    pluginAngular,
    pluginAngularTemplate,
    parserTs,
  ] = await Promise.all([
    interopDefault(import('@angular-eslint/eslint-plugin')),
    interopDefault(import('@angular-eslint/eslint-plugin-template')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const)

  return [
    {
      name: 'antfu/angular/setup',
      plugins: {
        angular: pluginAngular,
      },
    },
    {
      files: [GLOB_TS],
      languageOptions: {
        parser: parserTs,
      },
      name: 'antfu/angular/rules/ts',
      processor: pluginAngularTemplate.processors['extract-inline-html'] as TypedFlatConfigItem['processor'],
      rules: {
        'angular/contextual-lifecycle': 'error',
        'angular/no-empty-lifecycle-method': 'error',
        'angular/no-input-rename': 'error',
        'angular/no-inputs-metadata-property': 'error',
        'angular/no-output-native': 'error',
        'angular/no-output-on-prefix': 'error',
        'angular/no-output-rename': 'error',
        'angular/no-outputs-metadata-property': 'error',
        'angular/prefer-inject': 'error',
        'angular/prefer-standalone': 'error',
        'angular/use-lifecycle-interface': 'error',
        'angular/use-pipe-transform-interface': 'error',

        ...overrides,
      },
    },
    {
      files: [GLOB_HTML],
      name: 'antfu/angular/rules/html',
      rules: {
        'angular/template/alt-text': 'error',

        ...overrides,
      },
    },
  ]
}
