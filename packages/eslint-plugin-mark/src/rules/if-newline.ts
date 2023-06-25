import { createEslintRule } from '../utils'

export const RULE_NAME = 'if-newline'
export type MessageIds = 'missingIfNewline'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Newline after if',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingIfNewline: 'Expect newline after if',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      IfStatement(node) {
        if (!node.consequent)
          return
        if (node.consequent.type === 'BlockStatement')
          return
        if (node.test.loc.end.line === node.consequent.loc.start.line) {
          context.report({
            node,
            loc: {
              start: node.test.loc.end,
              end: node.consequent.loc.start,
            },
            messageId: 'missingIfNewline',
            fix(fixer) {
              return fixer.replaceTextRange([node.consequent.range[0], node.consequent.range[0]], '\n')
            },
          })
        }
      },
    }
  },
})
