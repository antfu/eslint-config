import type { TypedFlatConfigItem } from '../types'

import createCommand from 'eslint-plugin-command/config'

export async function command(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ...createCommand() as any,
      name: 'antfu/command/rules',
    },
  ]
}
