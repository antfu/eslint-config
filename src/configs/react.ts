import { interopDefault } from 'src'
import type { FlatConfigItem, OptionsHasTypeScript, OptionsOverrides, OptionsStylistic } from '../types'
import { GLOB_JSX, GLOB_TSX } from '../globs'

export async function react(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic = {},
): Promise<FlatConfigItem[]> {
  const {
    overrides = {},
    typescript = true,
  } = options

  const [
    pluginReact,
    pluginReactHooks,
  ] = await Promise.all([
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-react')),
    interopDefault(import('eslint-plugin-react-hooks')),
  ] as const)

  return [
    {
      name: 'antfu:react:setup',
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
      },
    },
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: 'antfu:react:rules',
      rules: {
        // recommended rules react
        ...pluginReact.configs.recommended.rules as any,
        ...pluginReactHooks.configs.recommended.rules as any,

        'react/react-in-jsx-scope': 'off',

        ...typescript
          ? {
              'react/prop-type': 'off',
            }
          : {},

        // overrides
        ...overrides,
      },
    },
  ]
}
