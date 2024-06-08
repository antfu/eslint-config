import path from 'node:path'
import { fixupConfigRules } from '@eslint/compat'
import { ensurePackages } from '../utils'
import type { TypedFlatConfigItem } from '../types'
import { compat } from '../compat'

export async function i18n(): Promise<Array<TypedFlatConfigItem>> {
  await ensurePackages([
    'eslint-plugin-i18n-checker',
    'eslint-plugin-i18n-json',
    'eslint-plugin-i18n-prefix',
    'eslint-plugin-i18next',
    '@naturacosmeticos/i18n-checker',
  ])

  return [
    {
      name: 'nirtami2/i18n',
      ...fixupConfigRules(
        compat.config({
          extends: [
            'plugin:i18n-prefix/recommended',
            'plugin:i18next/recommended',
          ],
          plugins: ['@naturacosmeticos/i18n-checker'],
          rules: {
            /**
             * This will error if `t` function called with a translation key
             * that does not exist in translation files
             */
            '@naturacosmeticos/i18n-checker/path-in-locales': [
              'error',
              {
                localesPath: 'locales/',
                messagesBasePath: 'translations',
                translationFunctionName: 't',
              },
            ],
            /**
             * i18n translation should be the same as component name
             */
            'i18n-prefix/i18n-prefix': [
              'error',
              {
                translationFunctionName: 't',
                delimiter: '.',
                ignorePrefixes: ['enum'],
              },
            ],
          },
          overrides: [
            {
              files: ['**/locales/**/*.json'],
              extends: ['plugin:i18n-json/recommended'],
              rules: {
                'i18n-json/valid-message-syntax': [
                  'error',
                  {
                    /**
                     * This allows using the i18next format with {param} syntax
                     * @see https://github.com/godaddy/eslint-plugin-i18n-json/issues/40#issuecomment-842474651
                     */
                    syntax: path.resolve('./i18next-syntax-validator.mjs'),
                  },
                ],
              },
            },
          ],
        }),
      ),
    },
  ]
}
