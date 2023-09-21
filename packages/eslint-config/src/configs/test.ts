import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginNoOnlyTests } from '../plugins'
import { GLOB_TESTS } from '../globs'
import { isInEditor } from '../env'
import { OFF } from '../flags'

export const test: FlatESLintConfigItem[] = [
  {
    files: GLOB_TESTS,
    plugins: {
      'no-only-tests': pluginNoOnlyTests,
    },
    rules: {
      'no-only-tests/no-only-tests': isInEditor ? OFF : 'error',
    },
  },
]
