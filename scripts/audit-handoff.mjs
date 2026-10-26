import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const handoff = path.join(root, "RFT-Codex-Desktop-Handoff");
const manifest = readFileSync(path.join(root, "MANIFEST.md"), "utf8");
let count = 0;
for (const [, name, bytes, prefix] of manifest.matchAll(
  /\| `([^`]+)` \| (\d+) \| ([0-9a-f]{16}) \|/g,
)) {
  const candidate = path.join(handoff, name);
  const file = existsSync(candidate) ? candidate : path.join(root, name);
  let data = readFileSync(file);
  // Next 16.4.3 appends this exact managed guide during dev. Verify the original
  // byte prefix AND the reviewed appendix; accept no arbitrary instruction edits.
  if (name === "AGENTS.md" && data.length > Number(bytes)) {
    const suffix = data.subarray(Number(bytes));
    if (
      createHash("sha256").update(suffix).digest("hex") !==
      "d3286762dd482129868fd571ad02da3394a176a050affd21f0e1a2693d81fd90"
    )
      throw new Error("Unreviewed root instruction appendix");
    data = data.subarray(0, Number(bytes));
  }
  if (
    data.length !== Number(bytes) ||
    !createHash("sha256").update(data).digest("hex").startsWith(prefix)
  )
    throw new Error(`Handoff mismatch: ${name}`);
  count++;
}
const lock = JSON.parse(readFileSync("skills-lock.json", "utf8")).skills;
const names = readdirSync(".agents/skills", { withFileTypes: true })
  .filter((x) => x.isDirectory())
  .map((x) => x.name)
  .sort();
if (JSON.stringify(Object.keys(lock).sort()) !== JSON.stringify(names))
  throw new Error("Skill inventory differs");
const assetChanges = JSON.parse(
  readFileSync("docs/authorized-asset-changes.json", "utf8"),
);
if (assetChanges.baseline !== "c669f6ea616d266e6d433efec4cf4ac9853602a2")
  throw new Error("Unexpected protected source baseline");
for (const entry of assetChanges.added) {
  if (!entry.path.startsWith("assets/") || !entry.path.endsWith(".png"))
    throw new Error("Unexpected asset change path");
  const actual = createHash("sha256")
    .update(readFileSync(entry.path))
    .digest("hex");
  if (actual !== entry.sha256)
    throw new Error(`Approved new source changed: ${entry.path}`);
}
const changes = execFileSync(
  "git",
  [
    "diff",
    "c669f6ea616d266e6d433efec4cf4ac9853602a2",
    "--name-status",
    "-z",
    "--",
    "assets",
    ".agents/skills",
    "skills-lock.json",
  ],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
for (let i = 0; i < changes.length; i += 2) {
  const status = changes[i],
    file = changes[i + 1];
  const removed = assetChanges.removed.find((e) => e.path === file);
  if (status === "D" && removed) {
    const original = execFileSync("git", [
      "show",
      `${assetChanges.baseline}:${file}`,
    ]);
    if (createHash("sha256").update(original).digest("hex") !== removed.sha256)
      throw new Error("Removed source provenance differs");
    continue;
  }
  if (status === "A" && assetChanges.added.some((e) => e.path === file))
    continue;
  throw new Error(
    `Protected source changed without an owner-recorded exception: ${status} ${file}`,
  );
}
console.log(
  `PASS: ${count} original handoff hashes; ${names.length} skill names; skills unchanged; 20 original PNGs preserved, 1 owner-authorized removal, 5 hash-registered approved additions.`,
);
console.log(
  "Split extraction supported: four entry documents remain at repository root. This is not an application release check.",
);
console.log(
  "Root AGENTS original byte prefix preserved; only the reviewed Next.js 16.4.3 generated documentation appendix is accepted.",
);
