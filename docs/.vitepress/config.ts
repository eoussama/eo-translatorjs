import { createRequire } from "node:module";

import { defineConfig } from "vitepress";



const require = createRequire(import.meta.url);
const pkg = require("../../package.json") as { version: string };



/**
 * @description
 * VitePress site configuration for eo-translatorjs documentation
 */
export default defineConfig({
  vite: {
    define: {
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
  },

  title: "EO TranslatorJS",
  description: "A simple javascript library for translating web content.",
  base: "/",
  cleanUrls: true,

  head: [["link", { rel: "icon", href: "/logo.svg" }]],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "EO TranslatorJS",

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API Reference", link: "/api/" },
      { text: "Demos", link: "/demos/translate" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "The Translator", link: "/guide/translator" },
          ],
        },
        {
          text: "Usage",
          items: [
            { text: "Translating", link: "/guide/translating" },
            { text: "Translating the DOM", link: "/guide/dom" },
            { text: "Editing the Dictionary", link: "/guide/dictionary" },
            { text: "Node.js", link: "/guide/node" },
          ],
        },
        {
          text: "More",
          items: [
            { text: "Migration Guide", link: "/guide/migration" },
          ],
        },
      ],
      "/demos/": [
        {
          text: "Demos",
          items: [
            { text: "translate", link: "/demos/translate" },
            { text: "translateElement", link: "/demos/translate-element" },
            { text: "translateDOM", link: "/demos/translate-dom" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [{ text: "Overview", link: "/api/" }],
        },
        {
          text: "Translator",
          items: [{ text: "EOTranslator", link: "/api/classes/EOTranslator" }],
        },
        {
          text: "Types",
          items: [
            { text: "TDictionary", link: "/api/eo-translatorjs/namespaces/EOTranslator/type-aliases/TDictionary" },
            { text: "TTranslationNode", link: "/api/eo-translatorjs/namespaces/EOTranslator/type-aliases/TTranslationNode" },
            { text: "TTranslateOptions", link: "/api/eo-translatorjs/namespaces/EOTranslator/type-aliases/TTranslateOptions" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/eoussama/eo-translatorjs" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © EOussama",
    },

    editLink: {
      pattern: "https://github.com/eoussama/eo-translatorjs/edit/master/docs/:path",
      text: "Edit this page on GitHub",
    },

    search: {
      provider: "local",
    },
  },
});
