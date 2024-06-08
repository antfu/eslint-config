import { configs } from "eslint-plugin-regexp";
import type { OptionsOverrides, OptionsRegExp, TypedFlatConfigItem } from "../types";

const nirOverridesConfig: TypedFlatConfigItem["rules"] = {
  // Nir's override
  "regexp/strict": "off", // conflicts with unicorn/better-regex https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1852
};

export async function regexp(
  options: OptionsRegExp & OptionsOverrides = {},
): Promise<Array<TypedFlatConfigItem>> {
  const config = configs["flat/recommended"] as TypedFlatConfigItem;
  const rules = {
    ...config.rules,
    ...nirOverridesConfig,
  };

  if (options.level === "warn") {
    for (const key in rules) {
      if (rules[key] === "error")
        rules[key] = "warn";
    }
  }

  return [
    {
      ...config,
      name: "nirtamir2/regexp/rules",
      rules: {
        ...rules,
        ...options.overrides,
      },
    },
  ];
}
