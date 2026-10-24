# RFT implementation progress

## 2026-10-24 — Stage 0 completed; Stage 1–3 started

Branch: `codex/rft-v1`. Baseline: `c669f6ea616d266e6d433efec4cf4ac9853602a2`.

- Correct local Git root and `https://github.com/ismailabs/rft.git` confirmed. Local HEAD, tracking ref, and `git ls-remote --heads origin` agree. No modified/deleted tracked files. Root AGENTS/README/MANIFEST/START-HERE and handoff directory were untracked owner additions.
- Every one of the 65 inventory entries matched byte size and SHA-256 prefix. The extraction is split: four root entry documents sit outside the handoff folder. Original structural validator fails on this path assumption; release validator rejects its intentionally unready example as expected. Preserve originals; `scripts/audit-handoff.mjs` supports this actual layout.
- All 12 installed skill directory names match skills-lock.json; source files unchanged from baseline. Lock hashes are upstream aggregate values, not claimed to be individual SKILL.md hashes.
- All 21 PNGs opened individually. Classification and use decisions: `docs/assets-audit.md`.
- Node 24.19.0 and npm 11.17.0 available. Docker, psql, gh not on PATH. No app/package existed before implementation. Bundled Python available.
- GitHub connector confirms public RFT repo and admin/push permission. Supabase RFT `pvsvhfatkfcxgccfnxzq`: active, no public tables, no migrations, zero Auth users. Security advisor warns that `public.rls_auto_enable()` is executable by anon/authenticated. No provider mutation performed during audit.
- Vercel RFT project `prj_eM0EcPUzjg3G31h4jc6uhfo60dBo` verified; Node 24.x, framework unset, existing placeholder production deployment READY; SSO protection enabled. Existing deployment is not the RFT implementation. Billing plan, Git integration triggers, Google OAuth publication, recovery and legal review remain unverified.
- No Google Cloud integration or authenticated dashboard browser session available. No environment variables matching provider credentials present in this shell.

## Working plan

1. Foundation and source-informed design; pure exact finance functions and tests.
2. Local migration rehearsal, negative RLS/MFA/session/parent integrity tests using isolated PostgreSQL runtime. Hosted Auth verification remains separate.
3. SSR Google/optional TOTP flow, protected services; account/category/transaction/transfer workflows.
4. Reports, deterministic insights, optional budgets, export/deletion, EN/BM, PWA.
5. Build, browser, accessibility/security verification; fix failures, record gate evidence, commit/push/PR after review.
6. Production only after G01–G15 evidence. Do not let a Git push automatically release production.

No new deployment or hosted schema mutation yet. No money spent or paid service enabled. Implementation remains in progress.

## 2026-10-24 — First implementation and verification cycle

- Added Next.js foundation, pure bigint money/time/report/CSV modules, versioned additive SQL, RLS/session/MFA helper and ownership/date/scale constraints, protected finance APIs, Google PKCE callback, server TOTP management, export/deletion handlers, EN/BM UI, public sample/legal draft routes, account/category/transaction/transfer/budget screens, network-only PWA and source-derived icons.
- `npm test`: 36/36 passed in first corrected run, including 9 isolated PostgreSQL tests and 27 unit cases, with 1,500 property iterations. Further reconciliation and browser tests added after that run remain to be executed.
- `npm run build`: successful Next.js production compile, type validation and route generation (23 routes plus proxy). This run preceded the newest browser-harness source additions and is not final release evidence.
- Initial TypeScript 7/ESLint incompatibility diagnosed; pinned compatible TypeScript 6.0.3 and ESLint 9.39.5. Fixed impossible form intersection and Vitest 5 suite API usage; exact assertions retained. Install audit reports zero vulnerabilities.
- Owner disabled Email provider. Current Auth settings rechecked: HTTP 200, Google true, Email false, anonymous false. Owner confirms Google audience is **Testing**, so public OAuth gate remains blocked.
- Git-triggered Vercel deployment disabled in vercel.json. No source push, new deployment, hosted migration or test-user creation performed.
- Next: browser screenshots/accessibility and synthetic UI harness; broaden DB/recovery/API tests; final static/financial/security verification; review and commit/push/PR if appropriate. Hosted OAuth, legal, actual free-tier/billing, recoverability and complete account lifecycle remain unverified.

## 2026-10-24 — Database setup and browser hardening

- Expanded local run: 45 tests passed, including all-table owner denials, BM taxonomy initialization, synthetic restore/snapshot equality and restored MFA enforcement. Reconciliation properties now run 2,000 iterations across three tests.
- Production Next.js build passed again; lint passed after stable render timestamps replaced Date.now during render. Latest UI refinements still require final regression.
- Public browser checks: homepage at 320/375/430/768/1440, BM routes/FAQ, unauthenticated protected routes/APIs, manifest/icons and network-only worker passed (8 checks). Isolated UI checks found and fixed chart hidden-focus and sheet return-focus defects. Targeted sheet keyboard/save-failure test passed. Full final browser run pending.
- Screenshot review moved mobile Add into a reserved center navigation slot so it no longer covers transaction values. Actual screenshots are in artifacts/screenshots, explicitly synthetic for app-component harness captures.
- Reconfirmed hosted RFT has zero Auth users and zero public tables. Applied three reviewed additive migrations; aligned local migration versions with provider history. Seven RLS tables / 14 policies / zero users verified, security advisors clear. Hosted anonymous probes all 401. See database-rollout.md and hosted-anonymous.json.
- No financial records or test identities inserted into hosted database. Local .env.local contains publishable configuration only and is gitignored. No admin key, new deployment, push or PR yet.
- Google audience remains Testing (owner confirmed); public launch blocked. Legal/operator contact/retention, operational encrypted backups/restore, current provider eligibility/billing, real OAuth/MFA/deletion and protected CI still require evidence.

