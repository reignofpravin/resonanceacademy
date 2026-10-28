import js from '@eslint/js'
import globals from 'globals'

// Resonance Academy — browser-only theme bundles (resources/js).
export default [
  {
    ignores: ['node_modules/**', 'public/**', 'vendor/**', 'resources/js/blocks.mjs', 'block-templates/**'],
  },
  {
    files: ['resources/js/**/*.js', 'resources/js/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
    },
  },
  {
    files: ['resources/js/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        jsx: true,
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
        wp: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
    },
  },
]
