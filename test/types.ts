import type { Linter } from 'eslint'

import type { TypedFlatConfigItem } from '../src'

// Make sure they are compatible
((): Linter.Config => ({} as TypedFlatConfigItem))();
// @ts-expect-error not working well for some reason
((): TypedFlatConfigItem => ({} as Linter.Config))()
