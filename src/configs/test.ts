import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginNoOnlyTests } from '../plugins'
import { GLOB_TESTS } from '../globs'
import { OFF } from '../flags'
import type { OptionsIsInEditor } from '../types'

export function test(options: OptionsIsInEditor = {}): FlatESLintConfigItem[] {
  return [
    {
      plugins: {
        'no-only-tests': pluginNoOnlyTests,
      },
    },
    {
      files: GLOB_TESTS,
      rules: {
        'no-only-tests/no-only-tests': options.isInEditor ? OFF : 'error',
      },
    },
  ]
}
