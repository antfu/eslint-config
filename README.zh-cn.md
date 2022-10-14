# @antfu/eslint-config
[![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[npm-image]: https://img.shields.io/npm/v/@antfu/eslint-config.svg
[npm-url]: https://npmjs.org/package/@antfu/eslint-config
[downloads-image]: https://img.shields.io/npm/dm/@antfu/eslint-config.svg
[downloads-url]: https://npmjs.org/package/@antfu/eslint-config
[code-style-image]: https://img.shields.io/badge/code__style-%40antfu%2Feslint--config-brightgreen
[code-style-url]: https://github.com/antfu/eslint-config/

<div align='left'>
<a href="README.md">English</a> | <b>简体中文</b>
</div>
<br>

## 特性

- 单引号，不加分号
- 格式化的自动修复（旨在独立使用，不需要Prettier）。
- TypeScript，Vue开箱即用
- 对 JSON、YAML、Markdown也支持格式化
- 导入自动排序，需要尾随逗号，更干净的提交差异
- 合理的默认值，最佳实践，只有一行的配置

## 如何使用

### 安装

```bash
pnpm add -D eslint @antfu/eslint-config
```

### 在你的`.eslintrc`文件中加入这个。

```json
{
  "extends": "@antfu"
}
```

> 你通常不需要`.eslintignore`，因为它已经由预设提供了。

### 为package.json添加脚本配置

例如:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

###  在VS Code中 配置自动修复

创建 `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```


## 延伸阅读

了解更多内容 - [为什么我不使用Prettier](https://antfu.me/posts/why-not-prettier-zh)。

## 也看看这些

- [antfu/dotfiles](https://github.com/antfu/dotfiles) - 我的dotfiles
- [antfu/vscode-settings](https://github.com/antfu/vscode-settings) - 我的VS Code设置
- [antfu/eslint-config](https://github.com/antfu/eslint-config) - 我的ESLint配置
- [antfu/ts-starter](https://github.com/antfu/ts-starter) - 我的TypeScript库的启动模板
- [antfu/vitesse](https://github.com/antfu/vitesse) - 我的Vue和Vite应用程序的启动模板。

## 许可证

[MIT](./LICENSE) License &copy; 2019-RESENT [Anthony Fu](https://github.com/antfu)
