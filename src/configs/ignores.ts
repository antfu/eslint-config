import type { TypedFlatConfigItem } from '../types'

import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from '../globs'

export async function ignores(
  userIgnores: string[] | ((originals: string[]) => string[]) = [],
  ignoreTypeScript = false,
): Promise<TypedFlatConfigItem[]> {
  let ignores = [
    ...GLOB_EXCLUDE,
  ]

  if (ignoreTypeScript)
    ignores.push(GLOB_TS, GLOB_TSX)

  if (typeof userIgnores === 'function') {
    ignores = userIgnores(ignores)
  }
  else {
    ignores = [
      ...ignores,
      ...userIgnores,
    ]
  }

  return [
    {
      ignores,
      name: 'antfu/ignores',
    },
  ]
}
