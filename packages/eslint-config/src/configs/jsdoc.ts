import type { FlatESLintConfigItem } from 'eslint-define-config'
import { pluginJsdoc } from '../plugins'
import { OFF } from '../flags'

export const jsdoc: FlatESLintConfigItem[] = [
  {
    plugins: {
      jsdoc: pluginJsdoc,
    },
    rules: {
      ...pluginJsdoc.configs['flat/recommended-typescript'].rules,
      'jsdoc/check-tag-names': OFF,
      'jsdoc/check-values': OFF,
      'jsdoc/no-undefined-types': OFF,
      'jsdoc/require-jsdoc': OFF,
      'jsdoc/require-param': OFF,
      'jsdoc/require-param-description': OFF,
      'jsdoc/require-param-type': OFF,
      'jsdoc/require-returns': OFF,
      'jsdoc/require-returns-type': OFF,
      'jsdoc/require-throws': OFF,
      'jsdoc/require-yields': OFF,
      'jsdoc/tag-lines': OFF,
    },
  },
]
