import type { FlatConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export function ignores(): FlatConfigItem[] {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ]
}
