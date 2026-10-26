import { describe, expect, it } from "vitest";
import EOTranslator from "../../src/index";



describe("translate", () => {
  it("translates a key", () => {
    const translator = new EOTranslator({ en: { greet: "Hello!" } });

    expect(translator.translate("greet")).toBe("Hello!");
  });

  it("translates a nested key", () => {
    const translator = new EOTranslator({ en: { greet: { morning: "Good morning!", evening: "Good evening!" } } });

    expect(translator.translate("greet.evening")).toBe("Good evening!");
  });

  it("translates a deeply nested key", () => {
    const translator = new EOTranslator({ en: { a: { b: { c: { d: "Deep!" } } } } });

    expect(translator.translate("a.b.c.d")).toBe("Deep!");
  });

  it("ignores empty fragments in a nested key", () => {
    const translator = new EOTranslator({ en: { a: { b: "Deep!" } } });

    expect(translator.translate(".a..b.")).toBe("Deep!");
  });

  it("looks up a single-fragment key with surrounding dots as written", () => {
    const translator = new EOTranslator({ en: { "greet": "Hello!", "greet.": "Dotted!" } });

    expect(translator.translate("greet.")).toBe("Dotted!");
    expect(translator.translate(".greet")).toBe(".greet");
  });

  it("translates with an explicit language override", () => {
    const translator = new EOTranslator({ en: { greet: "Hello!" }, fr: { greet: "Bonjour!" } }, "en");

    expect(translator.translate("greet", { lang: "fr" })).toBe("Bonjour!");
    expect(translator.language).toBe("en");
  });

  it("uses the active language when the override is empty", () => {
    const translator = new EOTranslator({ en: { greet: "Hello!" }, fr: { greet: "Bonjour!" } }, "fr");

    expect(translator.translate("greet", { lang: "" })).toBe("Bonjour!");
  });

  it("translates the empty key when called without arguments", () => {
    expect(new EOTranslator({ en: { "": "Empty" } }).translate()).toBe("Empty");
    expect(new EOTranslator({ en: {} }).translate()).toBe("");
  });

  describe("fallback", () => {
    it("is the key itself by default", () => {
      const translator = new EOTranslator({ en: { greet: "Hello!" } });

      expect(translator.translate("missing.key")).toBe("missing.key");
      expect(translator.translate("missing")).toBe("missing");
    });

    it("can be specified", () => {
      const translator = new EOTranslator({ en: { greet: "Hello!" } });

      expect(translator.translate("missing.key", { fallback: "Fallback value" })).toBe("Fallback value");
    });

    it("can be an empty string", () => {
      const translator = new EOTranslator({ en: { greet: "Hello!" } });

      expect(translator.translate("missing", { fallback: "" })).toBe("");
    });

    it("is used when the language does not exist", () => {
      const translator = new EOTranslator({ en: { greet: "Hello!" } });

      expect(translator.translate("greet", { lang: "ar", fallback: "N/A" })).toBe("N/A");
      expect(translator.translate("greet", { lang: "toString" })).toBe("greet");
    });

    it("is used when the active language is not in the dictionary", () => {
      const translator = new EOTranslator({});

      translator.language = "fr";
      translator.dictionary = { en: { greet: "Hello!" } };

      expect(translator.translate("greet")).toBe("greet");
    });

    it("is used for inherited property names", () => {
      const translator = new EOTranslator({ en: { greet: "Hello!" } });

      expect(translator.translate("toString")).toBe("toString");
      expect(translator.translate("greet.length")).toBe("greet.length");
    });

    it("is used when a nested key goes through a translation or a null value", () => {
      const translator = new EOTranslator({ en: { greet: "Hello!", none: null } });

      expect(translator.translate("greet.morning")).toBe("greet.morning");
      expect(translator.translate("none.morning")).toBe("none.morning");
    });

    it.each([
      ["null", null],
      ["undefined", undefined],
      ["false", false],
      ["an empty string", ""],
    ])("is used when the translation is %s", (_, value) => {
      const translator = new EOTranslator({ en: { key: value, nested: { key: value } } });

      expect(translator.translate("key")).toBe("key");
      expect(translator.translate("nested.key")).toBe("nested.key");
    });
  });

  it.each([
    ["zero", 0, "0"],
    ["true", true, "true"],
    ["a number", 42, "42"],
  ])("stringifies %s translations", (_, value, expected) => {
    const translator = new EOTranslator({ en: { key: value, nested: { key: value } } });

    expect(translator.translate("key")).toBe(expected);
    expect(translator.translate("nested.key")).toBe(expected);
  });

  describe("params", () => {
    it("replaces a placeholder", () => {
      const translator = new EOTranslator({ en: { greet: "Hello {name}!" } });

      expect(translator.translate("greet", { params: { name: "Luffy" } })).toBe("Hello Luffy!");
    });

    it("replaces several placeholders", () => {
      const translator = new EOTranslator({ en: { msg: "Hello {first} {last}!" } });

      expect(translator.translate("msg", { params: { first: "Monkey", last: "D. Luffy" } })).toBe("Hello Monkey D. Luffy!");
    });

    it("replaces every occurrence of a placeholder", () => {
      const translator = new EOTranslator({ en: { msg: "{name}, {name}!" } });

      expect(translator.translate("msg", { params: { name: "Zoro" } })).toBe("Zoro, Zoro!");
    });

    it("stringifies parameter values", () => {
      const translator = new EOTranslator({ en: { msg: "{count} {flag} {none}" } });

      expect(translator.translate("msg", { params: { count: 3, flag: false, none: null } })).toBe("3 false null");
    });

    it("leaves unknown placeholders in place", () => {
      const translator = new EOTranslator({ en: { msg: "Hello {name}!" } });

      expect(translator.translate("msg", { params: { other: "Nami" } })).toBe("Hello {name}!");
      expect(translator.translate("msg")).toBe("Hello {name}!");
    });

    it("matches placeholder names literally", () => {
      const translator = new EOTranslator({ en: { msg: "{a.b} {axb} {a+} {aa}" } });

      expect(translator.translate("msg", { params: { "a.b": "dot", "a+": "plus" } })).toBe("dot {axb} plus {aa}");
    });

    it("does not apply params to the fallback", () => {
      const translator = new EOTranslator({ en: {} });

      expect(translator.translate("{name}", { params: { name: "Luffy" } })).toBe("{name}");
    });
  });
});
