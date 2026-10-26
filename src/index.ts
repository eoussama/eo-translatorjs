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
   * @param dict The new dictionary value
   * @throws {Error} When the value is not a valid plain object
   */
  set dictionary(dict: EOTranslator.TDictionary) {
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
      throw new Error("[EOTranslatorJS] Invalid dictionary object.");
    }

    this._dictionary = dict;
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

    if (
      !Object.hasOwn(this.dictionary, lang)
      && Object.keys(this.dictionary).length > 0
      && lang.length > 0
    ) {
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
   * @param lang The default language key. Defaults to the document's `lang`
   *   attribute when running in a browser, or `"en"`.
   *
   * @throws {Error} When the dictionary is not a valid plain object
   * @throws {TypeError} When the language is not a string
   * @throws {Error} When the language key does not exist in the dictionary
   */
  constructor(dict: EOTranslator.TDictionary, lang: string = "") {
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) {
      throw new Error("[EOTranslatorJS] Invalid dictionary object.");
    }

    if (typeof lang !== "string") {
      throw new TypeError(`[EOTranslatorJS] Invalid language key, expected "string" but received "${typeof lang}".`);
    }

    if (!Object.hasOwn(dict, lang) && lang.length > 0) {
      throw new Error(`[EOTranslatorJS] Invalid language key, "${lang}" does not exist in the passed dictionary.`);
    }

    this.dictionary = dict;
    this.language = lang || (typeof document === "object" ? document.documentElement.lang : "") || "en";
  }

  // #endregion

  // #region Methods

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
   */
  translate(input: string = "", options: EOTranslator.TTranslateOptions = {}): string {
    const language = options.lang || this.language;
    const fallback = options.fallback !== undefined ? options.fallback : input;
    const params = options.params || {};
    const frags = input.split(".").filter(frag => frag.length > 0);

    if (!this.isValidLanguage(language)) {
      return fallback;
    }

    const entries = this.dictionary[language] as EOTranslator.TTranslationNode;
    let output: unknown;

    if (frags.length > 1) {
      output = extractValue(entries, frags);
    }
    else {
      output = Object.hasOwn(entries, input) ? entries[input] : undefined;
    }

    return output != null && output !== false && output !== ""
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
   * | `eo-translator` | _(required)_ The translation key |
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
    const fallbackAttr = DOMElement.attributes.getNamedItem("eo-translator-fallback");
    const fallback = fallbackAttr ? fallbackAttr.value : input;
    const paramsAttr = DOMElement.attributes.getNamedItem("eo-translator-params");
    let params: Record<string, unknown> = {};

    if (paramsAttr) {
      try {
        params = JSON.parse(paramsAttr.value) || {};
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
   * Translates all `[eo-translator]` elements inside a container.
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

    const elements = container.querySelectorAll("[eo-translator]");

    elements.forEach(element => this.translateElement(element, language));
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
   */
  add(lang: string, key: string, translation: string): void {
    const frags = key.split(".").filter(frag => frag.length > 0);
    const last = frags.pop();

    if (last === undefined) {
      return;
    }

    if (!this.isValidLanguage(lang)) {
      this.dictionary[lang] = {};
    }

    let node = this.dictionary[lang] as EOTranslator.TTranslationNode;

    for (const frag of frags) {
      const child = node[frag];

      node = child && typeof child === "object"
        ? child as EOTranslator.TTranslationNode
        : (node[frag] = {});
    }

    node[last] = translation;
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
   */
  remove(lang: string, key: string): void {
    const frags = key.split(".").filter(frag => frag.length > 0);
    const last = frags.pop();
    let node: unknown = this.isValidLanguage(lang) ? this.dictionary[lang] : undefined;

    for (const frag of frags) {
      node = node && typeof node === "object" ? (node as EOTranslator.TTranslationNode)[frag] : undefined;
    }

    if (last !== undefined && node && typeof node === "object") {
      delete (node as EOTranslator.TTranslationNode)[last];
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
 * parameters object. Placeholder names are escaped before being used in a
 * RegExp to avoid injection from special characters in key names.
 *
 * @param raw The template string containing `{placeholder}` tokens
 * @param params The interpolation values
 * @returns The string with all matching tokens replaced
 */
function assignParams(raw: string, params: Record<string, unknown>): string {
  return Object.keys(params).reduce((result, key) => {
    const escapedKey = key.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
    const pattern = new RegExp(`\\{${escapedKey}\\}`, "g");

    return result.replace(pattern, String(params[key]));
  }, raw);
}

/**
 * @description
 * Walks a nested translation node following a list of key fragments,
 * returning the value at the end of the path.
 *
 * Unlike a truthiness check, this uses an explicit `null`/`undefined` guard
 * so that falsy-but-valid values (`0`, `false`, `""`) are preserved.
 *
 * @param entries The translations of the language to look up
 * @param frags The ordered list of nested key fragments
 * @returns The value at the resolved path, or `undefined`
 */
function extractValue(entries: EOTranslator.TTranslationNode, frags: string[]): unknown {
  let node: unknown = entries;

  for (const frag of frags) {
    if (node == null || typeof node !== "object") {
      return undefined;
    }

    node = (node as EOTranslator.TTranslationNode)[frag];
  }

  return node;
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
