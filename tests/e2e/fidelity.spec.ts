import { capture } from "./capture";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { fidelitySample } from "../browser-ui/fidelity-sample";
const harness = "http://127.0.0.1:5174";
for (const view of [
  "home",
  "activity",
  "accounts",
  "insights",
  "settings",
  "account",
])
  for (const width of [390, 768, 1448, 1920]) {
    test(`reference ${view} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1086 });
      await page.goto(`${harness}/?view=${view}&fidelity=1`);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      if (view === "insights" && width === 390) {
        const sections = [
          ".mobile-spending-trend",
          ".insight-chart-grid > .rft-panel:not(.monthly-panel)",
          ".insight-summary-grid",
          "#budgets",
          "#goals",
        ];
        const tops = await Promise.all(
          sections.map(
            async (selector) => (await page.locator(selector).boundingBox())!.y,
          ),
        );
        expect(tops).toEqual([...tops].sort((a, b) => a - b));
        await expect(page.locator(".spending-trend-total")).toHaveText(
          "RM 2,596.20",
        );
      }
      await capture(page, {
        path: `artifacts/design-recovery/actual-${view}-${width}.png`,
        fullPage: false,
      });
      if (view === "insights" && width === 390) {
        for (const section of ["budgets", "goals"]) {
          await page.locator(`#${section}`).scrollIntoViewIfNeeded();
          await capture(page, {
            path: `artifacts/design-recovery/actual-insights-${section}-390.png`,
            fullPage: false,
          });
        }
      }
    });
  }
for (const width of [1448, 1920])
  test(`Concept A reference at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1086 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Track your money/ }),
    ).toBeVisible();
    const google = page.locator(".hero-actions .google-action");
    await expect(google).toHaveAttribute("method", "post");
    await expect(google).toHaveAttribute("action", "/auth/sign-in");
    await expect(google.getByRole("button")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await capture(page, {
      path: `artifacts/design-recovery/actual-homepage-${width}.png`,
      fullPage: true,
    });
  });
test("savings goal preserves exact input through pending and failure, then refreshes saved progress", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1086 });
  await page.goto(`${harness}/?view=insights&fidelity=1`);
  await page.getByRole("button", { name: "Manage Goals", exact: true }).click();
  await page
    .getByRole("button", { name: "Add savings goal", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Goal name", { exact: true })
    .fill("Synthetic browser goal");
  await dialog
    .getByLabel("Target amount (RM)", { exact: true })
    .fill("4000.00");
  await dialog
    .getByLabel("Recorded savings (RM)", { exact: true })
    .fill("1234.56");
  let fail = true;
  let releaseFirst = () => {};
  const firstResponse = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  let observed: Record<string, unknown> | undefined;
  await page.route("**/api/finance", async (route) => {
    if (route.request().method() === "POST") {
      observed = route.request().postDataJSON();
      if (fail) await firstResponse;
      await route.fulfill({
        status: fail ? 503 : 200,
        json: fail ? { error: "SAVE_FAILED" } : { ok: true },
      });
    } else {
      const data = fidelitySample();
      data.goals.push({
        id: String(observed?.id),
        name: "Synthetic browser goal",
        target_amount: "4000.00",
        saved_amount: "1234.56",
        target_date: null,
      });
      await route.fulfill({ json: data });
    }
  });
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "Saving…", exact: true }),
  ).toBeDisabled();
  await capture(page, {
    path: "artifacts/design-recovery/actual-goal-loading-390.png",
    fullPage: false,
  });
  releaseFirst();
  await expect(dialog.getByRole("alert")).toContainText(
    "could not be confirmed",
  );
  await expect(
    dialog.getByLabel("Recorded savings (RM)", { exact: true }),
  ).toHaveValue("1234.56");
  await capture(page, {
    path: "artifacts/design-recovery/actual-goal-error-390.png",
    fullPage: false,
  });
  expect(observed).toMatchObject({
    kind: "goal",
    name: "Synthetic browser goal",
    target_amount: "4000.00",
    saved_amount: "1234.56",
    target_date: null,
    edit: false,
  });
  expect(observed).not.toHaveProperty("user_id");
  fail = false;
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  const goal = page.locator(".savings-goal").filter({
    has: page.getByRole("heading", {
      name: "Synthetic browser goal",
      exact: true,
    }),
  });
  await expect(goal).toContainText("RM 1,234.56");
  await expect(goal.getByRole("progressbar")).toHaveAttribute("value", "3086");
});
test("transaction filters reset pagination and category chips select the actual field", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=activity&fidelity=1`);
  await page
    .getByRole("combobox", { name: "Reporting period", exact: true })
    .selectOption("all");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.locator(".table-pagination [aria-current]")).toHaveText(
    "2",
  );
  await page
    .locator(".category-filter-strip")
    .getByRole("button", { name: "Transport", exact: true })
    .click();
  await expect(page.locator(".table-pagination [aria-current]")).toHaveText(
    "1",
  );
  await expect(page.locator(".transaction-table tbody tr")).toHaveCount(6);
  await page.setViewportSize({ width: 390, height: 1086 });
  await page
    .getByRole("button", { name: "Add transaction", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("group", { name: "Category", exact: true })
    .getByRole("button", { name: "Transport", exact: true })
    .click();
  await expect(
    dialog.getByRole("combobox", { name: "Category", exact: true }),
  ).toHaveValue("qa-category-1");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await capture(page, {
    path: "artifacts/design-recovery/actual-transaction-390.png",
    fullPage: false,
  });
});
test("mobile transfer preview preserves the combined total and displays exact after amounts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1086 });
  await page.goto(`${harness}/?view=accounts&fidelity=1`);
  await page.getByRole("button", { name: "Transfer", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("combobox", { name: "Source account", exact: true })
    .selectOption("qa-bank-1");
  await dialog
    .getByRole("combobox", { name: "Destination account", exact: true })
    .selectOption("qa-wallet-1");
  await dialog.getByLabel("Amount (RM)", { exact: true }).fill("100.01");
  await dialog
    .getByLabel("Date & time (Malaysia)", { exact: true })
    .fill("2026-10-24T12:00");
  await expect(dialog.locator(".transfer-preview")).toContainText(
    "RM 26,607.59",
  );
  await expect(dialog.locator(".transfer-preview")).toContainText("RM 578.81");
  expect((await dialog.boundingBox())?.y).toBe(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await capture(page, {
    path: "artifacts/design-recovery/actual-transfer-390.png",
    fullPage: false,
  });
});
for (const view of ["activity", "accounts", "insights", "settings"])
  test(`empty ${view} at 390`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1086 });
    await page.goto(`${harness}/?view=${view}&empty=1`);
    await expect(page.locator("main h1")).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await capture(page, {
      path: `artifacts/design-recovery/actual-empty-${view}-390.png`,
      fullPage: true,
    });
  });
