import type { ExtraLibrariesOption, PromptResult } from '../types'
import fsp from 'node:fs/promises'
import path from 'node:path'

import process from 'node:process'
import * as p from '@clack/prompts'

import c from 'ansis'

import { dependenciesMap, pkgJson } from '../constants'

export async function updatePackageJson(result: PromptResult): Promise<void> {
  const cwd = process.cwd()

  const pathPackageJSON = path.join(cwd, 'package.json')

  p.log.step(c.cyan`Bumping @antfu/eslint-config to v${pkgJson.version}`)

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  pkg.devDependencies ??= {}
  pkg.devDependencies['@antfu/eslint-config'] = `^${pkgJson.version}`
  pkg.devDependencies.eslint ??= pkgJson
    .devDependencies
    .eslint
    .replace('npm:eslint-ts-patch@', '')
    .replace(/-\d+$/, '')

  const addedPackages: string[] = []

  if (result.extra.length) {
    result.extra.forEach((item: ExtraLibrariesOption) => {
      switch (item) {
        case 'formatter':
          (<const>[
            'eslint-plugin-format',
            result.frameworks.includes('astro') ? 'prettier-plugin-astro' : null,
          ]).forEach((f) => {
            if (!f)
              return
            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          })
          break
        case 'unocss':
          (<const>[
            '@unocss/eslint-plugin',
          ]).forEach((f) => {
            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          })
          break
      }
    })
  }

  for (const framework of result.frameworks) {
    const deps = dependenciesMap[framework]
    if (deps) {
      deps.forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
        addedPackages.push(f)
      })
    }
  }

  if (addedPackages.length)
    p.note(c.dim(addedPackages.join(', ')), 'Added packages')

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2))
  p.log.success(c.green`Changes wrote to package.json`)
}
