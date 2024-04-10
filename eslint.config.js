// @ts-check
import { bundleRequire } from 'bundle-require'

export default bundleRequire({
  filepath: './eslint.config.ts',
}).then(r => r.mod.default)
