import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  globalIgnores(["dist", "coverage", "src/**/*.d.ts", "*.config.ts"]),
  ...tseslint.configs.recommended,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
];
