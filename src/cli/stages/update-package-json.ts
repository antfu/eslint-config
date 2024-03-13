import path from 'node:path'
import fsp from 'node:fs/promises'
import process from 'node:process'
import c from 'picocolors'
import * as p from '@clack/prompts'

import { pkgJson } from '../constants'
import { Extra, type PromtResult, Template } from '../types'

export async function updatePackageJson(result: PromtResult) {
  const cwd = process.cwd()

  const pathPackageJSON = path.join(cwd, 'package.json')

  p.log.step(c.cyan(`Bumping @antfu/eslint-config to v${pkgJson.version}`))

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  pkg.devDependencies ??= {}
  pkg.devDependencies['@antfu/eslint-config'] = `^${pkgJson.version}`
  pkg.devDependencies.eslint ??= pkgJson.devDependencies.eslint

  const addedPackages: string[] = []

  if (result.extra.length) {
    result.extra.forEach((item: Extra) => {
      switch (item) {
        case Extra.Formatter:
          (<const>[
            'eslint-plugin-format',
            result.template.includes(Template.Astro) ? 'prettier-plugin-astro' : null,
          ]).forEach((f) => {
            if (!f)
              return

            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          })
          break
        case Extra.Perfectionist:
          // Already in dependencies
          break
        case Extra.UnoCSS:
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

  switch (result.template) {
    case Template.React:
      (<const>[
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        'eslint-plugin-react-refresh',
      ]).forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
        addedPackages.push(f)
      })
      break
    case Template.Astro:
      (<const>[
        'eslint-plugin-astro',
        'astro-eslint-parser',
      ]).forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
        addedPackages.push(f)
      })
      break
    case Template.Svelte:
      (<const>[
        'eslint-plugin-svelte',
        'svelte-eslint-parser',
      ]).forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
        addedPackages.push(f)
      })
      break
  }

  if (addedPackages.length)
    p.note(`${c.dim(addedPackages.join(', '))}`, 'Added packages')

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2))
  p.log.success(c.green(`Changes wrote to package.json`))
}
