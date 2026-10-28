import type { Linter } from 'eslint'
import type { OxlintConfig, OxlintGlobals } from 'oxlint'
import type { ConfigInput, FlatConfigItem } from 'oxlint-flat-config'

import { ensurePackages } from './utils'

interface JsPlugin {
  name: string
  specifier: string
}

// Prefixes used by this config -> Oxlint built-in plugins that port the same rules, in lookup order.
const nativePlugins = {
  '': ['eslint'],
  'import': ['import'],
  'jsdoc': ['jsdoc'],
  'jsx-a11y': ['jsx-a11y'],
  'next': ['nextjs'],
  'node': ['node'],
  'test': ['vitest'],
  'ts': ['typescript', 'eslint'],
  'unicorn': ['unicorn'],
  'vue': ['vue'],
} satisfies Record<string, NonNullable<OxlintConfig['plugins']>>

// Prefixes used by this config -> packages loaded as Oxlint JS plugins.
// Oxlint reserves the names of its built-in plugins, so those get a `-js` suffix.
const jsPluginPackages: Record<string, string> = {
  '': new URL('./oxlint-eslint-plugin.mjs', import.meta.url).href,
  'angular': '@angular-eslint/eslint-plugin',
  'antfu': 'eslint-plugin-antfu',
  'command': 'eslint-plugin-command',
  'e18e': '@e18e/eslint-plugin',
  'erasable-syntax-only': 'eslint-plugin-erasable-syntax-only',
  'eslint-comments': '@eslint-community/eslint-plugin-eslint-comments',
  'import': 'eslint-plugin-import-lite',
  'jsdoc': 'eslint-plugin-jsdoc',
  'jsx-a11y': 'eslint-plugin-jsx-a11y',
  'next': '@next/eslint-plugin-next',
  'node': 'eslint-plugin-n',
  'perfectionist': 'eslint-plugin-perfectionist',
  'react': '@eslint-react/eslint-plugin',
  'react-refresh': 'eslint-plugin-react-refresh',
  'regexp': 'eslint-plugin-regexp',
  'slop': 'eslint-plugin-slop',
  'solid': 'eslint-plugin-solid',
  'sonarjs': 'eslint-plugin-sonarjs',
  'style': '@stylistic/eslint-plugin',
  'test': '@vitest/eslint-plugin',
  'ts': '@typescript-eslint/eslint-plugin',
  'unicorn': 'eslint-plugin-unicorn',
  'unocss': '@unocss/eslint-plugin',
  'unused-imports': 'eslint-plugin-unused-imports',
}

const reservedNames = new Set([
  '',
  'import',
  'jsdoc',
  'jsx-a11y',
  'node',
  'react',
  'unicorn',
])

// Native ports that reject the options this config passes to the ESLint rule.
const optionMismatches = new Set([
  'import/consistent-type-specifier-style',
  'jsx-a11y/control-has-associated-label',
])

function splitRuleId(id: string): [prefix: string, name: string] {
  if (id.startsWith('node/prefer-global/')) {
    return [
      'node',
      id.slice('node/'.length),
    ]
  }
  const index = id.lastIndexOf('/')
  return index === -1
    ? ['', id]
    : [
        id.slice(0, index),
        id.slice(index + 1),
      ]
}

function toOxlintRule(id: string, nativeRules: Set<string>): { id: string, plugin?: JsPlugin } | undefined {
  const [prefix, name] = splitRuleId(id)
  if (!optionMismatches.has(id)) {
    const scope = nativePlugins[prefix as keyof typeof nativePlugins]?.find(scope => nativeRules.has(`${scope}/${name}`))
    if (scope)
      return { id: `${scope}/${name}` }
  }
  // Merged into `test` by this config, but shipped as its own package.
  if (id === 'test/no-only-tests') {
    return {
      id: 'no-only-tests/no-only-tests',
      plugin: {
        name: 'no-only-tests',
        specifier: import.meta.resolve('eslint-plugin-no-only-tests'),
      },
    }
  }
  const pkg = jsPluginPackages[prefix]
  if (!pkg)
    return
  const pluginName = reservedNames.has(prefix)
    ? `${prefix || 'eslint'}-js`
    : prefix
  return {
    id: `${pluginName}/${name}`,
    plugin: {
      name: pluginName,
      specifier: import.meta.resolve(pkg),
    },
  }
}

