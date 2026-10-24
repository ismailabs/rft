# Verification and release control

The GitHub repository is public. Current official GitHub Actions billing documentation (checked 2026-10-24) confirms standard hosted runners are free for public repositories. The workflow uses ubuntu-latest, no larger runner, no persistent caches and no artifact upload to avoid storage overage. Source action release tags/commit SHAs were resolved from their official repositories. It contains no deployment or provider credential step.

Source: https://docs.github.com/en/billing/concepts/product-billing/github-actions

`RFT verification / verify` runs clean locked install, original-handoff/protected-source audit, type/lint/unit/database/build, dependency audit, and Chromium public/synthetic-component tests. Browser screenshots from the component host are synthetic UI evidence, not real hosted Auth evidence. The test host is under tests/ and is not deployed by Next.js.

`main` branch currently reports `protected: false` (GitHub API, 2026-10-24). Production is blocked until required verification is enforced. A pull request and green run do not themselves enable branch protection.

`vercel.json` disables Git-triggered deployment for every branch. No merge or production deployment should bypass G01–G15, privacy/operational review, Google audience publication and actual Auth lifecycle tests. Deployment is an explicit future gated operation. G16 must be verified after any authorized release.

For the owner after the first successful CI run: GitHub → ismailabs/rft → Settings → Rules → Rulesets → New branch ruleset. Name it “RFT main protection”, target the default branch, require a pull request and the “verify” check from “RFT verification”, block force pushes/deletions, and set enforcement to Active. Do not enable a paid feature if GitHub asks for an upgrade. Codex will inspect the resulting protection before release.
