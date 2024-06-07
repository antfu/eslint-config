import path from 'node:path'
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import process from 'node:process'
import c from 'picocolors'
import * as p from '@clack/prompts'

import { vscodeSettingsString } from '../constants'
import type { PromptResult } from '../types'

export async function updateVscodeSettings(result: PromptResult) {
  const cwd = process.cwd()

  if (!result.updateVscodeSettings)
    return

  const dotVscodePath: string = path.join(cwd, '.vscode')
  const settingsPath: string = path.join(dotVscodePath, 'settings.json')

  if (!fs.existsSync(dotVscodePath))
    await fsp.mkdir(dotVscodePath, { recursive: true })

  if (fs.existsSync(settingsPath)) {
    let settingsContent = await fsp.readFile(settingsPath, 'utf8')

    settingsContent = settingsContent.trim().replace(/\s*\}$/, '')
    settingsContent += settingsContent.endsWith(',') || settingsContent.endsWith('{') ? '' : ','
    settingsContent += `${vscodeSettingsString}}\n`

    await fsp.writeFile(settingsPath, settingsContent, 'utf-8')
    p.log.success(c.green(`Updated .vscode/settings.json`))
  }
  else {
    await fsp.writeFile(settingsPath, `{${vscodeSettingsString}}\n`, 'utf-8')
    p.log.success(c.green(`Created .vscode/settings.json`))
  }
}
