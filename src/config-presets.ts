import type { OptionsConfig } from './types'

// @keep-sorted
export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  astro: true,
  formatters: true,
  gitignore: true,
  imports: true,
  jsdoc: true,
  jsonc: true,
  jsx: {
    a11y: true,
  },
  markdown: true,
  nextjs: true,
  node: true,
  pnpm: true,
  react: {
    reactCompiler: true,
  },
  regexp: true,
  solid: true,
  stylistic: {
    experimental: true,
  },
  svelte: true,
  test: true,
  toml: true,
  typescript: {
    erasableOnly: true,
    tsconfigPath: 'tsconfig.json',
  },
  unicorn: true,
  unocss: true,
  vue: {
    a11y: true,
  },
  yaml: true,
}

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  astro: false,
  formatters: false,
  gitignore: false,
  imports: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  nextjs: false,
  node: false,
  pnpm: false,
  react: false,
  regexp: false,
  solid: false,
  stylistic: false,
  svelte: false,
  test: false,
  toml: false,
  typescript: false,
  unicorn: false,
  unocss: false,
  vue: false,
  yaml: false,
}
