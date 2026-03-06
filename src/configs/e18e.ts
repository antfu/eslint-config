import type { Linter } from 'eslint'

import type { OptionsE18e, OptionsIsInEditor, TypedFlatConfigItem } from '../types'
import { pluginE18e } from '../plugins'

export async function e18e(options: OptionsIsInEditor & OptionsE18e = {}): Promise<TypedFlatConfigItem[]> {
  const {
    isInEditor = false,
    modernization = true,
    moduleReplacements = isInEditor,
    overrides = {},
    performanceImprovements = true,
  } = options

  // TODO: better type needed on the e18e side
  const configs = pluginE18e.configs as Record<string, Linter.Config>

  return [
    {
      name: 'antfu/e18e/rules',
      plugins: {
        e18e: pluginE18e,
      },
      rules: {
        ...modernization ? { ...configs.modernization.rules } : {},
        ...moduleReplacements ? { ...configs.moduleReplacements!.rules } : {},
        ...performanceImprovements ? { ...configs.performanceImprovements!.rules } : {},
        ...overrides,
      },
    },
  ]
}
