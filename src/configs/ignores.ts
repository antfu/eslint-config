import type { FlatESLintConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export function ignores(): FlatESLintConfigItem[] {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ]
}
