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
  unicorn,
  vue,
  yml,
} from './configs'
import { hasTypeScript, hasVue } from './env'

/**
 * The fundamental preset
 */
export const presetJavaScript = [
  ...ignores,
  ...javascript,
  ...comments,
  ...node,
  ...jsdoc,
  ...imports,
  ...unicorn,
  ...javascriptStylistic,
]

/**
 * Preset for TypeScript
 */
export const presetTypeScript = [
  ...typescript,
  ...typescriptStylistic,
]

/**
 * Preset for Markdown, JSONC, YAML
 */
export const presetLangsExtensions = [
  ...markdown,
  ...yml,
  ...jsonc,
  ...sortPackageJson,
  ...sortTsconfig,
]

/**
 * The full preset
 *
 * Automatically detects TypeScript and Vue rules based on the dependencies
 */
export const presetAuto = [
  ...presetJavaScript,

  // ts
  ...hasTypeScript ? presetTypeScript : [],

  ...test,

  // vue
  ...hasVue ? vue : [],

  // language extensions
  ...presetLangsExtensions,
]

/**
 * Include rules for all supported integrations
 */
export const presetAll = [
  ...presetJavaScript,
  ...presetTypeScript,
  ...test,
  ...vue,
  ...presetLangsExtensions,
]
