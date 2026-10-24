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
  const data = readFileSync(file);
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
const changes = execFileSync(
  "git",
  [
    "diff",
    "c669f6ea616d266e6d433efec4cf4ac9853602a2",
    "--name-only",
    "--",
    "assets",
    ".agents/skills",
    "skills-lock.json",
  ],
  { encoding: "utf8" },
).trim();
if (changes) throw new Error(`Protected source changed: ${changes}`);
console.log(
  `PASS: ${count} original handoff hashes; ${names.length} skill names; original assets/skills unchanged.`,
);
console.log(
  "Split extraction supported: four entry documents remain at repository root. This is not an application release check.",
);
