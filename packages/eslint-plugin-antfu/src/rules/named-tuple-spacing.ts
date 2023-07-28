import { createEslintRule } from '../utils'

export const RULE_NAME = 'named-tuple-spacing'
export type MessageIds = 'expectedSpaceAfter' | 'unexpectedSpaceBetween' | 'unexpectedSpaceBefore'
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
      unexpectedSpaceBetween: 'Unexpected space between \'?\' and the \':\'.',
      unexpectedSpaceBefore: 'Unexpected space before the \':\'.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()
    return {
      TSNamedTupleMember: (node) => {
        const code = sourceCode.text.slice(node.range[0], node.range[1])

        const reg = /(\w+)(\s*)(\?\s*)?:(\s*)(\w+)/

        const labelName = node.label.name
        const spaceBeforeColon = code.match(reg)?.[2]
        const optionalMark = code.match(reg)?.[3]
        const spacesAfterColon = code.match(reg)?.[4]
        const elementType = code.match(reg)?.[5]

        function getReplaceValue() {
          let ret = labelName
          if (node.optional)
            ret += '?'
          ret += ': '
          ret += elementType
          return ret
        }

        if (optionalMark?.length > 1) {
          context.report({
            node,
            messageId: 'unexpectedSpaceBetween',
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(reg, getReplaceValue()))
            },
          })
        }

        if (spaceBeforeColon?.length) {
          context.report({
            node,
            messageId: 'unexpectedSpaceBefore',
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(reg, getReplaceValue()))
            },
          })
        }

        if (spacesAfterColon.length !== 1) {
          context.report({
            node,
            messageId: 'expectedSpaceAfter',
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(reg, getReplaceValue()))
            },
          })
        }
      },
    }
  },
})
