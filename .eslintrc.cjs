/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable node/no-unpublished-require */
// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  extends: [
    '@hyrious',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'node/no-missing-import': ['error', {
      tryExtensions: ['.ts', '.js'],
    }],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: { delimiter: 'none' },
      singleline: { delimiter: 'comma' },
    }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
  overrides: [{
    files: ['.eslintrc.cjs', 'src/node/**'],
    env: { node: true },
  }, {
    files: ['src/client/**'],
    env: { browser: true },
  }],
})
