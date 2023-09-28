import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginNoOnlyTests, pluginVitest } from '../plugins'
import { GLOB_TESTS } from '../globs'
import { OFF } from '../flags'
import type { OptionsIsInEditor, OptionsOverrides } from '../types'

export function test(options: OptionsIsInEditor & OptionsOverrides = {}): FlatESLintConfigItem[] {
  const {
    isInEditor = false,
    overrides = {},
  } = options

  return [
    {
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
      rules: {
        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'test/no-identical-title': 'error',
        'test/no-only-tests': isInEditor ? OFF : 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        ...overrides,
      },
    },
  ]
}
