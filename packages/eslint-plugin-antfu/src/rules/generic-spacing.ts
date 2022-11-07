import { createEslintRule } from '../utils'

export const RULE_NAME = 'generic-spacing'
export type MessageIds = 'genericSpacingMismatch'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Spaces around generic type parameters',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      genericSpacingMismatch: 'Generic spaces mismatch',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    return {
      TSTypeParameterDeclaration: (node) => {
        if (!['TSCallSignatureDeclaration', 'ArrowFunctionExpression', 'TSFunctionType'].includes(node.parent.type)) {
          const pre = sourceCode.text.slice(0, node.range[0])
          const preSpace = pre.match(/(\s+)$/)?.[0]
          // strip space before <T>
          if (preSpace && preSpace.length) {
            context.report({
              node,
              messageId: 'genericSpacingMismatch',
              *fix(fixer) {
                yield fixer.replaceTextRange([node.range[0] - preSpace.length, node.range[0]], '')
              },
            })
          }
        }

        // add space between <T,K>
        const params = node.params
        for (let i = 1; i < params.length; i++) {
          const prev = params[i - 1]
          const current = params[i]
          const from = prev.range[1]
          const to = current.range[0]
          const span = sourceCode.text.slice(from, to)
          if (span !== ', ' && !span.match(/,\n/)) {
            context.report({
              *fix(fixer) {
                yield fixer.replaceTextRange([from, to], ', ')
              },
              loc: {
                start: prev.loc.end,
                end: current.loc.start,
              },
              messageId: 'genericSpacingMismatch',
              node,
            })
          }
        }
      },
      // add space around = in type Foo<T = true>
      TSTypeParameter: (node) => {
        if (!node.default)
          return
        const endNode = node.constraint || node.name
        const from = endNode.range[1]
        const to = node.default.range[0]
        if (sourceCode.text.slice(from, to) !== ' = ') {
          context.report({
            *fix(fixer) {
              yield fixer.replaceTextRange([from, to], ' = ')
            },
            loc: {
              start: endNode.loc.end,
              end: node.default.loc.start,
            },
            messageId: 'genericSpacingMismatch',
            node,
          })
        }
      },
    }
  },
})
