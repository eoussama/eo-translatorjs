// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import EOTranslator from "../../src/index";



const DICT: EOTranslator.TDictionary = {
  en: { greeting: "Hello!" },
  fr: { greeting: "Bonjour!" },
  es: { greeting: "Hola!" },
  br: { greeting: "Jola!" },
};

/**
 * @description
 * Render markup into the document body and return the element with the `target` id
 *
 * @param html - The markup to render
 * @returns The target element
 */
function render(html: string): HTMLElement {
  document.body.innerHTML = html;

  return document.getElementById("target")!;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("lang");
});

describe("constructor in a browser", () => {
  it("defaults to the document language", () => {
    document.documentElement.lang = "fr";

    expect(new EOTranslator(DICT).language).toBe("fr");
  });

  it("defaults to \"en\" when the document has no language", () => {
    expect(new EOTranslator(DICT).language).toBe("en");
  });

  it("prefers the specified language over the document language", () => {
    document.documentElement.lang = "fr";

    expect(new EOTranslator(DICT, "es").language).toBe("es");
  });
});

describe("translateElement", () => {
  it("translates a single element", () => {
    const target = render("<p id=\"target\" eo-translator=\"greeting\"></p>");

    new EOTranslator(DICT).translateElement(target);

    expect(target.textContent).toBe("Hello!");
  });

  it("translates to a language that is not the default one", () => {
    const target = render("<p id=\"target\" eo-translator=\"greeting\"></p>");

    new EOTranslator(DICT).translateElement(target, "fr");

    expect(target.textContent).toBe("Bonjour!");
  });

  it("falls back to the specified value for an unknown key", () => {
    const target = render("<p id=\"target\" eo-translator=\"invalidKey\" eo-translator-fallback=\"Fallback value\"></p>");

    new EOTranslator(DICT).translateElement(target);

    expect(target.textContent).toBe("Fallback value");
  });

  it("falls back to the key without a fallback attribute", () => {
    const target = render("<p id=\"target\" eo-translator=\"invalidKey\">Original</p>");

    new EOTranslator(DICT).translateElement(target);

    expect(target.textContent).toBe("invalidKey");
  });

  it("uses the text content as the key when the attribute is empty", () => {
    const target = render("<p id=\"target\" eo-translator>greeting</p>");

    new EOTranslator(DICT, "es").translateElement(target);

    expect(target.textContent).toBe("Hola!");
  });

  it("uses the inner HTML as the key when the element has no text", () => {
    const target = render("<p id=\"target\" eo-translator><br></p>");

    new EOTranslator({ en: { "<br>": "Line break" } }).translateElement(target);

    expect(target.textContent).toBe("Line break");
  });

  it("uses the empty key for an empty element", () => {
    const target = render("<p id=\"target\" eo-translator></p>");

    new EOTranslator({ en: { "": "Empty" } }).translateElement(target);

    expect(target.textContent).toBe("Empty");
  });

  it("embeds parameters", () => {
    const target = render("<p id=\"target\" eo-translator=\"greeting\" eo-translator-params='{\"name\": \"Luffy\"}'></p>");

    new EOTranslator({ en: { greeting: "Hello, {name}!" } }).translateElement(target);

    expect(target.textContent).toBe("Hello, Luffy!");
  });

  it.each([
    ["invalid JSON", "{name"],
    ["null", "null"],
  ])("ignores %s parameters", (_, params) => {
    const target = render(`<p id="target" eo-translator="greeting" eo-translator-params='${params}'></p>`);

    new EOTranslator({ en: { greeting: "Hello, {name}!" } }).translateElement(target);

    expect(target.textContent).toBe("Hello, {name}!");
  });

  it("renders HTML when eo-translator-html is true", () => {
    const target = render("<p id=\"target\" eo-translator=\"greeting\" eo-translator-html=\"true\"></p>");

    new EOTranslator({ en: { greeting: "Hello <b>World</b>!" } }).translateElement(target);

    expect(target.innerHTML).toBe("Hello <b>World</b>!");
    expect(target.querySelector("b")).not.toBeNull();
  });

  it.each(["false", "", "TRUE"])("renders text when eo-translator-html is %j", (value) => {
    const target = render(`<p id="target" eo-translator="greeting" eo-translator-html="${value}"></p>`);

    new EOTranslator({ en: { greeting: "Hello <b>World</b>!" } }).translateElement(target);

    expect(target.textContent).toBe("Hello <b>World</b>!");
    expect(target.querySelector("b")).toBeNull();
  });

  it("leaves elements without the eo-translator attribute untouched", () => {
    const target = render("<p id=\"target\" data-key=\"greeting\">Original</p>");

    new EOTranslator(DICT).translateElement(target);

    expect(target.textContent).toBe("Original");
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
  ])("does nothing when passed %s", (_, element) => {
    expect(() => new EOTranslator(DICT).translateElement(element)).not.toThrow();
  });
});

describe("translateDOM", () => {
  it("translates every marked element in a container", () => {
    render("<div id=\"container\"><span eo-translator=\"greeting\" id=\"a\"></span><span eo-translator=\"greeting\" id=\"b\"></span></div><span eo-translator=\"greeting\" id=\"outside\">Outside</span>");

    new EOTranslator(DICT, "fr").translateDOM(document.getElementById("container"));

    expect(document.getElementById("a")!.textContent).toBe("Bonjour!");
    expect(document.getElementById("b")!.textContent).toBe("Bonjour!");
    expect(document.getElementById("outside")!.textContent).toBe("Outside");
  });

  it("respects a language override", () => {
    const target = render("<span id=\"target\" eo-translator=\"greeting\"></span>");
    const translator = new EOTranslator(DICT, "en");

    translator.translateDOM(document.body, "es");

    expect(target.textContent).toBe("Hola!");
    expect(translator.language).toBe("en");
  });

  it("uses the active language without an override", () => {
    const target = render("<span id=\"target\" eo-translator=\"greeting\"></span>");

    new EOTranslator(DICT, "br").translateDOM(document.body);

    expect(target.textContent).toBe("Jola!");
  });

  it.each([
    ["no container", undefined],
    ["a null container", null],
  ])("translates the whole document with %s", (_, container) => {
    const target = render("<span id=\"target\" eo-translator=\"greeting\"></span>");

    new EOTranslator(DICT, "fr").translateDOM(container);

    expect(target.textContent).toBe("Bonjour!");
  });
});
