import { ensurePackages, interopDefault } from '../utils'
import type { FlatConfigItem, OptionsPrettier } from '../types'

export async function prettier(
  options: OptionsPrettier = {},
): Promise<FlatConfigItem[]> {
  await ensurePackages([
    'eslint-plugin-prettier',
  ])

  const rules = {
    ...options.custom || {},
  }

  if (options.css) {
    rules.css ||= ['**/*.css', '**/*.pcss', '**/*.postcss']
    rules.less ||= ['**/*.less']
    rules.scss ||= ['**/*.scss', '**/*.sass']
  }

  if (options.html)
    rules.html ||= ['**/*.html', '**/*.htm']

  if (options.graphql)
    rules.graphql ||= ['**/*.graphql', '**/*.gql']

  if (!Object.keys(rules).length)
    throw new Error('No languages specified for Prettier')

  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'))
  const parserPlain = await interopDefault(import('eslint-parser-plain'))

  return [
    {
      name: 'antfu:prettier:setup',
      plugins: {
        prettier: pluginPrettier,
      },
    },
    ...Object.entries(rules).map(([name, files]): FlatConfigItem => ({
      files,
      languageOptions: {
        parser: parserPlain,
      },
      name: `antfu:prettier:${name}`,
      rules: {
        'prettier/prettier': ['error', { parser: name }],
      },
    })),
  ]
}
