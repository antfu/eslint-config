import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-import-node-modules-by-path'
export type MessageIds = 'noImportNodeModulesByPath'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent importing modules in `node_modules` folder by relative or absolute path',
      recommended: 'error',
    },
    schema: [],
    messages: {
      noImportNodeModulesByPath: 'Do not import modules in `node_modules` folder by path',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      'ImportDeclaration': (node) => {
        if (node.source.value.includes('/node_modules/')) {
          context.report({
            node,
            messageId: 'noImportNodeModulesByPath',
          })
        }
      },
      'CallExpression[callee.name="require"]': (node: any) => {
        const value = node.arguments[0]?.value
        if (typeof value === 'string' && value.includes('/node_modules/')) {
          context.report({
            node,
            messageId: 'noImportNodeModulesByPath',
          })
        }
      },
    }
  },
})
