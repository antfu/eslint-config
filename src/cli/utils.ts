import { execSync } from 'node:child_process'

export function isGitClean() {
  try {
    execSync('git diff-index --quiet HEAD --')
    return true
  }
  catch (error) {
    return false
  }
}
