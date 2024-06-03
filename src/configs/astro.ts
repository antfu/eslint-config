import globals from 'globals'
import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'
import { GLOB_ASTRO } from '../globs'
import { interopDefault } from '../utils'

export async function astro(
  options: OptionsOverrides & OptionsStylistic & OptionsFiles = {},
  enableFormatter: boolean = false,
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_ASTRO],
    overrides = {},
    stylistic = true,
  } = options

  const [
    pluginAstro,
    parserAstro,
    parserTs,
    pluginTs,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-astro')),
    interopDefault(import('astro-eslint-parser')),
    interopDefault(import('@typescript-eslint/parser')),
    interopDefault(import('@typescript-eslint/eslint-plugin')),
  ] as const)

  return [
    {
      name: 'antfu/astro/setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: parserTs,
        },
        sourceType: 'module',
      },
      name: 'antfu/astro/rules',
      processor: 'astro/client-side-ts',
      rules: {
        // use recommended rules
        'astro/missing-client-only-directive-value': 'error',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-set-html-directive': 'off',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/semi': 'off',
        'astro/valid-compile': 'error',

        ...stylistic
          ? {
              'style/indent': 'off',
              'style/jsx-closing-tag-location': 'off',
              'style/jsx-indent': 'off',
              'style/jsx-one-expression-per-line': 'off',
              'style/no-multiple-empty-lines': 'off',
            }
          : {},

        ...overrides,
      },
    },
    {
      // Define the configuration for `<script>` tag when using `client-side-ts` processor.
      files: ['**/*.astro/*.ts', '*.astro/*.ts'],
      languageOptions: {
        globals: {
          ...globals.browser,
        },
        parser: parserTs,
        parserOptions: {
          project: null,
        },
        sourceType: 'module',
      },
      // Script in `<script>` is assigned a virtual file name with the `.ts` extension.
      name: 'antfu/astro/base/typescript',
      rules: {
        'prettier/prettier': 'off',
        ...(enableFormatter
          ? {
              'style/indent': 'off',
            }
          : {}),
        // Type aware rules breaks the astro plugin
        ...(pluginTs?.configs?.['disable-type-checked']?.rules ?? {}),
      },
    },
  ]
}
