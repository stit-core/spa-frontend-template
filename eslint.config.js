import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactCompiler from 'eslint-plugin-react-compiler'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import testingLibrary from 'eslint-plugin-testing-library'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

const fsdLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'node_modules',
      'src/app/router/routeTree.gen.ts',
      'src/shared/api/__generated__/**',
      'public/mockServiceWorker.js',
      'public/config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-compiler': reactCompiler,
      'jsx-a11y': jsxA11y,
      'testing-library': testingLibrary,
      boundaries,
    },
    settings: {
      react: { version: 'detect' },
      'boundaries/elements': fsdLayers.map((layer) => ({
        type: layer,
        pattern: `src/${layer}/*`,
      })),
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-compiler/react-compiler': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['../*/*'], message: 'Импорт через ../ за пределы слайса запрещён — используй public API через @/<layer>/<slice>' },
            { group: ['@/*/*/*/*'], message: 'Deep-импорт мимо public API запрещён' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'vitest.setup.ts'],
    plugins: { 'testing-library': testingLibrary },
    rules: {
      ...testingLibrary.configs.react.rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['scripts/**/*.ts', '*.config.{ts,js}', 'vite.config.ts', 'vitest.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
)
