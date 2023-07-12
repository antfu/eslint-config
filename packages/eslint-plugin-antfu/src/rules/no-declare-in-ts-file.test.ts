import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './no-declare-in-ts-file'

const codes = [
  'declare class A {}',
  'class A { declare name: string }',
  'class A { declare getName: () => string }',

  'declare var A: number = 123',
  'declare let A: number = 123',
  'declare const A: number = 123',
  'declare function A(a: string): any',
  'declare enum A{A1,A2}',
  'declare namespace A{}',
  'declare type A = {}',
  'declare interface A{}',
  'declare global { var a: string }',
  'declare module \'moment\' { export function foo(): string }',
]

const invalids = codes.map(code => ({ code, filename: 'foo.ts' }))
const valids = codes.map(code => ({ code, filename: 'foo.d.ts' }))

it('runs', () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map(i => ({
      ...i,
      errors: [{ messageId: 'noDeclareInTsFile' }],
    })),
  })
})
