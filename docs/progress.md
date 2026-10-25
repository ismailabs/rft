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

## Visual fidelity recovery checkpoint — 2026-10-24

The owner's recovery directive in docs/visual-recovery-directive.md supersedes the earlier visual interpretation. Five approved desktop/homepage sources and all M1–M8 references were inspected; all 25 surviving/current source PNGs were visually opened. The owner approved shared leaf/green branding, minimum responsive adaptations, retaining the old round-logo removal, and white Google-compliant buttons in their reference positions. Registered hashes preserve the 20 surviving original PNGs and five additions. The original handoff root is preserved byte-for-byte before the exact identified Next.js-generated appendix; the source audit passes.

Actual work: reference-based shell, Concept A homepage, dashboard, transaction table plus entry form, accounts/transfer, insights, responsive rows/skyline, exact month reports, and additive savings-goal CRUD/schema/UI. Google POST sign-in and authenticated service boundaries remain intact. New goal migration has NOT been applied to hosted Supabase at this checkpoint. Goal database rehearsal passed 17 local checks sequentially, including owner/RLS/MFA/exact money/restore coverage. Earlier full browser run: 24 passed, 7 failures/timeouts; these remain open. Subsequent source refinements require a fresh production build and full browser verification. No current visual-completion claim, no release, no new public URL.

Known next work: finish supporting mobile layouts; inspect actual refined renders and reference comparisons; verify goal persistence and new interactions; run full static, unit/integration, browser/accessibility and source/security gates; publish reviewed source to the existing draft PR. Existing owner-only production gates remain blocked and must not be downgraded. White Google button and leaf install-icon source changes are implemented but have not yet passed the fresh browser run.

## Visual recovery: current hosted and verification state

Optional manual savings goals were applied with migration 20261024090654. Metadata confirms eight RLS tables, two goals policies (owner + restrictive assurance), authenticated-only grants, invoker snapshot, and unchanged aggregate ledger counts. Two Google identities/one profile/two verified factors remain undesignated; no identity was impersonated or deleted. Supabase retains the existing password-protection advisor warning; the app remains Google-only.

Fresh full local verify passed 76 tests/type/lint/build/source/secret checks; npm audit reports zero vulnerabilities. Expanded browser run was 62 passed/2 failed. One failure was real standalone-preview decoration overflow, now repaired; the other was Windows screenshot-file open UNKNOWN after the stress layout assertion passed. Both cases plus three interactions passed the focused 5/5 rerun; latest Settings refinement passed 7/7 with fresh type/lint. A final complete browser run is underway against the current build; no green full-run claim is made yet. Vercel still lists only baseline placeholder c669f6e; no implementation deployment. Source/CI publication and final comparison review follow.

## Visual recovery: frozen source and owner clarification

The last frozen local verify ran 79 tests: 64 passed and 15 database cases were skipped after the unchanged beforeAll exceeded 30 seconds. The run failed. Earlier database/probe rehearsal passed 17/17; no timeout or assertion was weakened. The current M4 daily chart has seven passing reporting-unit cases and independently inspected native-browser captures at 390/768/1448/1920; exact synthetic total 2,596.20 and mobile section order are recorded in m4-native-verification.json. The latest production build and custom secret scan passed. Fresh complete CI remains required for this source.

The owner recognizes both Google identities; browser-profile mapping and disposable designation remain open. Approved public operator/contact implemented in EN/BM privacy and terms: Ismail Studio, ismailstudio.my, contact@ismailstudio.my. Homepage credit added. Retention, owner/legal review, recovery, public OAuth, protected main and manual/device gates remain blocked. No deployment.

## Visual recovery: source and clean CI confirmed

Source 7612ed76c9bd03ec53d30adb3c3d74cba7827e0b published in draft PR #1; local/tracking/advertised refs agree and main is unchanged. CI https://github.com/ismailabs/rft/actions/runs/40095971680 completed successfully: clean install, 79/79 unit/integration, build/type/lint/source/secret audit, npm audit zero, 64/64 browser tests. Tested PR merge/source Git trees match. Receipt: artifacts/verification/recovery-ci-receipt.md. Earlier local failures retained.

Owner maps A Current profile (preserve) and B New RFT Test, preserves both and explicitly prohibits deletion. Owner reports B empty. Hosted read-only SQL simulation passes five contexts/eight tables without persistent changes; counts remain 2 Google identities/1 profile/2 factors and unchanged ledger aggregates. Signed-session/write/MFA-removal/deletion proof remains incomplete. EN/BM privacy/terms contact links rendered and captured; operator contact resolved, retention/legal/recovery not resolved. No implementation deployment; post-push Vercel list still baseline only.

