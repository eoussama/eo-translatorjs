# translate

Translates a greeting into the picked language with the `translate` method, filling the `{name}` placeholder from the input.

The dictionary has no Portuguese translations, so picking Portuguese falls back to the key, `greeting`.

<TranslateDemo />

```ts
const translator = new EOTranslator({
  en: { greeting: "Hello {name}!" },
  fr: { greeting: "Bonjour {name}!" },
  es: { greeting: "Hola {name}!" },
});

translator.translate("greeting", { lang, params: { name } });
```
