import type { ExtraLibrariesOption, FrameworkOption, PromItem } from './types'

import c from 'ansis'

export const vscodeSettingsString = `
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
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
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
    "json5",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
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
  formatter: [
    'eslint-plugin-format',
  ],
  formatterAstro: [
    'prettier-plugin-astro',
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
  unocss: [
    '@unocss/eslint-plugin',
  ],
  vue: [],
} as const
