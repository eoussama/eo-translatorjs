import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: __dirname,
  // Serves the built bundles at the root, for the browser global scenarios; run `pnpm build` first.
  publicDir: resolve(__dirname, "../../dist"),
  resolve: {
    alias: {
      "@eo-translatorjs": resolve(__dirname, "../../src/index.ts"),
    },
  },
  server: {
    port: 5175,
  },
});
