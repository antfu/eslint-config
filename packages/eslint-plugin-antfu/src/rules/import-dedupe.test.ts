import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './import-dedupe'

const valids = [
  'import { a } from \'foo\'',
]
const invalids = [
  [
    'import { a, b, a, a, c, a } from \'foo\'',
    'import { a, b,   c,  } from \'foo\'',
  ],
]

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    code: i[0],
    output: i[1],
    errors: [{ messageId: 'importDedupe' }, { messageId: 'importDedupe' }, { messageId: 'importDedupe' }],
  })),
})
