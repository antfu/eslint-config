import { defineConfig } from 'tsdown'
import { StaleGuardRecorder } from 'tsdown-stale-guard'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
  ],
  dts: true,
  shims: true,
  format: ['esm'],
  exports: true,
  plugins: [
    StaleGuardRecorder(),
  ],
})
