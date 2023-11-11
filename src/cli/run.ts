/* eslint-disable no-console */
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import prompts from 'prompts'
import c from 'picocolors'

// @ts-expect-error missing types
import parse from 'parse-gitignore'
import { ARROW, CHECK, WARN, version, vscodeSettingsString } from './constants'
import { isGitClean } from './utils'

const SKIP_PROMPT = !!process.env.SKIP_PROMPT
const SKIP_GIT_CHECK = !!process.env.SKIP_GIT_CHECK

export async function run() {
  const cwd = process.cwd()

  const pathFlatConfig = path.join(cwd, 'eslint.config.js')
  const pathPackageJSON = path.join(cwd, 'package.json')
  const pathESLintIngore = path.join(cwd, '.eslintignore')

  if (fs.existsSync(pathFlatConfig)) {
    console.log(c.yellow(`${WARN} eslint.config.js already exists, migration wizard exited.`))
    return
  }

  if (!SKIP_GIT_CHECK && !isGitClean())
    throw new Error('There are uncommitted changes in the current repository, please commit them and try again')

  // Update package.json
  console.log(c.cyan(`${ARROW} bumping @antfu/eslint-config to v${version}`))
  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  pkg.devDependencies ??= {}
  pkg.devDependencies['@antfu/eslint-config'] = `^${version}`

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2))
  console.log(c.green(`${CHECK} changes wrote to package.json`))

  // End update package.json
  // Update eslint files
  const eslintIgnores: string[] = []
  if (fs.existsSync(pathESLintIngore)) {
    console.log(c.cyan(`${ARROW} migrating existing .eslintignore`))
    const parsed = parse(pathESLintIngore.replace(/\\/g, '/'))
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
import antfu from '@antfu/eslint-config'

export default antfu({\n${antfuConfig}\n})
`.trimStart()
  }
  else {
    eslintConfigContent = `
const antfu = require('@antfu/eslint-config').default

module.exports = antfu({\n${antfuConfig}\n})
`.trimStart()
  }

  await fsp.writeFile(pathFlatConfig, eslintConfigContent)
  console.log(c.green(`${CHECK} created eslint.config.js`))

  const files = fs.readdirSync(cwd)
  const legacyConfig: string[] = []
  files.forEach((file) => {
    if (file.includes('eslint') || file.includes('prettier'))
      legacyConfig.push(file)
  })
  if (legacyConfig.length) {
    console.log(`${WARN} you can now remove those files manually:`)
    console.log(`   ${c.dim(legacyConfig.join(', '))}`)
  }

  // End update eslint files
  // Update .vscode/settings.json
  let promptResult: prompts.Answers<'updateVscodeSettings'> = {
    updateVscodeSettings: true,
  }

  if (!SKIP_PROMPT) {
    try {
      promptResult = await prompts({
        initial: true,
        message: 'Update .vscode/settings.json for better VS Code experience?',
        name: 'updateVscodeSettings',
        type: 'confirm',
      }, {
        onCancel: () => {
          throw new Error(`Cancelled`)
        },
      })
    }
    catch (cancelled: any) {
      console.log(cancelled.message)
      return
    }
  }

  if (promptResult?.updateVscodeSettings ?? true) {
    const dotVscodePath: string = path.join(cwd, '.vscode')
    const settingsPath: string = path.join(dotVscodePath, 'settings.json')

    if (!fs.existsSync(dotVscodePath))
      await fsp.mkdir(dotVscodePath, { recursive: true })

    if (!fs.existsSync(settingsPath)) {
      await fsp.writeFile(settingsPath, `{${vscodeSettingsString}}\n`, 'utf-8')
      console.log(c.green(`${CHECK} created .vscode/settings.json`))
    }
    else {
      let settingsContent = await fsp.readFile(settingsPath, 'utf8')

      settingsContent = settingsContent.trim().replace(/\s*}$/, '')
      settingsContent += settingsContent.endsWith(',') || settingsContent.endsWith('{') ? '' : ','
      settingsContent += `${vscodeSettingsString}}\n`

      await fsp.writeFile(settingsPath, settingsContent, 'utf-8')
      console.log(c.green(`${CHECK} updated .vscode/settings.json`))
    }
  }

  // End update .vscode/settings.json
  console.log(c.green(`${CHECK} migration completed`))
  console.log(` ow you can update the dependencies and run ${c.blue('eslint . --fix')}\n`)
}
