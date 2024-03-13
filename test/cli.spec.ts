import { join } from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
import fs from 'fs-extra'
import { afterAll, beforeEach, expect, it } from 'vitest'

const CLI_PATH = join(__dirname, '../bin/index.js')
const genPath = join(__dirname, '..', '.temp')

async function run(params: string[] = [], env = {
  SKIP_PROMPT: '1',
  NO_COLOR: '1',
}) {
  return execa('node', [CLI_PATH, ...params], {
    cwd: genPath,
    env: {
      ...process.env,
      ...env,
    },
  })
};

async function createMockDir() {
  await fs.rm(genPath, { recursive: true, force: true })
  await fs.ensureDir(genPath)

  await Promise.all([
    fs.writeFile(join(genPath, 'package.json'), JSON.stringify({}, null, 2)),
    fs.writeFile(join(genPath, '.eslintrc.yml'), ''),
    fs.writeFile(join(genPath, '.eslintignore'), 'some-path\nsome-file'),
    fs.writeFile(join(genPath, '.prettierc'), ''),
    fs.writeFile(join(genPath, '.prettierignore'), 'some-path\nsome-file'),
  ])
};

beforeEach(async () => await createMockDir())
afterAll(async () => await fs.rm(genPath, { recursive: true, force: true }))

it('package.json updated', async () => {
  const { stdout } = await run()

  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))

  expect(JSON.stringify(pkgContent.devDependencies)).toContain('@antfu/eslint-config')
  expect(stdout).toContain('Changes wrote to package.json')
})

it('esm eslint.config.js', async () => {
  const pkgContent = await fs.readFile('package.json', 'utf-8')
  await fs.writeFile(join(genPath, 'package.json'), JSON.stringify({ ...JSON.parse(pkgContent), type: 'module' }, null, 2))

  const { stdout } = await run()

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  expect(eslintConfigContent.includes('export default')).toBeTruthy()
  expect(stdout).toContain('Created eslint.config.js')
})

it('cjs eslint.config.js', async () => {
  const { stdout } = await run()

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  expect(eslintConfigContent.includes('module.exports')).toBeTruthy()
  expect(stdout).toContain('Created eslint.config.js')
})

it('ignores files added in eslint.config.js', async () => {
  const { stdout } = await run()

  const eslintConfigContent = (await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')).replace(/\\/g, '/')

  expect(stdout).toContain('Created eslint.config.js')
  expect(eslintConfigContent)
    .toMatchInlineSnapshot(`
      "const antfu = require('@antfu/eslint-config').default

      module.exports = antfu({
      ignores: ["some-path","**/some-path/**","some-file","**/some-file/**"],
      })
      "
    `)
})

it('suggest remove unnecessary files', async () => {
  const { stdout } = await run()

  expect(stdout).toContain('You can now remove those files manually')
  expect(stdout).toContain('.eslintignore, .eslintrc.yml, .prettierc, .prettierignore, eslint.config.js')
})

it('react template', async () => {
  await run(['-t react'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(eslintConfigContent).toContain('react')
  expect(devDependencies).toContain('eslint-plugin-react')
  expect(devDependencies).toContain('eslint-plugin-react-hooks')
  expect(devDependencies).toContain('eslint-plugin-react-refresh')
})

it('svelte template', async () => {
  await run(['-t svelte'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(eslintConfigContent).toContain('svelte')
  expect(devDependencies).toContain('eslint-plugin-svelte')
  expect(devDependencies).toContain('svelte-eslint-parser')
})

it('astro template', async () => {
  await run(['-t astro'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(eslintConfigContent).toContain('astro')
  expect(devDependencies).toContain('eslint-plugin-astro')
  expect(devDependencies).toContain('astro-eslint-parser')
})

it('astro template with formatter', async () => {
  await run(['-t astro', '-e formatter'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(eslintConfigContent).toContain('astro')
  expect(eslintConfigContent).toContain('formatters')
  expect(devDependencies).toContain('eslint-plugin-astro')
  expect(devDependencies).toContain('astro-eslint-parser')

  expect(devDependencies).toContain('eslint-plugin-format')
  expect(devDependencies).toContain('prettier-plugin-astro')
})

it('formatter extra util', async () => {
  await run(['-e formatter'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(eslintConfigContent).toContain('formatters')
  expect(devDependencies).toContain('eslint-plugin-format')
})

it('unocss extra util', async () => {
  await run(['-e unocss'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(eslintConfigContent).toContain('unocss')
  expect(devDependencies).toContain('@unocss/eslint-plugin')
})

it('perfectionist extra util', async () => {
  await run(['-e perfectionist'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')

  expect(eslintConfigContent).toMatchInlineSnapshot(`
    "const antfu = require('@antfu/eslint-config').default

    module.exports = antfu({
    ignores: ["some-path","**/some-path/**","some-file","**/some-file/**"],
    },{
    files: ['src/**/*.{ts,js}'],
      rules: {
        'perfectionist/sort-objects': 'error',
      }
    })
    "
  `)
})

it('all extra util', async () => {
  await run(['-e formatter', '-e unocss', '-e perfectionist'])

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf-8')
  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  const devDependencies = JSON.stringify(pkgContent.devDependencies)

  expect(devDependencies).toContain('@unocss/eslint-plugin')
  expect(devDependencies).toContain('eslint-plugin-format')

  expect(eslintConfigContent).toMatchInlineSnapshot(`
    "const antfu = require('@antfu/eslint-config').default

    module.exports = antfu({
    ignores: ["some-path","**/some-path/**","some-file","**/some-file/**"],
    formatters: true,
    unocss: true,
    },{
    files: ['src/**/*.{ts,js}'],
      rules: {
        'perfectionist/sort-objects': 'error',
      }
    })
    "
  `)
})
