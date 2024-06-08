import type { TypedFlatConfigItem } from "../types";
import { pluginUnicorn } from "../plugins";

export async function unicorn(): Promise<Array<TypedFlatConfigItem>> {
  return [
    {
      name: "nirtamir2/unicorn/rules",
      rules: {
        ...pluginUnicorn.configs["flat/recommended"].rules,
        // #region unicorn
        "unicorn/consistent-destructuring": "warn",
        "unicorn/filename-case": 0,
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/9c3f180c3ce35b3e488c076a243bf5b935c108ef/docs/rules/no-null.md
         * I use null to check for null / undefined with `variableName == null`
         */
        "unicorn/no-null": 0,
        "unicorn/numeric-separators-style": 0,
        /**
         * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/9c3f180c3ce35b3e488c076a243bf5b935c108ef/docs/rules/prevent-abbreviations.md
         * I prefer variables with short scope to be called with short name like e instead of event
         */
        "unicorn/prevent-abbreviations": 0,
        // #endregion unicorn
      },
    },
    {
      name: "antfu/unicorn/rules",
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        // Pass error message when throwing errors
        "unicorn/error-message": "error",
        // Uppercase regex escapes
        "unicorn/escape-case": "error",
        // Array.isArray instead of instanceof
        "unicorn/no-instanceof-array": "error",
        // Ban `new Array` as `Array` constructor's params are ambiguous
        "unicorn/no-new-array": "error",
        // Prevent deprecated `new Buffer()`
        "unicorn/no-new-buffer": "error",
        // Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
        "unicorn/number-literal-case": "error",
        // textContent instead of innerText
        "unicorn/prefer-dom-node-text-content": "error",
        // includes over indexOf when checking for existence
        "unicorn/prefer-includes": "error",
        // Prefer using the node: protocol
        "unicorn/prefer-node-protocol": "error",
        // Prefer using number properties like `Number.isNaN` rather than `isNaN`
        "unicorn/prefer-number-properties": "error",
        // String methods startsWith/endsWith instead of more complicated stuff
        "unicorn/prefer-string-starts-ends-with": "error",
        // Enforce throwing type error when throwing error while checking typeof
        "unicorn/prefer-type-error": "error",
        // Use new when throwing error
        "unicorn/throw-new-error": "error",
      },
    },
  ];
}
