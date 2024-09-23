import { GLOB_JSX, GLOB_TSX } from "../globs";
import type { TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export async function jsx(): Promise<Array<TypedFlatConfigItem>> {
  const [pluginJsStylistic, pluginJsxStylistic] = await Promise.all([
    interopDefault(import("@stylistic/eslint-plugin-js")),
    interopDefault(import("@stylistic/eslint-plugin-jsx")),
  ] as const);

  return [
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: "antfu/jsx/setup",
    },
    {
      files: [GLOB_JSX, GLOB_TSX],
      plugins: {
        "@stylistic/js": pluginJsStylistic,
        "@stylistic/jsx": pluginJsxStylistic,
      },
      name: "nirtamir/jsx/stylistic",
      rules: {
        "@stylistic/js/jsx-quotes": "warn",
        "@stylistic/jsx/jsx-self-closing-comp": "warn",
      },
    },
  ];
}
