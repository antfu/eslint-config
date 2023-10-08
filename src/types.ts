import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ParserOptions } from '@typescript-eslint/parser'
import type {
  EslintCommentsRules,
  EslintRules,
  FlatESLintConfigItem,
  ImportRules,
  JsoncRules,
  MergeIntersection,
  NRules,
  Prefix,
  RenamePrefix,
  RuleConfig,
  TypeScriptRules,
  UnicornRules,
  VitestRules,
  VueRules,
  YmlRules,
} from '@antfu/eslint-define-config'
import type { StylisticRules } from './generated/stylistic'

export type Rules = MergeIntersection<
  RenamePrefix<TypeScriptRules, '@typescript-eslint/', 'ts/'> &
  RenamePrefix<VitestRules, 'vitest/', 'test/'> &
  RenamePrefix<YmlRules, 'yml/', 'yaml/'> &
  RenamePrefix<NRules, 'n/', 'node/'> &
  Prefix<StylisticRules, 'style/'> &
  ImportRules &
  EslintRules &
  JsoncRules &
  VueRules &
  UnicornRules &
  EslintCommentsRules &
  {
    'test/no-only-tests': RuleConfig<[]>
  }
>

export type ConfigItem = Omit<FlatESLintConfigItem<Rules, false>, 'plugins'> & {
  /**
   * Custom name of each config item
   */
  name?: string

  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>
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
  overrides?: ConfigItem['rules']
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
    javascript?: ConfigItem['rules']
    typescript?: ConfigItem['rules']
    test?: ConfigItem['rules']
    vue?: ConfigItem['rules']
    jsonc?: ConfigItem['rules']
    markdown?: ConfigItem['rules']
    yaml?: ConfigItem['rules']
  }
}
