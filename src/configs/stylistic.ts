import { interopDefault } from "../utils";
import type {
  OptionsOverrides,
  StylisticConfig,
  TypedFlatConfigItem,
} from "../types";
import { pluginAntfu } from "../plugins";

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean;
}

export async function stylistic(
  options: StylisticOptions = {}
): Promise<Array<TypedFlatConfigItem>> {
  const {
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(
    import("@stylistic/eslint-plugin")
  );

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi,
  });

  return [
    {
      name: "antfu/stylistic/rules",
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        "antfu/consistent-list-newline": "error",

        ...(lessOpinionated
          ? {
              curly: ["error", "all"],
            }
          : {
              "antfu/curly": "error",
              "antfu/if-newline": "error",
              "antfu/top-level-function": "error",
            }),

        ...overrides,
      },
    },
  ];
}
