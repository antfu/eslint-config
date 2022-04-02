import ifNewline from './rules/if-newline'
import noLeadingNewline from './rules/no-leading-newline'

export default {
  rules: {
    'no-leading-newline': noLeadingNewline,
    'if-newline': ifNewline,
  },
}
