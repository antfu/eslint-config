import type { TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export async function query(): Promise<Array<TypedFlatConfigItem>> {
  await ensurePackages(["@tanstack/eslint-plugin-query"]);

  const [pluginTanstackQuery] = await Promise.all([
    interopDefault(import("@tanstack/eslint-plugin-query")),
  ] as const);

  return pluginTanstackQuery.configs["flat/recommended"];
}
