import type { OptionsUnicorn, TypedFlatConfigItem } from '../types'

import { pluginUnicorn } from '../plugins'

export async function unicorn(options: OptionsUnicorn = {}): Promise<TypedFlatConfigItem[]> {
  const {
    allRecommended = false,
    overrides = {},
  } = options
  return [
    {
      name: 'antfu/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...(allRecommended
          ? pluginUnicorn.configs.recommended.rules as any
          : {
              'unicorn/consistent-empty-array-spread': 'error',
              'unicorn/error-message': 'error',
              'unicorn/escape-case': 'error',
              'unicorn/new-for-builtins': 'error',
              'unicorn/no-instanceof-builtins': 'error',
              'unicorn/no-new-array': 'error',
              'unicorn/no-new-buffer': 'error',
              'unicorn/number-literal-case': 'error',
              'unicorn/prefer-dom-node-text-content': 'error',
              'unicorn/prefer-includes': 'error',
              'unicorn/prefer-node-protocol': 'error',
              'unicorn/prefer-number-properties': 'error',
              'unicorn/prefer-string-starts-ends-with': 'error',
              'unicorn/prefer-type-error': 'error',
              'unicorn/throw-new-error': 'error',
            }),
        ...overrides,
      },
    },
  ]
}
