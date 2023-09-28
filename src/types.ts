import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import type { ParserOptions } from '@typescript-eslint/parser'

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string
}

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsStylistic {
  stylistic?: boolean
}

export interface OptionsOverrides {
  overrides?: FlatESLintConfigItem['rules']
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsConfig {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypeScriptWithTypes

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean

  /**
   * Enable Markdown support.
   *
   * @default true
   */
  markdown?: boolean

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean

  /**
   * Provide overrides for rules for each integration.
   */
  overrides?: {
    javascript?: FlatESLintConfigItem['rules']
    typescript?: FlatESLintConfigItem['rules']
    test?: FlatESLintConfigItem['rules']
    vue?: FlatESLintConfigItem['rules']
    jsonc?: FlatESLintConfigItem['rules']
    markdown?: FlatESLintConfigItem['rules']
    yaml?: FlatESLintConfigItem['rules']
  }
}
