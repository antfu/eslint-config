import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-declare-in-ts-file'
export type MessageIds = 'noDeclareInTsFile'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using `declare` statement in ts file',
      recommended: 'error',
    },
    schema: [],
    messages: {
      noDeclareInTsFile: 'Do not use `declare` statement in ts file',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const filename = context.getFilename()
    if (/.*\.d\.[mc]?ts$/.test(filename))
      return {}
    return {
      '[declare=true]': (node) => {
        context.report({
          node,
          messageId: 'noDeclareInTsFile',
        })
      },
    }
  },
})
