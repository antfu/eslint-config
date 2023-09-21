import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginUnicorn } from '../plugins'

export const unicorn: FlatESLintConfigItem[] = [
  {
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      // Pass error message when throwing errors
      'unicorn/error-message': 'error',
      // Uppercase regex escapes
      'unicorn/escape-case': 'error',
      // Array.isArray instead of instanceof
      'unicorn/no-instanceof-array': 'error',
      // Ban `new Array` as `Array` constructor's params are ambiguous
      'unicorn/no-new-array': 'error',
      // Prevent deprecated `new Buffer()`
      'unicorn/no-new-buffer': 'error',
      // Keep regex literals safe!
      'unicorn/no-unsafe-regex': 'error',
      // Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
      'unicorn/number-literal-case': 'error',
      // includes over indexOf when checking for existence
      'unicorn/prefer-includes': 'error',
      // Prefer using the node: protocol
      'unicorn/prefer-node-protocol': 'error',
      // Prefer using number properties like `Number.isNaN` rather than `isNaN`
      'unicorn/prefer-number-properties': 'error',
      // String methods startsWith/endsWith instead of more complicated stuff
      'unicorn/prefer-string-starts-ends-with': 'error',
      // textContent instead of innerText
      'unicorn/prefer-text-content': 'error',
      // Enforce throwing type error when throwing error while checking typeof
      'unicorn/prefer-type-error': 'error',
      // Use new when throwing error
      'unicorn/throw-new-error': 'error',
    },
  },
]
