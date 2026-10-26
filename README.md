<p align="center">
    <a href="https://eo-translatorjs.ouss.es">
      <img src="https://raw.githubusercontent.com/eoussama/eo-translatorjs/refs/heads/master/docs/public/logo.svg" alt="Logo" width="130px">
      <h1 align="center">eo-translatorjs</h1>
    </a>
    <p align="center">A lightweight, zero-dependency library for translating web content: define a dictionary, create a translator, and translate a string, an element or a whole DOM tree in one call.</p>
    <p align="center">
        <img src="https://img.shields.io/npm/v/eo-translatorjs.svg" alt="npm version">
        <img src="https://img.shields.io/npm/dm/eo-translatorjs.svg" alt="npm downloads">
        <img src="https://img.shields.io/github/actions/workflow/status/eoussama/eo-translatorjs/ci.yml?branch=master&label=CI" alt="CI status">
        <img src="https://img.shields.io/github/license/eoussama/eo-translatorjs.svg" alt="License">
    </p>
</p>

## Installation

```bash
pnpm add eo-translatorjs
# or: npm install eo-translatorjs / yarn add eo-translatorjs
```

The package is also published to GitHub Packages as `@eoussama/eo-translatorjs`, and ships browser bundles for a plain `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/eo-translatorjs@3/dist/index.iife.js"></script>
<script>
  const translator = new EOTranslator({ en: { greeting: "Hello" } }, "en");
</script>
```

## Why eo-translatorjs

- **One dictionary**: keep every language in a plain object and switch the active language at any time.
- **Nested keys**: organise translations into namespaces and reach them with keys such as `nav.home`.
- **Interpolation**: fill `{placeholder}` tokens from parameters, in code or from an `eo-translator-params` attribute.
- **DOM translation**: mark elements with `eo-translator` attributes and translate one element or a whole container, as text or as HTML.
- **Safe fallbacks**: missing keys and languages fall back to the key or to a fallback you choose.
- **TypeScript-first**: typed API, ESM and CommonJS builds with type declarations.

## Quick start

```ts
import EOTranslator from "eo-translatorjs";



const translator = new EOTranslator({
  en: { greeting: "Hello, {name}!" },
  fr: { greeting: "Bonjour, {name}!" },
}, "en");

translator.translate("greeting", { params: { name: "Luffy" } }); // "Hello, Luffy!"
translator.translate("greeting", { lang: "fr", params: { name: "Luffy" } }); // "Bonjour, Luffy!"

// Translates every [eo-translator] element on the page
translator.translateDOM();
```

## Documentation

Full documentation, guides, and the API reference are available on the docs site.

- [Docs site](https://eo-translatorjs.ouss.es/)
- [Getting started](https://eo-translatorjs.ouss.es/guide/getting-started)
- [The translator](https://eo-translatorjs.ouss.es/guide/translator)
- [Translating](https://eo-translatorjs.ouss.es/guide/translating)
- [Translating the DOM](https://eo-translatorjs.ouss.es/guide/dom)
- [Migration guide](https://eo-translatorjs.ouss.es/guide/migration)
- [API reference](https://eo-translatorjs.ouss.es/api/)

## Demos

Try the library live in the [demos](https://eo-translatorjs.ouss.es/demos/translate): translate a string, a single element, or a whole container as you switch languages.

## Testing

- **Unit and integration tests** (`pnpm test`): Vitest, with a 100% coverage threshold.
- **Smoke tests** (`pnpm test:smoke`): import the built ESM and CommonJS packages.
- **End-to-end tests** (`pnpm test:e2e`): Playwright, covering a browser harness of translation scenarios and the built bundles, the docs site and every demo. Build the library and the docs first with `pnpm build` and `pnpm docs:build`.
- **Mutation tests** (`pnpm test:mutation`): Stryker, failing below a 95% mutation score.

## Development

Requires Node.js 24 or later and pnpm 12.15.0. Recent pnpm versions switch to the pinned version from `package.json` on their own; npm is refused.

```bash
pnpm install
pnpm dev           # rebuild the library on change
pnpm build         # build the library
pnpm typecheck     # type check with TypeScript 7
pnpm lint          # lint
pnpm test          # run unit and integration tests with coverage
pnpm docs:dev      # start the docs site, demos included (/demos)
pnpm check         # run every check CI runs
```

## Credits

Icon made by [Freepik](https://www.freepik.com/) from [Flaticon](https://www.flaticon.com/) and is licensed by [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/).

## License

MIT
