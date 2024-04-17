import c from 'picocolors'
import pkgJson from '../../package.json'
import type { ExtraLibrariesOption, FrameworkOption, PromItem } from './types'

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

export const frameworkOptions: PromItem<FrameworkOption>[] = [
  {
    label: c.green('Vue'),
    value: 'vue',
  },
  {
    label: c.cyan('React'),
    value: 'react',
  },
  {
    label: c.red('Svelte'),
    value: 'svelte',
  },
  {
    label: c.magenta('Astro'),
    value: 'astro',
  },
  {
    label: c.cyan('Solid'),
    value: 'solid',
  },
  {
    label: c.blue('Slidev'),
    value: 'slidev',
  },
]

export const frameworks: FrameworkOption[] = frameworkOptions.map(({ value }) => (value))

export const extraOptions: PromItem<ExtraLibrariesOption>[] = [
  {
    hint: 'Use external formatters (Prettier and/or dprint) to format files that ESLint cannot handle yet (.css, .html, etc)',
    label: c.red('Formatter'),
    value: 'formatter',
  },
  {
    label: c.cyan('UnoCSS'),
    value: 'unocss',
  },
]

export const extra: ExtraLibrariesOption[] = extraOptions.map(({ value }) => (value))

export const dependenciesMap = {
  astro: [
    'eslint-plugin-astro',
    'astro-eslint-parser',
  ],
  react: [
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
  ],
  slidev: [
    'prettier-plugin-slidev',
  ],
  solid: [
    'eslint-plugin-solid',
  ],
  svelte: [
    'eslint-plugin-svelte',
    'svelte-eslint-parser',
  ],
  vue: [],
} as const
