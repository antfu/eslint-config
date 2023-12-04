import type { Linter } from 'eslint'
import type { FlatConfigItem, OptionsComponentExts, OptionsFiles, OptionsOverrides } from '../types'
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs'
import { interopDefault } from '../utils'

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {},
  formatMarkdown: boolean = false,
): Promise<FlatConfigItem[]> {
  const {
    componentExts = [],
    files = [GLOB_MARKDOWN],
    overrides = {},
  } = options

  // @ts-expect-error missing types
  const markdown = await interopDefault(import('eslint-plugin-markdown'))
  const baseProcessor = markdown.processors.markdown

  // `eslint-plugin-markdown` only creates virtual files for code blocks,
  // but not the markdown file itself. In order to format the whole markdown file,
  // we need to create another virtual file for the markdown file itself.
  const processor: Linter.Processor = !formatMarkdown
    ? baseProcessor
    : {
        ...baseProcessor,
        postprocess(messages, filename) {
          const markdownContent = messages.pop()
          const codeSnippets = baseProcessor.postprocess(messages, filename)
          return [
            ...markdownContent || [],
            ...codeSnippets || [],
          ]
        },
        preprocess(text, filename) {
          const result = baseProcessor.preprocess(text, filename)
          return [
            ...result,
            {
              filename: '.__markdown_content__',
              text,
            },
          ]
        },
      }

  return [
    {
      name: 'antfu:markdown:setup',
      plugins: {
        markdown,
      },
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: 'antfu:markdown:processor',
      processor,
    },
    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      name: 'antfu:markdown:disables',
      rules: {
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
