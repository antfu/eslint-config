import { execSync } from "node:child_process";

export function isGitClean() {
  try {
    execSync("git diff-index --quiet HEAD --");
    return true;
  }
  catch {
    return false;
  }
}

export function getEslintConfigContent(
  mainConfig: string,
  additionalConfigs?: Array<string>,
) {
  return `
import nirtamir2 from '@nirtamir2/eslint-config'

export default nirtamir2({
${mainConfig}
}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart();
}
