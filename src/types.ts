import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { ConfigNames, RuleOptions } from './typegen'
import type { VendoredPrettierOptions } from './vender/prettier-types'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions

export type { ConfigNames }

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions

  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3

  /**
   * Vue accessibility plugin. Help check a11y issue in `.vue` files upon enabled
   *
   * @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
   * @default false
   */
  a11y?: boolean
}

export interface OptionsJSXA11y extends OptionsOverrides {
  // Add future a11y-specific options here
}

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * Can be a boolean or an object for custom options and overrides.
   * @default false
   */
  a11y?: boolean | OptionsJSXA11y
}

export type OptionsTypescript
  = (OptionsTypeScriptWithTypes & OptionsOverrides & OptionsErasable)
    | (OptionsTypeScriptParserOptions & OptionsOverrides & OptionsErasable)

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: 'prettier' | boolean

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: 'prettier' | boolean

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: 'prettier' | boolean

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: 'prettier' | boolean

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: 'prettier' | 'dprint' | boolean

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: 'prettier' | boolean

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean

  /**
   * Install the prettier plugin for handle Slidev markdown
   *
   * Only works when `markdown` is enabled with `prettier`.
   */
  slidev?: boolean | {
    files?: string[]
  }

  /**
   * Enable formatting support for Astro.
   *
   * Currently only support Prettier.
   */
  astro?: 'prettier' | boolean
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

export interface OptionsUnicorn extends OptionsOverrides {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
   *
   * @default false
   */
  allRecommended?: boolean
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib'
}

export interface OptionsErasable {
  /**
   * Enable erasable syntax only rules.
   *
   * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
   * @default false
   */
  erasableOnly?: boolean
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn'
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
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
   * Disable some opinionated rules to Anthony's preference.
   *
   * Including:
   * - `antfu/top-level-function`
   * - `antfu/if-newline`
   *
   * @default false
   */
  lessOpinionated?: boolean

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Enable JSX related rules.
   *
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn

  /**
   * Options for eslint-plugin-import-lite.
   *
   * @default true
   */
  imports?: boolean | OptionsOverrides

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | OptionsOverrides

  /**
   * Enable ASTRO support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default false
   */
  astro?: boolean | OptionsOverrides

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides)

  /**
   * Enable react rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-hooks`
   * - `eslint-plugin-react-refresh`
   *
   * @default false
   */
  react?: boolean | OptionsOverrides

  /**
   * Enable nextjs rules.
   *
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * @default false
   */
  nextjs?: boolean | OptionsOverrides

  /**
   * Enable solid rules.
   *
   * Requires installing:
   * - `eslint-plugin-solid`
   *
   * @default false
   */
  solid?: boolean | OptionsOverrides

  /**
   * Enable svelte rules.
   *
   * Requires installing:
   * - `eslint-plugin-svelte`
   *
   * @default false
   */
  svelte?: boolean | OptionsOverrides

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * Currently it's disabled by default, as it's still experimental.
   * In the future it will be smartly enabled based on the project usage.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @experimental
   * @default false
   */
  pnpm?: boolean

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    stylistic?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
    test?: TypedFlatConfigItem['rules']
    vue?: TypedFlatConfigItem['rules']
    jsonc?: TypedFlatConfigItem['rules']
    markdown?: TypedFlatConfigItem['rules']
    yaml?: TypedFlatConfigItem['rules']
    toml?: TypedFlatConfigItem['rules']
    react?: TypedFlatConfigItem['rules']
    svelte?: TypedFlatConfigItem['rules']
  }
}
