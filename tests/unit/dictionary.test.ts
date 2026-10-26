import { describe, expect, it } from "vitest";
import EOTranslator from "../../src/index";



describe("add", () => {
  it("adds a translation to a new language", () => {
    const translator = new EOTranslator({});

    translator.add("en", "translation", "Hello, I'm a translation");

    expect(translator.dictionary).toEqual({ en: { translation: "Hello, I'm a translation" } });
  });

  it("keeps the other translations of an existing language", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!" } });

    translator.add("en", "bye", "Goodbye!");

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!", bye: "Goodbye!" } });
  });

  it("updates an existing translation", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!" } });

    translator.add("en", "greet", "Hi there!");

    expect(translator.dictionary).toEqual({ en: { greet: "Hi there!" } });
  });

  it("creates the namespaces of a nested key", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!" } });

    translator.add("en", "nested.a.b.c", "...");

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!", nested: { a: { b: { c: "..." } } } } });
  });

  it("adds to existing namespaces", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!", nested: { a: "..." } } });

    translator.add("en", "nested.b", "..");
    translator.add("en", "nested.c.d", ".");

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!", nested: { a: "...", b: "..", c: { d: "." } } } });
  });

  it("updates a nested translation", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!", nested: { a: { b: { c: "..." } } } } });

    translator.add("en", "nested.a.b.c", ".");

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!", nested: { a: { b: { c: "." } } } } });
  });

  it("replaces a translation that is in the way of a nested key", () => {
    const translator = new EOTranslator({ en: { nested: "text", empty: "" } });

    translator.add("en", "nested.a", "...");
    translator.add("en", "empty.a", "..");

    expect(translator.dictionary).toEqual({ en: { nested: { a: "..." }, empty: { a: ".." } } });
  });

  it("creates entries that stay writable, enumerable and deletable", () => {
    const dict: EOTranslator.TDictionary = {};
    const translator = new EOTranslator(dict);

    translator.add("en", "nav.home", "Home");

    const en = dict.en as { nav: Record<string, unknown> };

    en.nav.home = "House";
    expect(translator.translate("nav.home", { lang: "en" })).toBe("House");
    expect(Object.keys(dict)).toEqual(["en"]);
    expect(delete en.nav.home).toBe(true);
  });

  it("ignores empty key fragments", () => {
    const translator = new EOTranslator({ en: {} });

    translator.add("en", ".a..b.", "...");

    expect(translator.dictionary).toEqual({ en: { a: { b: "..." } } });
  });

  it.each(["", "."])("does nothing for the empty key %j", (key) => {
    const translator = new EOTranslator({});

    translator.add("en", key, "...");

    expect(translator.dictionary).toEqual({});
  });

  it("does not reuse an inherited property as the language", () => {
    const dict: EOTranslator.TDictionary = {};
    const translator = new EOTranslator(dict);

    translator.add("toString", "a", "...");

    expect(Object.hasOwn(dict, "toString")).toBe(true);
    expect(dict.toString).toEqual({ a: "..." });
  });
});

describe("remove", () => {
  it("removes a translation", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!" } });

    translator.remove("en", "greet");

    expect(translator.dictionary).toEqual({ en: {} });
  });

  it("removes a nested translation", () => {
    const translator = new EOTranslator({ en: { nested: { a: "...", b: ".." } } });

    translator.remove("en", "nested.a");

    expect(translator.dictionary).toEqual({ en: { nested: { b: ".." } } });
  });

  it("ignores empty key fragments", () => {
    const translator = new EOTranslator({ en: { nested: { a: "...", b: ".." } } });

    translator.remove("en", ".nested..a.");

    expect(translator.dictionary).toEqual({ en: { nested: { b: ".." } } });
  });

  it("does nothing for a missing key", () => {
    const translator = new EOTranslator({ en: { greet: "Hello there!", nested: { a: "...", b: "..", c: "." } } });

    translator.remove("en", "nested.ab");

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!", nested: { a: "...", b: "..", c: "." } } });
  });

  it.each([
    ["a missing namespace", "missing.a"],
    ["a translation used as a namespace", "greet.a"],
    ["through a translation", "greet.a.b"],
    ["through a null value", "none.a.b"],
    ["into a translation's characters", "greet.0"],
    ["a null value used as a namespace", "none.a"],
    ["an empty key", ""],
  ])("does nothing when walking %s", (_, key) => {
    const translator = new EOTranslator({ en: { greet: "Hello there!", none: null } });

    translator.remove("en", key);

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!", none: null } });
  });

  it.each(["greet", "nested.greet"])("does nothing for a missing language with the key %j", (key) => {
    const translator = new EOTranslator({ en: { greet: "Hello there!" } });

    translator.remove("fr", key);

    expect(translator.dictionary).toEqual({ en: { greet: "Hello there!" } });
  });

  it("does not remove a translation literally named \"undefined\" for an empty key", () => {
    const translator = new EOTranslator({ en: { undefined: "Kept" } });

    translator.remove("en", ".");

    expect(translator.dictionary).toEqual({ en: { undefined: "Kept" } });
  });

  it("does not walk into or delete from function values", () => {
    const fn = Object.assign(() => {}, { a: "Kept", inner: { b: "Kept" } });
    const translator = new EOTranslator({ en: { fn } });

    translator.remove("en", "fn.a");
    translator.remove("en", "fn.inner.b");

    expect(fn.a).toBe("Kept");
    expect(fn.inner).toEqual({ b: "Kept" });
  });

  it("does nothing for an inherited language", () => {
    const inherited = { en: { greet: "Hello there!" } };
    const translator = new EOTranslator(Object.create(inherited) as EOTranslator.TDictionary);

    translator.remove("en", "greet");

    expect(inherited).toEqual({ en: { greet: "Hello there!" } });
  });
});
