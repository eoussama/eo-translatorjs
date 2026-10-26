import type { Locator, Page } from "@playwright/test";



/**
 * @description
 * Navigate to the harness with a given scenario id and wait for it to complete
 *
 * @param page - Playwright page
 * @param id - Scenario id to run
 * @returns Promise that resolves when the scenario signals completion
 */
export async function gotoScenario(page: Page, id: string): Promise<void> {
  await page.goto(`/?scenario=${id}`);
  await page.waitForFunction(
    () => {
      const el = document.querySelector("[data-testid='done']");

      return el !== null && el.textContent !== "";
    },
    { timeout: 15000 },
  );
}

/**
 * @description
 * Return the output element locator for assertion
 *
 * @param page - Playwright page
 * @returns Locator for the output element
 */
export function getOutput(page: Page): Locator {
  return page.getByTestId("output");
}

/**
 * @description
 * Return all log entries written by the scenario
 *
 * @param page - Playwright page
 * @returns Array of log message strings
 */
export async function getLogs(page: Page): Promise<string[]> {
  return page.locator("[data-testid='log'] li").allTextContents();
}

/**
 * @description
 * Return the status value set by the scenario
 *
 * @param page - Playwright page
 * @returns Status string
 */
export async function getStatus(page: Page): Promise<string> {
  return (await page.locator("[data-testid='status']").textContent()) ?? "";
}

/**
 * @description
 * Return the done element locator for assertion
 *
 * @param page - Playwright page
 * @returns Locator for the done element
 */
export function getDoneLocator(page: Page): Locator {
  return page.locator("[data-testid='done']");
}
