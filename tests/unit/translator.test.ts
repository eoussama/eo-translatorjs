import { describe, expect, it } from "vitest";
import EOTranslator from "../../src/index";



const DICT: EOTranslator.TDictionary = {
  en: { greeting: "Hello!" },
  fr: { greeting: "Bonjour!" },
  es: { greeting: "Hola!" },
  br: { greeting: "Jola!" },
};

describe("constructor", () => {
  it("creates a translator with a valid dictionary", () => {
    const translator = new EOTranslator(DICT);

    expect(translator.dictionary).toEqual(DICT);
  });

  it("sets the specified language as default", () => {
    const translator = new EOTranslator(DICT, "fr");

    expect(translator.language).toBe("fr");
  });

  it("defaults to \"en\" when no language is specified and there is no document", () => {
    expect(typeof document).toBe("undefined");
    expect(new EOTranslator(DICT).language).toBe("en");
    expect(new EOTranslator(DICT, "").language).toBe("en");
  });

  it("accepts an empty dictionary", () => {
    const translator = new EOTranslator({});

    expect(translator.dictionary).toEqual({});
  });

  it("throws when the language key does not exist in the dictionary", () => {
    expect(() => new EOTranslator(DICT, "ar")).toThrow("[EOTranslatorJS] Invalid language key, \"ar\" does not exist in the passed dictionary.");
  });

  it("throws when the language key does not exist in an empty dictionary", () => {
    expect(() => new EOTranslator({}, "ar")).toThrow("[EOTranslatorJS] Invalid language key, \"ar\" does not exist in the passed dictionary.");
  });

  it.each([42, 0])("throws when the number %d is passed as the language", (lang) => {
    expect(() => new EOTranslator(DICT, lang as unknown as string)).toThrow(new TypeError("[EOTranslatorJS] Invalid language key, expected \"string\" but received \"number\"."));
  });

  it.each([
    ["a boolean", true],
    ["a number", 1],
    ["a string", "en"],
    ["null", null],
    ["undefined", undefined],
    ["an array", ["en"]],
  ])("throws when %s is passed as the dictionary", (_, dict) => {
    expect(() => new EOTranslator(dict as unknown as EOTranslator.TDictionary)).toThrow(new Error("[EOTranslatorJS] Invalid dictionary object."));
  });
});

describe("dictionary", () => {
  it("can be replaced at runtime", () => {
    const translator = new EOTranslator(DICT);
    const dict = { de: { greeting: "Hallo!" } };

    translator.dictionary = dict;

    expect(translator.dictionary).toBe(dict);
  });

  it.each([
    ["an array", []],
    ["null", null],
    ["a string", "en"],
  ])("throws when %s is assigned", (_, dict) => {
    const translator = new EOTranslator(DICT);

    expect(() => {
      translator.dictionary = dict as unknown as EOTranslator.TDictionary;
    }).toThrow(new Error("[EOTranslatorJS] Invalid dictionary object."));
    expect(translator.dictionary).toEqual(DICT);
  });
});

describe("language", () => {
  it("can be changed at runtime", () => {
    const translator = new EOTranslator(DICT);

    translator.language = "br";

    expect(translator.language).toBe("br");
  });

  it("throws when an unknown language is set", () => {
    const translator = new EOTranslator(DICT, "es");

    expect(() => {
      translator.language = "ar";
    }).toThrow(new Error("[EOTranslatorJS] Invalid language key, \"ar\" does not exist in the dictionary."));
    expect(translator.language).toBe("es");
  });

  it("throws when a non-string is set", () => {
    const translator = new EOTranslator(DICT);

    expect(() => {
      translator.language = 99 as unknown as string;
    }).toThrow(new TypeError("[EOTranslatorJS] Invalid language key, expected \"string\" but received \"number\"."));
  });

  it("accepts any language while the dictionary is empty", () => {
    const translator = new EOTranslator({});

    translator.language = "ar";

    expect(translator.language).toBe("ar");
  });

  it("accepts an empty language", () => {
    const translator = new EOTranslator(DICT);

    translator.language = "";

    expect(translator.language).toBe("");
  });

  it("rejects inherited property names", () => {
    const translator = new EOTranslator(DICT);

    expect(() => {
      translator.language = "toString";
    }).toThrow("[EOTranslatorJS]");
  });
});

describe("languages", () => {
  it("lists every top-level language key", () => {
    expect(new EOTranslator(DICT).languages).toEqual(["en", "fr", "es", "br"]);
  });

  it("is empty for an empty dictionary", () => {
    expect(new EOTranslator({}).languages).toEqual([]);
  });

  it("follows dictionary replacements", () => {
    const translator = new EOTranslator(DICT);

    translator.dictionary = { de: {} };

    expect(translator.languages).toEqual(["de"]);
  });
});

describe("isValidLanguage", () => {
  it("is true for an existing language", () => {
    expect(new EOTranslator(DICT).isValidLanguage("fr")).toBe(true);
  });

  it("is false for a missing language", () => {
    expect(new EOTranslator(DICT).isValidLanguage("ar")).toBe(false);
  });

  it("is false for inherited property names", () => {
    expect(new EOTranslator(DICT).isValidLanguage("toString")).toBe(false);
  });
});

describe("translateDOM without a document", () => {
  it("does nothing when no container is passed", () => {
    expect(typeof document).toBe("undefined");
    expect(() => new EOTranslator(DICT).translateDOM()).not.toThrow();
  });
});
