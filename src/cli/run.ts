/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import prompts from 'prompts'
import c from 'picocolors'

import { CHECK, WARN, extra, extraItems, templates, templatesItems } from './constants'
import { isGitClean } from './utils'
import type { Extra, PromtResult } from './types'
import { Template } from './types'
import { updatePackageJson } from './stages/update-package-json'
import { updateEslintFiles } from './stages/update-eslint-files'
import { updateVscodeSettings } from './stages/update-vscode-settings'

export interface RuleOptions {
  /**
   * Skip prompts and use default values
   */
  yes?: boolean
  /**
   * Use the framework template for optimal customization: vue / react / svelte / astro
   */
  template?: string
  /**
   * Use the extra utils: formatter / perfectionist / unocss
   */
  extra?: string[]
}

export async function run(options: RuleOptions = {}) {
  const argSkipPromt = !!process.env.SKIP_PROMPT || options.yes
  const argTemplate = options.template?.trim()
  const argExtra = options.extra?.map(m => m.trim())

  if (fs.existsSync(path.join(process.cwd(), 'eslint.config.js'))) {
    console.log(c.yellow(`${WARN} eslint.config.js already exists, migration wizard exited.`))
    return process.exit(1)
  }

  // Set default value for promtResult if `argSkipPromt` is enabled
  let result: PromtResult = {
    extra: argExtra ?? [],
    template: argTemplate ?? Template.Vanilla,
    uncommittedConfirmed: false,
    updateVscodeSettings: true,
  }

  if (!argSkipPromt) {
    try {
      result = await prompts([
        {
          initial: true,
          message: 'There are uncommitted changes in the current repository, are you sure to continue?',
          name: 'uncommittedConfirmed',
          type: !argSkipPromt && !isGitClean() ? 'confirm' : null,
        },
        {
          choices: templatesItems.map(({ color, description, title, value }) => ({
            description,
            title: color(title),
            value,
          })),
          initial: 0,
          message: typeof argTemplate === 'string' && !templates.includes(<Template>argTemplate)
            ? c.reset(`"${argTemplate}" isn't a valid template. Please choose from below: `)
            : c.reset('Select a framework:'),
          name: 'template',
          type: argTemplate && templates.includes(<Template>argTemplate) ? null : 'select',
        },
        {
          choices: extraItems.map(({ color, description, title, value }) => ({
            description,
            title: color(title),
            value,
          })),
          initial: 0,
          instructions: false,
          message: typeof argExtra === 'object' && argExtra.filter(element => !extra.includes(<Extra>element)).length
            ? c.reset(`"${argExtra}" isn't a valid extra util. Please choose from below: `)
            : c.reset('Select a extra utils:'),
          name: 'extra',
          type: argExtra && !argExtra.filter(element => !extra.includes(<Extra>element)).length ? null : 'multiselect',
        },
        {
          initial: true,
          message: 'Update .vscode/settings.json for better VS Code experience?',
          name: 'updateVscodeSettings',
          type: 'confirm',
        },
      ], {
        onCancel: () => {
          throw new Error(`Cancelled`)
        },
      })
    }
    catch (cancelled: any) {
      console.log(cancelled.message)
      return
    }

    if (!result.uncommittedConfirmed)
      return process.exit(1)

    // Reset value from args is they overite by promt
    result = {
      extra: result.extra ?? argExtra ?? [],
      template: result.template ?? argTemplate ?? Template.Vanilla,
      uncommittedConfirmed: result.uncommittedConfirmed ?? false,
      updateVscodeSettings: result.updateVscodeSettings ?? true,
    }
  }

  await updatePackageJson(result)
  await updateEslintFiles(result)
  await updateVscodeSettings(result)

  console.log(c.green(`${CHECK} migration completed`))
  console.log(`Now you can update the dependencies and run ${c.blue('eslint . --fix')}\n`)
}
