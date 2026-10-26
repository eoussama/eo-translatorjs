import type { TScenario } from "../scenario.type";



type TTranslatorClass = new (dict: object, lang?: string) => { translateDOM: (container?: ParentNode | null) => void };

/**
 * @description
 * Load a built bundle with a classic script tag
 *
 * @param src - The bundle path, served from `dist/`
 * @returns A promise resolving once the script has run
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load ${src}; run \`pnpm build\` first`));
    document.head.appendChild(script);
  });
}

/**
 * @description
 * Translate the output element with the `EOTranslator` global a bundle defined
 *
 * @param el - The output element
 * @param log - The scenario logger
 */
function translateWithGlobal(el: HTMLElement, log: (msg: string) => void): void {
  const Translator = (window as unknown as { EOTranslator: TTranslatorClass }).EOTranslator;

  log(typeof Translator);
  el.innerHTML = "<span eo-translator=\"greeting\"></span>";
  new Translator({ en: { greeting: "Hello from the bundle!" } }, "en").translateDOM(el);
}

export const BUNDLE_SCENARIOS: readonly TScenario[] = [
  {
    id: "iife-global",
    run: async ({ el, log }) => {
      await loadScript("/index.iife.js");
      translateWithGlobal(el, log);
    },
  },
  {
    id: "umd-global",
    run: async ({ el, log }) => {
      await loadScript("/index.umd.js");
      translateWithGlobal(el, log);
    },
  },
];
