import process from 'node:process'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_TS, GLOB_TSX } from '../globs'
import { parserTs, pluginAntfu, pluginImport, pluginTs } from '../plugins'
import { OFF } from '../flags'
import type { OptionsComponentExts, OptionsTypeScriptWithLanguageServer } from '../types'
import { renameRules } from '../utils'

export function typescript(options?: OptionsComponentExts): FlatESLintConfigItem[] {
  const {
    componentExts = [],
  } = options ?? {}

  return [
    {
      files: [
        GLOB_TS,
        GLOB_TSX,
        ...componentExts.map(ext => `**/*.${ext}`),
      ],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          sourceType: 'module',
        },
      },
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
        ts: pluginTs as any,
      },
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          '@typescript-eslint/',
          'ts/',
        ),
        ...renameRules(
          pluginTs.configs.strict.rules!,
          '@typescript-eslint/',
          'ts/',
        ),

        'antfu/generic-spacing': 'error',
        'antfu/named-tuple-spacing': 'error',
        'antfu/no-cjs-exports': 'error',
        'antfu/no-const-enum': 'error',
        'antfu/no-ts-export-equal': 'error',

        'no-dupe-class-members': OFF,
        'no-extra-parens': OFF,
        'no-invalid-this': OFF,
        'no-loss-of-precision': OFF,
        'no-redeclare': OFF,
        'no-use-before-define': OFF,
        'no-useless-constructor': OFF,

        // TS
        'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        'ts/ban-ts-ignore': OFF,
        'ts/consistent-indexed-object-style': OFF,
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': ['error', { disallowTypeAnnotations: false, prefer: 'type-imports' }],
        'ts/explicit-function-return-type': OFF,
        'ts/explicit-member-accessibility': OFF,
        'ts/explicit-module-boundary-types': OFF,
        'ts/naming-convention': OFF,
        'ts/no-dupe-class-members': 'error',
        'ts/no-empty-function': OFF,

        'ts/no-empty-interface': OFF,
        'ts/no-explicit-any': OFF,
        'ts/no-extra-parens': ['error', 'functions'],
        'ts/no-invalid-this': 'error',
        'ts/no-loss-of-precision': 'error',

        'ts/no-non-null-assertion': OFF,
        'ts/no-redeclare': 'error',
        'ts/no-require-imports': 'error',
        'ts/no-unused-vars': OFF,
        'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'ts/parameter-properties': OFF,
        'ts/prefer-ts-expect-error': 'error',
        'ts/triple-slash-reference': OFF,
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': OFF,
        'import/no-duplicates': OFF,
        'unused-imports/no-unused-vars': OFF,
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': OFF,
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': OFF,
        'ts/no-var-requires': OFF,
      },
    },
  ]
}

export function typescriptWithLanguageServer(options: OptionsTypeScriptWithLanguageServer & OptionsComponentExts): FlatESLintConfigItem[] {
  const {
    componentExts = [],
    tsconfigPath,
    tsconfigRootDir = process.cwd(),
  } = options

  return [
    {
      files: [
        GLOB_TS,
        GLOB_TSX,
        ...componentExts.map(ext => `**/*.${ext}`),
      ],
      ignores: ['**/*.md/*.*'],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          project: [tsconfigPath],
          tsconfigRootDir,
        },
      },
      plugins: {
        ts: pluginTs as any,
      },
      rules: {
        'dot-notation': OFF,
        'no-implied-eval': OFF,
        'no-throw-literal': OFF,
        'require-await': OFF,
        'ts/await-thenable': 'error',
        'ts/dot-notation': ['error', { allowKeywords: true }],
        'ts/no-floating-promises': 'error',
        'ts/no-for-in-array': 'error',
        'ts/no-implied-eval': 'error',
        'ts/no-misused-promises': 'error',
        'ts/no-throw-literal': 'error',
        'ts/no-unnecessary-type-assertion': 'error',
        'ts/no-unsafe-argument': 'error',
        'ts/no-unsafe-assignment': 'error',
        'ts/no-unsafe-call': 'error',
        'ts/no-unsafe-member-access': 'error',
        'ts/no-unsafe-return': 'error',
        'ts/require-await': 'error',
        'ts/restrict-plus-operands': 'error',
        'ts/restrict-template-expressions': 'error',
        'ts/unbound-method': 'error',
      },
    },
  ]
}
