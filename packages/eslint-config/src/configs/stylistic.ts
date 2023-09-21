import type { FlatESLintConfigItem } from 'eslint-define-config'
import { rules } from '@eslint-stylistic/metadata'
import { pluginStylisticJs, pluginStylisticTs } from '../plugins'
import { OFF } from '../flags'

export const javascriptStylistic: FlatESLintConfigItem[] = [
  {
    plugins: {
      '@stylistic/js': pluginStylisticJs,
    },
    rules: {
      // Stylistic
      '@stylistic/js/array-bracket-spacing': ['error', 'never'],
      '@stylistic/js/arrow-spacing': ['error', { after: true, before: true }],
      '@stylistic/js/block-spacing': ['error', 'always'],
      '@stylistic/js/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      '@stylistic/js/comma-spacing': ['error', { after: true, before: false }],
      '@stylistic/js/comma-style': ['error', 'last'],
      '@stylistic/js/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
      '@stylistic/js/dot-location': ['error', 'property'],
      '@stylistic/js/func-call-spacing': OFF,
      '@stylistic/js/generator-star-spacing': OFF,
      '@stylistic/js/indent': ['error', 2, {
        ArrayExpression: 1,
        CallExpression: { arguments: 1 },
        FunctionDeclaration: { body: 1, parameters: 1 },
        FunctionExpression: { body: 1, parameters: 1 },
        ImportDeclaration: 1,
        MemberExpression: 1,
        ObjectExpression: 1,
        SwitchCase: 1,
        VariableDeclarator: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: [
          'TemplateLiteral *',
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
          'TSTypeParameterInstantiation',
          'FunctionExpression > .params[decorators.length > 0]',
          'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
          'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
        ],
        offsetTernaryExpressions: true,
        outerIIFEBody: 1,
      }],
      '@stylistic/js/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      '@stylistic/js/keyword-spacing': ['error', { after: true, before: true }],
      '@stylistic/js/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      '@stylistic/js/multiline-ternary': ['error', 'always-multiline'],

      '@stylistic/js/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/js/no-multi-spaces': 'error',
      '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/js/no-tabs': 'error',

      '@stylistic/js/no-trailing-spaces': 'error',
      '@stylistic/js/no-whitespace-before-property': 'error',
      '@stylistic/js/object-curly-newline': ['error', { consistent: true, multiline: true }],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
      '@stylistic/js/operator-linebreak': ['error', 'before'],
      '@stylistic/js/padded-blocks': ['error', { blocks: 'never', classes: 'never', switches: 'never' }],
      '@stylistic/js/rest-spread-spacing': ['error', 'never'],
      '@stylistic/js/semi-spacing': ['error', { after: true, before: false }],
      '@stylistic/js/space-before-blocks': ['error', 'always'],
      '@stylistic/js/space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
      '@stylistic/js/space-in-parens': ['error', 'never'],
      '@stylistic/js/space-infix-ops': 'error',
      '@stylistic/js/space-unary-ops': ['error', { nonwords: false, words: true }],
      '@stylistic/js/spaced-comment': ['error', 'always', {
        block: {
          balanced: true,
          exceptions: ['*'],
          markers: ['!'],
        },
        line: {
          exceptions: ['/', '#'],
          markers: ['/'],
        },
      }],
      '@stylistic/js/template-curly-spacing': 'error',
      '@stylistic/js/template-tag-spacing': ['error', 'never'],
      '@stylistic/js/yield-star-spacing': ['error', 'both'],
    },
  },
]

export const typescriptStylistic: FlatESLintConfigItem[] = [
  {
    plugins: {
      '@stylistic/js': pluginStylisticJs,
      '@stylistic/ts': pluginStylisticTs,
    },
    rules: {
      ...stylisticJsToTS(rules),
      '@stylistic/ts/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
      '@stylistic/ts/type-annotation-spacing': ['error', {}],
    },
  },
]

// TODO: move to ESLint Stylistic
function stylisticJsToTS(input: Record<string, any>) {
  return {
    // turn off all stylistic rules from @stylistic/js
    ...Object.fromEntries(
      Object.entries(input)
        .map(([key]) => rules.find(i => i.name === key) ? [key, OFF] : null!)
        .filter(Boolean),
    ),
    // rename all stylistic rules from @stylistic/js to @stylistic/ts
    ...Object.fromEntries(
      Object.entries(input)
        .map(([key, value]) => {
          const newKey = key.replace('@stylistic/js', '@stylistic/ts')
          if (newKey === key)
            return null!
          return rules.find(i => i.name === newKey)
            ? [key.replace('@stylistic/js', '@stylistic/ts'), value]
            : null!
        })
        .filter(Boolean),
    ),
  }
}
