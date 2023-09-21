import jsoncPlugin, { configs } from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'

export const jsonc: FlatESLintConfigItem[] = [
  {
    files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc: jsoncPlugin,
    },
    rules: {
      ...configs['recommended-with-jsonc'].rules as any,
      'jsonc/array-bracket-spacing': ['error', 'never'],
      'jsonc/comma-dangle': ['error', 'never'],
      'jsonc/comma-style': ['error', 'last'],
      'jsonc/indent': ['error', 2],
      'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      'jsonc/no-octal-escape': 'error',
      'jsonc/object-curly-newline': ['error', { consistent: true, multiline: true }],
      'jsonc/object-curly-spacing': ['error', 'always'],
      'jsonc/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
    },
  },
]
