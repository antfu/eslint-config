import type { OptionsConfig } from '../src'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import { antfu } from '../src'

describe('jsx-a11y rules', () => {
  const createESLint = async (options?: OptionsConfig) => {
    const configs = await antfu({
      react: true,
      typescript: false,
      stylistic: false,
      formatters: false,
      jsx: {
        a11y: true,
      },
      ...options,
    })

    return new ESLint({
      overrideConfigFile: true,
      overrideConfig: configs as any,
    })
  }

  const readFixture = async (filePath: string) => {
    const fullPath = resolve('fixtures', filePath)
    return await fs.readFile(fullPath, 'utf-8')
  }

  it('should catch invalid anchor href', async () => {
    const eslint = await createESLint()
    const code = await readFixture('jsx-a11y-errors/invalid-anchor-href.jsx')

    const results = await eslint.lintText(code, { filePath: 'test.jsx' })
    const errors = results[0].messages.filter(msg => msg.ruleId?.startsWith('jsx-a11y/'))

    expect(errors.length).toBeGreaterThan(0)
  })

  it('should ignore a11y error if not enabled', async () => {
    const eslint = await createESLint({ jsx: { a11y: false } })
    const code = await readFixture('jsx-a11y-errors/invalid-anchor-href.jsx')

    const results = await eslint.lintText(code, { filePath: 'test.jsx' })
    const errors = results[0].messages.filter(msg => msg.ruleId?.startsWith('jsx-a11y/'))

    expect(errors.length).toBe(0)
  })

  it('should allow valid accessible JSX', async () => {
    const eslint = await createESLint()
    const code = await readFixture('jsx-a11y-valid/accessible-elements.jsx')

    const results = await eslint.lintText(code, { filePath: 'test.jsx' })
    const a11yErrors = results[0].messages.filter(msg => msg.ruleId?.startsWith('jsx-a11y/'))

    expect(a11yErrors.length).toBe(0)
  })

  it('should respect a11y override in ESLint config', async () => {
    const code = await readFixture('jsx-a11y-errors/invalid-anchor-href.jsx')

    const configs = await antfu({
      react: true,
      typescript: false,
      stylistic: false,
      formatters: false,
      jsx: {
        a11y: {
          overrides: {
            'jsx-a11y/anchor-is-valid': 'off',
          },
        },
      },
    })

    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: configs as any,
    })

    const results = await eslint.lintText(code, { filePath: 'test.jsx' })
    const anchorErrors = results[0].messages.filter(msg => msg.ruleId === 'jsx-a11y/anchor-is-valid')

    expect(anchorErrors.length).toBe(0)
  })
})
