import { expect, test } from "@playwright/test";

import { getDoneLocator, getLogs, getOutput, gotoScenario } from "../../helpers/harness.helper";



test.describe("browser bundles", () => {
  for (const id of ["iife-global", "umd-global"]) {
    test(`${id} defines the EOTranslator class as a global`, async ({ page }) => {
      await gotoScenario(page, id);

      await expect(getDoneLocator(page)).toHaveText("true");
      expect(await getLogs(page)).toEqual(["function"]);
      await expect(getOutput(page)).toHaveText("Hello from the bundle!");
    });
  }
});
