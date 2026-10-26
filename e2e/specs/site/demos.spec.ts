import { expect, test } from "@playwright/test";

import { collectErrors, openDemo } from "../../helpers/site.helper";



test.describe("demos", () => {
  test("translate greets in the picked language", async ({ page }) => {
    const errors = collectErrors(page);
    const demo = await openDemo(page, "translate");
    const output = demo.getByTestId("demo-output");

    await demo.getByTestId("demo-greet").click();
    await expect(output).toHaveText("Hello EOussama!");

    await demo.getByTestId("demo-language").selectOption("fr");
    await demo.getByTestId("demo-name").fill("Luffy");
    await demo.getByTestId("demo-greet").click();
    await expect(output).toHaveText("Bonjour Luffy!");

    await demo.getByTestId("demo-language").selectOption("br");
    await demo.getByTestId("demo-greet").click();
    await expect(output).toHaveText("greeting");
    expect(errors).toEqual([]);
  });

  test("translateElement translates its element and falls back for a missing language", async ({ page }) => {
    const errors = collectErrors(page);
    const demo = await openDemo(page, "translate-element");
    const output = demo.getByTestId("demo-output");

    await expect(output).toContainText("Without her dog, Riley, Claire would be very sad.");

    await demo.getByTestId("demo-language").selectOption("es");
    await expect(output).toContainText("Sin su perro, Riley, Claire estaría muy triste");

    await demo.getByTestId("demo-language").selectOption("br");
    await expect(output).toHaveText("This is a fallback translation for when the targeted translation is not found.");
    expect(errors).toEqual([]);
  });

  test("translateDOM renders its translations as HTML", async ({ page }) => {
    const errors = collectErrors(page);
    const demo = await openDemo(page, "translate-dom");
    const output = demo.getByTestId("demo-output");

    await expect(output.locator("b")).toHaveText(["Riley", "Claire"]);

    await demo.getByTestId("demo-language").selectOption("fr");
    await expect(output).toContainText("Sans son chien, Riley, Claire serait très triste.");
    await expect(output.locator("b")).toHaveCount(2);
    expect(errors).toEqual([]);
  });
});
