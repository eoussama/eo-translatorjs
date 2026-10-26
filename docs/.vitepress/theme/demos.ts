import type EOTranslator from "../../../src/index";



/**
 * @description
 * A language offered by the demos' language pickers
 */
export type TDemoLanguage = {
  readonly code: string;
  readonly name: string;
};

/**
 * @description
 * The languages offered by every demo. Portuguese is deliberately missing from the
 * dictionaries, to show how a missing language falls back.
 */
export const DEMO_LANGUAGES: readonly TDemoLanguage[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "br", name: "Portuguese" },
];

/**
 * @description
 * The greeting dictionary of the `translate` demo
 */
export const GREETING_DICTIONARY: EOTranslator.TDictionary = {
  en: { greeting: "Hello {name}!" },
  fr: { greeting: "Bonjour {name}!" },
  es: { greeting: "Hola {name}!" },
};

/**
 * @description
 * Build the paragraph dictionary of the DOM demos
 *
 * @param emphasis - Wrap the names in `<b>` tags, for the HTML rendering demo
 * @returns The dictionary
 */
export function informDictionary(emphasis: boolean): EOTranslator.TDictionary {
  const name = (placeholder: string): string => emphasis ? `<b>{${placeholder}}</b>` : `{${placeholder}}`;
  const pet = name("pet-name");
  const owner = name("owner-name");

  return {
    en: {
      inform: `At times, commas will also be integral in a complete sentence. They punctuate clauses within a complete sentence. For example, "Without her dog, ${pet}, ${owner} would be very sad." Commas love to enter the scene whenever there's a natural pause, or a clause, within a complete sentence.`,
    },
    fr: {
      inform: `Parfois, les virgules feront également partie intégrante d'une phrase complète. Ils ponctuent les clauses d'une phrase complète. Par exemple, "Sans son chien, ${pet}, ${owner} serait très triste." Les virgules adorent entrer en scène chaque fois qu'il y a une pause naturelle ou une clause dans une phrase complète.`,
    },
    es: {
      inform: `A veces, las comas también serán integrales en una oración completa. Puntúan cláusulas dentro de una oración completa. Por ejemplo, "Sin su perro, ${pet}, ${owner} estaría muy triste". A las comas les encanta entrar en escena cada vez que hay una pausa natural, o una cláusula, dentro de una oración completa.`,
    },
  };
}
