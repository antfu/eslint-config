import fs from 'node:fs'
import fsp from 'node:fs/promises'
import process from 'node:process'
import path from 'node:path'
import c from 'picocolors'
import * as p from '@clack/prompts'

// @ts-expect-error missing types
import parse from 'parse-gitignore'
import { Extra, type PromtResult, Template } from '../types'
import { getEslintConfigContent } from '../utils'

export async function updateEslintFiles(result: PromtResult) {
  const cwd = process.cwd()
  const pathFlatConfig = path.join(cwd, 'eslint.config.js')
  const pathESLintIgnore = path.join(cwd, '.eslintignore')
  const pathPackageJSON = path.join(cwd, 'package.json')

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  const eslintIgnores: string[] = []
  if (fs.existsSync(pathESLintIgnore)) {
    p.log.step(c.cyan(`Migrating existing .eslintignore`))
    const content = await fsp.readFile(pathESLintIgnore, 'utf-8')
    const parsed = parse(content)
    const globs = parsed.globs()

    for (const glob of globs) {
      if (glob.type === 'ignore')
        eslintIgnores.push(...glob.patterns)
      else if (glob.type === 'unignore')
        eslintIgnores.push(...glob.patterns.map((pattern: string) => `!${pattern}`))
    }
  }

  const mainConfig = `
${eslintIgnores.length ? `ignores: ${JSON.stringify(eslintIgnores)},\n` : ''}\
${result.extra.includes(Extra.Formatter) ? `formatters: true,\n` : ''}\
${result.extra.includes(Extra.UnoCSS) ? `unocss: true,\n` : ''}\
${result.template !== Template.Vanilla ? `${result.template}: true,` : ''}
  `.trim()

  const additionalConfig = <string[]>[
    result.extra.includes(Extra.Perfectionist) && `
  files: ['src/**/*.{ts,js}'],
  rules: {
    'perfectionist/sort-objects': 'error',
  }`.trim(),
  ].filter(f => !!f)

  const eslintConfigContent: string = getEslintConfigContent(pkg, mainConfig, additionalConfig)

  await fsp.writeFile(pathFlatConfig, eslintConfigContent)
  p.log.success(c.green(`Created eslint.config.js`))

  const files = fs.readdirSync(cwd)
  const legacyConfig: string[] = []
  files.forEach((file) => {
    if (file.includes('eslint') || file.includes('prettier'))
      legacyConfig.push(file)
  })

  if (legacyConfig.length)
    p.note(`${c.dim(legacyConfig.join(', '))}`, 'You can now remove those files manually')
}
