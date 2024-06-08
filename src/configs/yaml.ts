import type {
  OptionsFiles,
  OptionsOverrides,
  OptionsStylistic,
  TypedFlatConfigItem,
} from "../types";
import { GLOB_YAML } from "../globs";
import { interopDefault } from "../utils";

export async function yaml(
  options: OptionsOverrides & OptionsStylistic & OptionsFiles = {}
): Promise<Array<TypedFlatConfigItem>> {
  const { files = [GLOB_YAML], overrides = {}, stylistic = false } = options;

  const { indent = 2, quotes = "single" } =
    typeof stylistic === "boolean" ? {} : stylistic;

  const [pluginYaml, parserYaml] = await Promise.all([
    interopDefault(import("eslint-plugin-yml")),
    interopDefault(import("yaml-eslint-parser")),
  ] as const);

  return [
    {
      name: "antfu/yml/setup",
      plugins: {
        yml: pluginYaml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: "antfu/yaml/rules",
      rules: {
        "@stylistic/spaced-comment": "off",

        "yml/block-mapping": "error",
        "yml/block-sequence": "error",
        "yml/no-empty-key": "error",
        "yml/no-empty-sequence-entry": "error",
        "yml/no-irregular-whitespace": "error",
        "yml/plain-scalar": "error",

        "yml/vue-custom-block/no-parsing-error": "error",

        ...(stylistic
          ? {
              "yml/block-mapping-question-indicator-newline": "error",
              "yml/block-sequence-hyphen-indicator-newline": "error",
              "yml/flow-mapping-curly-newline": "error",
              "yml/flow-mapping-curly-spacing": "error",
              "yml/flow-sequence-bracket-newline": "error",
              "yml/flow-sequence-bracket-spacing": "error",
              "yml/indent": ["error", indent === "tab" ? 2 : indent],
              "yml/key-spacing": "error",
              "yml/no-tab-indent": "error",
              "yml/quotes": ["error", { avoidEscape: false, prefer: quotes }],
              "yml/spaced-comment": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
