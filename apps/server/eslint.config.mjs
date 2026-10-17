import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importHelpers from "eslint-plugin-import-helpers";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["generated/**", "node_modules/**", "dist/**"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, Bun: "readonly" },
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
    plugins: { "import-helpers": importHelpers },
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": "warn",
      "prefer-const": "error",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "import-helpers/order-imports": [
        "warn",
        {
          newlinesBetween: "always",
          groups: [
            "module",
            "/^@generated\\//",
            "/^@\\//",
            ["parent", "sibling", "index"],
          ],
          alphabetize: { order: "asc", ignoreCase: true },
        },
      ],
    },
  },
  prettier,
);
