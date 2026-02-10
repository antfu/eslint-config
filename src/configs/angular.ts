import type { OptionsOverrides, Rules, TypedFlatConfigItem } from '../types'

import { GLOB_HTML, GLOB_TS } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function angular(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  await ensurePackages([
    '@angular-eslint/eslint-plugin',
    '@angular-eslint/eslint-plugin-template',
    '@angular-eslint/template-parser',
  ])

  const [
    pluginAngular,
    pluginAngularTemplate,
    parserAngularTemplate,
  ] = await Promise.all([
    interopDefault(import('@angular-eslint/eslint-plugin')),
    interopDefault(import('@angular-eslint/eslint-plugin-template')),
    interopDefault(import('@angular-eslint/template-parser')),
  ] as const)

  const angularTsRules: Rules = {}
  const angularTemplateRules: Rules = {}
  Object.entries(overrides).forEach(([key, value]) => {
    if (key.startsWith('angular/')) {
      angularTsRules[key] = value
    }
    if (key.startsWith('angular-template/')) {
      angularTemplateRules[key] = value
    }
  })

  return [
    {
      name: 'antfu/angular/setup',
      plugins: {
        'angular': pluginAngular,
        'angular-template': pluginAngularTemplate,
      },
    },
    {
      files: [GLOB_TS],
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

        ...angularTsRules,
      },
    },
    {
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserAngularTemplate,
      },
      name: 'antfu/angular/rules/template',
      rules: {
        'angular-template/banana-in-box': 'error',
        'angular-template/eqeqeq': 'error',
        'angular-template/no-negated-async': 'error',
        'angular-template/prefer-control-flow': 'error',

        /**
         * we need to mute some style lint rules for angular inline templates,
         */
        'style/indent': 'off',
        'style/no-multiple-empty-lines': ['error', { max: 1 }],
        'style/no-trailing-spaces': 'off',

        ...angularTemplateRules,
      },
    },
  ]
}
