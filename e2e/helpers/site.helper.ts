import type { Locator, Page } from "@playwright/test";



/**
 * @description
 * Collect uncaught page errors and console errors while a test runs
 *
 * @param page - The page to watch
 * @returns The live list of errors
 */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("pageerror", error => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  return errors;
}

/**
 * @description
 * Open a demo page and return its demo
 *
 * @param page - The page
 * @param name - The demo page name, e.g. `translate-dom`
 * @returns The demo's root locator
 */
export async function openDemo(page: Page, name: string): Promise<Locator> {
  await page.goto(`/demos/${name}`);

  const demo = page.locator(".demo").first();

  await demo.waitFor();

  return demo;
}
