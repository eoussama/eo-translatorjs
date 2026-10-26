# translateDOM

Translates every marked element in a container with the `translateDOM` method whenever the language changes. The translations hold `<b>` tags, rendered as HTML because of `eo-translator-html`.

<TranslateDomDemo />

```html
<div
  eo-translator="inform"
  eo-translator-html="true"
  eo-translator-params='{ "pet-name": "Riley", "owner-name": "Claire" }'
  eo-translator-fallback="This is a fallback translation for when the targeted translation is not found."
></div>
```

```ts
translator.translateDOM(container, lang);
```