## Protected-main and evidence-commit verification

After the owner saved and corrected the ruleset, public GitHub API verification confirms ruleset 25783124 is Active, targets ~DEFAULT_BRANCH and requires a pull request plus GitHub Actions verify (integration 15368), with deletion and non-fast-forward restrictions. Main remains c669f6ea616d266e6d433efec4cf4ac9853602a2 and protected=true. The endpoint does not expose bypass actors to this read-only request; no independent bypass-list claim is made. Receipt: artifacts/verification/main-protection-receipt.json. G12 remains blocked by intended environment/secret-scope verification.

Evidence commit 087801592f2ac5cd9b2c9ac06e1259b340024c1c also passes clean CI https://github.com/ismailabs/rft/actions/runs/40098650105 (job 120886076785): all steps succeeded, 79/79 unit/integration, 64/64 browser tests and zero npm vulnerabilities. Excerpt: artifacts/verification/recovery-evidence-ci-excerpt.log. Application, test, migration, package and workflow source are unchanged from the tested visual recovery source 7612ed7. Source and both receipt checkpoints are published; the existing draft PR stays unmerged. Both designated identities and all existing records are preserved. No implementation deployment or confirmed public URL.

## Mandatory pixel correction — new worktree checkpoint

The owner rejected the preceding visual result and required binding A–E reproduction. This supersedes all earlier visual-acceptance language; the old CI receipts do not verify the new worktree. Base branch/commit: codex/rft-v1 at 1a4896e5b9742bd1df9cdfdab3df2929674c7538. Main and the draft PR remain unmerged. No production action or hosted data change has occurred.

All five desktop originals were opened at full resolution again. Before captures are preserved at 1448 × 1086/DPR 1 in artifacts/pixel-fidelity/before. Three actual rendered iterations and equal-scale comparison sheets are recorded; pass 3 had zero page errors and no missing images. Shared geometry, account artwork, Lucide insights/category/goal icons, tables, entry fields, transfer pickers, charts and the native React homepage preview have been corrected incrementally. The exact bank marks are cropped from reference C, and the small Netflix mark from B; crop/hash provenance is saved. No original asset was overwritten or restored against the owner's removal decision.

The literal test host has a separate reference fixture. Reference inconsistencies remain confined to display-only synthetic data; authenticated calculations and mutations do not consume it. Public illustration figures reconcile to the five displayed accounts. Description and Note retain one persisted field with a checked 300-character combined limit. Account and goal deletion remain behind edit and confirmation dialogs; budget chevrons open details with the existing removal confirmation. No deletion was performed.

Fresh typecheck passes at intermediate checkpoints; the first current production build compiled. Scoped browser checks initially found contrast and label issues (2/7 passed), then passed 6/7 after repairs, leaving invalid definition-list markup. That markup is now repaired; an expanded eight-case scoped run is underway. Later code still needs the final full lint/type/unit/database/build/browser/source/secret verification and A–E captures. Current status is IN PROGRESS, not visually complete or released. Detailed discrepancy register: docs/pixel-fidelity-correction.md.

The backup archive download finished safely before this correction: no tool installation/execution, key creation, dump or Drive upload occurred. The existing free Drive destination remains selected for the later recovery workflow. Both owner identities and all records remain preserved.

## Measured A–E correction — review checkpoint

The actual React screens now use the binding A–E geometry and supplied artwork. Current comparisons are in artifacts/pixel-fidelity/delivery: 1448 × 1086, DPR 1, fonts loaded, zero page errors/missing images on all five routes. All 22 selected panel rectangles are within 1.063 px of hand-measured source bounds (1–2 px raster uncertainty). B/C input-border measurements and C transaction-row ink positions are separately recorded. Source headings were measured and calibrated; remaining font/vector/paint differences are documented, with no pixel-perfect percentage claim.

The five bank marks, Netflix mark and shaded leaf are original reference crops with hashes/coordinates; originals and installed skills are preserved. Literal sample contradictions, chart angles and percentages remain isolated in the synthetic host. Public example figures reconcile. Functional management, date sorting, selection, chart ranges, transfer notes/previews and confirmation flows remain operational. Real RLS/auth/MFA/API/migration/domain code is unchanged. No real identities or records were changed; both owner accounts remain protected and no deletion is authorized.

Complete local verification passed repeatedly at recorded checkpoints: 80 unit/database tests, typecheck, lint, build, original handoff/skills/assets and custom secret scan. Scoped runs passed 14/14 and responsive 18/18; later contrast checks passed 2/2. Actual failures remain recorded: local setup/timeouts, corrected selectors, large-data overflow, an insufficient-contrast link and a populated-transfer button hidden by fixed reference height. The latter is repaired and its stronger submission/retention test passes. The current source is frozen for final verification, draft-PR publication and complete clean CI. Production remains blocked; there is no implemented public deployment URL. See docs/pixel-fidelity-correction.md and docs/release-evidence.json.

