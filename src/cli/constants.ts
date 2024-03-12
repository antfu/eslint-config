import c from 'picocolors'
import pkgJson from '../../package.json'
import type { PromItem } from './types'
import { Extra, Template } from './types'

export const ARROW = c.cyan('→')
export const CHECK = c.green('✔')
export const CROSS = c.red('✘')
export const WARN = c.yellow('ℹ')

export { pkgJson }

export const vscodeSettingsString = `
  // Enable the ESlint flat config support
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "format/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "astro",
  ]
`

export const templatesItems: PromItem[] = [
  {
    color: c.green,
    title: 'Vanilla / Vue',
    value: Template.Vanilla,
  },
  {
    color: c.cyan,
    title: 'React',
    value: Template.React,
  },
  {
    color: c.red,
    title: 'Svelte',
    value: Template.Svelte,
  },
  {
    color: c.magenta,
    title: 'Astro',
    value: Template.Astro,
  },
]

export const templates: Template[] = templatesItems.map(({ value }) => (value))

export const extraItems: PromItem[] = [
  {
    color: c.red,
    description: 'Use external formatters to format files that ESLint cannot handle yet (.css, .html, etc)',
    title: 'Formatter',
    value: Extra.Formatter,
  },
  {
    color: c.magenta,
    description: 'Allows you to sorted object keys, imports, etc, with auto-fix',
    title: 'Perfectionist',
    value: Extra.Perfectionist,
  },
  {
    color: c.cyan,
    title: 'UnoCSS',
    value: Extra.UnoCSS,
  },
]

export const extra: Extra[] = extraItems.map(({ value }) => (value))
