import { fixupConfigRules } from "@eslint/compat";
import { compat } from "../compat";
import type { TypedFlatConfigItem } from "../types";
import { ensurePackages } from "../utils";

export async function storybook(): Promise<Array<TypedFlatConfigItem>> {
  await ensurePackages(["eslint-plugin-storybook"]);

  return [
    {
      name: "nirtamir2/storybook",
      ...fixupConfigRules(
        compat.config({
          extends: [
            "plugin:storybook/recommended",
            "plugin:storybook/csf-strict",
            "plugin:storybook/addon-interactions",
          ],
          // .eslintignore is not supported with flat config, make sure to ignore also other build and test folders
          ignorePatterns: ["!.storybook", "storybook-static"],
        }),
      ),
    },
    {
      name: "nirtamir2/storybook/i18n",
      files: ["**.stories.tsx"],
      rules: {
        "i18next/no-string-literal": "off",
      },
    },
  ];
}
