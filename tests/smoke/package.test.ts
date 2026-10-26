import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";



const require = createRequire(import.meta.url);

describe("built package", () => {
  it("exposes the main entry as ESM", async () => {
    const mod = await import("eo-translatorjs");

    expect(typeof mod.default).toBe("function");
  });

  it("exposes the class itself as the CommonJS export", async () => {
    const cjs = require("eo-translatorjs") as typeof import("eo-translatorjs").default;
    const esm = await import("eo-translatorjs");

    expect(typeof cjs).toBe("function");
    expect(cjs.name).toBe(esm.default.name);
  });

  it("translates a string end to end with the built code", async () => {
    const { default: EOTranslator } = await import("eo-translatorjs");
    const translator = new EOTranslator({ en: { greeting: "Hello {name}" } }, "en");

    expect(translator.translate("greeting", { params: { name: "World" } })).toBe("Hello World");
  });
});
