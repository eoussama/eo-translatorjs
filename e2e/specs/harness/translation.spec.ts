import { expect, test } from "@playwright/test";

import { getDoneLocator, getLogs, getOutput, getStatus, gotoScenario } from "../../helpers/harness.helper";



test.describe("translation", () => {
  test("translateDOM translates every marked element with its params", async ({ page }) => {
    await gotoScenario(page, "translate-dom");

    await expect(getDoneLocator(page)).toHaveText("true");
    await expect(getOutput(page)).toHaveText("Home Hello, Luffy!");
  });

  test("translateDOM honours a language override without changing the active language", async ({ page }) => {
    await gotoScenario(page, "translate-dom-override");

    await expect(getOutput(page)).toHaveText("Accueil");
    expect(await getStatus(page)).toBe("en");
  });

  test("translateDOM translates the whole document without a container", async ({ page }) => {
    await gotoScenario(page, "translate-document");

    await expect(getOutput(page)).toHaveText("Accueil");
  });

  test("switching the active language retranslates the page", async ({ page }) => {
    await gotoScenario(page, "switch-language");

    expect(await getLogs(page)).toEqual(["Home", "Accueil", "Home"]);
  });

  test("eo-translator-html renders markup only when enabled", async ({ page }) => {
    await gotoScenario(page, "html-rendering");

    const [html, text] = await getOutput(page).locator("p").all();

    await expect(html!.locator("b")).toHaveText("World");
    await expect(text!).toHaveText("Hello <b>World</b>!");
    await expect(text!.locator("b")).toHaveCount(0);
  });

  test("eo-translator-fallback replaces an unknown key", async ({ page }) => {
    await gotoScenario(page, "fallback");

    await expect(getOutput(page)).toHaveText("Not translated");
  });

  test("the default language comes from the document", async ({ page }) => {
    await gotoScenario(page, "document-language");

    expect(await getStatus(page)).toBe("fr");
  });
});
