import type { FlatConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export async function ignores(): Promise<FlatConfigItem[]> {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ]
}
