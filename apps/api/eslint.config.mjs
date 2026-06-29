/* eslint-disable import/no-extraneous-dependencies */
import _import from "eslint-plugin-import";
import importHelpers from "eslint-plugin-import-helpers";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      "airbnb-base",
      "plugin:prettier/recommended",
      "plugin:import/typescript",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ),
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier: fixupPluginRules(prettier),
      import: fixupPluginRules(_import),
      "import-helpers": importHelpers,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },

      parser: tsParser,
      ecmaVersion: 13,
      sourceType: "commonjs",
    },

    settings: {
      "import/resolver": {
        typescript: {},

        node: {
          extensions: [".js", ".ts", ".json"],
        },
      },

      "import/extensions": [".js", ".ts", ".mjs"],

      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".d.ts"],
      },
    },

    rules: {
      "prettier/prettier": "error",
      "no-use-before-define": "off",
      curly: ["error", "all"],
      "no-underscore-dangle": "off",
      "@typescript-eslint/no-use-before-define": ["error"],

      "no-empty-function": [
        "error",
        {
          allow: ["constructors"],
        },
      ],

      "import/extensions": [
        "error",
        "ignorePackages",
        {
          tsx: "never",
          ts: "never",
          "": "never",
        },
      ],

      "import-helpers/order-imports": [
        "warn",
        {
          newlinesBetween: "always",
          groups: [
            ["absolute"],
            ["module"],
            ["/^(@|~)/"],
            ["parent", "sibling", "index"],
          ],

          alphabetize: {
            order: "asc",
            ignoreCase: true,
          },
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "_",
        },
      ],

      "class-methods-use-this": "off",
      "no-useless-constructor": "off",
      "import/prefer-default-export": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-namespace": "off",
      "import/no-cycle": "off",
      camelcase: "off",
    },
  },
];
