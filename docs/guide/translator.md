# The Translator

## Constructor

```ts
new EOTranslator(dictionary, language?)
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `dictionary` | `object` | ✅ | Plain object with language keys at the top level |
| `language` | `string` | ✗ | Default language. When omitted, the first of the document `lang` attribute and `"en"` that the dictionary has, then the dictionary's first language |

```ts
const translator = new EOTranslator(dict); // language defaults to "en"
const french = new EOTranslator(dict, "fr"); // explicitly set to French
const empty = new EOTranslator({}, "fr"); // any language while the dictionary is empty
```

**Throws:**

- `Error`: when the dictionary is not a plain object
- `TypeError`: when the language argument is not a string
- `Error`: when the language key does not exist in a non-empty dictionary

## Properties

### `dictionary`

Get or replace the entire translation dictionary at runtime.

```ts
translator.dictionary = {
  en: { home: "House" },
  fr: { home: "Maison" },
};
```

Throws if the assigned value is not a plain object. When the new dictionary lacks the active language, the language falls back to the default one, picked as in the constructor.

### `language`

Get or set the active language at runtime.

```ts
translator.language = "fr";
translator.language; // → "fr"
```

Throws if the value is not a string, or if it does not exist in a non-empty dictionary. The empty string is always accepted.

### `languages` _(read-only)_

Returns an array of all language keys currently present in the dictionary.

```ts
const translator = new EOTranslator({ en: {}, fr: {}, es: {} }, "en");

translator.languages; // → ["en", "fr", "es"]
```

## `isValidLanguage(lang)`

Returns `true` when the given string is a top-level key in the dictionary.

```ts
const translator = new EOTranslator({ en: {}, fr: {} }, "en");

translator.isValidLanguage("fr"); // → true
translator.isValidLanguage("ar"); // → false
```

## Types

The dictionary and option types are exported on the class's namespace:

```ts
import EOTranslator from "eo-translatorjs";

const dict: EOTranslator.TDictionary = { en: { greeting: "Hello" } };
const options: EOTranslator.TTranslateOptions = { lang: "en" };
```
