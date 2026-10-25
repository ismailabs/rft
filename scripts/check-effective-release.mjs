// Structural guard only. Actual human provenance, logs and provider state still
// require inspection. The original handoff validator remains unmodified.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { evaluateEffectiveRelease } from "./lib/release-policy.ts";
try {
  const evidence = JSON.parse(fs.readFileSync(process.argv[2] || "docs/release-evidence.json", "utf8"));
  const policy = JSON.parse(fs.readFileSync(process.argv[3] || "docs/production-release-policy.json", "utf8"));
  const result = evaluateEffectiveRelease(evidence, policy);
  if (execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim())
    result.problems.push("Working tree is not clean");
  try {
    execFileSync("git", ["cat-file", "-e", `${evidence.source_commit}^{commit}`], { stdio: "pipe" });
    execFileSync("git", ["diff", "--quiet", evidence.source_commit, "HEAD", "--", "src", "tests", "scripts", "public", "supabase", ".github", "package.json", "package-lock.json", "vercel.json"], { stdio: "pipe" });
  } catch { result.problems.push("Current application/test/release source differs from the tested evidence commit"); }
  result.ready = result.problems.length === 0;
  console.log(JSON.stringify({ ...result, scope: "Effective predeployment structure only; not independent proof or an automatic deployment", recoveryTested: false }, null, 2));
  process.exitCode = result.ready ? 0 : 1;
} catch {
  console.error("BLOCKED: unreadable or invalid release evidence/policy");
  process.exitCode = 2;
}
