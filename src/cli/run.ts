/* eslint-disable perfectionist/sort-objects */
import type { ExtraLibrariesOption, FrameworkOption, PromptResult } from './types'

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'

import { extra, extraOptions, frameworkOptions, frameworks } from './constants'
import { updateEslintFiles } from './stages/update-eslint-files'
import { updatePackageJson } from './stages/update-package-json'
import { updateVscodeSettings } from './stages/update-vscode-settings'

import { isGitClean } from './utils'

export interface CliRunOptions {
  /**
   * Skip prompts and use default values
   */
  yes?: boolean
  /**
   * Use the framework template for optimal customization: vue / react / svelte / astro
   */
  frameworks?: string[]
  /**
   * Use the extra utils: formatter / perfectionist / unocss
   */
  extra?: string[]
}

export async function run(options: CliRunOptions = {}): Promise<void> {
  const argSkipPrompt = !!process.env.SKIP_PROMPT || options.yes
  const argTemplate = <FrameworkOption[]>options.frameworks?.map(m => m?.trim()).filter(Boolean)
  const argExtra = <ExtraLibrariesOption[]>options.extra?.map(m => m?.trim()).filter(Boolean)

  if (fs.existsSync(path.join(process.cwd(), 'eslint.config.js'))) {
    p.log.warn(c.yellow`eslint.config.js already exists, migration wizard exited.`)
    return process.exit(1)
  }

  // Set default value for promptResult if `argSkipPrompt` is enabled
  let result: PromptResult = {
    extra: argExtra ?? [],
    frameworks: argTemplate ?? [],
    uncommittedConfirmed: false,
    updateVscodeSettings: true,
  }

  if (!argSkipPrompt) {
    result = await p.group({
      uncommittedConfirmed: () => {
        if (argSkipPrompt || isGitClean())
          return Promise.resolve(true)

        return p.confirm({
          initialValue: false,
          message: 'There are uncommitted changes in the current repository, are you sure to continue?',
        })
      },
      frameworks: ({ results }) => {
        const isArgTemplateValid = typeof argTemplate === 'string' && !!frameworks.includes(<FrameworkOption>argTemplate)

        if (!results.uncommittedConfirmed || isArgTemplateValid)
          return

        const message = !isArgTemplateValid && argTemplate
          ? `"${argTemplate}" isn't a valid template. Please choose from below: `
          : 'Select a framework:'

        return p.multiselect<FrameworkOption>({
          message: c.reset(message),
          options: frameworkOptions,
          required: false,
        })
      },
      extra: ({ results }) => {
        const isArgExtraValid = argExtra?.length && !argExtra.filter(element => !extra.includes(<ExtraLibrariesOption>element)).length

        if (!results.uncommittedConfirmed || isArgExtraValid)
          return

        const message = !isArgExtraValid && argExtra
          ? `"${argExtra}" isn't a valid extra util. Please choose from below: `
          : 'Select a extra utils:'

        return p.multiselect<ExtraLibrariesOption>({
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
    }) as PromptResult

    if (!result.uncommittedConfirmed)
      return process.exit(1)
  }

  await updatePackageJson(result)
  await updateEslintFiles(result)
  await updateVscodeSettings(result)

  p.log.success(c.green`Setup completed`)
  p.outro(`Now you can update the dependencies by run ${c.blue('pnpm install')} and run ${c.blue('eslint --fix')}\n`)
}
