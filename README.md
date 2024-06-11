# @nirtamir2/eslint-config

[![npm](https://img.shields.io/npm/v/@nirtamir2/eslint-config?color=444&label=)](https://npmjs.com/package/@nirtamir2/eslint-config)

This is a fork of Anthony Fu's [ESLint Config](https://github.com/antfu/eslint-config) maintained by [Nir Tamir](https://github.com/nirtamir2/).

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, Vue, JSON, YAML, Toml, Markdown, etc. Out-of-box.
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Optional [React](#react), [Svelte](#svelte), [UnoCSS](#unocss), [Astro](#astro), [Solid](#solid) support
- Optional [formatters](#formatters) support for formatting CSS, HTML, XML, etc.
- **Style principle**: Minimal for reading, stable for diff, consistent
  - Sorted imports, dangling commas
  - Single quotes, no semi
  - Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Supports ESLint v9 or v8.50.0+


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

## VS Code support (auto fix on save)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Enable the ESlint flat config support
  // (remove this if your ESLint extension above v3.0.5)
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never",
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "format/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" },
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss",
  ],
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
  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: "single", // or 'double'
  },

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
  .override("nirtamir2/imports", {
    rules: {
      "import/order": ["error", { "newlines-between": "always" }],
    },
  })
  // rename plugin prefixes
  .renamePlugins({
    "old-prefix": "new-prefix",
    // ...
  });
// ...
```

### Vue

Vue support is detected automatically by checking if `vue` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  vue: true,
});
```

#### Vue 2

We have limited support for Vue 2 (as it's already [reached EOL](https://v2.vuejs.org/eol/)). If you are still using Vue 2, you can configure it manually by setting `vueVersion` to `2`:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  vue: {
    vueVersion: 2,
  },
});
```

As it's in maintenance mode, we only accept bug fixes for Vue 2. It might also be removed in the future when `eslint-plugin-vue` drops support for Vue 2. We recommend upgrading to Vue 3 if possible.

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### Formatters

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc). Powered by [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format).

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: "prettier",
  },
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-format
```

#### React

To enable React support, you need to explicitly turn it on:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  react: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Svelte

To enable svelte support, you need to explicitly turn it on:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  svelte: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-svelte
```

#### Astro

To enable astro support, you need to explicitly turn it on:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  astro: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-astro
```

#### Solid

To enable Solid support, you need to explicitly turn it on:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  solid: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-solid
```

#### UnoCSS

To enable UnoCSS support, you need to explicitly turn it on:

```js
// eslint.config.js
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  unocss: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @unocss/eslint-plugin
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

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/) for releases. However, since this is just a config and involves opinions and many moving parts, we don't treat rules changes as breaking changes.

### Changes Considered as Breaking Changes

- Node.js version requirement changes
- Huge refactors that might break the config
- Plugins made major changes that might break the config
- Changes that might affect most of the codebases

### Changes Considered as Non-breaking Changes

- Enable/disable rules and plugins (that might become stricter)
- Rules options changes
- Version bumps of dependencies

## Badge

If you enjoy this code style, and would like to mention it in your project, here is the badge you can use:

```md
[![code style](https://nirtamir2.me/badge-code-style.svg)](https://github.com/nirtamir2/eslint-config)
```

[![code style](https://nirtamir2.me/badge-code-style.svg)](https://github.com/nirtamir2/eslint-config)

## FAQ

### Prettier?

[Why I don't use Prettier](https://nirtamir2.me/posts/why-not-prettier)

Well, you can still use Prettier to format files that are not supported well by ESLint yet, such as `.css`, `.html`, etc. See [formatters](#formatters) for more details.

### dprint?

[dprint](https://dprint.dev/) is also a great formatter that with more abilities to customize. However, it's in the same model as Prettier which reads the AST and reprints the code from scratch. This means it's similar to Prettier, which ignores the original line breaks and might also cause the inconsistent diff. So in general, we prefer to use ESLint to format and lint JavaScript/TypeScript code.

Meanwhile, we do have dprint integrations for formatting other files such as `.md`. See [formatters](#formatters) for more details.

### How to format CSS?

You can opt-in to the [`formatters`](#formatters) feature to format your CSS. Note that it's only doing formatting, but not linting. If you want proper linting support, give [`stylelint`](https://stylelint.io/) a try.

### Top-level Function Style, etc.

I am a very opinionated person, so as this config. I prefer the top-level functions always using the function declaration over arrow functions; I prefer one-line if statements without braces and always wraps, and so on. I even wrote some custom rules to enforce them.

I know they are not necessarily the popular opinions. If you really want to get rid of them, you can disable them with:

```ts
import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  lessOpinionated: true,
});
```

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Anthony Fu](https://github.com/antfu).

[Nir Tamir](https://github.com/nirtamir2) fork his excellent work and adapt it to his own needs.
