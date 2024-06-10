import type { OptionsUnoCSS, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export async function unocss(
  options: OptionsUnoCSS = {},
): Promise<Array<TypedFlatConfigItem>> {
  const { attributify = true, strict = false } = options;

  await ensurePackages(["@unocss/eslint-plugin"]);

  const [pluginUnoCSS] = await Promise.all([
    interopDefault(import("@unocss/eslint-plugin")),
  ] as const);

  return [
    {
      name: "antfu/unocss",
      plugins: {
        unocss: pluginUnoCSS,
      },
      rules: {
        "unocss/order": "warn",
        ...(attributify
          ? {
              "unocss/order-attributify": "warn",
            }
          : {}),
        ...(strict
          ? {
              "unocss/blocklist": "error",
            }
          : {}),
      },
    },
  ];
}
