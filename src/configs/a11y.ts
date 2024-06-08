import type { TypedFlatConfigItem } from '../types'
import { compat } from '../compat'

export function a11y(): Array<TypedFlatConfigItem> {
  return compat.config({
    extends: ['plugin:jsx-a11y/recommended'],
    rules: {
      // @see https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js
      // #region jsx-a11y from nextjs eslint config
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',

      // #endregion jsx-a11y from nextjs eslint config
    },
  })
}
