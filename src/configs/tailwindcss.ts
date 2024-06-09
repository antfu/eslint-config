import { ensurePackages, interopDefault } from "../utils";
import type { TypedFlatConfigItem } from "../types";

export async function tailwindcss(): Promise<Array<TypedFlatConfigItem>> {
  await ensurePackages(["eslint-plugin-tailwindcss"]);

  const [pluginTailwindCSS] = await Promise.all([
    interopDefault(import("eslint-plugin-tailwindcss")),
  ] as const);

  return pluginTailwindCSS.configs["flat/recommended"];
}
