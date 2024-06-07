import { interopDefault } from '../utils'
import type { OptionsFiles, OptionsIsInEditor, OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_TESTS } from '../globs'

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
  } = options

  const [
    pluginVitest,
    pluginNoOnlyTests,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vitest')),
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-no-only-tests')),
  ] as const)

  _pluginTest = _pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `vitest/no-only-tests` rule
      ...pluginNoOnlyTests.rules,
    },
  }

  return [
    {
      name: 'antfu/vitest/setup',
      plugins: {
        test: _pluginTest,
      },
    },
    {
      files,
      name: 'antfu/test/rules',
      rules: {
        'n/prefer-global/process': 'off',

        'vitest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'vitest/no-identical-title': 'error',
        'vitest/no-import-node-test': 'error',
        'vitest/no-only-tests': isInEditor ? 'off' : 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-lowercase-title': 'error',

        ...overrides,
      },
    },
  ]
}
