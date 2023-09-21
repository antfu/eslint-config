import process from 'node:process'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_TS, GLOB_TSX } from '../globs'
import { parserTs, pluginAntfu, pluginImport, pluginTs } from '../plugins'
import { OFF } from '../flags'
import type { OptionsComponentExts, OptionsTypeScriptWithLanguageServer } from '../types'

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
        '@typescript-eslint': pluginTs as any,
        'antfu': pluginAntfu,
        'import': pluginImport,
      },
      rules: {
        ...pluginTs.configs['eslint-recommended'].overrides![0].rules,
        ...pluginTs.configs.strict.rules,

        // TS
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        '@typescript-eslint/ban-ts-ignore': OFF,
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/consistent-indexed-object-style': OFF,
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false, prefer: 'type-imports' }],
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/explicit-member-accessibility': OFF,
        '@typescript-eslint/explicit-module-boundary-types': OFF,
        '@typescript-eslint/naming-convention': OFF,
        '@typescript-eslint/no-dupe-class-members': 'error',
        '@typescript-eslint/no-empty-function': OFF,
        '@typescript-eslint/no-empty-interface': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-extra-parens': ['error', 'functions'],
        '@typescript-eslint/no-invalid-this': 'error',
        '@typescript-eslint/no-loss-of-precision': 'error',
        '@typescript-eslint/no-non-null-assertion': OFF,
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': OFF,
        '@typescript-eslint/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        '@typescript-eslint/parameter-properties': OFF,
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/triple-slash-reference': OFF,

        'antfu/generic-spacing': 'error',
        'antfu/named-tuple-spacing': 'error',
        'antfu/no-cjs-exports': 'error',
        'antfu/no-const-enum': 'error',
        'antfu/no-ts-export-equal': 'error',

        'comma-dangle': OFF,
        'no-dupe-class-members': OFF,
        'no-extra-parens': OFF,
        'no-invalid-this': OFF,
        'no-loss-of-precision': OFF,
        'no-redeclare': OFF,
        'no-use-before-define': OFF,
        'no-useless-constructor': OFF,
        'quotes': OFF,
        'semi': OFF,
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
        '@typescript-eslint/no-require-imports': OFF,
        '@typescript-eslint/no-var-requires': OFF,
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
        '@typescript-eslint': pluginTs as any,
      },
      rules: {
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-implied-eval': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/restrict-template-expressions': 'error',
        '@typescript-eslint/unbound-method': 'error',
        'dot-notation': OFF,
        'no-implied-eval': OFF,
        'no-throw-literal': OFF,
        'require-await': OFF,
      },
    },
  ]
}
