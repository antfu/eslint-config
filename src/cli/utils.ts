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

export function getEslintConfigContent(pkg: Record<string, any>, mainConfig: string, additionalConfigs?: string[]) {
  let content = ''

  if (pkg.type === 'module') {
    content = `
import antfu from '@antfu/eslint-config'

export default antfu({\n${mainConfig}\n}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart()
  }
  else {
    content = `
const antfu = require('@antfu/eslint-config').default

module.exports = antfu({\n${mainConfig}\n}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart()
  }

  return content.trimStart()
}
