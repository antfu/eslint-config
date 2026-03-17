import type { Linter } from 'eslint'

import type { OptionsE18e, OptionsIsInEditor, OptionsProjectType, TypedFlatConfigItem } from '../types'
import { pluginE18e } from '../plugins'

export async function e18e(options: OptionsE18e & OptionsProjectType & OptionsIsInEditor = {}): Promise<TypedFlatConfigItem[]> {
  const {
    isInEditor = false,
    modernization = true,
    type = 'app',
    moduleReplacements = type === 'lib' && isInEditor,
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

        // these are a bit opinionated and dangerous, so we'll disable them for now
        'e18e/prefer-array-to-reversed': 'off',
        'e18e/prefer-array-to-sorted': 'off',
        'e18e/prefer-array-to-spliced': 'off',
        'e18e/prefer-spread-syntax': 'off',

        ...overrides,
      },
    },
  ]
}
