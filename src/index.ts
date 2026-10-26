/**
 * @description
 * The translator class — manages a multilingual dictionary and
 * provides methods to translate strings and DOM elements.
 */
class EOTranslator {
  // #region Properties

  private _dictionary!: EOTranslator.TDictionary;

  private _language!: string;

  /**
   * @description
   * Sets the translation dictionary.
   *
   * The dictionary must be a plain object whose top-level keys are language
   * codes and whose values are plain objects mapping translation keys to
   * translated strings (or further nested objects for namespaced keys).
   *
   * When the new dictionary lacks the active language, the language falls
   * back to the default one, picked as in the constructor.
   *
   * @param dict The new dictionary value
   * @throws {Error} When the value is not a valid plain object
   */
  set dictionary(dict: EOTranslator.TDictionary) {
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
      throw new Error("[EOTranslatorJS] Invalid dictionary object.");
    }

    this._dictionary = dict;

    if (this._language !== undefined && !this.acceptsLanguage(this._language)) {
      this._language = this.defaultLanguage();
    }
  }

  /**
   * @description
   * Gets the current translation dictionary.
   *
   * @returns The current dictionary
   */
  get dictionary(): EOTranslator.TDictionary {
    return this._dictionary;
  }

  /**
   * @description
   * Sets the active language.
   *
   * The language must be a string that exists as a top-level key in the
   * dictionary, unless the dictionary is empty or the string itself is empty.
   *
   * @param lang The new language value
   * @throws {TypeError} When the value is not a string
   * @throws {Error} When the language key does not exist in the dictionary
   */
  set language(lang: string) {
    if (typeof lang !== "string") {
      throw new TypeError(`[EOTranslatorJS] Invalid language key, expected "string" but received "${typeof lang}".`);
    }

    if (!this.acceptsLanguage(lang)) {
      throw new Error(`[EOTranslatorJS] Invalid language key, "${lang}" does not exist in the dictionary.`);
    }

    this._language = lang;
  }

  /**
   * @description
   * Gets the active language key.
   *
   * @returns The current language
   */
  get language(): string {
    return this._language;
  }

  /**
   * @description
   * Gets the list of all language keys present in the dictionary.
   *
   * @returns The list of available language keys
   */
  get languages(): string[] {
    return Object.keys(this._dictionary);
  }

  // #endregion

  // #region Constructor

  /**
   * @description
   * Instantiates a translator object.
   *
   * @param dict The translation dictionary
   * @param lang The default language key. When omitted, the first of the
   *   document's `lang` attribute (in a browser) and `"en"` that the dictionary
   *   has is used, then the dictionary's first language. With an empty
   *   dictionary, the document's `lang` attribute or `"en"` is used.
   *
   * @throws {Error} When the dictionary is not a valid plain object
   * @throws {TypeError} When the language is not a string
   * @throws {Error} When the language key does not exist in a non-empty dictionary
   */
  constructor(dict: EOTranslator.TDictionary, lang: string = "") {
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
      throw new Error("[EOTranslatorJS] Invalid dictionary object.");
    }

    if (typeof lang !== "string") {
      throw new TypeError(`[EOTranslatorJS] Invalid language key, expected "string" but received "${typeof lang}".`);
    }

    if (!Object.hasOwn(dict, lang) && Object.keys(dict).length > 0 && lang.length > 0) {
      throw new Error(`[EOTranslatorJS] Invalid language key, "${lang}" does not exist in the passed dictionary.`);
    }

    this.dictionary = dict;
    this.language = lang || this.defaultLanguage();
  }

  // #endregion

  // #region Methods

  /**
   * @description
   * Checks whether a language can be active: the empty language, any language
   * of an empty dictionary, or a language of the dictionary.
   *
   * @param lang The language key to check
   * @returns `true` when the language can be active
   */
  private acceptsLanguage(lang: string): boolean {
    return lang.length === 0 || this.languages.length === 0 || this.isValidLanguage(lang);
  }

  /**
   * @description
   * Picks the language to use when none is passed to the constructor.
   *
   * @returns The document's `lang` attribute or `"en"`, whichever the
   *   dictionary has first, then the dictionary's first language
   */
  private defaultLanguage(): string {
    const documentLang = typeof document === "object" ? document.documentElement.lang : "";
    const [first] = this.languages;

    if (first === undefined) {
      return documentLang || "en";
    }

    return [documentLang, "en"].find(candidate => this.isValidLanguage(candidate)) ?? first;
  }

  /**
   * @description
   * Translates a key against the active (or specified) language.
   *
   * Keys may be dot-separated to access nested translations
   * (e.g. `"section.title"`). When no matching translation is found the
   * fallback value is returned — which defaults to the key itself.
   *
   * @param input The translation key (supports dot notation)
   * @param options Translation options
   * @returns The translated string, or the fallback value
   * @throws {TypeError} When the key is not a string
   */
  translate(input: string = "", options: EOTranslator.TTranslateOptions = {}): string {
    assertString(input, "translation key");

    const language = options.lang || this.language;
    const fallback = options.fallback !== undefined ? options.fallback : input;
    const params = options.params || {};
    const frags = input.split(".").filter(frag => frag.length > 0);
    const entries = ownValue(this.dictionary, language);
    const output = frags.length > 1 ? frags.reduce(ownValue, entries) : ownValue(entries, input);

    return isTranslation(output)
      ? assignParams(String(output), params)
      : fallback;
  }

  /**
   * @description
   * Translates the content of a single DOM element.
   *
   * The element must carry the `eo-translator` attribute whose value is the
   * translation key. Optional companion attributes:
   *
   * | Attribute | Description |
   * |---|---|
   * | `eo-translator` | _(required)_ The translation key. When empty, the element's content is used and stored here |
   * | `eo-translator-fallback` | Fallback text when the key is not found |
   * | `eo-translator-params` | JSON object of interpolation parameters |
   * | `eo-translator-html` | `"true"` to set `innerHTML` instead of `textContent` |
   *
   * @param DOMElement The DOM element to translate
   * @param lang Language override for this call
   */
  translateElement(DOMElement?: Element | null, lang?: string): void {
    if (!DOMElement) {
      return;
    }

    const keyAttr = DOMElement.attributes.getNamedItem("eo-translator");

    if (!keyAttr) {
      return;
    }

    const language = lang || this.language;
    const input = keyAttr.value || DOMElement.textContent || DOMElement.innerHTML || "";

    // The content is about to be replaced, so keep a key read from it for later translations.
    if (keyAttr.value !== input) {
      DOMElement.setAttribute("eo-translator", input);
    }
    const fallbackAttr = DOMElement.attributes.getNamedItem("eo-translator-fallback");
    const fallback = fallbackAttr ? fallbackAttr.value : input;
    const paramsAttr = DOMElement.attributes.getNamedItem("eo-translator-params");
    let params: Record<string, unknown> = {};

    if (paramsAttr) {
      try {
        const parsed: unknown = JSON.parse(paramsAttr.value);

        params = isNode(parsed) ? parsed : {};
      }
      catch {
        params = {};
      }
    }

    const htmlAttr = DOMElement.attributes.getNamedItem("eo-translator-html");
    const useHTML = htmlAttr !== null && htmlAttr.value === "true";

    DOMElement[useHTML ? "innerHTML" : "textContent"] = this.translate(input, {
      lang: language,
      fallback,
      params,
    });
  }

  /**
   * @description
   * Translates all `[eo-translator]` elements inside a container, and the
   * container itself when it carries the attribute.
   *
   * When no container is provided, the entire `document` is used (browser only).
   *
   * @param DOMContainer The root container to search within
   * @param lang Language override for this call
   */
  translateDOM(DOMContainer?: ParentNode | null, lang?: string): void {
    const language = lang || this.language;
    const container = DOMContainer ?? (typeof document === "object" ? document : null);

    if (!container) {
      return;
    }

    container.querySelectorAll("[eo-translator]").forEach(element => this.translateElement(element, language));

    // Last, as translating it replaces the content its marked descendants were translated into.
    if (isElement(container) && container.hasAttribute("eo-translator")) {
      this.translateElement(container, language);
    }
  }

  /**
   * @description
   * Adds or updates a translation entry in the dictionary.
   *
   * Supports dot-separated keys for nested entries
   * (e.g. `"section.title"` will create `{ section: { title: value } }`).
   * If the language does not yet exist in the dictionary it is created.
   *
   * @param lang The language key to add the translation to
   * @param key The translation key (supports dot notation)
   * @param translation The translated string
   * @throws {TypeError} When the language or the key is not a string
   */
  add(lang: string, key: string, translation: string): void {
    assertString(lang, "language key");
    assertString(key, "translation key");

    const frags = key.split(".").filter(frag => frag.length > 0);
    const last = frags.pop();

    if (last === undefined) {
      return;
    }

    let node = ownNode(this.dictionary, lang);

    for (const frag of frags) {
      node = ownNode(node, frag);
    }

    setOwn(node, last, translation);
  }

  /**
   * @description
   * Removes a translation entry from the dictionary.
   *
   * Supports dot-separated keys for nested entries. Does nothing if the
   * language or key does not exist.
   *
   * @param lang The language key to remove the translation from
   * @param key The translation key to remove (supports dot notation)
   * @throws {TypeError} When the language or the key is not a string
   */
  remove(lang: string, key: string): void {
    assertString(lang, "language key");
    assertString(key, "translation key");

    const frags = key.split(".").filter(frag => frag.length > 0);
    const last = frags.pop();
    const node = frags.reduce(ownValue, ownValue(this.dictionary, lang));

    if (last !== undefined && isNode(node) && Object.hasOwn(node, last)) {
      delete node[last];
    }
  }

  /**
   * @description
   * Checks whether a language key is present in the dictionary.
   *
   * @param lang The language key to check
   * @returns `true` when the language exists in the dictionary
   */
  isValidLanguage(lang: string): boolean {
    return Object.hasOwn(this.dictionary, lang);
  }

  // #endregion
}

