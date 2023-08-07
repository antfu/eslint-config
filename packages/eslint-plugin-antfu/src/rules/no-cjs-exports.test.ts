import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-cjs-exports'

const valids = [
  { code: 'export = {}', filename: 'test.ts' },
  { code: 'exports.a = {}', filename: 'test.js' },
  { code: 'module.exports.a = {}', filename: 'test.js' },
]

const invalids = [
  { code: 'exports.a = {}', filename: 'test.ts' },
  { code: 'module.exports.a = {}', filename: 'test.ts' },
]

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    ...i,
    errors: [{ messageId: 'noCjsExports' }],
  })),
})
