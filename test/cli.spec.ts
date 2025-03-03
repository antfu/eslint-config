import { join } from 'node:path'
import process from 'node:process'

import { execa } from 'execa'
import fs from 'fs-extra'
import { afterAll, beforeEach, expect, it } from 'vitest'

const CLI_PATH = join(__dirname, '../bin/index.js')
const genPath = join(__dirname, '..', '.temp', randomStr())

function randomStr() {
  return Math.random().toString(36).slice(2)
}

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

it('lint script - keep should preserve existing script', async () => {
  // Setup existing lint script
  await fs.writeJSON(join(genPath, 'package.json'), {
    scripts: {
      lint: 'custom-lint-command',
    },
  }, { spaces: 2 })

  const { stdout } = await run(['--lint=keep'])

  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  expect(pkgContent.scripts?.lint).toBe('custom-lint-command')
  expect(stdout).toContain('Changes wrote to package.json')
})

it('lint script - check should add check script', async () => {
  const { stdout } = await run(['--lint=check'])

  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  expect(pkgContent.scripts?.lint).toBe('eslint --cache')
  expect(stdout).toContain('Changes wrote to package.json')
})

it('lint script - fix should add fix script', async () => {
  const { stdout } = await run(['--lint=fix'])

  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  expect(pkgContent.scripts?.lint).toBe('eslint --fix --cache')
  expect(stdout).toContain('Changes wrote to package.json')
})

it('lint script - keep should not add script if none exists', async () => {
  const { stdout } = await run(['--lint=keep'])

  const pkgContent: Record<string, any> = await fs.readJSON(join(genPath, 'package.json'))
  expect(pkgContent.scripts?.lint).toBeUndefined()
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

it('ignores files added in eslint.config.js', async () => {
  const { stdout } = await run()

  const eslintConfigContent = (await fs.readFile(join(genPath, 'eslint.config.mjs'), 'utf-8')).replace(/\\/g, '/')

  expect(stdout).toContain('Created eslint.config.mjs')
  expect(eslintConfigContent)
    .toMatchInlineSnapshot(`
      "import antfu from '@antfu/eslint-config'

      export default antfu({
        ignores: ["some-path","**/some-path/**","some-file","**/some-file/**"],
      })
      "
    `)
})

it('suggest remove unnecessary files', async () => {
  const { stdout } = await run()

  expect(stdout).toContain('You can now remove those files manually')
  expect(stdout).toContain('.eslintignore, .eslintrc.yml, .prettierc, .prettierignore')
})
