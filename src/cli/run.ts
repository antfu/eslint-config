/* eslint-disable perfectionist/sort-objects */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import c from 'picocolors'
import * as p from '@clack/prompts'

import { extra, extraOptions, templates, templatesOptions } from './constants'
import { isGitClean } from './utils'
import type { Extra, PromItem, PromtResult } from './types'
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
  const argTemplate = <Template>options.template?.trim()
  const argExtra = <Extra[]>options.extra?.map(m => m.trim())

  if (fs.existsSync(path.join(process.cwd(), 'eslint.config.js'))) {
    p.log.warn(c.yellow(`eslint.config.js already exists, migration wizard exited.`))
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
    result = await p.group({
      uncommittedConfirmed: () => {
        if (argSkipPromt || isGitClean())
          return

        return p.confirm({
          initialValue: false,
          message: 'There are uncommitted changes in the current repository, are you sure to continue?',
        })
      },
      template: ({ results }) => {
        const isArgTemplateValid = typeof argTemplate === 'string' && !!templates.includes(<Template>argTemplate)

        if (!results.uncommittedConfirmed || isArgTemplateValid)
          return

        const message = !isArgTemplateValid && argTemplate
          ? `"${argTemplate}" isn't a valid template. Please choose from below: `
          : 'Select a framework:'

        return p.select<PromItem<Template>[], Template>({
          maxItems: templatesOptions.length,
          message: c.reset(message),
          options: templatesOptions,
        })
      },
      extra: ({ results }) => {
        const isArgExtraValid = argExtra?.length && !argExtra.filter(element => !extra.includes(<Extra>element)).length

        if (!results.uncommittedConfirmed || isArgExtraValid)
          return

        const message = !isArgExtraValid && argExtra
          ? `"${argExtra}" isn't a valid extra util. Please choose from below: `
          : 'Select a extra utils:'

        return p.multiselect<PromItem<Extra>[], Extra>({
          message: c.reset(message),
          options: extraOptions,
          required: false,
        })
      },

      updateVscodeSettings: ({ results }) => {
        if (!results.uncommittedConfirmed)
          return

        return p.confirm({
          initialValue: true,
          message: 'Update .vscode/settings.json for better VS Code experience?',
        })
      },
    }, {
      onCancel: () => {
        p.cancel('Operation cancelled.')
        process.exit(0)
      },
    }) as PromtResult

    if (!result.uncommittedConfirmed)
      return process.exit(1)
  }

  await updatePackageJson(result)
  await updateEslintFiles(result)
  await updateVscodeSettings(result)

  p.log.success(c.green(`Migration completed`))
  p.outro(`Now you can update the dependencies and run ${c.blue('eslint . --fix')}\n`)
}
