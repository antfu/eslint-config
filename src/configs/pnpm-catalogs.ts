import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function pnpmCatalogs(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [
        'package.json',
        '**/package.json',
      ],
      languageOptions: {
        parser: await interopDefault(import('jsonc-eslint-parser')),
      },
      name: 'antfu/pnpm-catalogs/rules',
      plugins: {
        'pnpm-catalogs': await interopDefault(import('eslint-plugin-pnpm-catalogs')),
      },
      rules: {
        'pnpm-catalogs/enforce-catalog': 'error',
        'pnpm-catalogs/valid-catalog': 'error',
      },
    },
  ]
}
