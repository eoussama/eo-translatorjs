# Migration Guide

## From 3.1.3 to 3.1.4

The API is unchanged. The package itself changed:

- **Node.js 24 or later** is required on the server.
- **ES modules and CommonJS**: the package ships `dist/index.mjs` and `dist/index.cjs` with type declarations, behind an `exports` map. `import EOTranslator from "eo-translatorjs"` and `require("eo-translatorjs")` both still give you the class.
- **Browser bundles were renamed**. `dist/eo-translatorjs.js` and `dist/eo-translatorjs.min.js` are gone; use `dist/index.iife.js` for a `<script>` tag (it still defines the `EOTranslator` global), `dist/index.umd.js` for AMD or `dist/index.browser.mjs` as an ES module.

```html
<!-- Before -->
<script src="https://cdn.jsdelivr.net/npm/eo-translatorjs@3.1.3/dist/eo-translatorjs.min.js"></script>

<!-- After -->
<script src="https://cdn.jsdelivr.net/npm/eo-translatorjs@3/dist/index.iife.js"></script>
```

- **Types**: the type declarations are generated from the TypeScript sources and replace `types/eo-translatorjs.d.ts`. The dictionary and option types are available as `EOTranslator.TDictionary`, `EOTranslator.TTranslationNode` and `EOTranslator.TTranslateOptions`.
