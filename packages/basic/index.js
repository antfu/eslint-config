module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:yml/standard',
  ],
  plugins: [
    'html',
    'unicorn',
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.ts', '.d.ts'] },
    },
  },
  overrides: [
    {
      files: ['*.json', '*.json5'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'quotes': ['error', 'double'],
        'quote-props': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser',
    },
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '^$',
            order: [
              'name',
              'version',
              'description',
              'keywords',
              'license',
              'repository',
              'funding',
              'author',
              'type',
              'files',
              'exports',
              'main',
              'module',
              'unpkg',
              'bin',
              'scripts',
              'husky',
              'lint-staged',
              'peerDependencies',
              'peerDependenciesMeta',
              'dependencies',
              'devDependencies',
              'eslintConfig',
            ],
          },
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
            order: { type: 'asc' },
          },
        ],
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
      },
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['scripts/**/*.*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  rules: {
    // import
    'import/order': 'error',
    'import/first': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',

    // Common
    'semi': ['error', 'never'],
    'curly': ['error', 'multi-or-nest', 'consistent'],
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'no-unused-vars': 'warn',
    'no-param-reassign': 'off',
    'array-bracket-spacing': ['error', 'never'],
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'block-spacing': ['error', 'always'],
    'camelcase': 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-constant-condition': 'warn',
    'no-debugger': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-cond-assign': ['error', 'always'],
    'func-call-spacing': ['off', 'never'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'indent': ['error', 2, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
    'no-restricted-syntax': [
      'error',
      'DebuggerStatement',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'object-curly-spacing': ['error', 'always'],
    'no-return-await': 'off',
    'space-before-function-paren': ['error', 'never'],

    // es6
    'no-var': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: true,
      },
    ],
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      },
    ],
    'object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true,
      },
    ],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'generator-star-spacing': 'off',

    // best-practice
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'consistent-return': 'off',
    'complexity': ['off', 11],
    'eqeqeq': ['error', 'smart'],
    'no-alert': 'warn',
    'no-case-declarations': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-with': 'error',
    'no-void': 'error',
    'no-useless-escape': 'off',
    'vars-on-top': 'error',
    'require-await': 'off',
    'no-return-assign': 'off',
    'operator-linebreak': ['error', 'before'],

    // unicorns
    // Pass error message when throwing errors
    'unicorn/error-message': 'error',
    // Uppercase regex escapes
    'unicorn/escape-case': 'error',
    // Array.isArray instead of instanceof
    'unicorn/no-array-instanceof': 'error',
    // Prevent deprecated `new Buffer()`
    'unicorn/no-new-buffer': 'error',
    // Keep regex literals safe!
    'unicorn/no-unsafe-regex': 'off',
    // Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
    'unicorn/number-literal-case': 'error',
    // ** instead of Math.pow()
    'unicorn/prefer-exponentiation-operator': 'error',
    // includes over indexOf when checking for existence
    'unicorn/prefer-includes': 'error',
    // String methods startsWith/endsWith instead of more complicated stuff
    'unicorn/prefer-starts-ends-with': 'error',
    // textContent instead of innerText
    'unicorn/prefer-text-content': 'error',
    // Enforce throwing type error when throwing error while checking typeof
    'unicorn/prefer-type-error': 'error',
    // Use new when throwing error
    'unicorn/throw-new-error': 'error',

    'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
    'eslint-comments/disable-enable-pair': 'off',
  },
}
