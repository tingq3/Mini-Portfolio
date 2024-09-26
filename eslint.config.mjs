// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    ignores: [
      "**/.DS_Store",
      "**/node_modules",
      "build",
      ".svelte-kit",
      "package",
      "**/.env",
      "**/.env.*",
      "!**/.env.example",
      "**/pnpm-lock.yaml",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/svelte.config.js",
      "**/vitest.config.ts",
      "eslint.config.mjs",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);

