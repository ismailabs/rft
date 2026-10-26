import fs from "node:fs/promises";
import path from "node:path";
const iteration = process.argv[2];
if (!/^[a-z0-9-]+$/.test(iteration || ""))
  throw new Error("Supply a capture iteration");
const folder = path.resolve("artifacts/pixel-fidelity", iteration);
const capture = JSON.parse(
  await fs.readFile(path.join(folder, "geometry.json"), "utf8"),
);
// Hand-measured source-raster edges have approximately 1–2 px uncertainty.
// A panel's DOM rectangle is not a pixel-similarity score or visual acceptance.
const targets = {
  A: [
    ["balance", "balance-summary", null, [285, 182, 712, 140]],
    ["flows", "metric-grid", null, [285, 338, 712, 117]],
    ["monthly", "monthly-panel", null, [285, 471, 712, 264]],
    ["recent", "rft-panel", "Recent Transactions", [285, 751, 712, 305]],
    ["accounts", "rft-panel", "Accounts", [1012, 182, 407, 484]],
    ["insights", "dashboard-insights", null, [1012, 683, 407, 372]],
  ],
  B: [
    ["filters", "transaction-controls", null, [277, 183, 783, 260]],
    ["history", "rft-panel", undefined, [277, 457, 783, 576]],
    ["composer", "desktop-composer", null, [1076, 95, 365, 950]],
  ],
  C: [
    ["balance", "balance-summary", null, [285, 183, 697, 140]],
    ["accounts", "rft-panel", "Your Accounts", [285, 338, 697, 414]],
    [
      "recent",
      "rft-panel",
      "Recent Account Transactions",
      [285, 769, 697, 292],
    ],
    ["transfer", "desktop-composer", null, [997, 183, 423, 619]],
    ["summary", "desktop-account-summary", null, [997, 818, 423, 243]],
  ],
  D: [
    ["summary", "insight-summary-grid", null, [286, 183, 1134, 158]],
    ["categories", "category-breakdown", null, [286, 356, 610, 334]],
    ["comparison", "monthly-panel", null, [910, 356, 511, 334]],
    ["budgets", "budget-progress", null, [286, 704, 593, 350]],
    ["goals", "rft-panel", "Goals Progress", [891, 704, 530, 350]],
  ],
  E: [
    ["hero", "concept-a-hero", null, [0, 77, 1448, 566]],
    ["preview", "preview-window", null, [623, 104, 766, 522]],
    ["features", "feature-card-grid", null, [56, 936, 1334, 124]],
  ],
};
const rows = [];
for (const [screen, panels] of Object.entries(targets)) {
  for (const [panel, className, title, target] of panels) {
    const matches = capture.screens[screen].boxes.filter(
      (b) =>
        b.selector.split(" ").includes(className) &&
        (title === null || b.title === title) &&
        (screen !== "B" || panel !== "history" || b.height > 500),
    );
    if (matches.length !== 1)
      throw new Error(
        `${screen}/${panel}: expected one measured rectangle, found ${matches.length}`,
      );
    const b = matches[0];
    const actual = [b.x, b.y, b.width, b.height];
    const delta = actual.map((n, i) => Number((n - target[i]).toFixed(3)));
    rows.push({
      screen,
      panel,
      reference: target,
      actual,
      delta,
      maxAbsoluteDelta: Math.max(...delta.map(Math.abs)),
    });
  }
}
const result = {
  referenceUncertaintyPixels: "approximately 1–2",
  note: "Geometry diagnostic only; no pixel-perfect or similarity-percentage claim.",
  rows,
  maxAbsoluteDeltaPixels: Math.max(...rows.map((r) => r.maxAbsoluteDelta)),
};
await fs.writeFile(
  path.join(folder, "measurements.json"),
  JSON.stringify(result, null, 2) + "\n",
  { flag: "wx" },
);
console.log(
  JSON.stringify({
    panels: rows.length,
    maxAbsoluteDeltaPixels: result.maxAbsoluteDeltaPixels,
    above2Pixels: rows.filter((r) => r.maxAbsoluteDelta > 2),
  }),
);
