module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'capitalized-comments': 'off',
    'max-len': ['error', {code: 140, ignoreComments: true}],
    'max-lines-per-function': ['error', {max: 140, skipBlankLines: true, skipComments: true}],
    'max-params': [
      'error',
      6,
    ],
  },
}
