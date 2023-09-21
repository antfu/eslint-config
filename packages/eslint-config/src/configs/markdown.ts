import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_VUE } from '../globs'
import { pluginMarkdown } from '../plugins'
import { OFF } from '../flags'

export const markdown: FlatESLintConfigItem[] = [
  {
    files: [GLOB_MARKDOWN],
    plugins: {
      markdown: pluginMarkdown,
    },
    processor: 'markdown/markdown',
  },
  {
    files: [`${GLOB_MARKDOWN}/${GLOB_SRC}`, `${GLOB_MARKDOWN}/${GLOB_VUE}`],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
    rules: {
      ...pluginMarkdown.configs.recommended.overrides[1].rules,
      '@typescript-eslint/comma-dangle': OFF,
      '@typescript-eslint/consistent-type-imports': OFF,
      '@typescript-eslint/no-namespace': OFF,
      '@typescript-eslint/no-redeclare': OFF,
      '@typescript-eslint/no-require-imports': OFF,
      '@typescript-eslint/no-unused-vars': OFF,
      '@typescript-eslint/no-use-before-define': OFF,
      '@typescript-eslint/no-var-requires': OFF,

      'antfu/no-cjs-exports': OFF,
      'antfu/no-ts-export-equal': OFF,

      'import/no-unresolved': OFF,

      'n/prefer-global/process': OFF,

      'no-alert': OFF,
      'no-console': OFF,
      'no-restricted-imports': OFF,
      'no-undef': OFF,
      'no-unused-expressions': OFF,
      'no-unused-vars': OFF,

      'unused-imports/no-unused-imports': OFF,
      'unused-imports/no-unused-vars': OFF,
    },
  },
]
