import type { FlatESLintConfigItem } from 'eslint-define-config'
import { packages } from '@eslint-stylistic/metadata'
import { pluginStylisticJs, pluginStylisticTs, pluginTs } from '../plugins'
import { OFF } from '../flags'

const tsPackage = packages.find(i => i.shortId === 'ts')!

export const javascriptStylistic: FlatESLintConfigItem[] = [
  {
    plugins: {
      style: pluginStylisticJs,
    },
    rules: {
      'antfu/consistent-list-newline': 'error',
      'antfu/if-newline': 'error',

      'comma-dangle': ['error', 'always-multiline'],
      'curly': ['error', 'multi-or-nest', 'consistent'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],

      'style/array-bracket-spacing': ['error', 'never'],
      'style/arrow-spacing': ['error', { after: true, before: true }],
      'style/block-spacing': ['error', 'always'],
      'style/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'style/comma-spacing': ['error', { after: true, before: false }],
      'style/comma-style': ['error', 'last'],
      'style/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
      'style/dot-location': ['error', 'property'],
      'style/indent': ['error', 2, {
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
      'style/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      'style/keyword-spacing': ['error', { after: true, before: true }],
      'style/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'style/multiline-ternary': ['error', 'always-multiline'],
      'style/no-mixed-spaces-and-tabs': 'error',
      'style/no-multi-spaces': 'error',
      'style/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'style/no-tabs': 'error',
      'style/no-trailing-spaces': 'error',
      'style/no-whitespace-before-property': 'error',
      'style/object-curly-spacing': ['error', 'always'],
      'style/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
      'style/operator-linebreak': ['error', 'before'],
      'style/padded-blocks': ['error', { blocks: 'never', classes: 'never', switches: 'never' }],
      'style/rest-spread-spacing': ['error', 'never'],
      'style/semi-spacing': ['error', { after: true, before: false }],
      'style/space-before-blocks': ['error', 'always'],
      'style/space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
      'style/space-in-parens': ['error', 'never'],
      'style/space-infix-ops': 'error',
      'style/space-unary-ops': ['error', { nonwords: false, words: true }],
      'style/spaced-comment': ['error', 'always', {
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
      'style/template-curly-spacing': 'error',
      'style/template-tag-spacing': ['error', 'never'],
      'style/yield-star-spacing': ['error', 'both'],
    },
  },
]

export const typescriptStylistic: FlatESLintConfigItem[] = [
  {
    plugins: {
      'style-ts': pluginStylisticTs,
      'ts': pluginTs as any,
    },
    rules: {
      ...stylisticJsToTS(javascriptStylistic[0].rules!),

      'comma-dangle': OFF,
      'quotes': OFF,
      'semi': OFF,

      'style-ts/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
      'style-ts/type-annotation-spacing': ['error', {}],

      'ts/comma-dangle': ['error', 'always-multiline'],
      'ts/quotes': ['error', 'single'],
      'ts/semi': ['error', 'never'],
    },
  },
]

// TODO: move to ESLint Stylistic
function stylisticJsToTS(input: Record<string, any>) {
  return {
    // turn off all stylistic rules from style
    ...Object.fromEntries(
      Object.entries(input)
        .map(([key]) => {
          if (!key.startsWith('style/'))
            return null!
          const basename = key.replace('style/', '')
          if (tsPackage.rules.find(i => i.name === basename))
            return [key, OFF]
          return null!
        })
        .filter(Boolean),
    ),
    // rename all stylistic rules from style to style/ts
    ...Object.fromEntries(
      Object.entries(input)
        .map(([key, value]) => {
          if (!key.startsWith('style/'))
            return null!
          const basename = key.replace('style/', '')
          return tsPackage.rules.find(i => i.name === basename)
            ? [`style-ts/${basename}`, value]
            : null!
        })
        .filter(Boolean),
    ),
  }
}
