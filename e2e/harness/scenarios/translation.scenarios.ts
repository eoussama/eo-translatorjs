import type { TScenario } from "../scenario.type";

import EOTranslator from "@eo-translatorjs";



const DICT: EOTranslator.TDictionary = {
  en: { greeting: "Hello, {name}!", nav: { home: "Home" }, rich: "Hello <b>World</b>!" },
  fr: { greeting: "Bonjour, {name}!", nav: { home: "Accueil" }, rich: "Bonjour <b>le monde</b>!" },
};

export const TRANSLATION_SCENARIOS: readonly TScenario[] = [
  {
    id: "translate-dom",
    run: async ({ el }) => {
      el.innerHTML = "<span eo-translator=\"nav.home\"></span> <span eo-translator=\"greeting\" eo-translator-params='{\"name\": \"Luffy\"}'></span>";

      new EOTranslator(DICT, "en").translateDOM(el);
    },
  },
  {
    id: "translate-dom-override",
    run: async ({ el, setStatus }) => {
      el.innerHTML = "<span eo-translator=\"nav.home\"></span>";

      const translator = new EOTranslator(DICT, "en");

      translator.translateDOM(el, "fr");
      setStatus(translator.language);
    },
  },
  {
    id: "translate-document",
    run: async ({ el }) => {
      el.innerHTML = "<span eo-translator=\"nav.home\"></span>";

      new EOTranslator(DICT, "fr").translateDOM();
    },
  },
  {
    id: "switch-language",
    run: async ({ el, log }) => {
      el.innerHTML = "<span eo-translator=\"nav.home\"></span>";

      const translator = new EOTranslator(DICT, "en");

      for (const lang of ["en", "fr", "en"]) {
        translator.language = lang;
        translator.translateDOM(el);
        log(el.textContent ?? "");
      }
    },
  },
  {
    id: "html-rendering",
    run: async ({ el }) => {
      el.innerHTML = "<p eo-translator=\"rich\" eo-translator-html=\"true\"></p><p eo-translator=\"rich\"></p>";

      new EOTranslator(DICT, "en").translateDOM(el);
    },
  },
  {
    id: "fallback",
    run: async ({ el }) => {
      el.innerHTML = "<span eo-translator=\"missing\" eo-translator-fallback=\"Not translated\"></span>";

      new EOTranslator(DICT, "en").translateElement(el.firstElementChild);
    },
  },
  {
    id: "document-language",
    run: async ({ setStatus }) => {
      document.documentElement.lang = "fr";
      setStatus(new EOTranslator(DICT).language);
    },
  },
];
