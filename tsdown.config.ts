import { defineConfig } from 'tsdown'
import { StaleGuardRecorder } from 'tsdown-stale-guard'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/oxlint.ts',
    'src/oxlint-eslint-plugin.ts',
  ],
  dts: true,
  shims: true,
  format: ['esm'],
  exports: {
    // Loaded by Oxlint through a file URL, not part of the public API.
    exclude: ['oxlint-eslint-plugin'],
  },
  plugins: [
    StaleGuardRecorder(),
  ],
})
