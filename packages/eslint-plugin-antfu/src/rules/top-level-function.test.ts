import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './top-level-function'

const valids = [
  'function foo() {}',
  // allow arrow function inside function
  'function foo() { const bar = () => {} }',
  // allow arrow function when type is specified
  'const Foo: Bar = () => {}',
  // allow let/var
  'let foo = () => {}',
  // allow arrow function in as
  'const foo = (() => {}) as any',
  // allow iife
  ';(() => {})()',
  // allow export default
  'export default () => {}',
  'export default defineConfig(() => {})',
]

const invalids = [
  [
    'const foo = (as: string, bar: number) => { return as + bar }',
    'function foo (as: string, bar: number) { return as + bar }',
  ],
  [
    'const foo = <K, T extends Boolean>(as: string, bar: number): Omit<T, K> => as + bar',
    'function foo <K, T extends Boolean>(as: string, bar: number): Omit<T, K> { return as + bar }',
  ],
  [
    'export const foo = () => {}',
    'export function foo () {}',
  ],
  [
    'export const foo = () => ({})',
    'export function foo () { return {} }',
  ],
]

it('runs', () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map(i => ({
      code: i[0],
      output: i[1],
      errors: [{ messageId: 'topLevelFunctionDeclaration' }],
    })),
  })
})
