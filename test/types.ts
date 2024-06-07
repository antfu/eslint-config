import type { Linter } from 'eslint'
import type { TypedFlatConfigItem } from '../src';

// Make sure they are compatible
((): Linter.FlatConfig => {
  return ({} as TypedFlatConfigItem)
})();
((): TypedFlatConfigItem => {
  return ({} as Linter.FlatConfig)
})()
