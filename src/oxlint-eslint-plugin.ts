// Exposes ESLint's core rules as a JS plugin, for the ones Oxlint has not ported natively.
import { builtinRules } from 'eslint/use-at-your-own-risk'

export default {
  meta: { name: 'eslint-js' },
  rules: Object.fromEntries(builtinRules),
}
