import { compat } from "../compat";
import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from "../types";


export async function tsdoc(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {},
): Promise<Array<TypedFlatConfigItem>> {
  return [
    ...compat.config({
      plugins: ["tsdoc"],
      rules: {
        "tsdoc/syntax": "warn",
        ...options.overrides,
      },
    }),
  ];
}
