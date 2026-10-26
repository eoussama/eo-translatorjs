import type { PlaywrightTestConfig } from "@playwright/test";

import process from "node:process";
import { defineConfig, devices } from "@playwright/test";



const HARNESS_URL = "http://localhost:5175";
// A dedicated port, so tests never hit a preview server left over from manual work.
const SITE_URL = "http://localhost:4317";

const config: PlaywrightTestConfig = defineConfig({
  testDir: "e2e/specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    // Library scenarios rendered by a bare page, plus the built browser bundles; run `pnpm build` first.
    {
      name: "harness",
      testDir: "e2e/specs/harness",
      use: { ...devices["Desktop Chrome"], baseURL: HARNESS_URL },
    },
    // The built docs site and its demos; run `pnpm docs:build` first.
    {
      name: "site",
      testDir: "e2e/specs/site",
      use: { ...devices["Desktop Chrome"], baseURL: SITE_URL },
    },
  ],
  webServer: [
    {
      command: "vite --config e2e/harness/vite.config.ts",
      url: HARNESS_URL,
      reuseExistingServer: !process.env.CI,
    },
    // Never reused: a preview server caches its file list and would serve a stale build.
    {
      command: "vitepress preview docs --port 4317",
      url: SITE_URL,
      reuseExistingServer: false,
    },
  ],
});

export default config;
