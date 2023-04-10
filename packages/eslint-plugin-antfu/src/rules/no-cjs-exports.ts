import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-cjs-exports'
export type MessageIds = 'noCjsExports'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Do not use CJS exports',
      recommended: false,
    },
    schema: [],
    messages: {
      noCjsExports: 'Use ESM export instead',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const extension = context.getFilename().split('.').pop()
    if (!['ts', 'tsx', 'mts', 'cts'].includes(extension))
      return {}

    return {
      'MemberExpression[object.name="exports"]': function (node) {
        context.report({
          node,
          messageId: 'noCjsExports',
        })
      },
      'MemberExpression[object.name="module"][property.name="exports"]': function (node) {
        context.report({
          node,
          messageId: 'noCjsExports',
        })
      },
    }
  },
})
