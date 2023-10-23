import type { ConfigItem } from '../types'
import { pluginSortKeys } from '../plugins'

/**
 * Optional sort-keys plugin
 *
 * @see https://github.com/namnm/eslint-plugin-sort-keys
 */
export function sortKeys(): ConfigItem[] {
  return [
    {
      name: 'antfu:sort-keys',
      plugins: {
        'sort-keys': pluginSortKeys,
      },
    },
  ]
}
