# translateElement

Translates a single element with the `translateElement` method whenever the language changes. Its parameters and fallback come from its attributes.

The dictionary has no Portuguese translations, so picking Portuguese shows the element's fallback.

<TranslateElementDemo />

```html
<div
  eo-translator="inform"
  eo-translator-params='{ "pet-name": "Riley", "owner-name": "Claire" }'
  eo-translator-fallback="This is a fallback translation for when the targeted translation is not found."
></div>
```

```ts
translator.translateElement(element, lang);
```
