# @nirtamir2/eslint-config

[![npm](https://img.shields.io/npm/v/@nirtamir2/eslint-config?color=444&label=)](https://npmjs.com/package/@nirtamir2/eslint-config)

This is a fork of Anthony Fu's [ESLint Config](https://github.com/antfu/eslint-config) maintained by [Nir Tamir](https://github.com/nirtamir2/).

## Usage

### Starter Wizard

We provided a CLI tool to help you set up your project, or migrate from the legacy config to the new flat config with one command.

```bash
npx @nirtamir2/eslint-config@latest
```

### Manual Install

If you prefer to set up manually:

```bash
pnpm i -D eslint @nirtamir2/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2();
```

<details>
<summary>
Combined with legacy config:
</summary>

If you still use some configs from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import nirtamir2 from "@nirtamir2/eslint-config";

const compat = new FlatCompat();

export default nirtamir2(
  {
    ignores: [],
  },

  // Legacy config
  ...compat.config({
    extends: [
      "eslint:recommended",
      // Other extends...
    ],
  }),

  // Other flat configs...
);
```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

</details>

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Customization

It uses [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new). It provides much better organization and composition.

Normally you only need to import the `nirtamir2` preset:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2();
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    "**/fixtures",
    // ...globs
  ],
});
```

The `nirtamir2` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2(
  {
    // Configures for nirtamir2's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ["**/*.ts"],
    rules: {},
  },
  {
    rules: {},
  },
);
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from "@nirtamir2/eslint-config";

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
);
```

</details>

Check out the [configs](https://github.com/nirtamir2/eslint-config/blob/main/src/configs) and [factory](https://github.com/nirtamir2/eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2(
  {
    vue: true,
    typescript: true,
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      "@stylistic/semi": ["error", "never"],
    },
  },
);
```

We also provided the `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  vue: {
    overrides: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  typescript: {
    overrides: {
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
});
```

### Config Composer

The factory function `nirtamir2()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/nirtamir2/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2()
  .prepend
  // some configs before the main config
  ()
  // overrides any named configs
  .override("antfu/imports/rules", {
    rules: {
      "import-x/order": ["error", { "newlines-between": "always" }],
    },
  })
  // rename plugin prefixes
  .renamePlugins({
    "old-prefix": "new-prefix",
    // ...
  });
// ...
```


### Optional Rules

This config also provides some optional plugins/rules for extended usage.

#### `command`

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is not a typical rule for linting, but an on-demand micro-codemod tool that triggers by specific comments.

For a few triggers, for example:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts a `.forEach()` to a for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [documentation](https://github.com/antfu/eslint-plugin-command#built-in-commands)

You can add the trigger comment one line above the code you want to transform, for example (note the triple slash):

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg);
};
```

Will be transformed to this when you hit save with your editor or run `eslint . --fix`:

```ts
async function foo(msg: string): void {
  console.log(msg);
}
```

The command comments are usually one-off and will be removed along with the transformation.

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
});
```

### Editor Specific Disables

Some rules are disabled when inside ESLint IDE integrations, namely [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports) [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)

This is to prevent unused imports from getting removed by the IDE during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  isInEditor: false,
});
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

I built a visual tool to help you view what rules are enabled in your project and apply them to what files, [@eslint/config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.js` and run:

```bash
npx @eslint/config-inspector
```

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Anthony Fu](https://github.com/antfu).

[Nir Tamir](https://github.com/nirtamir2) fork his excellent work and adapt it to his own needs.
