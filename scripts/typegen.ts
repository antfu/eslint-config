import fs from 'node:fs/promises'
import { pluginsToRulesOptions } from 'eslint-typegen'
import type { ESLint } from 'eslint'
import {
  astro,
  combine,
  comments,
  formatters,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  perfectionist,
  react,
  sortPackageJson,
  stylistic,
  svelte,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from '../src'

const plugins: Record<string, ESLint.Plugin> = {}

const configs = await combine(
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

for (const config of configs)
  Object.assign(plugins, config.plugins)

console.log(Object.keys(plugins))

const dts = await pluginsToRulesOptions(plugins)

await fs.writeFile('src/typegen.d.ts', dts)
