import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-import-node-modules-by-path'

const valids = [
  'import xxx from "a"',
  'import "b"',
  'const c = require("c")',
  'require("d")',
]

const invalids = [
  'import a from "../node_modules/a"',
  'import "../node_modules/b"',
  'const c = require("../node_modules/c")',
  'require("../node_modules/d")',
]

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    code: i,
    errors: [{ messageId: 'noImportNodeModulesByPath' }],
  })),
})
