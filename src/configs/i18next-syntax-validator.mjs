/**
 * @param {string} message i18n message
 * @see https://github.com/godaddy/eslint-plugin-i18n-json/issues/40#issuecomment-842474651
 */
export default function validate(message = '') {
  if (!(message || '').trim()) {
    throw new SyntaxError('Message is Empty.')
  }
  if (typeof message !== 'string') {
    throw new TypeError('Message must be a String.')
  }
  if (
    (message.includes('{') || message.includes('}'))
    && !/{{ ?(?:- |\w+)(?:, ?\w+)? ?}}/.test(message)
  ) {
    throw new SyntaxError(
      'Interpolation error. See: https://www.i18next.com/misc/json-format',
    )
  }
  if (message.includes('$t(') && !/\$t\(\w+:\w+(?:\.\w+)*\)/.test(message)) {
    throw new SyntaxError(
      'Nesting error. See: https://www.i18next.com/misc/json-format',
    )
  }
}
