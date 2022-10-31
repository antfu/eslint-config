import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './generic-spacing'

const valids = [
  'type Foo<T = true> = T',
  'type Foo<T extends true = true> = T',
  `
type Foo<
  T = true,
  K = false
> = T`,
  `function foo<
  T
>() {}`,
]
const invalids = [
  ['type Foo<T=true> = T', 'type Foo<T = true> = T'],
  ['type Foo<T,K> = T', 'type Foo<T, K> = T'],
  ['type Foo<T=false,K=1|2> = T', 'type Foo<T = false, K = 1|2> = T', 3],
  ['function foo <T>() {}', 'function foo<T>() {}'],
] as const

it('runs', () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map(i => ({
      code: i[0],
      output: i[1].trim(),
      errors: Array.from({ length: i[2] || 1 }, () => ({ messageId: 'genericSpacingMismatch' })),
    })),
  })
})
