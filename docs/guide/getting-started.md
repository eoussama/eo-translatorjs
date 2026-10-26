# Getting Started

EO TranslatorJS is a lightweight, zero-dependency library that makes it easy to translate web page content. Define a dictionary, create a translator instance, and call a single method to translate a string or an entire DOM tree.

## Installation

The package is published to both the **npm registry** and the **GitHub Packages registry**.

```bash
pnpm add eo-translatorjs
# or: npm install eo-translatorjs / yarn add eo-translatorjs
```

To install from the GitHub Packages registry instead, scope the registry in your `.npmrc`:

```ini
@eoussama:registry=https://npm.pkg.github.com
```

Then install as usual:

```bash
pnpm add @eoussama/eo-translatorjs
```

### Without a bundler

Browser bundles are included for a plain `<script>` tag. The IIFE build exposes the `EOTranslator` class as a global:

```html
<p eo-translator="greeting"></p>
<script src="https://cdn.jsdelivr.net/npm/eo-translatorjs@3/dist/index.iife.js"></script>
<script>
  const translator = new EOTranslator({ en: { greeting: "Hello!" } }, "en");

  translator.translateDOM();
</script>
```

A minified ES module (`dist/index.browser.mjs`) and a UMD build (`dist/index.umd.js`) are available as well.

The package targets ES2022 and needs Node.js 24 or later on the server.

## Quick start

```ts
import EOTranslator from "eo-translatorjs";

const dict = {
  en: { greeting: "Hello" },
  fr: { greeting: "Bonjour" },
  es: { greeting: "Hola" },
};

const translator = new EOTranslator(dict, "en");

translator.translate("greeting"); // → "Hello"
translator.translate("greeting", { lang: "fr" }); // → "Bonjour"
```

With CommonJS, `require` returns the class itself:

```js
const EOTranslator = require("eo-translatorjs");
```

## Next steps

- [The Translator](./translator): the constructor, the dictionary and the active language
- [Translating](./translating): keys, nested keys, fallbacks and parameters
- [Translating the DOM](./dom): the `eo-translator` attributes
- [Demos](/demos/translate): try it live
