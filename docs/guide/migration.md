# Migration Guide

## From 3.1.3 to 3.1.4

The API is unchanged. The package itself changed, and a few bugs were fixed:

- **Node.js 24 or later** is required on the server.
- **ES modules and CommonJS**: the package ships `dist/index.mjs` and `dist/index.cjs` with type declarations, behind an `exports` map. `import EOTranslator from "eo-translatorjs"` and `require("eo-translatorjs")` both still give you the class.
- **Browser bundles were renamed**. `dist/eo-translatorjs.js` and `dist/eo-translatorjs.min.js` are gone; use `dist/index.iife.js` for a `<script>` tag (it still defines the `EOTranslator` global), `dist/index.umd.js` for AMD or `dist/index.browser.mjs` as an ES module.

```html
<!-- Before -->
<script src="https://cdn.jsdelivr.net/npm/eo-translatorjs@3.1.3/dist/eo-translatorjs.min.js"></script>

<!-- After -->
<script src="https://cdn.jsdelivr.net/npm/eo-translatorjs@3/dist/index.iife.js"></script>
```

- **Bug fixes**: behaviour changes only where the old behaviour was a bug.
  - Parameter values are inserted literally; `$&`, `$1` and other replacement patterns in a value are no longer expanded.
  - Translating a namespace key, an array or a function returns the fallback instead of `"[object Object]"` or source code.
  - Nested keys no longer resolve inherited properties, so `"nav.constructor"` falls back instead of returning `Object`'s source.
  - `add()` and `remove()` no longer write to or delete from `Object.prototype` through `__proto__` keys, and `add("__proto__", …)` no longer replaces the dictionary's prototype.
  - When the page's `lang` is not in the dictionary (for example `de`, or `en-US` with only `en`), the constructor falls back to `"en"` instead of throwing.
  - A dictionary without `"en"` no longer throws when no language is given; the dictionary's first language is used.
  - `new EOTranslator({}, "fr")` is accepted, like setting `language` on an empty dictionary.
  - A `{placeholder}` inside a parameter value is no longer replaced by another parameter.
  - Elements whose key comes from their text (an empty `eo-translator`) keep that key in the attribute, so they can switch languages.
  - Replacing `dictionary` with one that lacks the active language falls back to the default language, instead of leaving every translation on its fallback.
  - `translate`, `add` and `remove` throw a clear `TypeError` for a key or language that is not a string, instead of an engine error such as `input.split is not a function`.
  - `translateDOM(container)` also translates the container when it carries `eo-translator`.
  - `eo-translator-params` values that are not JSON objects, such as `"abc"`, are ignored instead of filling `{0}`, `{1}`, ….
- **Types**: the type declarations are generated from the TypeScript sources and replace `types/eo-translatorjs.d.ts`. The dictionary and option types are available as `EOTranslator.TDictionary`, `EOTranslator.TTranslationNode` and `EOTranslator.TTranslateOptions`.
