import type { TScenario } from "../scenario.type";

import { BUNDLE_SCENARIOS } from "./bundle.scenarios";
import { TRANSLATION_SCENARIOS } from "./translation.scenarios";



export const SCENARIOS: readonly TScenario[] = [
  ...TRANSLATION_SCENARIOS,
  ...BUNDLE_SCENARIOS,
];
