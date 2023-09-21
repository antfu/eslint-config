import type { FlatESLintConfigItem } from 'eslint-define-config'

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
export const sortPackageJson: FlatESLintConfigItem[] = [
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-array-values': [
        'error',
        {
          order: { type: 'asc' },
          pathPattern: '^files$',
        },
      ],
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'publisher',
            'name',
            'displayName',
            'type',
            'version',
            'private',
            'packageManager',
            'description',
            'author',
            'license',
            'funding',
            'homepage',
            'repository',
            'bugs',
            'keywords',
            'categories',
            'sideEffects',
            'exports',
            'main',
            'module',
            'unpkg',
            'jsdelivr',
            'types',
            'typesVersions',
            'bin',
            'icon',
            'files',
            'engines',
            'activationEvents',
            'contributes',
            'scripts',
            'peerDependencies',
            'peerDependenciesMeta',
            'dependencies',
            'optionalDependencies',
            'devDependencies',
            'pnpm',
            'overrides',
            'resolutions',
            'husky',
            'simple-git-hooks',
            'lint-staged',
            'eslintConfig',
          ],
          pathPattern: '^$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^resolutions$',
        },
        {
          order: { type: 'asc' },
          pathPattern: '^pnpm.overrides$',
        },
        {
          order: [
            'types',
            'import',
            'require',
            'default',
          ],
          pathPattern: '^exports.*$',
        },
      ],
    },
  },
]
/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */

export const sortTsconfig: FlatESLintConfigItem[] = [
  {
    files: ['**/tsconfig.json', '**/tsconfig.*.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'extends',
            'compilerOptions',
            'references',
            'files',
            'include',
            'exclude',
          ],
          pathPattern: '^$',
        },
        {
          order: [
            /* Projects */
            'incremental',
            'composite',
            'tsBuildInfoFile',
            'disableSourceOfProjectReferenceRedirect',
            'disableSolutionSearching',
            'disableReferencedProjectLoad',
            /* Language and Environment */
            'target',
            'lib',
            'jsx',
            'experimentalDecorators',
            'emitDecoratorMetadata',
            'jsxFactory',
            'jsxFragmentFactory',
            'jsxImportSource',
            'reactNamespace',
            'noLib',
            'useDefineForClassFields',
            'moduleDetection',
            /* Modules */
            'module',
            'rootDir',
            'moduleResolution',
            'baseUrl',
            'paths',
            'rootDirs',
            'typeRoots',
            'types',
            'allowUmdGlobalAccess',
            'moduleSuffixes',
            'allowImportingTsExtensions',
            'resolvePackageJsonExports',
            'resolvePackageJsonImports',
            'customConditions',
            'resolveJsonModule',
            'allowArbitraryExtensions',
            'noResolve',
            /* JavaScript Support */
            'allowJs',
            'checkJs',
            'maxNodeModuleJsDepth',
            /* Emit */
            'declaration',
            'declarationMap',
            'emitDeclarationOnly',
            'sourceMap',
            'inlineSourceMap',
            'outFile',
            'outDir',
            'removeComments',
            'noEmit',
            'importHelpers',
            'importsNotUsedAsValues',
            'downlevelIteration',
            'sourceRoot',
            'mapRoot',
            'inlineSources',
            'emitBOM',
            'newLine',
            'stripInternal',
            'noEmitHelpers',
            'noEmitOnError',
            'preserveConstEnums',
            'declarationDir',
            'preserveValueImports',
            /* Interop Constraints */
            'isolatedModules',
            'verbatimModuleSyntax',
            'allowSyntheticDefaultImports',
            'esModuleInterop',
            'preserveSymlinks',
            'forceConsistentCasingInFileNames',
            /* Type Checking */
            'strict',
            'strictBindCallApply',
            'strictFunctionTypes',
            'strictNullChecks',
            'strictPropertyInitialization',
            'allowUnreachableCode',
            'allowUnusedLabels',
            'alwaysStrict',
            'exactOptionalPropertyTypes',
            'noFallthroughCasesInSwitch',
            'noImplicitAny',
            'noImplicitOverride',
            'noImplicitReturns',
            'noImplicitThis',
            'noPropertyAccessFromIndexSignature',
            'noUncheckedIndexedAccess',
            'noUnusedLocals',
            'noUnusedParameters',
            'useUnknownInCatchVariables',
            /* Completeness */
            'skipDefaultLibCheck',
            'skipLibCheck',
          ],
          pathPattern: '^compilerOptions$',
        },
      ],
    },
  },
]
