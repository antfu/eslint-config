import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginNoOnlyTests } from '../plugins'
import { GLOB_TESTS } from '../globs'
import { OFF } from '../flags'
import type { OptionsIsInEditor } from '../types'

export function test(options: OptionsIsInEditor = {}): FlatESLintConfigItem[] {
  return [
    {
      files: GLOB_TESTS,
      plugins: {
        'no-only-tests': pluginNoOnlyTests,
      },
      rules: {
        'no-only-tests/no-only-tests': options.isInEditor ? OFF : 'error',
      },
    },
  ]
}
