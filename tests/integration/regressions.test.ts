import { afterEach, describe, expect, it } from "vitest";
import EOTranslator from "../../src/index";



afterEach(() => {
  delete (Object.prototype as Record<string, unknown>).polluted;
  delete (Object.prototype as Record<string, unknown>).victim;
});

describe("parameter values", () => {
  it.each(["$&", "$1", "$$", "$`", "$'", "$<name>"])("insert %j literally", (value) => {
    const translator = new EOTranslator({ en: { greet: "Hi {name}!" } }, "en");

    expect(translator.translate("greet", { params: { name: value } })).toBe(`Hi ${value}!`);
  });
});

describe("placeholders in parameter values", () => {
  it("are not replaced by other parameters", () => {
    const translator = new EOTranslator({ en: { msg: "Hi {user}, code {code}" } }, "en");

    expect(translator.translate("msg", { params: { user: "{code}", code: "1234" } })).toBe("Hi {code}, code 1234");
    expect(translator.translate("msg", { params: { code: "{user}", user: "Nami" } })).toBe("Hi Nami, code {user}");
  });

  it("are not replaced by the same parameter", () => {
    const translator = new EOTranslator({ en: { msg: "{a}" } }, "en");

    expect(translator.translate("msg", { params: { a: "{a}{a}" } })).toBe("{a}{a}");
  });

  it("leave empty braces alone without parameters", () => {
    const translator = new EOTranslator({ en: { msg: "Set {} and {name}" } }, "en");

    expect(translator.translate("msg")).toBe("Set {} and {name}");
    expect(translator.translate("msg", { params: {} })).toBe("Set {} and {name}");
  });

  it("match a name that starts with another one in full", () => {
    const translator = new EOTranslator({ en: { msg: "{a} {ab} {abc}" } }, "en");

    expect(translator.translate("msg", { params: { a: 1, abc: 3, ab: 2 } })).toBe("1 2 3");
  });
});

describe("namespaces and non-text values", () => {
  it("fall back instead of translating a namespace to \"[object Object]\"", () => {
    const translator = new EOTranslator({ en: { nav: { home: "Home" } } }, "en");

    expect(translator.translate("nav")).toBe("nav");
    expect(translator.translate("nav", { fallback: "Navigation" })).toBe("Navigation");
  });

  it("fall back for functions, symbols and arrays", () => {
    const translator = new EOTranslator({ en: { fn: () => "x", sym: Symbol("x"), list: ["a"], nested: { list: ["a"] } } }, "en");

    expect(translator.translate("fn")).toBe("fn");
    expect(translator.translate("sym")).toBe("sym");
    expect(translator.translate("list")).toBe("list");
    expect(translator.translate("nested.list")).toBe("nested.list");
  });

  it("translate bigints", () => {
    const translator = new EOTranslator({ en: { big: 10n } }, "en");

    expect(translator.translate("big")).toBe("10");
  });
});

describe("inherited properties", () => {
  it.each(["nav.constructor", "nav.__proto__", "nav.toString", "nav.hasOwnProperty"])("are not translated by %j", (key) => {
    const translator = new EOTranslator({ en: { nav: { home: "Home" } } }, "en");

    expect(translator.translate(key)).toBe(key);
  });

  it("are not translated through an inherited namespace", () => {
    const translator = new EOTranslator({ en: Object.create({ nav: { home: "Home" } }) }, "en");

    expect(translator.translate("nav.home")).toBe("nav.home");
  });
});

