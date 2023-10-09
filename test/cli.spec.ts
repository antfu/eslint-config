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

  const pkgJsonContent = {
    devDependencies: {
      '@custom/eslint-some-config': 'x.x.x',
      '@custom/eslint-some-plugin': 'x.x.x',
      'eslint-some-config': 'x.x.x',
      'eslint-some-plugin': 'x.x.x',
      'prettier': 'x.x.x',
    },
  }
  fs.writeFileSync(join(genPath, 'package.json'), JSON.stringify(pkgJsonContent, null, 2))
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

it('.vscode updated', () => {
  createMockDir()
  run()

  const settingsContent: Record<string, any> = JSON.parse(fs.readFileSync(join(genPath, '.vscode', 'settings.json'), 'utf-8'))

  const expectedSettings = [
    '"eslint.experimental.useFlatConfig":true',
    '"prettier.enable":false',
    '"editor.formatOnSave":false',
    '"eslint.format.enable":true',
    'editor.codeActionsOnSave',
    'eslint.rules.customizations',
    'eslint.validate',
  ]

  expectedSettings.forEach((setting) => {
    expect(JSON.stringify(settingsContent)).toContain(setting)
  })
})

it('all eslint configs files removed', () => {
  createMockDir()
  run()

  expect(fs.existsSync(join(genPath, '.eslintignore'))).toBeFalsy()
  expect(fs.existsSync(join(genPath, '.eslintrc.yml'))).toBeFalsy()
})

it('all prettier configs files removed', () => {
  createMockDir()
  run()

  expect(fs.existsSync(join(genPath, '.prettierignore'))).toBeFalsy()
  expect(fs.existsSync(join(genPath, '.prettierrc'))).toBeFalsy()
})

it('ignores files added in eslint.config.js', () => {
  createMockDir()
  run()

  const eslintConfigContent: string = fs.readFileSync(join(genPath, 'eslint.config.js'), 'utf-8').replace(/\s+/g, '')

  expect(eslintConfigContent.includes('ignores:[\'some-path\',\'some-file\']')).toBeTruthy()
})
