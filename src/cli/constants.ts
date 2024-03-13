import c from 'picocolors'
import pkgJson from '../../package.json'
import type { PromItem } from './types'
import { Extra, Template } from './types'

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

export const templatesOptions: PromItem<Template>[] = [
  {
    label: c.green('Vanilla / Vue'),
    value: Template.Vanilla,
  },
  {
    label: c.cyan('React'),
    value: Template.React,
  },
  {
    label: c.red('Svelte'),
    value: Template.Svelte,
  },
  {
    label: c.magenta('Astro'),
    value: Template.Astro,
  },
]

export const templates: Template[] = templatesOptions.map(({ value }) => (value))

export const extraOptions: PromItem<Extra>[] = [
  {
    hint: 'Use external formatters to format files that ESLint cannot handle yet (.css, .html, etc)',
    label: c.red('Formatter'),
    value: Extra.Formatter,
  },
  {
    hint: 'Allows you to sorted object keys, imports, etc, with auto-fix',
    label: c.magenta('Perfectionist'),
    value: Extra.Perfectionist,
  },
  {
    label: c.cyan('UnoCSS'),
    value: Extra.UnoCSS,
  },
]

export const extra: Extra[] = extraOptions.map(({ value }) => (value))
