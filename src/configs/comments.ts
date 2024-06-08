import type { TypedFlatConfigItem } from "../types";
import { pluginComments } from "../plugins";

export async function comments(): Promise<Array<TypedFlatConfigItem>> {
  return [
    {
      name: "antfu/eslint-comments/rules",
      plugins: {
        "eslint-comments": pluginComments,
      },
      rules: {
        "eslint-comments/no-aggregating-enable": "error",
        "eslint-comments/no-duplicate-disable": "error",
        "eslint-comments/no-unlimited-disable": "error",
        "eslint-comments/no-unused-enable": "error",
      },
    },
  ];
}
