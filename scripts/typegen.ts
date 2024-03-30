import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { astro, combine, comments, formatters, imports, javascript, jsdoc, jsonc, markdown, node, perfectionist, react, sortPackageJson, stylistic, svelte, test, toml, typescript, unicorn, unocss, vue, yaml } from '../src'

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  astro(),
  comments(),
  formatters(),
  imports(),
  javascript(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  react(),
  sortPackageJson(),
  stylistic(),
  svelte(),
  test(),
  toml(),
  typescript(),
  unicorn(),
  unocss(),
  vue(),
  yaml(),
)

const dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

await fs.writeFile('src/typegen.d.ts', dts)
