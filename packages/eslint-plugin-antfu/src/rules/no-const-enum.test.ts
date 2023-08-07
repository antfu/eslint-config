import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-const-enum'

const valids = [
  'enum E {}',
]

const invalids = [
  'const enum E {}',
]

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    code: i,
    errors: [{ messageId: 'noConstEnum' }],
  })),
})
