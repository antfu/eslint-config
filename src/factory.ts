import process from 'node:process'
import fs from 'node:fs'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import { isPackageExists } from 'local-pkg'
import gitignore from 'eslint-config-flat-gitignore'
import {
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  test,
  typescript,
  typescriptWithTypes,
  unicorn,
  vue,
  yaml,
} from './configs'
import type { OptionsConfig } from './types'
import { combine } from './utils'

const flatConfigProps: (keyof FlatESLintConfigItem)[] = [
  'files',
  'ignores',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
]

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
]

/**
 * Construct an array of ESLint flat config items.
 */
export function antfu(options: OptionsConfig & FlatESLintConfigItem = {}, ...userConfigs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]) {
  const {
    isInEditor = !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE) && !process.env.CI),
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    typescript: enableTypeScript = isPackageExists('typescript'),
    stylistic: enableStylistic = true,
    gitignore: enableGitignore = true,
    overrides = {},
  } = options

  const configs: FlatESLintConfigItem[][] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push([gitignore(enableGitignore)])
    }
    else {
      if (fs.existsSync('.gitignore'))
        configs.push([gitignore()])
    }
  }

  // Base configs
  configs.push(
    ignores(),
    javascript({
      isInEditor,
      overrides: overrides.javascript,
    }),
    comments(),
    node(),
    jsdoc(),
    imports(),
    unicorn(),
  )

  // In the future we may support more component extensions like Svelte or so
  const componentExts: string[] = []

  if (enableVue)
    componentExts.push('vue')

  if (enableTypeScript) {
    configs.push(typescript({
      componentExts,
      overrides: overrides.typescript,
    }))

    if (typeof enableTypeScript !== 'boolean') {
      configs.push(typescriptWithTypes({
        ...enableTypeScript,
        componentExts,
        overrides: overrides.typescriptWithTypes,
      }))
    }
  }

  if (enableStylistic)
    configs.push(stylistic())

  if (options.test ?? true) {
    configs.push(test({
      isInEditor,
      overrides: overrides.test,
    }))
  }

  if (enableVue) {
    configs.push(vue({
      overrides: overrides.vue,
      typescript: !!enableTypeScript,
    }))
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc(),
      sortPackageJson(),
      sortTsconfig(),
    )
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      overrides: overrides.yaml,
    }))
  }

  if (options.markdown ?? true) {
    configs.push(markdown({
      componentExts,
      overrides: overrides.markdown,
    }))
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      acc[key] = options[key]
    return acc
  }, {} as FlatESLintConfigItem)
  if (Object.keys(fusedConfig).length)
    configs.push([fusedConfig])

  const merged = combine(
    ...configs,
    ...userConfigs,
  )

  // recordRulesStateConfigs(merged)
  // warnUnnecessaryOffRules()

  return merged
}
