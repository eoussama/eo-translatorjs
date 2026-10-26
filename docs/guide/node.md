# Node.js

The translator works on the server as well. Without a `document`, the default language is `"en"` and `translateDOM()` without a container does nothing.

```js
const EOTranslator = require("eo-translatorjs");

const dict = {
  en: {
    greet: "Hello {name}!!",
    tmp: "tmp",
  },
  fr: {
    greet: "Bonjour {name}!!",
  },
};

const translator = new EOTranslator(dict);

translator.translate("greet", { params: { name: "Oussama" } });
// → "Hello Oussama!!"

translator.translate("greet", { lang: "fr", params: { name: "Oussama" } });
// → "Bonjour Oussama!!"

// Remove the `tmp` translation
translator.remove("en", "tmp");

// Update the English greeting
translator.add("en", "greet", "Hey, {name}! how are you?");
translator.translate("greet", { params: { name: "Oussama" } });
// → "Hey, Oussama! how are you?"

// Add a new English translation
translator.add("en", "home", "My house is {width} {unit} wide.");
translator.translate("home", { params: { width: 123, unit: "meters" } });
// → "My house is 123 meters wide."

// Add a nested Arabic translation
translator.add("ar", "nested.translation.greet", "مرحبا");
translator.translate("nested.translation.greet", { lang: "ar" });
// → "مرحبا"
```

ES modules work the same way:

```ts
import EOTranslator from "eo-translatorjs";
```