/**
 * @description
 * Replaces `{placeholder}` tokens in a string with values from a
 * parameters object, in a single pass. Placeholder names are escaped before
 * being used in a RegExp to avoid injection from special characters in key
 * names, and values are inserted literally: a `$&` in a value is not a
 * replacement pattern, and a `{placeholder}` in a value is not replaced.
 *
 * @param raw The template string containing `{placeholder}` tokens
 * @param params The interpolation values
 * @returns The string with all matching tokens replaced
 */
function assignParams(raw: string, params: Record<string, unknown>): string {
  const keys = Object.keys(params);

  if (keys.length === 0) {
    return raw;
  }

  const names = keys.map(key => key.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&"));
  const pattern = new RegExp(`\\{(${names.join("|")})\\}`, "g");

  return raw.replace(pattern, (_, key: string) => String(params[key]));
}

/**
 * @description
 * Throws a `TypeError` naming the argument when a value is not a string.
 *
 * @param value The value to check
 * @param name The argument's name in the error message
 * @throws {TypeError} When the value is not a string
 */
function assertString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`[EOTranslatorJS] Invalid ${name}, expected "string" but received "${typeof value}".`);
  }
}

/**
 * @description
 * Checks whether a container is an element, rather than a document or a fragment.
 *
 * @param node The container to check
 * @returns `true` when the container is an element
 */
