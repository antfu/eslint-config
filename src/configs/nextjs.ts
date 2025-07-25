import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_SRC } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

function normalizeRules(rules: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) =>
      [key, typeof value === 'string' ? [value] : value],
    ),
  )
}

export async function nextjs(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides = {},
  } = options

  await ensurePackages([
    '@next/eslint-plugin-next',
  ])

  const pluginNextJS = await interopDefault(import('@next/eslint-plugin-next'))

  return [
    {
      name: 'antfu/nextjs/setup',
      plugins: {
        next: pluginNextJS,
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'antfu/nextjs/rules',
      rules: {
        ...normalizeRules(pluginNextJS.configs.recommended.rules),
        ...normalizeRules(pluginNextJS.configs['core-web-vitals'].rules),

        // overrides
        ...overrides,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ]
}
