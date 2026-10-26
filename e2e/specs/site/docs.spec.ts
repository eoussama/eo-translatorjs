import { readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

import { collectErrors } from "../../helpers/site.helper";



const PAGES = [
  "/",
  "/api/",
  "/api/classes/EOTranslator",
  ...readdirSync("docs/guide").filter(file => file.endsWith(".md")).map(file => `/guide/${file.replace(/\.md$/, "")}`),
  ...readdirSync("docs/demos").filter(file => file.endsWith(".md")).map(file => `/demos/${file.replace(/\.md$/, "")}`),
];

test.describe("docs site", () => {
  test("home page links to the guide and the demos", async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto("/");
    await expect(page.getByRole("link", { name: "Demos" }).first()).toHaveAttribute("href", "/demos/translate");
    await page.getByRole("link", { name: "Guide" }).first().click();
    await expect(page).toHaveURL(/\/guide\//);
    expect(errors).toEqual([]);
  });

  test("the navigation shows the package version", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".vp-version-badge")).toHaveText(/^v\d+\.\d+\.\d+/);
  });

  for (const path of PAGES) {
    test(`${path} renders without errors`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
