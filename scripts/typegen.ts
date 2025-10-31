import fs from 'node:fs/promises'

import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { antfu } from '../src/factory'

const configs = await antfu({
  astro: true,
  formatters: true,
  imports: true,
  jsx: {
    a11y: true,
  },
  jsonc: true,
  markdown: true,
  nextjs: true,
  react: true,
  solid: true,
  pnpm: true,
  regexp: true,
  stylistic: true,
  gitignore: true,
  svelte: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableOnly: true,
  },
  unicorn: true,
  unocss: true,
  vue: {
    a11y: true,
  },
  yaml: true,
  toml: true,
  test: true,
})
  .prepend(
    {
      plugins: {
        '': {
          rules: Object.fromEntries(builtinRules.entries()),
        },
      },
    },
  )

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/typegen.d.ts', dts)
