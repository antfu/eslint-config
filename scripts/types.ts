import fs from 'node:fs/promises'
import { packages } from '@eslint-stylistic/metadata'

const main = packages.find(i => i.shortId === 'default')

console.log(main.rules)

const dts = `
import type {
  EslintRules,
  MergeIntersection,
  TypeScriptRules,
  Unprefix,
} from '@antfu/eslint-define-config'

type MergedRules = MergeIntersection<
  EslintRules &
  Unprefix<TypeScriptRules, '@typescript-eslint/'>
>

export type StylisticRules = Pick<MergedRules, ${main.rules.map(i => `'${i.name}'`).join(' | ')}>
`

fs.writeFile('src/generated/stylistic.ts', dts, 'utf-8')
