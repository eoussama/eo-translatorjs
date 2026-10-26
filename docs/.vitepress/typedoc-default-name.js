import { Converter } from "typedoc";



/**
 * @description
 * Name the default export after the class instead of `default` in the API reference
 *
 * @param {import("typedoc").Application} app - The TypeDoc application
 */
export function load(app) {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    for (const reflection of Object.values(context.project.reflections)) {
      if (reflection.name === "default") {
        reflection.name = "EOTranslator";
      }
    }
  });
}
