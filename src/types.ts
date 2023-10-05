import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { ESLint, Linter } from 'eslint'
import type { LanguageOptions, LinterOptions } from 'eslint-define-config'

/**
 * Flat ESLint Configuration.
 *
 * @see [Configuration Files (New)](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new)
 */
export interface FlatESLintConfigItem {
  /**
   * The name of the configuration object.
   */
  name?: string

  /**
   * An array of glob patterns indicating the files that the configuration object should apply to. If not specified, the configuration object applies to all files.
   *
   * @see [Ignore Patterns](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#excluding-files-with-ignores)
   */
  files?: string[]

  /**
   * An array of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by files.
   *
   * @see [Ignore Patterns](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#excluding-files-with-ignores)
   */
  ignores?: string[]

  /**
   * An object containing settings related to how JavaScript is configured for linting.
   *
   * @see [Configuring language options](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#configuring-language-options)
   */
  languageOptions?: LanguageOptions

  /**
   * An object containing settings related to the linting process.
   */
  linterOptions?: LinterOptions

  /**
   * Either an object containing `preprocess()` and `postprocess()` methods or a string indicating the name of a processor inside of a plugin (i.e., `"pluginName/processorName"`).
   *
   * @see [Using processors](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-processors)
   */
  processor?: string | Linter.Processor

  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, ESLint.Plugin>

  /**
   * An object containing the configured rules. When `files` or `ignores` are specified, these rule configurations are only available to the matching files.
   *
   * @see [Configuring rules](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#configuring-rules)
   */
  rules?: Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>

  /**
   * An object containing name-value pairs of information that should be available to all rules.
   *
   * @see [Configuring shared settings](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#configuring-shared-settings)
   */
  settings?: Record<string, any>
}

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
  stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig {
  indent?: number | 'tab'
  quotes?: 'single' | 'double'
}

export interface OptionsOverrides {
  overrides?: FlatESLintConfigItem['rules']
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsConfig extends OptionsComponentExts {
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
  stylistic?: boolean | StylisticConfig

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
