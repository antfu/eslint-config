import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './named-tuple-spacing'

const valids = [
  'type T = [i: number]',
  'type T = [i?: number]',
  'type T = [i: number, j: number]',
  'type T = [i: number, j: () => string]',
  `const emit = defineEmits<{
    change: [id: number]
    update: [value: string]
  }>()`,
]

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: [
    {
      code: 'type T = [i:number]',
      output: 'type T = [i: number]',
      errors: [{ messageId: 'expectedSpaceAfter' }],
    },
    {
      code: 'type T = [i:  number]',
      output: 'type T = [i: number]',
      errors: [{ messageId: 'expectedSpaceAfter' }],
    },
    {
      code: 'type T = [i?:number]',
      output: 'type T = [i?: number]',
      errors: [{ messageId: 'expectedSpaceAfter' }],
    },
    {
      code: 'type T = [i?   :number]',
      output: 'type T = [i?: number]',
      errors: [{ messageId: 'unexpectedSpaceBetween' }, { messageId: 'expectedSpaceAfter' }],
    },
    {
      code: 'type T = [i : number]',
      output: 'type T = [i: number]',
      errors: [{ messageId: 'unexpectedSpaceBefore' }],
    },
    {
      code: 'type T = [i  : number]',
      output: 'type T = [i: number]',
      errors: [{ messageId: 'unexpectedSpaceBefore' }],
    },
    {
      code: 'type T = [i  ?  : number]',
      output: 'type T = [i?: number]',
      errors: [{ messageId: 'unexpectedSpaceBetween' }, { messageId: 'unexpectedSpaceBefore' }],
    },
    {
      code: 'type T = [i:number, j:number]',
      output: 'type T = [i: number, j: number]',
      errors: [{ messageId: 'expectedSpaceAfter' }, { messageId: 'expectedSpaceAfter' }],
    },
    {
      code: 'type T = [i:()=>void, j:number]',
      output: 'type T = [i: ()=>void, j: number]',
      errors: [{ messageId: 'expectedSpaceAfter' }, { messageId: 'expectedSpaceAfter' }],
    },
    {
      code: `
        const emit = defineEmits<{
          change: [id:number]
          update: [value:string]
        }>()
        `,
      output: `
        const emit = defineEmits<{
          change: [id: number]
          update: [value: string]
        }>()
        `,
      errors: [{ messageId: 'expectedSpaceAfter' }, { messageId: 'expectedSpaceAfter' }],
    },
    {
      code: `
        const emit = defineEmits<{
          change: [id? :number]
          update: [value:string]
        }>()
        `,
      output: `
        const emit = defineEmits<{
          change: [id?: number]
          update: [value: string]
        }>()
        `,
      errors: [{ messageId: 'unexpectedSpaceBetween' }, { messageId: 'expectedSpaceAfter' }, { messageId: 'expectedSpaceAfter' }],
    },
  ],
})
