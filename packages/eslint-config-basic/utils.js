const fs = require('node:fs')

const SUPPORTED_EXTENSIONS = [
  'js', 'cjs', 'mjs', 'jsx',
  'ts', 'cts', 'mts', 'tsx',
  'json', 'json5', 'jsonc',
  'yaml', 'yml',
  'html', 'vue',
  'md',
]

function isUnsupportedFile(path) {
  return !SUPPORTED_EXTENSIONS.some(ext => path.toLowerCase().endsWith(`.${ext}`))
}

function isFile(path) {
  try {
    return fs.statSync(path).isFile()
  }
  catch (e) {
    // if file not found, return false here
    return false
  }
}

function listUnsupportedExtensions() {
  return process.argv
    .slice(2)
    .filter(i => !i.startsWith('-'))
    .filter(isFile)
    .filter(isUnsupportedFile)
    .map(p => `*.${p.split('.').at(-1)}`)
    .filter((i, index, arr) => arr.indexOf(i) === index)
}

exports.listUnsupportedExtensions = listUnsupportedExtensions
