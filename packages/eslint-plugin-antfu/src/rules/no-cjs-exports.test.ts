import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
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

it('runs', () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map(i => ({
      ...i,
      errors: [{ messageId: 'noCjsExports' }],
    })),
  })
})
