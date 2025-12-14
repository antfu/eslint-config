import type { OptionsConfig, TypedFlatConfigItem } from '../src/types'
import { it } from 'vitest'
import { CONFIG_PRESET_FULL_OFF, CONFIG_PRESET_FULL_ON } from '../src/config-presets'
import { antfu } from '../src/factory'

interface Suite {
  name: string
  configs: OptionsConfig
}

const suites: Suite[] = [
  {
    name: 'default',
    configs: {},
  },
  {
    name: 'full-off',
    configs: CONFIG_PRESET_FULL_OFF,
  },
  {
    name: 'full-on',
    configs: CONFIG_PRESET_FULL_ON,
  },
  {
    name: 'less-opinionated',
    configs: {
      lessOpinionated: true,
    },
  },
  {
    name: 'javascript-vue',
    configs: {
      typescript: false,
      vue: true,
    },
  },
  {
    name: 'pnpm-without-yaml',
    configs: {
      yaml: false,
      pnpm: true,
    },
  },
  {
    name: 'pnpm-without-jsonc',
    configs: {
      jsonc: false,
      pnpm: true,
    },
  },
  {
    name: 'in-editor',
    configs: {
      isInEditor: true,
    },
  },
]

const ignoreConfigs: string[] = [
  'antfu/gitignore',
  'antfu/ignores',
  'antfu/javascript/setup',
]

function serializeConfigs(configs: TypedFlatConfigItem[]) {
  return configs.map((c) => {
    if (c.name && ignoreConfigs.includes(c.name)) {
      return '<ignored>'
    }
    const clone = { ...c } as any
    if (c.plugins) {
      clone.plugins = Object.keys(c.plugins)
    }
    if (c.languageOptions) {
      if (c.languageOptions.parser) {
        if (typeof c.languageOptions.parser !== 'string') {
          clone.languageOptions.parser = (c.languageOptions.parser as any).meta?.name ?? (c.languageOptions.parser as any).name ?? 'unknown'
        }
      }
      delete clone.languageOptions.globals
      if (c.languageOptions.parserOptions) {
        delete clone.languageOptions.parserOptions.parser
        delete clone.languageOptions.parserOptions.projectService
        delete clone.languageOptions.parserOptions.tsconfigRootDir
      }
    }
    if (c.processor) {
      if (typeof c.processor !== 'string') {
        clone.processor = (c.processor as any).meta?.name ?? 'unknown'
      }
    }
    if (c.rules) {
      clone.rules = Object.entries(c.rules)
        .map(([rule, value]) => {
          if (value === 'off' || value === 0)
            return `- ${rule}`
          return rule
        })
    }
    return clone
  })
}

suites.forEach(({ name, configs }) => {
  it.concurrent(`factory ${name}`, async ({ expect }) => {
    const config = await antfu(configs)
    await expect(serializeConfigs(config))
      .toMatchFileSnapshot(`./__snapshots__/factory/${name}.snap.js`)
  })
})
