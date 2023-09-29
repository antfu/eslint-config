import type { FlatESLintConfigItem } from './types'

/**
 * Combine array and non-array configs into a single array.
 */
export function combine(...configs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]): FlatESLintConfigItem[] {
  return configs.flatMap(config => Array.isArray(config) ? config : [config])
}

export function renameRules(rules: Record<string, any>, from: string, to: string) {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        if (key.startsWith(from))
          return [to + key.slice(from.length), value]
        return [key, value]
      }),
  )
}

const rulesOn = new Set<string>()
const rulesOff = new Set<string>()

export function recordRulesStateConfigs(configs: FlatESLintConfigItem[]): FlatESLintConfigItem[] {
  for (const config of configs)
    recordRulesState(config.rules ?? {})

  return configs
}

export function recordRulesState(rules: FlatESLintConfigItem['rules']): FlatESLintConfigItem['rules'] {
  for (const [key, value] of Object.entries(rules ?? {})) {
    const firstValue = Array.isArray(value) ? value[0] : value
    if (firstValue == null)
      continue
    if (firstValue === 'off' || firstValue === 0)
      rulesOff.add(key)
    else
      rulesOn.add(key)
  }

  return rules
}

export function warnUnnecessaryOffRules() {
  const unnecessaryOffRules = [...rulesOff].filter(key => !rulesOn.has(key))

  for (const off of unnecessaryOffRules)
    console.warn(`[eslint] rule \`${off}\` is never turned on, you can remove the rule from your config`)
}
