import { join, resolve } from 'node:path'
import { beforeAll, expect, it } from 'vitest'
import fs from 'fs-extra'
import { execa } from 'execa'
import fg from 'fast-glob'
import type { OptionsConfig } from '../src/types'

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true })
})

it('js', async () => {
  await setup('js', {
    typescript: false,
    vue: false,
  })
})

it('all', async () => {
  await setup('all', {
    typescript: true,
    vue: true,
  })
})

async function setup(name: string, configs: OptionsConfig) {
  const from = resolve('fixtures/input')
  const output = resolve('fixtures/output', name)
  const target = resolve('_fixtures', name)
  await fs.copy(from, target, {
    filter: (src) => {
      return !src.includes('node_modules')
    },
  })

  await fs.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import antfu from '@antfu/eslint-config'

export default antfu(${JSON.stringify(configs)})
  `)

  await execa('npx', ['eslint', '.', '--fix'], {
    stdio: 'inherit',
    cwd: target,
  })

  const files = await fg('**/*', {
    ignore: [
      'node_modules',
      'eslint.config.js',
    ],
    cwd: target,
  })

  for (const file of files) {
    const content = await fs.readFile(join(target, file), 'utf-8')
    await expect.soft(content).toMatchFileSnapshot(join(output, file))
  }
}
