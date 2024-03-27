import type { Linter } from 'eslint'
import type { FlatConfigItem } from '../src';

// Make sure they are compatible
((): Linter.FlatConfig => ({} as FlatConfigItem))();
((): FlatConfigItem => ({} as Linter.FlatConfig))()
