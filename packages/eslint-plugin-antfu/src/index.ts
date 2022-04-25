import ifNewline from './rules/if-newline'
import importDedupe from './rules/import-dedupe'
import preferInlineTypeImport from './rules/prefer-inline-type-import'

export default {
  rules: {
    'if-newline': ifNewline,
    'import-dedupe': importDedupe,
    'prefer-inline-type-import': preferInlineTypeImport,
  },
}
