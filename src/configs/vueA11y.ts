import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import globals from 'globals'

import { GLOB_VUE } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function vueA11y(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_VUE],
    overrides = {},
  } = options

  await ensurePackages([
    'eslint-plugin-vuejs-accessibility',
  ])

  const [
    pluginVueA11y,
    parserVue,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vuejs-accessibility')),
    interopDefault(import('vue-eslint-parser')),
  ] as const)

  return [
    {
      languageOptions: {
        globals: globals.browser,
      },
      name: 'antfu/vue-a11y/setup',
      plugins: {
        'vue-a11y': pluginVueA11y,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
      },
      name: 'antfu/vue-a11y/rules',
      rules: {
        'vue-a11y/alt-text': 'error',
        'vue-a11y/anchor-has-content': 'error',
        'vue-a11y/aria-props': 'error',
        'vue-a11y/aria-role': 'error',
        'vue-a11y/aria-unsupported-elements': 'error',
        'vue-a11y/click-events-have-key-events': 'error',
        'vue-a11y/form-control-has-label': 'error',
        'vue-a11y/heading-has-content': 'error',
        'vue-a11y/iframe-has-title': 'error',
        'vue-a11y/interactive-supports-focus': 'error',
        'vue-a11y/label-has-for': 'error',
        'vue-a11y/media-has-caption': 'warn',
        'vue-a11y/mouse-events-have-key-events': 'error',
        'vue-a11y/no-access-key': 'error',
        'vue-a11y/no-aria-hidden-on-focusable': 'error',
        'vue-a11y/no-autofocus': 'warn',
        'vue-a11y/no-distracting-elements': 'error',
        'vue-a11y/no-redundant-roles': 'error',
        'vue-a11y/no-role-presentation-on-focusable': 'error',
        'vue-a11y/no-static-element-interactions': 'error',
        'vue-a11y/role-has-required-aria-props': 'error',
        'vue-a11y/tabindex-no-positive': 'warn',

        ...overrides,
      },
    },
  ]
}
