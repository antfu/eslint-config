import type { FlatConfigItem, OptionsFiles, OptionsOverrides, OptionsStylistic } from '../types'
import { GLOB_ASTRO } from '../globs'
import { interopDefault } from '../utils'

export async function astro(
  options: OptionsOverrides & OptionsStylistic & OptionsFiles = {},
): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_ASTRO],
    overrides = {},
  } = options

  const [
    pluginAstro,
    parserAstro,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-astro')),
    interopDefault(import('astro-eslint-parser')),
  ] as const)

  return [
    {
      name: 'antfu:astro:setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: await interopDefault(import('@typescript-eslint/parser')) as any,
        },
      },
      name: 'antfu:astro:rules',
      rules: {
        'astro/no-set-html-directive': 'off',
        'astro/semi': 'off',

        ...overrides,
      },
    },
  ]
}