function isElement(node: ParentNode): node is Element {
  return "hasAttribute" in node;
}

/**
 * @description
 * Checks whether a value is a translation node: a non-null object.
 *
 * @param value The value to check
 * @returns `true` when the value is a non-null object
 */
function isNode(value: unknown): value is EOTranslator.TTranslationNode {
  return typeof value === "object" && value !== null;
}

/**
 * @description
 * Checks whether a value can be returned as a translation. Strings, numbers,
 * bigints and `true` are; empty strings, `false`, nullish values, namespaces
 * and functions are not.
 *
 * @param value The value to check
 * @returns `true` when the value is a translation
 */
function isTranslation(value: unknown): value is string | number | bigint | true {
  return (typeof value === "string" && value.length > 0)
    || typeof value === "number"
    || typeof value === "bigint"
    || value === true;
}

/**
 * @description
 * Reads an own property of a translation node, ignoring inherited properties
 * such as `constructor` or `__proto__`.
 *
 * @param node The node to read from
 * @param key The property name
 * @returns The property value, or `undefined` when the node is not an object or lacks the property
 */
function ownValue(node: unknown, key: string): unknown {
  return isNode(node) && Object.hasOwn(node, key) ? node[key] : undefined;
}

/**
 * @description
 * Defines an own, enumerable property on a translation node. Unlike an
 * assignment, this never invokes the `__proto__` setter.
 *
 * @param node The node to write to
 * @param key The property name
 * @param value The property value
 */
function setOwn(node: EOTranslator.TTranslationNode, key: string, value: unknown): void {
  Object.defineProperty(node, key, { value, writable: true, enumerable: true, configurable: true });
}

/**
 * @description
 * Returns the child node of a translation node, replacing a missing or
 * non-object child with a new empty node.
 *
 * @param node The parent node
 * @param key The child's property name
 * @returns The child node
 */
function ownNode(node: EOTranslator.TTranslationNode, key: string): EOTranslator.TTranslationNode {
  const child = ownValue(node, key);

  if (isNode(child)) {
    return child;
  }

  const created: EOTranslator.TTranslationNode = {};

  setOwn(node, key, created);

  return created;
}

// eslint-disable-next-line ts/no-namespace -- merges the public types with the class for `export =` CommonJS consumers
declare namespace EOTranslator {
  /**
   * A translation entry: either a translated value or a nested namespace of entries.
   */
  export type TTranslationNode = { [key: string]: unknown };

  /**
   * The translation dictionary, keyed by language code at the top level.
   */
  export type TDictionary = { [lang: string]: TTranslationNode };

  /**
   * Options accepted by `EOTranslator.translate`.
   */
  export type TTranslateOptions = {
    /**
     * Override the active language for this call.
     */
    lang?: string;

    /**
     * Value to return when the key is not found. Defaults to the key itself.
     */
    fallback?: string;

    /**
     * Interpolation parameters (`{placeholder}` syntax).
     */
    params?: Record<string, unknown>;
  };
}

export default EOTranslator;