## Mandatory correction — clean source CI and release boundary

Correction source fb5fc33d8c27c94478445ccd4c6d72c3b8d250aa is pushed to codex/rft-v1. Both clean CI runs succeeded: PR 40154172781 (inspected job 121051847675) and push 40154168374. Every job step passes: fresh locked install, handoff/skills/assets audit, typecheck, lint, 80/80 unit/database tests, production build, custom secret scan, zero dependency vulnerabilities and 78/78 Chromium tests. Source and tested PR merge Git trees agree. Actual receipts and final before/reference/current screenshots are in artifacts/pixel-fidelity; source/PNG hashes bind the final 1448x1086, DPR1 captures to 82 rendering inputs.

The five final comparison sheets were inspected again; selected panel max delta remains 1.063 px, not a pixel-perfect score. Small glyph/vector/paint and intentional truthful/accessible differences remain recorded, with final visual/manual acceptance outstanding. G01–G04 have current evidence; no broad hosted or production claim is made. A/B identities, all records, original assets and skills remain preserved. Main remains c669f6e; draft PR #1 is unmerged. Post-push Vercel still lists only the baseline placeholder. No implementation deployment or confirmed public URL.

Stale operations/owner notes now reflect the already selected existing Drive destination and Active branch rules; no upload, keys, dump or paid activation occurred. Recovery, hosted signed-session/MFA/deletion, public OAuth, intended environment scopes, privacy/retention and physical-device gates remain blocked. See docs/pixel-fidelity-correction.md, docs/owner-actions.md and docs/release-evidence.json.

## Owner acceptance of mandatory A–E correction

On 2026-10-25 the owner explicitly replied “Accept the corrected visuals with the documented differences” after reviewing the five original-left/current-right comparison sheets. The visual correction review is resolved. This does not approve deployment or waive manual accessibility, hosted isolation/MFA/deletion, operational recovery, public OAuth, privacy or other release gates. Both real identities remain preserved; no deletion is authorized.

Evidence-only head 2002d3bb19b13e1b669fbe39642eedba2ba647e3 passed both clean PR CI 40154643920 (inspected job 121053305064) and push CI 40154641157. All steps succeeded: 80/80 unit/database tests, 78/78 browser tests, zero npm vulnerabilities and preserved-source/custom secret audits. Application/tests/migrations/packages/workflow remain identical to correction source fb5fc33. Main and the baseline-only Vercel deployment remain unchanged.

## Production preparation; encrypted backups cancelled by owner

On 2026-10-25 the owner directed “cancel encrypted backups, continue with the deployment and production”. Backup work stopped immediately. Before cancellation, the portable PostgreSQL 17.11/age 1.3.2 tools were extracted outside OneDrive; a 1 MiB synthetic age round trip, wrong-key rejection and tamper rejection passed, and its disposable test keys were removed. No native DB rehearsal, hosted dump, production key, upload or schedule was started. The uncommitted preparation scripts are preserved only in ignored artifacts/private/cancelled-backup-preparation. No backup/key-custody owner action is requested. EN/BM privacy/deletion copy now states there is no application-managed backup and deleted/lost data may not be recoverable. This does not fabricate a recovery pass.

Authenticated Vercel CLI independently confirms Hobby for the exact intended team. The repository is linked locally (ignored .vercel configuration) to the existing RFT project, with no new project/domain/service. Production-only variables are configured and independently metadata-checked; the admin key is a server-only Secret and passed read-only authorization. No Preview or Development credentials were added. Standard Protection is configured for preview and deployment URLs, preserving public production domains. Receipt: artifacts/verification/production-preparation-receipt.json. No keys, token values or identity metadata are in it.

Google-only settings remain confirmed by read-only API. The owner has actionable steps to set the confirmed production callback in Supabase and inspect/publish the RFT Google audience. Windows automation could open Edge Personal but its window became unavailable before the correct RFT project was selected; no Google/Auth security settings were changed by UI automation. Existing real identities and records remain preserved; no deletion is authorized. Full source verification for the legal-copy change is pending. No implementation deployment/public URL is confirmed; main remains unchanged and Git deployment stays disabled while remaining gates are unresolved.

