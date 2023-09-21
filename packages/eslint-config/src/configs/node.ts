import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginNode } from '../plugins'

export const node: FlatESLintConfigItem[] = [
  {
    plugins: {
      n: pluginNode,
    },
    rules: {
      // Node
      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/prefer-global/buffer': ['error', 'never'],
      'n/prefer-global/process': ['error', 'never'],
      'n/process-exit-as-throw': 'error',
    },
  },
]
