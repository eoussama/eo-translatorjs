import type { UserConfig, UserConfigExport } from "tsdown";
import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };



const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} | ${pkg.homepage} */`;

const shared: UserConfig = {
  outDir: "dist",
  target: "es2022",
  banner,
};

/**
 * Self-contained browser bundles: every dependency is inlined and the output is minified.
 */
const browser: UserConfig = {
  ...shared,
  entry: { index: "src/index.ts" },
  platform: "browser",
  minify: true,
  sourcemap: true,
  clean: false,
  dts: false,
  deps: { alwaysBundle: [/.*/] },
};



const config: UserConfigExport = defineConfig([
  // Modern ESM (`.mjs` + `.d.mts`) and CommonJS (`.cjs` + `.d.cts`) for bundlers and Node.js.
  {
    ...shared,
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    platform: "neutral",
    fixedExtension: true,
    sourcemap: true,
    dts: true,
    clean: true,
    publint: true,
    attw: { profile: "node16", level: "error" },
  },

  // Minified ESM for `<script type="module">` and CDNs.
  {
    ...browser,
    format: "esm",
    outExtensions: () => ({ js: ".browser.mjs" }),
  },

  // UMD (AMD, CommonJS or the `EOTranslator` global).
  {
    ...browser,
    format: "umd",
    globalName: "EOTranslator",
  },

  // IIFE for a classic `<script>` tag, exposing the `EOTranslator` global.
  {
    ...browser,
    format: "iife",
    globalName: "EOTranslator",
  },
]);

export default config;
