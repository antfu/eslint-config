/* eslint-disable perfectionist/sort-objects */
import type { OptionsFiles, OptionsReact, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

import { isPackageExists } from 'local-pkg'
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs'

import { ensurePackages, interopDefault } from '../utils'

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  'vite',
]
const RemixPackages = [
  '@remix-run/node',
  '@remix-run/react',
  '@remix-run/serve',
  '@remix-run/dev',
]
const ReactRouterPackages = [
  '@react-router/node',
  '@react-router/react',
  '@react-router/serve',
  '@react-router/dev',
]
const NextJsPackages = [
  'next',
]

export async function react(
  options: OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes & OptionsReact & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [
      `${GLOB_MARKDOWN}/**`,
      GLOB_ASTRO_TS,
    ],
    overrides = {},
    tsconfigPath,
  } = options

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-refresh',
  ])

  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'react/no-leaked-conditional-rendering': 'error',
  }

  const [
    pluginReact,
    pluginReactRefresh,
  ] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-refresh')),
  ] as const)

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i))
  const isUsingRemix = RemixPackages.some(i => isPackageExists(i))
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i))
  const isUsingNext = NextJsPackages.some(i => isPackageExists(i))

  const plugins = pluginReact.configs.all.plugins!

  return [
    {
      name: 'antfu/react/setup',
      plugins: {
        'react': plugins['@eslint-react'],
        'react-refresh': pluginReactRefresh,
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'antfu/react/rules',
      rules: {
        ...pluginReact.configs.recommended.rules,

        'react/prefer-namespace-import': 'error',

        // preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
        'react-refresh/only-export-components': [
          'error',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-static-params
                    'generateStaticParams',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-metadata
                    'metadata',
                    'generateMetadata',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-viewport
                    'viewport',
                    'generateViewport',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata
                    'generateImageMetadata',
                    // https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
                    'generateSitemaps',
                  ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                    'meta',
                    'links',
                    'headers',
                    'loader',
                    'action',
                    'clientLoader',
                    'clientAction',
                    'handle',
                    'shouldRevalidate',
                  ]
                : []),
            ],
          },
        ],

        // overrides
        ...overrides,
      },
    },
    {
      files: filesTypeAware,
      name: 'antfu/react/typescript',
      rules: {
        // Disables rules that are already handled by TypeScript
        'react-dom/no-string-style-prop': 'off',
        'react-dom/no-unknown-property': 'off',
      },
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'antfu/react/type-aware-rules',
          rules: {
            ...typeAwareRules,
          },
        }]
      : [],
  ]
}
