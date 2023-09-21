import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_EXCLUDE } from '../globs'

export const ignores: FlatESLintConfigItem[] = [
  { ignores: GLOB_EXCLUDE },
]
