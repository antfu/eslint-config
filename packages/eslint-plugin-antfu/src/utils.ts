import { ESLintUtils } from '@typescript-eslint/utils'

export const createEslintRule = ESLintUtils.RuleCreator(
  ruleName => ruleName,
)
