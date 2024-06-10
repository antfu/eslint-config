import type { TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export async function security(): Promise<Array<TypedFlatConfigItem>> {
  await ensurePackages(["eslint-plugin-security"]);
  // @ts-expect-error missing types
  const pluginSecurity = await interopDefault(import("eslint-plugin-security"));

  return [pluginSecurity.configs.recommended];
}
