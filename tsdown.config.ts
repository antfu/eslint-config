import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
  ],
  shims: true,
  format: ['esm'],
  inlineOnly: [
    'find-up-simple',
    'eslint-visitor-keys',
    '@eslint-community/eslint-utils',
    '@typescript-eslint/utils',
    '@typescript-eslint/types',
    '@typescript-eslint/visitor-keys',
    '@typescript-eslint/scope-manager',
    'eslint-plugin-erasable-syntax-only',
    'cached-factory',
  ],
  exports: {
    legacy: true,
  },
})
