# @antfu/eslint-config

[![npm](https://img.shields.io/npm/v/@antfu/eslint-config?color=444&label=)](https://npmjs.com/package/@antfu/eslint-config) [![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

- Single quotes, no semi
- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Designed to work with TypeScript, Vue out-of-box
- Lint also for json, yaml, markdown
- Sorted imports, dangling commas
- Reasonable defaults, best practices, only one-line of config
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- **Style principle**: Minimal for reading, stable for diff

> Configs uses [🌈 ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)

## Usage

### Install

```bash
pnpm add -D eslint @antfu/eslint-config
```

### Create config file

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default [
  ...antfu,
  {
    rules: {
      // your overrides
    },
  },
]
```

> You don't need `.eslintignore` normally as it has been provided by the preset.

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

## VS Code support (auto fix)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `settings.json`:

```jsonc
{
  // Enable the flat config support
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    {
      "rule": "@stylistic/*",
      "severity": "off"
    }
  ],

  // The following is optional.
  // It's better to put under project setting `.vscode/settings.json`
  // to avoid conflicts with working with different eslint configs
  // that does not support all formats.
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
    "yaml"
  ]
}
```

## Flat Config

Since v0.44.0, we migrated to [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), provides a much better organization and composition.

You can now compose your own config easily:

```js
// eslint.config.js
import {
  presetAuto,
  presetJavaScriptCore,
  presetLangsExtensions,
  presetTypeScript,
} from '@antfu/eslint-config'

export default [
  // javascript, node, unicorn, jsdoc, imports, etc.
  ...presetJavaScriptCore,
  // typescript support
  ...presetTypeScript,
  // yaml, markdown, json, support
  ...presetLangsExtensions,
]
```

Or even more granular:

```js
// eslint.config.js
import {
  comments,
  ignores,
  imports,
  javascript,
  javascriptStylistic,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  typescript,
  typescriptStylistic,
  unicorn,
  vue,
  yml,
} from '@antfu/eslint-config'

export default [
  ...ignores,
  ...javascript,
  ...comments,
  ...node,
  ...jsdoc,
  ...imports,
  ...unicorn,
  ...javascriptStylistic,

  ...typescript,
  ...typescriptStylistic,

  ...vue,

  ...jsonc,
  ...yml,
  ...markdown,
]
```

Check out the [presets](https://github.com/antfu/eslint-config/blob/main/packages/eslint-config/src/presets.ts) and [configs](https://github.com/antfu/eslint-config/blob/main/packages/eslint-config/src/configs) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by importing `typescriptWithLanguageServer` config:

```js
// eslint.config.js
import { presetAuto, typescriptWithLanguageServer } from '@antfu/eslint-config'

export default [
  ...presetAuto,
  ...typescriptWithLanguageServer({
    tsconfig: 'tsconfig.json', // path to your tsconfig
  }),
  {
    rules: {
      // your overrides
    },
  },
]
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
```

## Badge

If you enjoy this code style, and would like to mention it in your project, here is the badge you can use:

```md
[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)
```

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

## FAQ

### Prettier?

[Why I don't use Prettier](https://antfu.me/posts/why-not-prettier)

### How to lint CSS?

This config does NOT lint CSS. I personally use [UnoCSS](https://github.com/unocss/unocss) so I don't write CSS. If you still prefer CSS, you can use [stylelint](https://stylelint.io/) for CSS linting.

### I prefer XXX...

Sure, you can override rules locally in your project to fit your needs. Or you can always fork this repo and make your own.

## Check Also

- [antfu/dotfiles](https://github.com/antfu/dotfiles) - My dotfiles
- [antfu/vscode-settings](https://github.com/antfu/vscode-settings) - My VS Code settings
- [antfu/ts-starter](https://github.com/antfu/ts-starter) - My starter template for TypeScript library
- [antfu/vitesse](https://github.com/antfu/vitesse) - My starter template for Vue & Vite app

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Anthony Fu](https://github.com/antfu)
