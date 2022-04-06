import ifNewline from './rules/if-newline'
import noLeadingNewline from './rules/no-leading-newline'
import preferInlineTypeImport from './rules/prefer-inline-type-import'

export default {
  rules: {
    'no-leading-newline': noLeadingNewline,
    'if-newline': ifNewline,
    'prefer-inline-type-import': preferInlineTypeImport,
  },
}
