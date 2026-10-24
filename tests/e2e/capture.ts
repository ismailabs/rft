import { randomUUID } from "node:crypto";
import { mkdir, writeFile, rename, unlink } from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";
/** Preserve screenshot failures while avoiding in-place writes to cloud-synced files. */
export async function capture(
  page: Page,
  options: NonNullable<Parameters<Page["screenshot"]>[0]> & { path: string },
) {
  const { path: destination, ...settings } = options;
  const target = path.resolve(destination),
    root = path.resolve("artifacts");
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative))
    throw new Error("Screenshot target must remain under artifacts");
  const bytes = await page.screenshot(settings);
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.${randomUUID()}.tmp`;
  await writeFile(temporary, bytes, { flag: "wx" });
  try {
    await rename(temporary, target);
  } catch (error) {
    await unlink(temporary);
    throw error;
  }
}
