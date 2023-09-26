import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_EXCLUDE } from '../globs'

export function ignores(): FlatESLintConfigItem[] {
  return [
    { ignores: GLOB_EXCLUDE },
  ]
}
