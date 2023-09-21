import commentsPlugin from 'eslint-plugin-eslint-comments'
import type { FlatESLintConfigItem } from 'eslint'

export const comments: FlatESLintConfigItem[] = [
  {
    plugins: {
      'eslint-comments': commentsPlugin,
    },
    rules: {
      ...commentsPlugin.configs.recommended.rules,
      'eslint-comments/disable-enable-pair': 'off',
    },
  },
]