Owner reports completion of the production Site URL/callback and Google audience publishing steps. This is recorded as owner-reported completion, not an independently observed public sign-in/session lifecycle. No repeat confirmation requested. Fresh read-only Supabase counts remain 2 users/2 Google identities/1 RFT profile/2 verified MFA factors; no record or identity mutation occurred. Current full local verification passed 80/80 tests, typecheck, lint, build, preservation audit and custom secret scan. Four actual EN/BM privacy/terms renders at 1100px have loaded fonts, no page errors/missing images or horizontal overflow; source/PNG hashes are in artifacts/verification/production-notices/receipt.json. Broader hosted/manual gates remain open.

## Owner notice approval and signed-session verification preparation

The owner approved the factual EN/BM notices for publication, including the no-application-backup and possible-data-loss statements, and the proposed dated final paragraph. Only the approved status paragraphs changed. This is approval of facts, not legal certification. Final publication renders remain pending a fresh build; the prior draft renders are preserved as review evidence.

The owner offered a third Google test identity. A/B remain preserved and no identity deletion is authorized. A new loopback-only verifier accepts normal requests from the owner's signed-in RFT browser, validates the real Supabase session, compares the identity against the two protected hashes and records only authentication flags/counts. It has no mutation/deletion endpoint, uses no privileged key and never logs cookies, IDs or financial payloads. Anonymous verification correctly reports UNAUTHENTICATED with private/no-store. Earlier automated QA windows did not capture the owner's actual sign-in; those signed-out results are retained, not counted as a passed security test. The owner reports RFT opens after the private MFA step; their reply did not establish the pre-MFA API error.

The explicit backup cancellation plus factual notice approval is recorded as the sole G14 scope exception in `docs/production-release-policy.json`. G14 remains not-run/recovery_verified=false. The original handoff/validator stays unchanged. The effective structural guard keeps every other gate mandatory, requires the direct owner provenance and rejects false recovery passes or missing evidence. Its 11 behavioral cases passed; type checking found a test-fixture type omission, corrected without changing an assertion. Fresh typecheck/lint subsequently pass. Full updated verification is still pending. No deployment or hosted record mutation has occurred.

At 06:38 UTC the loopback verifier independently validated a real protected Google session for A at AAL2: finance API 200/private-no-store, direct database account read and invoker finance snapshot allowed. Only safe flags and counts were retained. This is positive assurance evidence, not enrolled-AAL1 bypass denial. No valid separate C receipt has yet been observed; cross-user/write/deletion tests remain blocked.

At 06:46 UTC C was independently validated as a third Google identity distinct from A/B, with current/next assurance AAL1, API 200/private-no-store, direct account SELECT zero rows and an empty financial snapshot (15 initialized categories). This proves permitted unenrolled access and that C does not see A's two accounts. Read-only provider counts confirm three Google identities and the original two verified factors. An accidental protected-identity C attempt was rejected earlier. No fixture writes, authenticator changes or identity deletion occurred.

The private synthetic operator verifier is prepared for C-only CRUD/exact reconciliation, historical month-boundary edits, atomic-transfer denials, eight-table cross-user read/update/delete denials, parent-ID swaps and safe CSV. It pins exact A/C hashes and keeps session clients only in memory; no privileged key or deletion command exists. A helper restart discarded the prior in-memory clients. Subsequent owner-reported refreshes did not produce new valid signed receipts; wrong-profile requests were actually observed and rejected. The latest read-only page identifies A/C automatically and displays its check time. The prepared checks remain unperformed until real signed requests reconnect both identities. No reported result is promoted to a passed test.

Fresh updated typecheck/lint and all 91 unit/database tests pass. The first final-notice axe check failed: legal-page home-link contrast 4.35:1 versus 4.5 required. A three-line rule scopes existing darker green #007750 to that link only. The rebuilt production server and all four EN/BM final notice captures pass fonts, date wording, overflow, page-error and axe checks; all four images were inspected. Draft review renders are preserved. Evidence: artifacts/verification/production-notices-approved, production-followup-unit.log and production-followup-build.log. This affects supporting notices only; accepted A–E geometry/artwork remains unchanged. Current full CI/publication and remaining release gates are still pending. No deployment.

Followup source is frozen at ea6666dba37f997aa14c79faa2df5669204737cd. Fresh authenticated provider reads now independently expose the main ruleset bypass list: empty, with current_user_can_bypass=never. Active default-branch PR/verify/deletion/force-push rules remain. Vercel metadata reconfirms exact project/team, five Production-only variables (server key sensitive), no Preview/Development credentials and Standard Protection. Deployment list still contains only baseline c669f6e. Original source preservation and 303-file custom/browser secret scan pass. Two protected identities retain 21 application rows with the exact same before/after SHA256 aggregate fingerprint; no real row changed. G12 now passes this bounded configuration/secrets evidence. G02 remains blocked pending clean current-source CI; all hosted/manual/public release gaps remain explicit. No identity deletion or implementation deployment.
