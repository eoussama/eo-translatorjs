import type { TestProjectInlineConfiguration, ViteUserConfig } from "vitest/config";
import process from "node:process";
import { defineConfig } from "vitest/config";



const unit: TestProjectInlineConfiguration = {
  test: {
    name: "unit",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    environment: "node",
  },
};

// Runs against the built `dist/`, so it's left out of mutation testing runs.
const smoke: TestProjectInlineConfiguration = {
  test: {
    name: "smoke",
    include: ["tests/smoke/**/*.test.ts"],
    environment: "node",
  },
};

const config: ViteUserConfig = defineConfig({
  test: {
    projects: process.env.STRYKER_MUTATOR_WORKER === undefined ? [unit, smoke] : [unit],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "coverage",
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});

export default config;
