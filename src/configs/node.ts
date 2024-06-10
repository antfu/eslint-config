import { pluginNode } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function node(): Promise<Array<TypedFlatConfigItem>> {
  return [
    {
      name: "antfu/node/rules",
      plugins: {
        n: pluginNode,
      },
      rules: {
        "n/handle-callback-err": ["error", "^(err|error)$"],
        "n/no-deprecated-api": "error",
        "n/no-exports-assign": "error",
        "n/no-new-require": "error",
        "n/no-path-concat": "error",
        "n/prefer-global/buffer": ["error", "never"],
        "n/prefer-global/process": ["error", "never"],
        "n/process-exit-as-throw": "error",
      },
    },
  ];
}
