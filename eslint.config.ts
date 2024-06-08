import { nirtamir2 } from "./src";

export default nirtamir2(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: false,
    stylistic: false,
  },
  [
    {
      rules: {
        "@typescript-eslint/init-declarations": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "github/array-foreach": "off",
        "github/no-then": "off",
        "jsdoc/require-param-description": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns": "off",
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/no-gratuitous-expressions": "off",
        "sonarjs/no-nested-template-literals": "off",
        "tsdoc/syntax": "off",
        "unicorn/consistent-destructuring": "off",
        "unicorn/import-style": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-await-expression-member": "off",
        "unicorn/no-object-as-default-parameter": "off",
        "unicorn/no-process-exit": "off",
        "unicorn/prefer-module": "off",
      },
    },
    {
      ignores: ["fixtures", "_fixtures"],
    },
  ],
);
