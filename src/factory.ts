import type { FlatESLintConfigItem } from 'eslint-define-config'
import {
  comments,
  ignores,
  imports,
  javascript,
  javascriptStylistic,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  test,
  typescript,
  typescriptStylistic,
  typescriptWithLanguageServer,
  unicorn,
  vue,
  yml,
} from './configs'
import { hasTypeScript, hasVue } from './env'
import type { OptionsConfig } from './types'
import { combine } from '.'

/**
 * Construct an array of ESLint flat config items.
 */
export function antfu(options: OptionsConfig = {}, ...userConfigs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]) {
  const configs = [
    ignores,
    javascript,
    comments,
    node,
    jsdoc,
    imports,
    unicorn,
  ]

  const enableVue = options.vue ?? hasVue
  const enableTypeScript = options.typescript ?? hasTypeScript
  const enableStylistic = options.stylistic ?? true

  // In the future we may support more component extensions like Svelte or so
  const componentExts: string[] = []
  if (enableVue)
    componentExts.push('vue')

  if (enableStylistic)
    configs.push(javascriptStylistic)

  if (enableTypeScript) {
    configs.push(typescript({ componentExts }))

    if (typeof enableTypeScript !== 'boolean') {
      configs.push(typescriptWithLanguageServer({
        ...enableTypeScript,
        componentExts,
      }))
    }

    if (enableStylistic)
      configs.push(typescriptStylistic)
  }

  if (options.test ?? true)
    configs.push(test)

  if (enableVue)
    configs.push(vue)

  if (options.jsonc ?? true) {
    configs.push(
      jsonc,
      sortPackageJson,
      sortTsconfig,
    )
  }

  if (options.yaml ?? true)
    configs.push(yml)

  if (options.markdown ?? true) {
    configs.push(markdown({
      componentExts,
    }))
  }

  return combine(
    ...configs,
    ...userConfigs,
  )
}
