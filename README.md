# @antfu/eslint-config

[![npm](https://img.shields.io/npm/v/@antfu/eslint-config)](https://npmjs.com/package/@antfu/eslint-config)

## Usage

### Install

```bash
pnpm add -D eslint @antfu/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": [
    "@antfu"
  ]
}
```

### Config `.eslintignore`

```txt
dist
public
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint \"**/*.{vue,ts,js}\""
  }
}
```

### Config VSCode auto fix

Create `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
