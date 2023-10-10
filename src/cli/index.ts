/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import prompts from 'prompts'
import c from 'kleur'

// @ts-expect-error missing types
import parse from 'parse-gitignore'

export async function cli() {
  const cwd = process.cwd()

  console.log(c.dim(`\nSetup eslint config ...\n`))

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

  const currentEslintVersion: string = (pkg?.devDependencies?.eslint || '').match(/\d+/)?.[0]

  if (!currentEslintVersion || Number.parseInt(currentEslintVersion) < 8) {
    let promptResult: prompts.Answers<'updateEslintVersion'>

    try {
      promptResult = await prompts({
        initial: true,
        message: () => {
          if (currentEslintVersion) {
            console.log(c.red('Your eslint version does not support the configuration, the minimum version eslint is'), c.dim('8.x.x'))
            return 'Update eslint to the current latest version?'
          }
          else {
            return ''
          }
        },
        name: 'updateEslintVersion',
        type: currentEslintVersion ? 'confirm' : null,
      }, { onCancel: () => {
        throw new Error(`${c.red('✖')} Operation cancelled`)
      } })
    }
    catch (cancelled: any) {
      console.log(cancelled.message)
      return
    }

    if (promptResult?.updateEslintVersion ?? true) {
      const eslintLastVersion = await execSync(`npm show eslint version --quite`)

      const eslintVersion: string = eslintLastVersion?.toString()?.trim()
      pkg.devDependencies.eslint = eslintVersion
    }
    else {
      console.log('Please update eslint and try again')
      return
    }
  }

  const eslintConfigLastVersion = await execSync(`npm show @antfu/eslint-config version --quite`)

  const eslintConfigVersion: string = eslintConfigLastVersion?.toString()?.trim()
  pkg.devDependencies['@antfu/eslint-config'] = eslintConfigVersion

  try {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    console.log(c.cyan('Updated -'), c.dim('package.json\n'))
  }
  catch (error) {
    console.log(c.red('Failed to update -'), c.dim('package.json'))
    process.exit(1)
  }
  // End update package.json

  // Update eslint files
  const eslintConfigPath: string = path.join(cwd, 'eslint.config.js')
  const eslintIgnorePath: string = path.join(cwd, '.eslintignore')
  const eslintIgnores: string[] = []

  if (fs.existsSync(eslintIgnorePath)) {
    const parsed = parse(eslintIgnorePath)
    const globs = parsed.globs()

    for (const glob of globs) {
      if (glob.type === 'ignore')
        eslintIgnores.push(...glob.patterns)
      else if (glob.type === 'unignore')
        eslintIgnores.push(...glob.patterns.map((pattern: string) => `!${pattern}`))
    }
  }

  let eslintConfigContent: string = ''

  const antfuConfig = `${eslintIgnores.length ? `ignores: ${JSON.stringify(eslintIgnores)}` : ''}`

  if (pkg.type === 'module') {
    eslintConfigContent = `
import antfu from '@antfu/eslint-config';\n
export default antfu({\n${antfuConfig}\n});`
  }
  else {
    eslintConfigContent = `
const antfu = require('@antfu/eslint-config').default;\n
module.exports = antfu({\n${antfuConfig}\n});`
  }

  try {
    fs.writeFileSync(eslintConfigPath, eslintConfigContent)
    console.log(c.cyan('Created -'), c.dim('eslint.config.js'))
  }
  catch (error) {
    console.log(c.red('Failed to create -'), c.dim('eslint.config.js'))
  }

  const files = fs.readdirSync(cwd)
  const unnecessaryFiles: string[] = []
  files.forEach((file) => {
    if (file.includes('eslint') || file.includes('prettier'))
      unnecessaryFiles.push(file)
  })
  if (unnecessaryFiles.length)
    console.log('You can now remove those files:', c.dim(unnecessaryFiles.join(', ')), '\n')
  // End update eslint files

  // Update .vscode/settings.json
  let promptResult: prompts.Answers<'updateVscodeSettings'>

  try {
    promptResult = await prompts({
      initial: true,
      message: 'Update .vscode/settings.json for better performance?',
      name: 'updateVscodeSettings',
      type: 'confirm',
    }, { onCancel: () => {
      throw new Error(`${c.red('✖')} Operation cancelled`)
    } })
  }
  catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  if (promptResult?.updateVscodeSettings ?? true) {
    const dotVscodePath: string = path.join(cwd, '.vscode')
    const settingsPath: string = path.join(dotVscodePath, 'settings.json')
    let settingsContent: string = ''

    try {
      if (!fs.existsSync(dotVscodePath))
        fs.mkdirSync(dotVscodePath)

      if (!fs.existsSync(settingsPath))
        fs.writeFileSync(settingsPath, `{\n}`)

      settingsContent = fs.readFileSync(settingsPath, 'utf8')
    }
    catch (error) {
      console.log(c.red('Error when reading a file -'), c.dim('.vscode/settings.json'))
      process.exit(1)
    }

    const vscodeSettingsRecommended = {
      'editor.codeActionsOnSave': {
        'source.fixAll': 'explicit',
        'source.organizeImports': 'never',
      },
      'editor.formatOnSave': false,
      'eslint.experimental.useFlatConfig': true,
      'eslint.rules.customizations': [
        { rule: 'style/*', severity: 'off' },
        { rule: '*-indent', severity: 'off' },
        { rule: '*-spacing', severity: 'off' },
        { rule: '*-spaces', severity: 'off' },
        { rule: '*-order', severity: 'off' },
        { rule: '*-dangle', severity: 'off' },
        { rule: '*-newline', severity: 'off' },
        { rule: '*quotes', severity: 'off' },
        { rule: '*semi', severity: 'off' },
      ],
      'eslint.validate': [
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
      ],
      'prettier.enable': false,
    }

    settingsContent = settingsContent.trim().replace(/\s*}$/, '')
    settingsContent += settingsContent.endsWith(',') || settingsContent === '{' ? '' : ','

    settingsContent = Object.entries(vscodeSettingsRecommended).reduce(
      (acc, [key, value]) => `${acc}\n"${key}": ${JSON.stringify(value, null, 2)},\n`,
      settingsContent,
    )
    settingsContent += `}`

    fs.writeFileSync(settingsPath, settingsContent)

    console.log(c.cyan('Updated -'), c.dim('.vscode/settings.json'))
  }
  // End update .vscode/settings.json

  console.log(c.green('\nSuccessful. Now you can update the dependencies and run'), c.dim('eslint . --fix\n'))
}
