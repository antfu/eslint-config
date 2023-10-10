import { join } from 'node:path'
import type { ExecaSyncReturnValue } from 'execa'
import { execaCommandSync } from 'execa'
import fs from 'fs-extra'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

const CLI_PATH = join(__dirname, '../bin/index.js')

const projectName = 'test-app'
const genPath = join(__dirname, projectName)

function run(): ExecaSyncReturnValue {
  return execaCommandSync(`node ${CLI_PATH}`, { cwd: genPath })
};

function createMockDir() {
  fs.mkdirpSync(genPath)

  fs.writeFileSync(join(genPath, 'package.json'), JSON.stringify({ devDependencies: { eslint: '8.0.0' } }, null, 2))
  fs.writeFileSync(join(genPath, '.eslintrc.yml'), '')
  fs.writeFileSync(join(genPath, '.eslintignore'), 'some-path\nsome-file')
  fs.writeFileSync(join(genPath, '.prettierc'), '')
  fs.writeFileSync(join(genPath, '.prettierignore'), 'some-path\nsome-file')
};

beforeAll(() => fs.rm(genPath, { recursive: true, force: true }))
afterEach(() => fs.rm(genPath, { recursive: true, force: true }))
afterAll(() => fs.rm(genPath, { recursive: true, force: true }))

it('package.json updated', () => {
  createMockDir()
  const { stdout } = run()

  const pkgContent: Record<string, any> = JSON.parse(fs.readFileSync(join(genPath, 'package.json'), 'utf-8'))

  expect(JSON.stringify(pkgContent.devDependencies)).toContain('eslint')
  expect(JSON.stringify(pkgContent.devDependencies)).toContain('@antfu/eslint-config')
  expect(stdout).toContain('Updated - package.json')
})

it('esm eslint.config.js', () => {
  createMockDir()
  const pkgContent: string = fs.readFileSync('package.json', 'utf-8')
  fs.writeFileSync(join(genPath, 'package.json'), JSON.stringify({ ...JSON.parse(pkgContent), type: 'module' }, null, 2))

  const { stdout } = run()

  const eslintConfigContent: string = fs.readFileSync(join(genPath, 'eslint.config.js'), 'utf-8')
  expect(eslintConfigContent.includes('export default')).toBeTruthy()
  expect(stdout).toContain('Created - eslint.config.js')
})

it('cjs eslint.config.js', () => {
  createMockDir()
  const { stdout } = run()

  const eslintConfigContent: string = fs.readFileSync(join(genPath, 'eslint.config.js'), 'utf-8')
  expect(eslintConfigContent.includes('module.exports')).toBeTruthy()
  expect(stdout).toContain('Created - eslint.config.js')
})

it('ignores files added in eslint.config.js', () => {
  createMockDir()
  const { stdout } = run()

  const eslintConfigContent: string = fs.readFileSync(join(genPath, 'eslint.config.js'), 'utf-8').replace(/\s+/g, '')

  expect(eslintConfigContent.includes('ignores:["some-path","**/some-path/**","some-file","**/some-file/**"]')).toBeTruthy()
  expect(stdout).toContain('Created - eslint.config.js')
})

it('suggest remove unnecessary files', () => {
  createMockDir()
  const { stdout } = run()

  expect(stdout).toContain('You can now remove those files: .eslintignore, .eslintrc.yml, .prettierc, .prettierignore, eslint.config.js')
})
