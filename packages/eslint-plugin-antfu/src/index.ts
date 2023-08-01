import genericSpacing from './rules/generic-spacing'
import ifNewline from './rules/if-newline'
import importDedupe from './rules/import-dedupe'
import preferInlineTypeImport from './rules/prefer-inline-type-import'
import topLevelFunction from './rules/top-level-function'
import noImportNodeModulesByPath from './rules/no-import-node-modules-by-path'
import noTsExportEqual from './rules/no-ts-export-equal'
import noCjsExports from './rules/no-cjs-exports'
import noConstEnum from './rules/no-const-enum'
import namedTupleSpacing from './rules/named-tuple-spacing'

export default {
  rules: {
    'if-newline': ifNewline,
    'import-dedupe': importDedupe,
    'prefer-inline-type-import': preferInlineTypeImport,
    'generic-spacing': genericSpacing,
    'top-level-function': topLevelFunction,
    'no-import-node-modules-by-path': noImportNodeModulesByPath,
    'no-cjs-exports': noCjsExports,
    'no-ts-export-equal': noTsExportEqual,
    'no-const-enum': noConstEnum,
    'named-tuple-spacing': namedTupleSpacing,
  },
}
