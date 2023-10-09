import type { ConfigItem, OptionsIsInEditor, OptionsOverrides } from '../types'
import { pluginNoOnlyTests, pluginVitest } from '../plugins'
import { GLOB_TESTS } from '../globs'

export function test(options: OptionsIsInEditor & OptionsOverrides = {}): ConfigItem[] {
  const {
    isInEditor = false,
    overrides = {},
  } = options

  return [
    {
      name: 'antfu:test:setup',
      plugins: {
        test: {
          ...pluginVitest,
          rules: {
            ...pluginVitest.rules,
            // extend `test/no-only-tests` rule
            ...pluginNoOnlyTests.rules,
          },
        },
      },
    },
    {
      files: GLOB_TESTS,
      name: 'antfu:test:rules',
      rules: {
        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'test/no-identical-title': 'error',
        'test/no-only-tests': isInEditor ? 'off' : 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        ...overrides,
      },
    },
  ]
}
