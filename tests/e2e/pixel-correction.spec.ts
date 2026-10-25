import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { en } from "../../src/i18n/dictionaries";
const harness = "http://127.0.0.1:5174";

for (const view of ["home", "activity", "accounts", "insights"]) {
  test(`literal reference ${view}: artwork, content and accessibility`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1448, height: 1086 });
    await page.goto(`${harness}/?view=${view}&reference=1`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main h1")).toBeVisible();
    expect(await page.locator(".app-header").boundingBox()).toMatchObject({
      x: 255,
      y: 0,
      width: 1193,
      height: 77,
    });
    const surface = page.locator(
      view === "home" || view === "accounts"
        ? ".balance-summary"
        : view === "activity"
          ? ".transaction-controls"
          : ".insight-summary-grid",
    );
    expect((await surface.boundingBox())?.y).toBe(view === "home" ? 182 : 183);
    for (const img of await page.locator(".institution-artwork img").all())
      expect(
        await img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      ).toBe(true);
    if (view === "home" || view === "accounts") {
      for (const brand of ["maybank", "cimb", "rhb", "tng", "grabpay"])
        await expect(
          page.locator(
            `.financial-account img[src="/institutions/${brand}.png"]`,
          ),
        ).toHaveCount(1);
    }
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}
test("description and optional note survive a failed save without changing exact money", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=activity&reference=1`);
  const form = page.locator(".desktop-composer form");
  await form.getByLabel("Amount (RM)", { exact: true }).fill("24.90");
  await form
    .getByLabel("Description", { exact: true })
    .fill("Synthetic purchase");
  await form
    .getByLabel("Note (optional)", { exact: true })
    .fill("Synthetic receipt reference");
  await page
    .getByRole("button", { name: "Close transaction panel", exact: true })
    .click();
  await expect(form).not.toBeVisible();
  await page
    .getByRole("button", { name: "Add transaction", exact: true })
    .click();
  await expect(form.getByLabel("Amount (RM)", { exact: true })).toHaveValue(
    "24.90",
  );
  let observed: Record<string, unknown> | undefined;
  await page.route("**/api/finance", (route) => {
    observed = route.request().postDataJSON();
    return route.fulfill({ status: 503, json: { error: "SAVE_FAILED" } });
  });
  await form
    .getByRole("button", { name: "Save Transaction", exact: true })
    .click();
  await expect(form.getByRole("alert")).toContainText("could not be confirmed");
  expect(observed).toMatchObject({
    kind: "transaction",
    amount: "24.90",
    note: "Synthetic purchase\n\nSynthetic receipt reference",
    planned: null,
  });
  expect(observed).not.toHaveProperty("user_id");
  await expect(form.getByLabel("Note (optional)", { exact: true })).toHaveValue(
    "Synthetic receipt reference",
  );
  observed = undefined;
  await form.getByLabel("Description", { exact: true }).fill("x".repeat(300));
  await form
    .getByRole("button", { name: "Save Transaction", exact: true })
    .click();
  expect(observed).toBeUndefined();
  await expect(form.getByRole("alert")).toContainText("300");
});
test("literal homepage uses the same React screen with isolated reference figures", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=homepage&reference=1`);
  await page.evaluate(() => document.fonts.ready);
  await expect(
    page.locator(".preview-native-main .balance-copy > strong"),
  ).toHaveText("RM 12,480.75");
  await expect(page.locator(".preview-native-main .metric-change")).toHaveCount(
    3,
  );
  const frame = await page.locator(".preview-window").boundingBox();
  for (const [key, value] of Object.entries({
    x: 623,
    y: 104,
    width: 766,
    height: 522,
  }))
    expect(Math.abs(frame![key as keyof typeof frame] - value)).toBeLessThan(2);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("calculated account shares round the exact ratio once", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=accounts&reference=1&calculated=1`);
  const rows = page.locator(".desktop-account-summary .breakdown-legend li");
  await expect(rows.filter({ hasText: "Maybank" }).locator("small")).toHaveText(
    "55.1%",
  );
  await expect(rows.filter({ hasText: "RHB" }).locator("small")).toHaveText(
    "10.5%",
  );
  await expect(rows.filter({ hasText: "GrabPay" }).locator("small")).toHaveText(
    "3.7%",
  );
  await expect(page.locator(".balance-copy > strong")).toHaveText(
    "RM 11,480.75",
  );
});
test("transfer date can be cleared and restored without a false balance or lost precision", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=accounts&reference=1`);
  const form = page.locator(".desktop-composer form");
  await form.locator(".transfer-date-options > summary").click();
  const date = form.getByLabel("Date & time (Malaysia)", { exact: true });
  await date.fill("");
  await expect(form.locator(".selected-account-detail")).toContainText([
    "—",
    "—",
  ]);
  await date.fill("2026-10-24T12:00");
  await form.getByLabel("Amount (RM)", { exact: true }).fill("100.01");
  await expect(form.locator(".transfer-preview")).toContainText("RM 6,220.49");
  await expect(form.locator(".transfer-preview")).toContainText("RM 2,950.01");
  await expect(page.locator(".desktop-account-summary")).toContainText(
    "RM 11,480.75",
  );
  const note = form.getByLabel("Note (optional)", { exact: true });
  await note.fill("Synthetic internal move");
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/finance", (route) => {
    submitted = route.request().postDataJSON();
    return route.fulfill({ status: 503, json: { error: "SAVE_FAILED" } });
  });
  await form
    .getByRole("button", { name: "Transfer Money", exact: true })
    .click();
  await expect(form.getByRole("alert")).toContainText("could not be confirmed");
  expect(submitted).toMatchObject({
    kind: "transfer",
    amount: "100.01",
    note: "Synthetic internal move",
  });
  await expect(note).toHaveValue("Synthetic internal move");
});
test("balance privacy and transaction selection preserve access to edit actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=home&reference=1`);
  await page.getByRole("button", { name: "Hide balance", exact: true }).click();
  await expect(page.locator(".balance-copy > strong")).toHaveText("••••••••");
  await page.getByRole("button", { name: "Show balance", exact: true }).click();
  await expect(page.locator(".balance-copy > strong")).toHaveText(
    "RM 12,480.75",
  );
  await page.goto(`${harness}/?view=activity&reference=1`);
  await page
    .getByRole("checkbox", {
      name: "Select all rows on this page",
      exact: true,
    })
    .check();
  expect(
    await page.locator(".transaction-table tbody input:checked").count(),
  ).toBe(10);
  await page
    .locator(".desktop-history")
    .getByLabel("Actions: Jaya Grocer Mid Valley", { exact: true })
    .click();
  await page
    .locator(".desktop-history")
    .getByRole("button", { name: "Edit: Jaya Grocer Mid Valley", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByLabel("Amount (RM)", { exact: true }),
  ).toHaveValue("182.30");
});
test("account, goal and budget chevrons retain deletion confirmation without issuing writes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  let writes = 0;
  await page.route("**/api/finance", (route) => {
    writes++;
    return route.abort();
  });
  for (const [view, action] of [
    ["accounts", "Edit: Maybank"],
    ["insights", "Edit: Japan Trip 2027"],
    ["insights", "View budget: Food & Beverage"],
  ]) {
    await page.goto(`${harness}/?view=${view}&reference=1`);
    if (view === "accounts") {
      await page.getByRole("button", { name: "Manage", exact: true }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: action, exact: true })
        .click();
    } else
      await page.getByRole("button", { name: action, exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("button", {
        name:
          view === "insights" && action.startsWith("View budget")
            ? "Delete: Food & Beverage"
            : "Delete",
        exact: true,
      })
      .click();
    await expect(
      page
        .getByRole("dialog")
        .getByRole("heading", { name: en.deleteConfirm, exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    expect(writes).toBe(0);
  }
});

test("chart and account period controls change the actual report", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=home&fidelity=1`);
  const range = page.getByRole("combobox", {
    name: "Chart reporting range",
    exact: true,
  });
  await range.selectOption("3");
  await expect(page.locator(".monthly-panel .bar-month")).toHaveCount(3);
  await range.selectOption("12");
  await expect(page.locator(".monthly-panel .bar-month")).toHaveCount(12);
  await page.goto(`${harness}/?view=accounts&reference=1&calculated=1`);
  await page
    .locator(".desktop-account-summary")
    .getByRole("combobox", { name: "Reporting period", exact: true })
    .selectOption("all");
  await expect(page.locator(".balance-copy > strong")).toHaveText(
    "RM 11,480.75",
  );
});

test("date sorting changes row order", async ({ page }) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=activity&reference=1`);
  const table = page.locator(".desktop-history .transaction-table");
  await expect(
    table.locator("tbody tr").first().locator("td").nth(1),
  ).toHaveText("24 Oct 2026");
  await page
    .getByRole("button", { name: "Date: oldest first", exact: true })
    .click();
  await expect(table.locator("th[aria-sort]")).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await expect(
    table.locator("tbody tr").first().locator("td").nth(1),
  ).not.toHaveText("24 Oct 2026");
  await page
    .getByRole("button", { name: "Date: newest first", exact: true })
    .click();
  await expect(
    table.locator("tbody tr").first().locator("td").nth(1),
  ).toHaveText("24 Oct 2026");
});

test("budget management opens the existing form and preserves unsaved exact limits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(`${harness}/?view=insights&reference=1`);
  await page
    .getByRole("button", { name: "Manage Budgets", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: en.addGoal, exact: true })
    .click();
  const form = page.getByRole("dialog").locator("form");
  await expect(
    form.getByLabel("Monthly limit (RM)", { exact: true }),
  ).toBeVisible();
  await form.getByLabel("Monthly limit (RM)", { exact: true }).fill("123.45");
  await expect(
    form.getByLabel("Monthly limit (RM)", { exact: true }),
  ).toHaveValue("123.45");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("long desktop account records wrap without overlap or page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1448, height: 1086 });
  await page.goto(
    `${harness}/?view=accounts&reference=1&calculated=1&stress=1`,
  );
  const card = page
    .locator(".account-card-grid .account-card-expanded")
    .filter({ hasText: "Synthetic long account name" });
  await expect(card).toHaveCount(1);
  const name = await card.locator(".account-name").boundingBox();
  const amount = await card.locator(":scope > strong").boundingBox();
  expect(amount!.y).toBeGreaterThanOrEqual(name!.y + name!.height - 1);
  const summary = page.locator(".balance-summary");
  await expect(summary.locator(".balance-copy > strong")).toHaveText(
    "RM 19,999,999,999,998,488.93",
  );
  const balance = await summary.locator(".balance-copy > strong").boundingBox();
  const surface = await summary.boundingBox();
  expect(balance!.y + balance!.height).toBeLessThanOrEqual(
    surface!.y + surface!.height,
  );
  const legend = page
    .locator(".desktop-account-summary .breakdown-legend li")
    .filter({ hasText: "Synthetic long account name" });
  const legendName = await legend.locator(":scope > span").boundingBox();
  const legendAmount = await legend.locator(":scope > strong").boundingBox();
  expect(legendAmount!.y).toBeGreaterThanOrEqual(
    legendName!.y + legendName!.height - 1,
  );
  const largeEntry = page
    .locator(".desktop-history .entry-money")
    .filter({ hasText: "9,999,999,999,999,999.99" });
  await expect(largeEntry).toHaveCount(1);
  const entryBox = await largeEntry.boundingBox();
  const cellBox = await largeEntry.locator("..").boundingBox();
  expect(entryBox!.x).toBeGreaterThanOrEqual(cellBox!.x);
  expect(entryBox!.x + entryBox!.width).toBeLessThanOrEqual(
    cellBox!.x + cellBox!.width,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    1448,
  );
});
