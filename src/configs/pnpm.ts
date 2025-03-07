import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function pnpm(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [
        'package.json',
        '**/package.json',
      ],
      languageOptions: {
        parser: await interopDefault(import('jsonc-eslint-parser')),
      },
      name: 'antfu/pnpm/rules',
      plugins: {
        pnpm: await interopDefault(import('eslint-plugin-pnpm')),
      },
      rules: {
        'pnpm/enforce-catalog': 'error',
        'pnpm/prefer-workspace-settings': 'error',
        'pnpm/valid-catalog': 'error',
      },
    },
  ]
}
