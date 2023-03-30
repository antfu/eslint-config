import { createEslintRule } from '../utils'

export const RULE_NAME = 'top-level-function'
export type MessageIds = 'topLevelFunctionDeclaration'
export type Options = []

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce top-level functions to be declared with function keyword',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      topLevelFunctionDeclaration: 'Top-level functions should be declared with function keyword',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      VariableDeclaration(node) {
        if (node.parent.type !== 'Program' && node.parent.type !== 'ExportNamedDeclaration')
          return

        if (node.declarations.length !== 1)
          return
        if (node.kind !== 'const')
          return
        if (node.declare)
          return

        const declaration = node.declarations[0]

        if (declaration.init?.type !== 'ArrowFunctionExpression')
          return
        if (declaration.id?.type !== 'Identifier')
          return
        if (declaration.id.typeAnnotation)
          return

        const arrowFn = declaration.init
        const body = declaration.init.body
        const id = declaration.id

        context.report({
          node,
          loc: {
            start: node.loc.start,
            end: node.loc.end,
          },
          messageId: 'topLevelFunctionDeclaration',
          fix(fixer) {
            const code = context.getSourceCode().text
            const textName = code.slice(id.range[0], id.range[1])
            const textArgs = arrowFn.params.length
              ? code.slice(arrowFn.params[0].range[0], arrowFn.params[arrowFn.params.length - 1].range[1])
              : ''
            const textBody = body.type === 'BlockStatement'
              ? code.slice(body.range[0], body.range[1])
              : `{ return ${code.slice(body.range[0], body.range[1])} }`
            const textGeneric = arrowFn.typeParameters
              ? code.slice(arrowFn.typeParameters.range[0], arrowFn.typeParameters.range[1])
              : ''
            const textTypeReturn = arrowFn.returnType
              ? code.slice(arrowFn.returnType.range[0], arrowFn.returnType.range[1])
              : ''
            const asyncLabel = arrowFn.async ? 'async ' : ''
            const text = `${asyncLabel}function ${textName} ${textGeneric}(${textArgs})${textTypeReturn} ${textBody}`
            // console.log({
            //   input: code.slice(node.range[0], node.range[1]),
            //   output: text,
            // })
            return fixer.replaceTextRange([node.range[0], node.range[1]], text)
          },
        })
      },
    }
  },
})
