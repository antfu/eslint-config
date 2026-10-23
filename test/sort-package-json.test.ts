import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import { antfu } from '../src'

describe('sort package.json', () => {
  const lintPackageJson = async (pkg: object) => {
    const configs = await antfu({
      typescript: false,
      vue: false,
    })
    const eslint = new ESLint({
      fix: true,
      overrideConfigFile: true,
      overrideConfig: configs as any,
    })
    const code = `${JSON.stringify(pkg, null, 2)}\n`
    const [result] = await eslint.lintText(code, { filePath: 'package.json' })
    return JSON.parse(result.output ?? code)
  }

  // https://github.com/antfu/eslint-config/issues/763
  it('keeps negated `files` patterns after includes', async () => {
    const pkg = await lintPackageJson({
      files: [
        'src',
        'dist',
        '!**/*.test.*',
        '!**/*.spec.*',
      ],
    })
    expect(pkg.files).toEqual([
      'dist',
      'src',
      '!**/*.spec.*',
      '!**/*.test.*',
    ])
  })

  it('moves negated `files` patterns after includes', async () => {
    const pkg = await lintPackageJson({
      files: ['!**/*.test.*', 'src', 'dist'],
    })
    expect(pkg.files).toEqual(['dist', 'src', '!**/*.test.*'])
  })
})
