// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import { createSimplePlugin } from 'eslint-factory'
import antfu from './src'

export default antfu(
  {
    vue: true,
    // react: true,
    typescript: true,
    ignores: [
      'fixtures',
      '_fixtures',
    ],
    formatters: true,
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
  createSimplePlugin({
    name: 'debugging',
    include: ['**/*.mdx'],
    create(context) {
      console.log(context.sourceCode.ast.tokens)
    },
  }),
)
