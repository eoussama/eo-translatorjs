---
layout: home

hero:
  name: "EO TranslatorJS"
  text: "Translate web content with a dictionary"
  tagline: "Define a dictionary, create a translator, and translate a string, a single element or a whole DOM tree in one call. Lightweight, zero-dependency, and typed."
  image:
    src: /logo.svg
    alt: EO TranslatorJS
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: Demos
      link: /demos/translate

features:
  - icon: 📖
    title: One dictionary, every language
    details: Keep every translation in a plain object keyed by language, and switch the active language at any time.
  - icon: 🌳
    title: Nested keys
    details: Organise translations into namespaces and reach them with dot-separated keys such as nav.home.
  - icon: 🧩
    title: Interpolation
    details: Fill {placeholder} tokens from parameters, in code or straight from an eo-translator-params attribute.
  - icon: 🖥️
    title: Translate the DOM
    details: Mark elements with eo-translator attributes and translate one element or a whole container, as text or as HTML.
  - icon: 🛟
    title: Safe fallbacks
    details: Missing keys and languages fall back to the key itself or to a fallback you choose, never to an error.
  - icon: 🌍
    title: Browser and server
    details: Translate strings in Node.js and pages in the browser with the same dictionary. DOM methods are safe no-ops where there is no document.
  - icon: 🔷
    title: TypeScript-first
    details: Written in TypeScript, with ESM and CommonJS builds, type declarations and browser bundles for a plain script tag.
  - icon: 🧪
    title: Tested end to end
    details: Every line of the library is covered by unit tests and checked by mutation testing, and Playwright runs every demo in a real browser.
---
