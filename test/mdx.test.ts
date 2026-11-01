import type { OptionsMarkdown } from '../src/types'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import { antfu } from '../src'

async function createConfigs(markdown?: OptionsMarkdown, ...userConfigs: any[]) {
  return await antfu({
    formatters: false,
    markdown,
    react: false,
    stylistic: false,
    typescript: false,
  }, ...userConfigs)
}

async function createESLint(markdown?: OptionsMarkdown, ...userConfigs: any[]) {
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: await createConfigs(markdown, ...userConfigs) as any,
  })
}

describe('markdown mdx', () => {
  it('parses and lints MDX by default', async () => {
    const eslint = await createESLint(
      undefined,
      {
        languageOptions: {
          globals: {
            Foo: 'readonly',
          },
        },
      },
    )
    const [result] = await eslint.lintText('<Foo bar="baz" />\n', { filePath: 'test.mdx' })

    expect(result.messages).toEqual([])
  })

  it('reports undeclared MDX components', async () => {
    const eslint = await createESLint()
    const [result] = await eslint.lintText('<Foo bar="baz" />\n', { filePath: 'test.mdx' })

    expect(result.messages).toEqual([
      expect.objectContaining({
        ruleId: 'no-undef',
      }),
    ])
  })

  it('uses eslint-plugin-mdx for Markdown only when requested', async () => {
    const defaultConfigs = await createConfigs()
    const mdxConfigs = await createConfigs({ parser: 'mdx' })

    expect(defaultConfigs.some(config => config.name === 'antfu/markdown/mdx' && config.files?.includes('**/*.mdx'))).toBe(true)
    expect(defaultConfigs.some(config => config.name === 'antfu/markdown/mdx' && config.files?.includes('**/*.md'))).toBe(false)
    expect(defaultConfigs.some(config => config.name === 'antfu/markdown/parser')).toBe(true)

    expect(mdxConfigs.some(config => config.name === 'antfu/markdown/mdx' && config.files?.includes('**/*.md'))).toBe(true)
    expect(mdxConfigs.some(config => config.name === 'antfu/markdown/parser')).toBe(false)
  })
})
