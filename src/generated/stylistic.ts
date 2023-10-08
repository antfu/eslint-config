import type {
  EslintRules,
  MergeIntersection,
  TypeScriptRules,
  Unprefix,
} from '@antfu/eslint-define-config'

type MergedRules = MergeIntersection<
  EslintRules &
  Unprefix<TypeScriptRules, '@typescript-eslint/'>
>

export type StylisticRules = Pick<MergedRules, 'array-bracket-newline' | 'array-bracket-spacing' | 'array-element-newline' | 'arrow-spacing' | 'block-spacing' | 'brace-style' | 'comma-dangle' | 'comma-spacing' | 'comma-style' | 'computed-property-spacing' | 'dot-location' | 'eol-last' | 'func-call-spacing' | 'function-call-argument-newline' | 'function-paren-newline' | 'generator-star-spacing' | 'implicit-arrow-linebreak' | 'indent' | 'jsx-quotes' | 'key-spacing' | 'keyword-spacing' | 'linebreak-style' | 'lines-around-comment' | 'lines-around-directive' | 'lines-between-class-members' | 'max-len' | 'max-statements-per-line' | 'multiline-ternary' | 'new-parens' | 'newline-after-var' | 'newline-before-return' | 'newline-per-chained-call' | 'no-confusing-arrow' | 'no-extra-parens' | 'no-extra-semi' | 'no-floating-decimal' | 'no-mixed-operators' | 'no-mixed-spaces-and-tabs' | 'no-multi-spaces' | 'no-multiple-empty-lines' | 'no-spaced-func' | 'no-tabs' | 'no-trailing-spaces' | 'no-whitespace-before-property' | 'nonblock-statement-body-position' | 'object-curly-newline' | 'object-curly-spacing' | 'object-property-newline' | 'one-var-declaration-per-line' | 'operator-linebreak' | 'padded-blocks' | 'padding-line-between-statements' | 'quote-props' | 'quotes' | 'rest-spread-spacing' | 'semi' | 'semi-spacing' | 'semi-style' | 'space-before-blocks' | 'space-before-function-paren' | 'space-in-parens' | 'space-infix-ops' | 'space-unary-ops' | 'spaced-comment' | 'switch-colon-spacing' | 'template-curly-spacing' | 'template-tag-spacing' | 'wrap-iife' | 'wrap-regex' | 'yield-star-spacing' | 'member-delimiter-style' | 'type-annotation-spacing'>
