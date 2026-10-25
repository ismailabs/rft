# Verification and release control

The GitHub repository is public. Current official GitHub Actions billing documentation (checked 2026-10-24) confirms standard hosted runners are free for public repositories. The workflow uses ubuntu-latest, no larger runner, no persistent caches and no artifact upload to avoid storage overage. Source action release tags/commit SHAs were resolved from their official repositories. It contains no deployment or provider credential step.

Source: https://docs.github.com/en/billing/concepts/product-billing/github-actions

`RFT verification / verify` runs clean locked install, original-handoff/protected-source audit, type/lint/unit/database/build, dependency audit, and Chromium public/synthetic-component tests. Browser screenshots from the component host are synthetic UI evidence, not real hosted Auth evidence. The test host is under tests/ and is not deployed by Next.js.

GitHub's read-only public API confirms Active default-branch ruleset 25783124 (rechecked 2026-10-25): require a pull request and GitHub Actions `verify` check (integration 15368), prevent deletion and force pushes. Main remains at c669f6e. The endpoint does not expose bypass actors, so it is not independent evidence of an empty bypass list. Intended environment/secret scopes and the other release gates remain blocked.

`vercel.json` disables Git-triggered deployment for every branch. No merge or production deployment should bypass G01–G15, privacy/operational review, Google audience publication and actual Auth lifecycle tests. Deployment is an explicit future gated operation. G16 must be verified after any authorized release.

The owner has completed the ruleset setup. Preserve **Settings → Rules → Rulesets → RFT main protection** with Active enforcement and the existing required check. Do not merge around blocked release gates or enable a paid feature. The current source is in draft PR #1; new visual-correction CI is recorded separately from historical recovery CI.
