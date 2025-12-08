import type { OptionsIsInEditor, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function pnpm(
  options: OptionsIsInEditor,
): Promise<TypedFlatConfigItem[]> {
  const [
    pluginPnpm,
    yamlParser,
    jsoncParser,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-pnpm')),
    interopDefault(import('yaml-eslint-parser')),
    interopDefault(import('jsonc-eslint-parser')),
  ])

  return [
    {
      files: [
        'package.json',
        '**/package.json',
      ],
      languageOptions: {
        parser: jsoncParser,
      },
      name: 'antfu/pnpm/package-json',
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        'pnpm/json-enforce-catalog': [
          'error',
          { autofix: !options.isInEditor },
        ],
        'pnpm/json-prefer-workspace-settings': [
          'error',
          { autofix: !options.isInEditor },
        ],
        'pnpm/json-valid-catalog': [
          'error',
          { autofix: !options.isInEditor },
        ],
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      languageOptions: {
        parser: yamlParser,
      },
      name: 'antfu/pnpm/pnpm-workspace-yaml',
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        'pnpm/yaml-enforce-settings': ['error', {
          settings: {
            catalogMode: 'prefer',
            cleanupUnusedCatalogs: true,
            shellEmulator: true,
            trustPolicy: 'no-downgrade',
          },
        }],
        'pnpm/yaml-no-duplicate-catalog-item': 'error',
        'pnpm/yaml-no-unused-catalog-item': 'error',
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      name: 'antfu/pnpm/pnpm-workspace-yaml-sort',
      rules: {
        'yaml/sort-keys': [
          'error',
          {
            order: [
              // Settings
              // @keep-sorted
              ...[
                'cacheDir',
                'catalogMode',
                'cleanupUnusedCatalogs',
                'dedupeDirectDeps',
                'deployAllFiles',
                'enablePrePostScripts',
                'engineStrict',
                'extendNodePath',
                'hoist',
                'hoistPattern',
                'hoistWorkspacePackages',
                'ignoreCompatibilityDb',
                'ignoreDepScripts',
                'ignoreScripts',
                'ignoreWorkspaceRootCheck',
                'managePackageManagerVersions',
                'minimumReleaseAge',
                'minimumReleaseAgeExclude',
                'modulesDir',
                'nodeLinker',
                'nodeVersion',
                'optimisticRepeatInstall',
                'packageManagerStrict',
                'packageManagerStrictVersion',
                'preferSymlinkedExecutables',
                'preferWorkspacePackages',
                'publicHoistPattern',
                'registrySupportsTimeField',
                'requiredScripts',
                'resolutionMode',
                'savePrefix',
                'scriptShell',
                'shamefullyHoist',
                'shellEmulator',
                'stateDir',
                'supportedArchitectures',
                'symlink',
                'tag',
                'trustPolicy',
                'trustPolicyExclude',
                'updateNotifier',
              ],

              // Packages and dependencies
              'packages',
              'overrides',
              'patchedDependencies',
              'catalog',
              'catalogs',

              // Other
              // @keep-sorted
              ...[
                'allowedDeprecatedVersions',
                'allowNonAppliedPatches',
                'configDependencies',
                'ignoredBuiltDependencies',
                'ignoredOptionalDependencies',
                'neverBuiltDependencies',
                'onlyBuiltDependencies',
                'onlyBuiltDependenciesFile',
                'packageExtensions',
                'peerDependencyRules',
              ],
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '.*',
          },
        ],
      },
    },
  ]
}
