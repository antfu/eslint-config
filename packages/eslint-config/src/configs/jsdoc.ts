import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginJsdoc } from '../plugins'

export const jsdoc: FlatESLintConfigItem[] = [
  {
    plugins: {
      jsdoc: pluginJsdoc,
    },
    rules: {
      ...pluginJsdoc.configs.recommended.rules,
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-yields': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/check-values': 'off',
      'jsdoc/check-tag-names': 'off',
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-throws': 'off',
    },
  },
]
