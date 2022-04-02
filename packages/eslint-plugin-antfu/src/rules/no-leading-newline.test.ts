import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint'
import { it } from 'vitest'
import rule, { RULE_NAME } from './no-leading-newline'

const valids = [
  'import {} from \'foo\'',
  `// comment
import {} from ''`,
]
const invalids = [
  '\n\nimport {} from \'fo\'',
]

it('runs', () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
  })

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map(i => ({
      code: i,
      output: i.trim(),
      errors: [{ messageId: 'noLeadingNewline' }],
    })),
  })
})
