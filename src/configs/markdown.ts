import * as mdx from 'eslint-plugin-mdx'

import type {
  FlatConfigItem,
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
} from '../types'
import { GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_OR_MDX } from '../globs'

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const { componentExts = [], overrides = {} } = options

  return [
    {
      name: 'antfu:markdown-mdx',
      ...(mdx.flat as FlatConfigItem),
      processor: mdx.createRemarkProcessor({
        lintCodeBlocks: true,
      }),
      rules: {
        ...mdx.flat.rules,
        'style/indent': 'off',
      },
    },
    {
      name: 'antfu:markdown-mdx:code-blocks',
      ...(mdx.flatCodeBlocks as FlatConfigItem),
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map(ext => `${GLOB_MARKDOWN_OR_MDX}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        ...mdx.flatCodeBlocks.rules,

        'import/newline-after-import': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',
        'style/comma-dangle': 'off',

        'style/eol-last': 'off',
        'ts/consistent-type-imports': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',
        'ts/no-var-requires': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        // Type aware rules
        ...{
          'ts/await-thenable': 'off',
          'ts/dot-notation': 'off',
          'ts/no-floating-promises': 'off',
          'ts/no-for-in-array': 'off',
          'ts/no-implied-eval': 'off',
          'ts/no-misused-promises': 'off',
          'ts/no-throw-literal': 'off',
          'ts/no-unnecessary-type-assertion': 'off',
          'ts/no-unsafe-argument': 'off',
          'ts/no-unsafe-assignment': 'off',
          'ts/no-unsafe-call': 'off',
          'ts/no-unsafe-member-access': 'off',
          'ts/no-unsafe-return': 'off',
          'ts/restrict-plus-operands': 'off',
          'ts/restrict-template-expressions': 'off',
          'ts/unbound-method': 'off',
        },

        ...overrides,
      },
    },
  ]
}
