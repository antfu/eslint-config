import { createEslintRule } from '../utils'

export const RULE_NAME = 'named-tuple-spacing'
export type MessageIds = 'expectedSpaceAfter' | 'unexpectedSpaceBefore'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Expect space before type declaration in named tuple',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      expectedSpaceAfter: 'Expected a space after the \':\'.',
      unexpectedSpaceBefore: 'Unexpected space(s) before the \':\'.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    return {
      TSNamedTupleMember: (node) => {
        const code = sourceCode.text.slice(node.range[0], node.range[1])

        const reg = /(\w+)( *):( *)(\w+)/
        const spacesBeforeColon = code.match(reg)?.[2]
        const spacesAfterColon = code.match(reg)?.[3]

        if (spacesBeforeColon?.length) {
          context.report({
            node,
            messageId: 'unexpectedSpaceBefore',
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(reg, '$1: $4'))
            },
          })
        }

        if (!spacesAfterColon) {
          context.report({
            node,
            messageId: 'expectedSpaceAfter',
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(reg, '$1: $4'))
            },
          })
        }
      },
    }
  },
})
