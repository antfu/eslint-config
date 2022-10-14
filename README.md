# @antfu/eslint-config
[![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[npm-image]: https://img.shields.io/npm/v/@antfu/eslint-config.svg
[npm-url]: https://npmjs.org/package/@antfu/eslint-config
[downloads-image]: https://img.shields.io/npm/dm/@antfu/eslint-config.svg
[downloads-url]: https://npmjs.org/package/@antfu/eslint-config
[code-style-image]: https://img.shields.io/badge/code__style-%40antfu%2Feslint--config-brightgreen
[code-style-url]: https://github.com/antfu/eslint-config/

<div align='left'>
<b>English</b> | <a href="README.zh-cn.md">简体中文</a>
</div>
<br>

- Single quotes, no semi
- Auto fix for formatting (aimed to be used standalone without Prettier)
- Designed to work with TypeScript, Vue out-of-box
- Lint also for json, yaml, markdown
- Sorted imports, dangling commas for cleaner commit diff
- Reasonable defaults, best practices, only one-line of config

## Usage

### Install

```bash
pnpm add -D eslint @antfu/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": "@antfu"
}
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

### Config VS Code auto fix

Create `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Extended Reading

Learn more about the context - [Why I don't use Prettier](https://antfu.me/posts/why-not-prettier).

## Check Also

- [antfu/dotfiles](https://github.com/antfu/dotfiles) - My dotfiles
- [antfu/vscode-settings](https://github.com/antfu/vscode-settings) - My VS Code settings
- [antfu/eslint-config](https://github.com/antfu/eslint-config) - My ESLint config
- [antfu/ts-starter](https://github.com/antfu/ts-starter) - My starter template for TypeScript library
- [antfu/vitesse](https://github.com/antfu/vitesse) - My starter template for Vue & Vite app

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Anthony Fu](https://github.com/antfu)
