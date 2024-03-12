/* eslint-disable no-console */
import path from 'node:path'
import fsp from 'node:fs/promises'
import process from 'node:process'
import c from 'picocolors'

import { ARROW, CHECK, pkgJson } from '../constants'
import { Extra, type PromtResult, Template } from '../types'

export async function updatePackageJson(result: PromtResult) {
  const cwd = process.cwd()

  const pathPackageJSON = path.join(cwd, 'package.json')

  console.log(c.cyan(`${ARROW} bumping @antfu/eslint-config to v${pkgJson.version}`))
  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  pkg.devDependencies ??= {}
  pkg.devDependencies['@antfu/eslint-config'] = `^${pkgJson.version}`
  pkg.devDependencies.eslint ??= pkgJson.devDependencies.eslint

  result.extra.forEach((item: Extra) => {
    switch (item) {
      case Extra.Formatter:
        (<const>[
          'eslint-plugin-format',
        ]).forEach((f) => {
          pkg.devDependencies[f] = pkgJson.devDependencies[f]
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
        })
        break
    }
  })

  switch (result.template) {
    case Template.React:
      (<const>[
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        'eslint-plugin-react-refresh',
      ]).forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
      })
      break
    case Template.Astro:
      (<const>[
        'eslint-plugin-astro',
        'astro-eslint-parser',
        result.extra.includes(Extra.Formatter) ? 'prettier-plugin-astro' : null,
      ]).forEach((f) => {
        !!f && (pkg.devDependencies[f] = pkgJson.devDependencies[f])
      })
      break
    case Template.Svelte:
      (<const>[
        'eslint-plugin-svelte',
        'svelte-eslint-parser',
      ]).forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
      })
      break
  }

  console.log('nice')

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2))
  console.log(c.green(`${CHECK} changes wrote to package.json`))
}
