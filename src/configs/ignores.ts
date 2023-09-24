import path from 'node:path'
import fs from 'node:fs'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_EXCLUDE } from '../globs'

const REGEX_SPLIT_ALL_CRLF = /\r?\n/g
const splitPattern = (pattern: string) => pattern.split(REGEX_SPLIT_ALL_CRLF)

export function ignores(ignorePath: string = '.gitignore'): FlatESLintConfigItem[] {
  // eslint-disable-next-line node/prefer-global/process
  const gitignorePath = path.join(process.cwd(), ignorePath)

  let ignoreList: string[] = []
  if (fs.existsSync(gitignorePath)) {
    ignoreList = splitPattern(fs.readFileSync(gitignorePath).toString())
      .filter(i => !(i.startsWith('#') || i.length === 0))
      .map(i => (i.startsWith('/') ? i.slice(1) : i))
  }

  return [{ ignores: [...GLOB_EXCLUDE, ...ignoreList] }]
}