describe("prototype pollution", () => {
  it("add does not write to Object.prototype through __proto__", () => {
    const translator = new EOTranslator({ en: {} }, "en");

    translator.add("en", "__proto__.polluted", "yes");

    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(translator.translate("__proto__.polluted")).toBe("yes");
  });

  it("add does not write through constructor.prototype", () => {
    const translator = new EOTranslator({ en: {} }, "en");

    translator.add("en", "constructor.prototype.polluted", "yes");

    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(translator.translate("constructor.prototype.polluted")).toBe("yes");
  });

  it("add keeps a __proto__ language as a regular language", () => {
    const dict: EOTranslator.TDictionary = {};
    const translator = new EOTranslator(dict);

    translator.add("__proto__", "greet", "Hi");

    expect(Object.getPrototypeOf(dict)).toBe(Object.prototype);
    expect(Object.hasOwn(dict, "__proto__")).toBe(true);
    expect(translator.translate("greet", { lang: "__proto__" })).toBe("Hi");
  });

  it("add stores a __proto__ translation as a regular key", () => {
    const translator = new EOTranslator({ en: {} }, "en");

    translator.add("en", "__proto__", "Proto");

    expect(Object.getPrototypeOf(translator.dictionary.en)).toBe(Object.prototype);
    expect(translator.translate("__proto__")).toBe("Proto");
  });

  it("add does not reuse an inherited namespace", () => {
    const inherited = { nav: { home: "Home" } };
    const translator = new EOTranslator({ en: Object.create(inherited) }, "en");

    translator.add("en", "nav.about", "About");

    expect(inherited).toEqual({ nav: { home: "Home" } });
    expect(translator.translate("nav.about")).toBe("About");
  });

  it("remove does not delete from Object.prototype through __proto__", () => {
    (Object.prototype as Record<string, unknown>).victim = "kept";

    const translator = new EOTranslator({ en: {} }, "en");

    translator.remove("en", "__proto__.victim");
    translator.remove("en", "victim");

    expect(({} as Record<string, unknown>).victim).toBe("kept");
  });

  it("remove deletes an own __proto__ translation", () => {
    const translator = new EOTranslator({ en: {} }, "en");

    translator.add("en", "__proto__", "Proto");
    translator.remove("en", "__proto__");

    expect(Object.hasOwn(translator.dictionary.en!, "__proto__")).toBe(false);
  });
});

describe("replacing the dictionary", () => {
  it("falls back to the default language when the new dictionary lacks the active one", () => {
    const translator = new EOTranslator({ fr: { greet: "Bonjour" } }, "fr");

    translator.dictionary = { es: { greet: "Hola" }, en: { greet: "Hello" } };

    expect(translator.language).toBe("en");
    expect(translator.translate("greet")).toBe("Hello");
  });

  it("falls back to the new dictionary's first language without \"en\"", () => {
    const translator = new EOTranslator({ fr: {} }, "fr");

    translator.dictionary = { es: {}, de: {} };

    expect(translator.language).toBe("es");
  });

  it("keeps the active language when the new dictionary has it", () => {
    const translator = new EOTranslator({ en: {}, fr: {} }, "fr");

    translator.dictionary = { en: {}, fr: { greet: "Salut" } };

    expect(translator.language).toBe("fr");
  });

  it("keeps the active language with an empty dictionary", () => {
    const translator = new EOTranslator({ fr: {} }, "fr");

    translator.dictionary = {};

    expect(translator.language).toBe("fr");
  });

  it("keeps an empty active language", () => {
    const translator = new EOTranslator({ fr: {} }, "fr");

    translator.language = "";
    translator.dictionary = { en: {} };

    expect(translator.language).toBe("");
  });
});

describe("argument types", () => {
  it.each([
    ["a number", 5, "number"],
    ["null", null, "object"],
    ["an object", {}, "object"],
  ])("translate rejects %s as the key", (_, key, type) => {
    const translator = new EOTranslator({ en: {} }, "en");

    expect(() => translator.translate(key as unknown as string)).toThrow(new TypeError(`[EOTranslatorJS] Invalid translation key, expected "string" but received "${type}".`));
  });

  it("translate still accepts no key", () => {
    expect(new EOTranslator({ en: { "": "Empty" } }, "en").translate()).toBe("Empty");
  });

  it.each(["add", "remove"] as const)("%s rejects a non-string language or key", (method) => {
    const translator = new EOTranslator({ en: { a: "b" } }, "en");
    const call = (lang: unknown, key: unknown): void => (translator[method] as (...args: unknown[]) => void)(lang, key, "x");

    expect(() => call(1, "a")).toThrow(new TypeError("[EOTranslatorJS] Invalid language key, expected \"string\" but received \"number\"."));
    expect(() => call("en", null)).toThrow(new TypeError("[EOTranslatorJS] Invalid translation key, expected \"string\" but received \"object\"."));
    expect(translator.dictionary).toEqual({ en: { a: "b" } });
  });
});
