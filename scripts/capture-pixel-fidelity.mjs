import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const iteration = process.argv[2];
if (!/^[a-z0-9-]+$/.test(iteration || ""))
  throw new Error("Supply a new iteration name");
const root = path.resolve("artifacts/pixel-fidelity", iteration);
await fs.mkdir(root, { recursive: true });
let browser;
let page;
const result = { viewport: { width: 1448, height: 1086, dpr: 1 }, screens: {} };
const references = [
  "01_37_16 PM-1",
  "01_37_18 PM-3",
  "01_37_20 PM-4",
  "01_37_21 PM-5",
  "01_37_17 PM-2",
];
try {
  for (const [i, view] of [
    "home",
    "activity",
    "accounts",
    "insights",
    "homepage",
  ].entries()) {
    if (process.argv.includes("--app-only") && i === 4) continue;
    const id = "ABCDE"[i];
    const only = process.argv
      .find((arg) => arg.startsWith("--screen="))
      ?.split("=")[1];
    if (only && id !== only) continue;
    // Release each renderer before the next screen on the owner's 4 GB machine.
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({
      viewport: { width: 1448, height: 1086 },
      deviceScaleFactor: 1,
    });
    const errors = [];
    const collect = (e) => errors.push(e.message);
    page.on("pageerror", collect);
    await page.goto(
      i === 4 && process.argv.includes("--public-homepage")
        ? "http://127.0.0.1:3000/"
        : `http://127.0.0.1:5174/?view=${view}&reference=1`,
    );
    try {
      await page.locator("main h1").waitFor();
    } catch (error) {
      console.error(id, errors);
      throw error;
    }
    await page.waitForFunction(() => document.fonts.status === "loaded");
    result.screens[id] = await page.evaluate(() => ({
      fontStatus: document.fonts.status,
      devicePixelRatio: window.devicePixelRatio,
      scrollWidth: document.documentElement.scrollWidth,
      boxes: [
        ...document.querySelectorAll(
          ".app-sidebar,.app-header,.page-heading,.balance-summary,.metric-grid,.rft-panel,.desktop-composer,.insight-summary-grid,.insight-summary-grid>.factual-insight,.concept-a-copy,.desktop-preview-wrap,.preview-window,.concept-a-hero,.feature-card-grid",
        ),
      ].map((el) => {
        const r = el.getBoundingClientRect(),
          s = getComputedStyle(el);
        return {
          selector: el.className,
          title: el.querySelector("h1,h2")?.textContent,
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          font: s.fontFamily,
          background: s.backgroundColor,
          radius: s.borderRadius,
          padding: s.padding,
        };
      }),
      missingImages: [...document.images]
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute("src")),
    }));
    result.screens[id].errors = errors;
    await fs.writeFile(
      path.join(root, "geometry.partial.json"),
      JSON.stringify(result, null, 2) + "\n",
    );
    const shot = await page.screenshot({ fullPage: false });
    await fs.writeFile(path.join(root, `${id}.png`), shot, { flag: "wx" });
    const original = await fs.readFile(
      `assets/ChatGPT Image Oct 24, 2026, ${references[i]}.png`,
    );
    await sharp({
      create: { width: 2896, height: 1086, channels: 3, background: "white" },
    })
      .composite([
        { input: original, left: 0, top: 0 },
        { input: shot, left: 1448, top: 0 },
      ])
      .png()
      .toFile(path.join(root, `${id}-comparison.png`));
    page.off("pageerror", collect);
    console.log(`${id}: captured; ${errors.length} page errors`);
    await browser.close();
    browser = undefined;
  }
  await fs.writeFile(
    path.join(root, "geometry.json"),
    JSON.stringify(result, null, 2) + "\n",
    { flag: "wx" },
  );
} finally {
  await browser?.close();
}
