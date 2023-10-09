/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import c from 'kleur'

export async function cli() {
  const cwd = process.cwd()

  console.log(c.dim(`\nCreating eslint config...\n`))

  // Update package.json
  let pkg: Record<string, any>
  const pkgPath: string = path.join(cwd, 'package.json')

  try {
    const pkgContent: string = fs.readFileSync(pkgPath, 'utf-8')
    pkg = JSON.parse(pkgContent)
  }
  catch (error) {
    console.log(c.red('Could not find -'), c.dim('package.json'))
    process.exit(1)
  }

  const eslintLastVersion = await execSync(`npm show eslint version --quite`)
  const eslintConfigLastVersion = await execSync(`npm show @antfu/eslint-config version --quite`)

  const eslintVersion: string = eslintLastVersion?.toString()?.trim()
  const eslintConfigVersion: string = eslintConfigLastVersion?.toString()?.trim()

  pkg.type = 'module'

  const pkgDep = ['dependencies', 'devDependencies']

  pkgDep.forEach((depType) => {
    if (pkg[depType]) {
      Object.keys(pkg[depType]).forEach((key) => {
        if (key.includes('eslint') || key.includes('prettier'))
          delete pkg[depType][key]
      })
    }
  })

  pkg.devDependencies['@antfu/eslint-config'] = eslintConfigVersion
  pkg.devDependencies.eslint = eslintVersion

  try {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    console.log(c.cyan('Updated -'), c.dim('package.json'))
  }
  catch (error) {
    console.log(c.red('Failed to update -'), c.dim('package.json'))
    process.exit(1)
  }
  // End update package.json

  // Update eslint files
  const eslintConfigPath: string = path.join(cwd, 'eslint.config.js')
  const eslintIgnorePath: string = path.join(cwd, '.eslintignore')
  let eslintIgnoreLines: string[] = []

  if (fs.existsSync(eslintIgnorePath)) {
    const eslintIgnoreContent: string = fs.readFileSync(eslintIgnorePath, 'utf-8')
    eslintIgnoreLines = eslintIgnoreContent.split('\n')
  }

  const eslintConfigContent = `
import antfu from '@antfu/eslint-config';

export default antfu({
  ${eslintIgnoreLines.length
  ? `ignores: [
    ${eslintIgnoreLines?.map(line => `'${line}'`).join(',\n')}
  ],`
 : ''}
});`

  const files = fs.readdirSync(cwd)
  files.forEach((file) => {
    if (file.includes('eslint') || file.includes('prettier'))
      fs.unlinkSync(file)
  })

  try {
    fs.writeFileSync(eslintConfigPath, eslintConfigContent)
    console.log(c.cyan('Created -'), c.dim('eslint.config.js'))
  }
  catch (error) {
    console.log(c.red('Failed to create -'), c.dim('eslint.config.js'))
  }
  // End update eslint files

  // Update .vscode/settings.json
  const dotVscodePath: string = path.join(cwd, '.vscode')
  const settingsPath: string = path.join(dotVscodePath, 'settings.json')

  if (!fs.existsSync(dotVscodePath))
    fs.mkdirSync(dotVscodePath)

  if (!fs.existsSync(settingsPath))
    fs.writeFileSync(settingsPath, '{}')

  let settings: Record<string, any> = {}
  try {
    const settingsContent: string = fs.readFileSync(settingsPath, 'utf8')
    const settingsJsonWithoutComments = settingsContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
    settings = JSON.parse(settingsJsonWithoutComments)
  }
  catch (error) {
    console.log(c.red('Error when reading a file -'), c.dim('.vscode/settings.json'))
    process.exit(1)
  }

  settings['eslint.experimental.useFlatConfig'] = true
  settings['eslint.format.enable'] = true
  settings['prettier.enable'] = false
  settings['editor.formatOnSave'] = false
  settings['editor.codeActionsOnSave'] = {
    'source.fixAll.eslint': 'explicit',
    'source.organizeImports': 'never',
  }
  settings['eslint.rules.customizations'] = [
    { rule: '@stylistic/*', severity: 'off' },
    { rule: 'style*', severity: 'off' },
    { rule: '*-indent', severity: 'off' },
    { rule: '*-spacing', severity: 'off' },
    { rule: '*-spaces', severity: 'off' },
    { rule: '*-order', severity: 'off' },
    { rule: '*-dangle', severity: 'off' },
    { rule: '*-newline', severity: 'off' },
    { rule: '*quotes', severity: 'off' },
    { rule: '*semi', severity: 'off' },
  ]
  settings['eslint.validate'] = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
    'vue',
    'html',
    'markdown',
    'json',
    'jsonc',
    'yaml',
  ]

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
  console.log(c.cyan('Updated -'), c.dim('.vscode/settings.json'))
  // End update .vscode/settings.json

  console.log(c.green('\nSuccessful. Now you can update the dependencies and run'), c.dim('eslint . --fix\n'))
}
