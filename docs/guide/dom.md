# Translating the DOM

## `translateElement(element, lang?)`

Translates the content of a single DOM element. The element must carry the `eo-translator` attribute.

**Supported attributes:**

| Attribute | Required | Description |
|---|---|---|
| `eo-translator` | ✅ | The translation key. When empty, the element's text is used as the key and stored in the attribute, so the element can be translated again |
| `eo-translator-fallback` | ✗ | Fallback text when the key is not found |
| `eo-translator-params` | ✗ | JSON object of interpolation parameters. Invalid JSON and JSON that is not an object are ignored |
| `eo-translator-html` | ✗ | Set to `"true"` to write `innerHTML` instead of `textContent` |

```html
<span
  id="hello"
  eo-translator="greeting"
  eo-translator-params='{ "name": "Luffy" }'
></span>
```

```ts
const translator = new EOTranslator({ en: { greeting: "Hello, {name}!" } }, "en");

translator.translateElement(document.getElementById("hello"));
// <span ...>Hello, Luffy!</span>
```

**HTML rendering:**

```html
<span
  id="hello"
  eo-translator="greeting"
  eo-translator-html="true"
></span>
```

```ts
const translator = new EOTranslator({ en: { greeting: "Hello, <b>World</b>!" } }, "en");

translator.translateElement(document.getElementById("hello"));
// <span ...>Hello, <b>World</b>!</span>
```

::: warning
Only enable `eo-translator-html` for translations you trust: they are written to the page as HTML.
:::

Passing `null` or an element without the `eo-translator` attribute is a safe no-op.

See the [translateElement demo](/demos/translate-element).

## `translateDOM(container?, lang?)`

Translates **all** `[eo-translator]` elements within a container in one call, and the container itself when it carries the `eo-translator` attribute. Markup produced by an `eo-translator-html` translation is not translated again.

When called without a container it scans the entire `document` (browser only, and a no-op on the server).

```ts
// Translate everything in the document using the active language
translator.translateDOM();

// Translate everything inside a specific container
translator.translateDOM(document.getElementById("app"));

// Translate a container using a language override
translator.translateDOM(document.getElementById("app"), "fr");
```

See the [translateDOM demo](/demos/translate-dom).
