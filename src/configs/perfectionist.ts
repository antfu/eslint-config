import { pluginPerfectionist } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Optional perfectionist plugin for props and items sorting.
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<Array<TypedFlatConfigItem>> {
  return [
    {
      name: "antfu/perfectionist/setup",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
    },
  ];
}
