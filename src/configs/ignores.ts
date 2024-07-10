import type { TypedFlatConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export async function ignores(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ]
}
