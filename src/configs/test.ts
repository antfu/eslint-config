import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginNoOnlyTests } from '../plugins'
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
        'no-only-tests': pluginNoOnlyTests,
      },
    },
    {
      files: GLOB_TESTS,
      rules: {
        'no-only-tests/no-only-tests': isInEditor ? OFF : 'error',
        ...overrides,
      },
    },
  ]
}
