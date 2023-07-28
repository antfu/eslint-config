import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import type { MessageIds } from './named-tuple-spacing'
import rule, { RULE_NAME } from './named-tuple-spacing'

const valids = [
  'type T = [i: number]',
  'type T = [i:   number]', // passes since it will be handled by eslint's no-multi-spaces
  'type T = [i: number, j: number]',
  `const emit = defineEmits<{
    change: [id: number]
    update: [value: string]
  }>()`,
]

const invalids = [
  ['type T = [i:number]', 'type T = [i: number]'],
  ['type T = [i : number]', 'type T = [i: number]', 1, 'unexpectedSpaceBefore'],
  ['type T = [i:number, j:number]', 'type T = [i: number, j: number]', 2],
  [
    `const emit = defineEmits<{
      change: [id:number]
      update: [value:string]
    }>()`,
    `const emit = defineEmits<{
      change: [id: number]
      update: [value: string]
    }>()`,
    2,
  ],
] as [error: string, correct: string, errorNumber: number | undefined, errorMsg: MessageIds | undefined][]

it('runs', () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map(i => ({
      code: i[0],
      output: i[1].trim(),
      errors: Array.from({ length: i[2] || 1 }, () => ({ messageId: i[3] || 'expectedSpaceAfter' })),
    })),
  })
})
