import path from 'node:path'
import fsp from 'node:fs/promises'
import process from 'node:process'
import c from 'picocolors'
import * as p from '@clack/prompts'

import { dependenciesMap, pkgJson } from '../constants'
import type { ExtraLibrariesOption, PromptResult } from '../types'

export async function updatePackageJson(result: PromptResult) {
  const cwd = process.cwd()

  const pathPackageJSON = path.join(cwd, 'package.json')

  p.log.step(c.cyan(`Bumping @antfu/eslint-config to v${pkgJson.version}`))

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  pkg.devDependencies ??= {}
  pkg.devDependencies['@antfu/eslint-config'] = `^${pkgJson.version}`
  pkg.devDependencies.eslint ??= pkgJson.devDependencies.eslint
    .replace('npm:eslint-ts-patch@', '')
    .replace(/-\d+$/, '')

  const addedPackages: string[] = []

  if (result.extra.length > 0) {
    result.extra.forEach((item: ExtraLibrariesOption) => {
      switch (item) {
        case 'formatter': {
          for (const f of (<const>[
            'eslint-plugin-format',
            result.frameworks.includes('astro') ? 'prettier-plugin-astro' : null,
          ])) {
            if (!f)
              continue
            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          }
          break
        }
        case 'unocss': {
          for (const f of (<const>[
            '@unocss/eslint-plugin',
          ])) {
            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          }
          break
        }
      }
    })
  }

  for (const framework of result.frameworks) {
    const deps = dependenciesMap[framework]
    if (deps) {
      for (const f of deps) {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
        addedPackages.push(f)
      }
    }
  }

  if (addedPackages.length > 0)
    p.note(`${c.dim(addedPackages.join(', '))}`, 'Added packages')

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2))
  p.log.success(c.green(`Changes wrote to package.json`))
}
