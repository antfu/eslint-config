import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index.ts', 'src/cli/index.ts'],
  clean: true,
  declaration: true,

  rollup: {
    output: {
      exports: 'named',
    },
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      target: 'node18',
    },
  },
  alias: {
    prompts: 'prompts/lib/index.js',
  },
})
