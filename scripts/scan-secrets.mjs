import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
const rules = [
  ["privileged Supabase key", /sb_secret_[A-Za-z0-9_-]{20,}/g],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["GitHub token", /\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{25,}/g],
  ["Google OAuth secret", /GOCSPX-[A-Za-z0-9_-]{20,}/g],
];
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const problems = [];
let checked = 0;
function hasLegacyPrivilege(source) {
  return [
    ...source.matchAll(
      /\beyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+\b/g,
    ),
  ].some((match) => {
    try {
      return (
        JSON.parse(Buffer.from(match[1], "base64url").toString()).role ===
        "service_role"
      );
    } catch {
      return false;
    }
  });
}
for (const file of files) {
  if (
    !/\.(?:ts|tsx|js|mjs|json|md|sql|yml|yaml|toml|ps1|py|example|log|txt)$/.test(
      file,
    ) ||
    file.startsWith(".agents/")
  )
    continue;
  const source = readFileSync(file, "utf8");
  checked++;
  if (hasLegacyPrivilege(source))
    problems.push(`${file}: legacy privileged JWT`);
  for (const [label, pattern] of rules) {
    pattern.lastIndex = 0;
    if (pattern.test(source)) problems.push(`${file}: ${label}`);
  }
}
function walk(folder) {
  if (!existsSync(folder)) return;
  for (const name of readdirSync(folder)) {
    const file = path.join(folder, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (/\.(js|json|html)$/.test(file)) {
      const source = readFileSync(file, "utf8");
      if (hasLegacyPrivilege(source))
        problems.push(`${file}: legacy privileged JWT`);
      for (const [label, pattern] of rules) {
        pattern.lastIndex = 0;
        if (pattern.test(source)) problems.push(`${file}: ${label}`);
      }
      if (source.includes("SUPABASE_SECRET_KEY"))
        problems.push(`${file}: server-only variable name in browser output`);
    }
  }
}
walk(".next/static");
walk("public");
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(
  `PASS: custom source/asset scan (${checked} text files) and browser output checks. No configured privileged key patterns found. This is not a Gitleaks audit.`,
);
