import type { FlatConfigItem } from 'oxlint-flat-config'
import type { OptionsConfig, TypedFlatConfigItem } from '../src/types'

import fs from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { x } from 'tinyexec'
import { glob } from 'tinyglobby'

import { afterAll, beforeAll, it } from 'vitest'

const timeout = process.platform === 'win32'
  ? 300_000
  : 120_000

beforeAll(async () => {
  await fs.rm('_oxlint-fixtures', { recursive: true, force: true })
})
afterAll(async () => {
  await fs.rm('_oxlint-fixtures', { recursive: true, force: true })
})

runWithConfig('js', {}, {
  typescript: false,
  vue: false,
})
runWithConfig('all', {}, {
  typescript: true,
  vue: true,
  svelte: true,
  astro: true,
})
runWithConfig(
  'ts-strict',
  {
    options: { typeAware: true },
  },
  {
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
  },
  {
    rules: {
      'ts/no-unsafe-return': ['off'],
    },
  },
)

function runWithConfig(name: string, oxlintConfig: FlatConfigItem, configs: OptionsConfig, ...items: TypedFlatConfigItem[]) {
  it.concurrent(name, async ({ expect }) => {
    const from = resolve('fixtures/input')
    const output = resolve('fixtures/oxlint', name)
    const target = resolve('_oxlint-fixtures', name)

    await fs.cp(from, target, { recursive: true })
    await fs.writeFile(join(target, 'oxlint.config.ts'), `
import antfu from '@antfu/eslint-config'
import { toOxlint } from '@antfu/eslint-config/oxlint'

export default await toOxlint(
  antfu(${JSON.stringify(configs)}, ...${JSON.stringify(items)}),
  ${JSON.stringify(oxlintConfig)},
)
`)

    const files = await glob('**/*', {
      cwd: target,
      ignore: ['oxlint.config.ts'],
    })
    const read = () => Promise.all(files.map(file => fs.readFile(join(target, file), 'utf-8')))

    // Unlike ESLint, `oxlint --fix` applies a single pass, so repeat it until nothing changes.
    // Files are passed explicitly, as Oxlint would otherwise skip the copies for being in `.gitignore`.
    let diagnostics = ''
    for (let pass = 0; pass < 10; pass++) {
      const before = await read()
      const result = await x('npx', [
        'oxlint',
        '--fix',
        '--format',
        'unix',
        ...files,
      ], {
        nodeOptions: { cwd: target, stdio: 'pipe' },
      })
      if (result.exitCode !== 0 && !/^\d+ problems?$/m.test(result.stdout))
        throw new Error(result.stdout + result.stderr)
      diagnostics = result.stdout
      if ((await read()).every((content, i) => content === before[i]))
        break
    }

    // Oxlint lints in parallel, so sort for a stable order.
    const reported = diagnostics.split('\n').filter(line => /^\S+:\d+:\d+:/.test(line)).sort()
    await expect.soft(`${reported.join('\n')}\n`).toMatchFileSnapshot(join(output, '_diagnostics.txt'))
    await Promise.all(files.map(async (file) => {
      const content = await fs.readFile(join(target, file), 'utf-8')
      const source = await fs.readFile(join(from, file), 'utf-8')
      const outputPath = join(output, file)
      if (content === source) {
        await fs.rm(outputPath, { force: true })
        return
      }
      await expect.soft(content).toMatchFileSnapshot(outputPath)
    }))
  }, timeout)
}