function toGlobals(globals: Linter.Globals): OxlintGlobals {
  return Object.fromEntries(Object.entries(globals).map(([name, value]) => [
    name,
    value === true || value === 'writable' || value === 'writeable'
      ? 'writable'
      : value === 'off'
        ? 'off'
        : 'readonly',
  ]))
}

function toOxlintRules(nativeRules: Set<string>, rules: Linter.Config['rules'] = {}): Pick<FlatConfigItem, 'jsPlugins' | 'rules'> {
  const jsPlugins = new Map<string, JsPlugin>()
  const converted: Record<string, Linter.RuleEntry> = {}
  for (const [id, entry] of Object.entries(rules)) {
    const rule = entry && toOxlintRule(id, nativeRules)
    if (!rule)
      continue
    if (rule.plugin)
      jsPlugins.set(rule.plugin.name, rule.plugin)
    converted[rule.id] = entry
  }
  return {
    ...jsPlugins.size && {
      jsPlugins: [
        ...jsPlugins.values(),
      ],
    },
    ...Object.keys(converted).length && { rules: converted },
  }
}

function toOxlintItem(item: Linter.Config, nativeRules: Set<string>): FlatConfigItem | undefined {
  // Virtual files of processors, such as code blocks in Markdown, never reach Oxlint.
  if (item.files?.flat().every(file => typeof file === 'string' && /\.(?:md|astro)\//.test(file)))
    return
  if (item.ignores && Object.keys(item).every(key => key === 'name' || key === 'ignores'))
    return { ignores: item.ignores, name: item.name }

  const { jsPlugins, rules } = toOxlintRules(nativeRules, item.rules)
  // `languageOptions` is untyped in `Linter.Config`, this is the shape ESLint documents for `globals`.
  const globals = item.languageOptions?.globals as Linter.Globals | undefined
  if (!rules && !globals && !item.settings)
    return

  const fields = {
    name: item.name,
    ...jsPlugins && { jsPlugins },
    ...rules && { rules },
    ...globals && {
      globals: toGlobals(globals),
    },
  }
  // Oxlint only reads `settings` in the root config.
  if (!item.files && !item.ignores) {
    return {
      ...fields,
      ...item.settings && { settings: item.settings },
    }
  }
  return {
    ...fields,
    ...item.files && { files: item.files },
    ...item.ignores && { ignores: item.ignores },
  }
}

/**
 * Builds an Oxlint config from the ESLint flat config of `antfu()`, using `oxlint-flat-config`.
 *
 * Rules use Oxlint's native ports when available, and run the original ESLint plugins as JS plugins otherwise.
 * Rules that need a custom parser (Vue templates, Svelte, Astro, Markdown, JSON, YAML, TOML, formatters) are dropped.
 * `configs` are appended as Oxlint flat config objects.
 *
 * @experimental
 */
export async function toOxlint(
  eslintConfigs: PromiseLike<Linter.Config[]> | Linter.Config[],
  ...configs: ConfigInput[]
): Promise<OxlintConfig> {
  await ensurePackages(['oxlint', 'oxlint-flat-config'])
  const { all, category, defineConfig } = await import('oxlint-flat-config')
  const nativeRules = new Set([
    ...Object.keys(all.rules ?? {}),
    ...Object.keys(category({
      nursery: 'error',
      plugins: [
        ...new Set(Object.values(nativePlugins).flat()),
      ],
    }).rules ?? {}),
  ])
  return defineConfig((await eslintConfigs).flatMap(item => toOxlintItem(item, nativeRules) ?? []), ...configs)
}
