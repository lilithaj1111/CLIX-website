import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * React 19's new react-hooks lints (purity, immutability, refs,
 * set-state-in-effect) flag valid patterns we use heavily:
 *   - R3F scenes building typed-array geometries inside useMemo
 *   - Client components reading window/localStorage/matchMedia on mount
 * Downgraded to warnings so they stay visible in dev but don't block
 * production builds. Re-enable as errors if/when patterns are refactored.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