## 2026-10-24 — Local candidate verification and hosted synthetic workflow

- Final `npm run verify` passed: 65 original hashes, 12 skills/source preservation, TypeScript, zero-warning lint, 46 unit/PostgreSQL tests, production Next.js build and custom source/browser secret scan. Added legacy privileged-JWT detection; scan passes again. npm audit: zero vulnerabilities.
- Full Chromium run: 31 passed, zero skipped/unexpected/flaky. Covers public widths 320/375/430/768/1440, six app views at 320/430/1440, axe, BM/reduced motion, modal/focus/failed-write, maximum amounts/long names, transfer validation and source-entry drill-down. Final screenshot-only adjustment targeted test also passes; aggregate JSON remains the full 31-test receipt.
- Acceptance review added exact four completed KL-week expense buckets and accessible source-entry drill-down. New boundary test covers complete vs partial weeks. Added distinct invalid-authenticator error text and corrected account-detail balance label.
- Genuine Google login reached local authenticated app. Through actual UI, recorded only clearly named synthetic data: opening estimates 100.00 + 50.00, income 25.20, expense 5.10, transfer 10.34. App and a separately restricted hosted SQL read agree on 109.76 / 60.34 / total 170.10; transfer leaves income/expense unchanged. Authenticated CSV reviewed, exactly three synthetic entries. See artifacts/verification/live-workflow.md.
- Owner reports MFA enrollment and fresh sign-in challenge; Supabase confirms one verified factor. Two-user hosted verification still unproven: provider continues to show one user/profile despite owner preparation replies. No credential/session-token extraction or account deletion performed.
- Supabase organization verified free/tier_free. Vercel actual billing plan remains unverified; connected read tools omit it, browser audit timed out. Original placeholder unchanged. No production deployment or confirmed public app URL.
- Public OAuth remains Testing; direct hosted two-user/MFA bypass/deletion, legal/contact/retention facts, encrypted operational recovery and protected main remain release blockers. Exact owner steps and concrete recovery proposal are in docs/owner-actions.md and docs/operations.md.
- Local updated production server restarted successfully on port 3000. This is a local test environment, not a release. Source delivery/CI receipts follow after safe Git publication.

## GitHub checkpoint

Source commit: `8caa5bcb7b37ec40201b7dbdabad24601b577512`. Draft PR: https://github.com/ismailabs/rft/pull/1 (unmerged). Local HEAD, tracking ref and advertised remote feature SHA matched after push; main remains `c669f6ea616d266e6d433efec4cf4ac9853602a2`. Working tree was clean. No deletions or original assets/skill changes. Git diff --cached --check passed after normalizing only generated log trailing whitespace.

CI run 40059370624 has completed clean npm ci, handoff audit, type/lint/46 tests/build/secret scan and npm audit successfully; browser installation/full test step still running at this checkpoint. Final status is recorded after completion. Post-push Vercel list still contains only the original baseline placeholder deployment, so Git publication caused no new deployment.

## Confirmed clean CI

Run https://github.com/ismailabs/rft/actions/runs/40059370624 completed successfully for tested source 8caa5bcb7b37ec40201b7dbdabad24601b577512. All job steps passed, including fresh npm ci, full verify, npm audit, Chromium install and all 31 browser tests. A redacted result excerpt is in artifacts/verification/ci-receipt.md. No deployment occurred. Production remains blocked by the explicit gate record in docs/release-evidence.json.

## Owner clarification

Owner confirms only one Google account is available, explaining the one-user hosted count. A second legitimate test identity remains an external prerequisite; do not fabricate identities or repeat the same sign-in as a two-user test. Owner also reports Vercel Billing shows Hobby (free). Record this as owner dashboard evidence, distinct from independent provider API confirmation. Public OAuth, authenticated negative/deletion, protected main, privacy and operational recovery gates remain blocked. No deployment.

## Final HTTPS cookie hardening

Inspected installed Supabase SSR defaults and current official SSR documentation. Added a shared HTTPS Secure/SameSite=Lax cookie policy to server client and proxy. Two integration cases use the real SSR Google PKCE implementation and mocked Next cookie adapter, with network forbidden, to verify actual emitted cookie options for HTTPS and localhost. Total 48 unit/integration tests pass; type/lint/custom secret scan pass. Final build/CI receipts follow. This does not change the blocked public release decision.

Final local verify including HTTPS cookie policy passed: 48 unit/integration tests, original handoff audit, type/lint, production build and source/browser secret scan. Updated local server restarted successfully. The policy leaves local HTTP cookie transport unchanged; actual HTTPS flags are checked by real SSR PKCE cookie-adapter tests. Hosted/public lifecycle gates remain blocked.

Final application source dd5f90e6fc43d030064dad4c6371112c4c744596 passed clean GitHub CI https://github.com/ismailabs/rft/actions/runs/40060470069, verify job 120772653663: all steps successful, 48 unit/integration tests and 31 Chromium checks. Current receipt: artifacts/verification/ci-final-receipt.md. Release record updated to this tested source; all existing production blockers remain. Any following evidence commit changes documentation only.
