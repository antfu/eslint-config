import type { ConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export function ignores(): ConfigItem[] {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ]
}
