import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const harness = "http://127.0.0.1:5174";
for (const view of [
  "home",
  "activity",
  "accounts",
  "insights",
  "settings",
  "categories",
])
  for (const width of [320, 430, 1440]) {
    test(`isolated ${view} UI at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 950 });
      await page.goto(`${harness}/?view=${view}`);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
      await page.screenshot({
        path: `artifacts/screenshots/ui-${view}-${width}.png`,
        fullPage: true,
      });
    });
  }
test("entry sheet manages keyboard focus and preserves failed input", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(harness);
  await page
    .getByRole("button", { name: "Add transaction", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Amount (RM)", { exact: true }).fill("24.90");
  await dialog
    .getByRole("combobox", { name: "Account", exact: true })
    .selectOption("sample-cash");
  await dialog
    .getByRole("combobox", { name: "Category", exact: true })
    .selectOption("sample-food");
  await page.route("**/api/finance", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "SAVE_FAILED" }),
    }),
  );
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "could not be confirmed",
  );
  await expect(dialog.getByLabel("Amount (RM)", { exact: true })).toHaveValue(
    "24.90",
  );
  await page.screenshot({
    path: "artifacts/screenshots/ui-transaction-error-375.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add transaction", exact: true }),
  ).toBeFocused();
});
test("large balances and long financial rows stay readable at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const view of ["home", "activity", "accounts"]) {
    await page.goto(`${harness}/?view=${view}&stress=1`);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/screenshots/ui-stress-${view}-320.png`,
      fullPage: true,
    });
  }
});
test("transfer rejects the same account before making a request", async ({
  page,
}) => {
  await page.setViewportSize({ width: 430, height: 950 });
  await page.goto(`${harness}/?view=accounts`);
  await page.getByRole("button", { name: "Transfer", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("combobox", { name: "Source account", exact: true })
    .selectOption("sample-cash");
  await dialog
    .getByRole("combobox", { name: "Destination account", exact: true })
    .selectOption("sample-cash");
  await dialog.getByLabel("Amount (RM)", { exact: true }).fill("50.00");
  let writes = 0;
  await page.route("**/api/finance", (route) => {
    writes++;
    return route.abort();
  });
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Choose two different accounts.",
  );
  expect(writes).toBe(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: "artifacts/screenshots/ui-transfer-validation-430.png",
    fullPage: true,
  });
});
test("empty BM and reduced motion remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${harness}/?view=home&empty=1&locale=ms`);
  await expect(
    page.getByRole("heading", { name: "Mari mulakan catatan anda." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tambah akaun", exact: true }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("insight source entries reconcile and return focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`${harness}/?view=insights`);
  await expect(
    page.getByRole("heading", { name: "Four completed weeks", exact: true }),
  ).toBeVisible();
  const source = page.getByRole("button", {
    name: "View source entries: Food & drinks",
    exact: true,
  });
  await source.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Expenses: RM 24.90");
  await expect(dialog).toContainText("Expense entries: 1");
  await expect(dialog.getByRole("listitem")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: "artifacts/screenshots/ui-insight-source-320.png",
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await expect(source).toBeFocused();
});
