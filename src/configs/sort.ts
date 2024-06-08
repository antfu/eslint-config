import type { TypedFlatConfigItem } from "../types";

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
export async function sortPackageJson(): Promise<Array<TypedFlatConfigItem>> {
  return [
    {
      files: ["**/package.json"],
      name: "antfu/sort/package-json",
      rules: {
        "jsonc/sort-array-values": [
          "error",
          {
            order: { type: "asc" },
            pathPattern: "^files$",
          },
        ],
        "jsonc/sort-keys": [
          "error",
          {
            order: [
              "publisher",
              "name",
              "displayName",
              "type",
              "version",
              "private",
              "packageManager",
              "description",
              "author",
              "license",
              "funding",
              "homepage",
              "repository",
              "bugs",
              "keywords",
              "categories",
              "sideEffects",
              "exports",
              "main",
              "module",
              "unpkg",
              "jsdelivr",
              "types",
              "typesVersions",
              "bin",
              "icon",
              "files",
              "engines",
              "activationEvents",
              "contributes",
              "scripts",
              "peerDependencies",
              "peerDependenciesMeta",
              "dependencies",
              "optionalDependencies",
              "devDependencies",
              "pnpm",
              "overrides",
              "resolutions",
              "husky",
              "simple-git-hooks",
              "lint-staged",
              "eslintConfig",
            ],
            pathPattern: "^$",
          },
          {
            order: { type: "asc" },
            pathPattern:
              "^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$",
          },
          {
            order: { type: "asc" },
            pathPattern: "^(?:resolutions|overrides|pnpm.overrides)$",
          },
          {
            order: ["types", "import", "require", "default"],
            pathPattern: "^exports.*$",
          },
          {
            order: [
              // client hooks only
              "pre-commit",
              "prepare-commit-msg",
              "commit-msg",
              "post-commit",
              "pre-rebase",
              "post-rewrite",
              "post-checkout",
              "post-merge",
              "pre-push",
              "pre-auto-gc",
            ],
            pathPattern: "^(?:gitHooks|husky|simple-git-hooks)$",
          },
        ],
      },
    },
  ];
}
/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */

export function sortTsconfig(): Array<TypedFlatConfigItem> {
  return [
    {
      files: ["**/tsconfig.json", "**/tsconfig.*.json"],
      name: "antfu/sort/tsconfig-json",
      rules: {
        "jsonc/sort-keys": [
          "error",
          {
            order: [
              "extends",
              "compilerOptions",
              "references",
              "files",
              "include",
              "exclude",
            ],
            pathPattern: "^$",
          },
          {
            order: [
              /* Projects */
              "incremental",
              "composite",
              "tsBuildInfoFile",
              "disableSourceOfProjectReferenceRedirect",
              "disableSolutionSearching",
              "disableReferencedProjectLoad",
              /* Language and Environment */
              "target",
              "jsx",
              "jsxFactory",
              "jsxFragmentFactory",
              "jsxImportSource",
              "lib",
              "moduleDetection",
              "noLib",
              "reactNamespace",
              "useDefineForClassFields",
              "emitDecoratorMetadata",
              "experimentalDecorators",
              /* Modules */
              "baseUrl",
              "rootDir",
              "rootDirs",
              "customConditions",
              "module",
              "moduleResolution",
              "moduleSuffixes",
              "noResolve",
              "paths",
              "resolveJsonModule",
              "resolvePackageJsonExports",
              "resolvePackageJsonImports",
              "typeRoots",
              "types",
              "allowArbitraryExtensions",
              "allowImportingTsExtensions",
              "allowUmdGlobalAccess",
              /* JavaScript Support */
              "allowJs",
              "checkJs",
              "maxNodeModuleJsDepth",
              /* Type Checking */
              "strict",
              "strictBindCallApply",
              "strictFunctionTypes",
              "strictNullChecks",
              "strictPropertyInitialization",
              "allowUnreachableCode",
              "allowUnusedLabels",
              "alwaysStrict",
              "exactOptionalPropertyTypes",
              "noFallthroughCasesInSwitch",
              "noImplicitAny",
              "noImplicitOverride",
              "noImplicitReturns",
              "noImplicitThis",
              "noPropertyAccessFromIndexSignature",
              "noUncheckedIndexedAccess",
              "noUnusedLocals",
              "noUnusedParameters",
              "useUnknownInCatchVariables",
              /* Emit */
              "declaration",
              "declarationDir",
              "declarationMap",
              "downlevelIteration",
              "emitBOM",
              "emitDeclarationOnly",
              "importHelpers",
              "importsNotUsedAsValues",
              "inlineSourceMap",
              "inlineSources",
              "mapRoot",
              "newLine",
              "noEmit",
              "noEmitHelpers",
              "noEmitOnError",
              "outDir",
              "outFile",
              "preserveConstEnums",
              "preserveValueImports",
              "removeComments",
              "sourceMap",
              "sourceRoot",
              "stripInternal",
              /* Interop Constraints */
              "allowSyntheticDefaultImports",
              "esModuleInterop",
              "forceConsistentCasingInFileNames",
              "isolatedModules",
              "preserveSymlinks",
              "verbatimModuleSyntax",
              /* Completeness */
              "skipDefaultLibCheck",
              "skipLibCheck",
            ],
            pathPattern: "^compilerOptions$",
          },
        ],
      },
    },
  ];
}
