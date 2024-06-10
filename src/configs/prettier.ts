import { eslintConfigPrettier } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Optional perfectionist plugin for props and items sorting.
 * @see https://github.com/prettier/eslint-config-prettier
 */
export async function prettier(): Promise<Array<TypedFlatConfigItem>> {
  return eslintConfigPrettier;
}
