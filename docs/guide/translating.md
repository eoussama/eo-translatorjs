# Translating

## `translate(key, options?)`

Translates a key in the active (or specified) language.

| Parameter | Type | Description |
|---|---|---|
| `key` | `string` | Translation key. Supports dot notation for nested keys |
| `options.lang` | `string` | Override the active language for this call only |
| `options.fallback` | `string` | Value to return when the key is not found. Defaults to the key itself |
| `options.params` | `object` | Interpolation parameters replacing `{placeholder}` tokens |

Throws a `TypeError` when the key is not a string.

```ts
const dict = {
  en: {
    greeting: "Hello, {name}!",
    ui: {
      title: "Welcome",
    },
  },
  fr: {
    greeting: "Bonjour, {name}!",
  },
};

const translator = new EOTranslator(dict, "en");

// Basic translation
translator.translate("ui.title"); // → "Welcome"

// With parameters
translator.translate("greeting", { params: { name: "Luffy" } }); // → "Hello, Luffy!"

// With a language override (does not change the default)
translator.translate("greeting", { lang: "fr", params: { name: "Luffy" } }); // → "Bonjour, Luffy!"

// Missing key: returns the key itself by default
translator.translate("missing.key"); // → "missing.key"

// Missing key: custom fallback
translator.translate("missing.key", { fallback: "N/A" }); // → "N/A"
```

## Fallbacks

The fallback is returned, without parameters applied, when:

- the language does not exist in the dictionary
- the key does not exist, or a nested key goes through something that is not an object
- the key names an inherited property, such as `constructor` or `toString`
- the translation is `null`, `undefined`, `false`, an empty string, a namespace object, an array or a function

Numbers, bigints and `true` are converted to strings, so `0` translates to `"0"`.

## Nested keys

Dot-separated keys let you organise translations into namespaces without any extra configuration. Empty fragments are ignored, so `"nav..home"` is the same as `"nav.home"`.

```ts
const dict = {
  en: {
    nav: {
      home: "Home",
      about: "About us",
    },
    footer: {
      copyright: "© 2024 Example Inc.",
    },
  },
};

const translator = new EOTranslator(dict, "en");

translator.translate("nav.home"); // → "Home"
translator.translate("nav.about"); // → "About us"
translator.translate("footer.copyright"); // → "© 2024 Example Inc."
translator.translate("nav.missing"); // → "nav.missing" (fallback to key)
```

## Parameter interpolation

Use `{placeholder}` tokens inside translations and supply values via `options.params` (or the `eo-translator-params` attribute in HTML). Every occurrence of a placeholder is replaced, placeholder names are matched literally, and values are inserted as they are: a `$&` or `$1` in a value is not a replacement pattern, and a `{placeholder}` in a value is not replaced.

```ts
const dict = {
  en: {
    greeting: "Hello, {first} {last}!",
    score: "You scored {points} points.",
  },
};

const translator = new EOTranslator(dict, "en");

translator.translate("greeting", { params: { first: "Monkey", last: "D. Luffy" } });
// → "Hello, Monkey D. Luffy!"

translator.translate("score", { params: { points: 42 } });
// → "You scored 42 points."
```
