import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isInEditorEnv } from '../src/utils'

describe('isInEditorEnv', () => {
  beforeEach(() => {
    for (const name of [
      'CI',
      'GIT_INDEX_FILE',
      'GIT_PARAMS',
      'JETBRAINS_IDE',
      'npm_lifecycle_script',
      'NVIM',
      'VIM',
      'VSCODE_CWD',
      'VSCODE_GIT_COMMAND',
      'VSCODE_PID',
      'ZED_ENVIRONMENT',
    ])
      vi.stubEnv(name, undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('detects editors', () => {
    vi.stubEnv('VSCODE_PID', '1')
    expect(isInEditorEnv()).toBe(true)
  })

  it('ignores editors in git commit hooks', () => {
    vi.stubEnv('VSCODE_PID', '1')
    vi.stubEnv('GIT_INDEX_FILE', '.git/index')
    expect(isInEditorEnv()).toBe(false)
  })
})
