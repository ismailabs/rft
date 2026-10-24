import { capture } from "./capture";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 375, 430, 768, 1440]) {
  test(`public homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: /Track your money\.\s*A brighter tomorrow\./,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Illustrative sample — not your financial data"),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await capture(page, {
      path: `artifacts/screenshots/public-${width}.png`,
      fullPage: true,
    });
  });
}
test("BM language, FAQ and public routes work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "BM", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: /Jejaki wang anda\.\s*Esok yang lebih cerah\./,
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ms");
  await page
    .getByText("Adakah RFT bersambung dengan bank saya?", { exact: true })
    .click();
  await expect(
    page.getByText("Tidak. Anda memasukkan catatan sendiri.", { exact: false }),
  ).toBeVisible();
  for (const route of ["/privacy", "/terms", "/preview", "/login"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("protected pages and direct APIs fail closed without configuration/session", async ({
  page,
  request,
}) => {
  for (const path of [
    "/app",
    "/app/accounts",
    "/app/transactions",
    "/app/insights",
    "/app/settings",
    "/auth/mfa",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login/);
  }
  for (const path of ["/api/finance", "/api/export"]) {
    const response = await request.get(path);
    expect([401, 503]).toContain(response.status());
    expect(response.headers()["cache-control"]).toContain("no-store");
  }
  for (const path of [
    "/api/finance",
    "/api/delete-account",
    "/api/mfa",
    "/api/onboarding",
  ]) {
    const response = await request.post(path, {
      headers: { origin: "https://foreign.invalid" },
      data: {},
    });
    expect(response.status()).toBe(401);
  }
});
test("PWA manifest and worker never cache finance responses", async ({
  request,
}) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.name).toBe("Ringgit Finance Tracker");
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  const worker = await (await request.get("/sw.js")).text();
  expect(worker).not.toMatch(
    /caches\.(open|put)|addEventListener\(['"]fetch|indexedDB|localStorage/,
  );
});
