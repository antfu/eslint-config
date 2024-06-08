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
  {
    rules: {
      "tsdoc/syntax": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-param-description": "off",
      "unicorn/import-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "sonarjs/no-duplicate-string": "off",
      "unicorn/no-object-as-default-parameter": "off",
      "unicorn/prefer-module": "off",
      "github/no-then": "off",
      "unicorn/consistent-destructuring": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/init-declarations": "off",
    },
    ignores: ["fixtures/**", "_fixtures/**"],
  }
);
