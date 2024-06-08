import type { OptionsStylistic, TypedFlatConfigItem } from "../types";
import { pluginAntfu, pluginImport } from "../plugins";
import { GLOB_SRC_EXT } from "../globs";

export async function imports(options: OptionsStylistic = {}): Promise<Array<TypedFlatConfigItem>> {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: "antfu/imports/rules",
      plugins: {
        "antfu": pluginAntfu,
        "import-x": pluginImport,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

        "import-x/first": "error",
        "import-x/no-duplicates": "error",
        "import-x/no-mutable-exports": "error",
        "import-x/no-named-default": "error",
        "import-x/no-self-import": "error",
        "import-x/no-webpack-loader-syntax": "error",
        "import-x/order": "off", // use prettier for it

        ...stylistic
          ? {
              "import-x/newline-after-import": ["error", { count: 1 }],
            }
          : {},
      },
    },
    {
      files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
      name: "antfu/imports/disables/bin",
      rules: {
        "antfu/no-import-dist": "off",
        "antfu/no-import-node-modules-by-path": "off",
      },
    },
  ];
}
