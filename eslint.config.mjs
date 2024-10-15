// @ts-check
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Seemingly not defined in `globals.browser`
        ScrollBehavior: 'readonly',
      }
    }
  },
  {
    files: ['**/*.svelte', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        projectService: true,
      }
    }
  },
  {
    rules: {
      // Allow explicit any, to avoid type gymnastics
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
      // Disallow floating promises to avoid random crashes
      '@typescript-eslint/no-floating-promises': 'error',
      //
      quotes: ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': false }],
    },
  },
  {
    ignores: [
      '**/.DS_Store',
      '**/node_modules',
      'build',
      '.svelte-kit',
      'package',
      '**/.env',
      '**/.env.*',
      '!**/.env.example',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/svelte.config.js',
      '**/vitest.config.ts',
      'eslint.config.mjs',
      'vite.config.ts',
    ],
  },
);
