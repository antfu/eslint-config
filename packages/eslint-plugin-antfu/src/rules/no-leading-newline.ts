import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-leading-newline'
export type MessageIds = 'noLeadingNewline'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Do not allow leading newline',
      recommended: 'error',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      noLeadingNewline: 'No leading newline allowed',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      Program(node) {
        const code = context.getSourceCode()
        const match = code.text.match(/^[\s]+/)?.[0] || ''
        if (match.includes('\n')) {
          const line = match.split('\n')
          context.report({
            node,
            loc: {
              start: { line: 0, column: 0 },
              end: { line: line.length - 1, column: line[line.length - 1].length },
            },
            messageId: 'noLeadingNewline',
            fix(fixer) {
              return fixer.replaceTextRange([0, match.length], '')
            },
          })
        }
      },
    }
  },
})
