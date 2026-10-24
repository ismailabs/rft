# Visual recovery implementation and verification — 2026-10-24

Status: implementation is under final source-delivery verification; production remains blocked. This report supersedes the earlier warm/teal desktop interpretation and 48-test application checkpoint. The original handoff files remain preserved. No production URL for this implementation is confirmed.

## Implemented scope

The Concept A public page (`src/app/page.tsx`) now uses the approved headline, large real-DOM desktop preview, benefits and four feature cards. `src/components/brand.tsx`, the manifest and install PNGs share the approved leaf geometry. `src/components/google-action.tsx` uses a POST form, authentic Google G and the owner-approved white button; its font and mark are local assets with recorded provenance.

`src/features/finance/finance-app.tsx`, `visual-components.tsx`, `entry-form.tsx` and `src/app/recovery.css` implement the shared rail/top bar, A dashboard, B table/filters/pagination/right form, C account cards/internal transfer/right summary, D category/monthly charts/budgets/real saved-goal progress, responsive mobile rows/skyline, M1 two-card overview, M2 chips, M5 account-type summary, M7 detail and M8 grouped settings. Supporting screens keep their authenticated route behavior. The transaction search query is passed safely through its server page. No source screenshot is used as visitor-facing application UI.

`src/domain/finance/reporting.ts` computes Malaysia calendar-month reports and seven-day expenses with bigint sen. Charts use exact values for accessible tables and bounded display ratios. Internal transfers remain neutral in income/expense totals. Negative account balances suppress a misleading share ring. Goals are independent manual savings estimates: their updates never post ledger movements. Additive migration `supabase/migrations/20261024090654_rft_savings_goals.sql` is applied and checked; recovery and actual hosted evidence are in `docs/savings-goals-migration.md`.

The resumed export fix maps invalid date/range input to HTTP 400. Eighteen handler-level tests cover CSV, recent-auth/MFA, Origin, deletion ordering and failures with network forbidden. Hosted read-only identity probes are prepared and locally rehearsed, but have not been run against undesignated identities.

## Binding reference mapping

All desktop source filenames have prefix `assets/ChatGPT Image Oct 24, 2026, `.

| Screen | Exact source suffix | Route | Comparison |
|---|---|---|---|
| A Dashboard | `01_37_16 PM-1.png` | `/app` | `artifacts/design-recovery/comparison-A-home.png` |
| B Transactions | `01_37_18 PM-3.png` | `/app/transactions` | `comparison-B-activity.png` in the same directory |
| C Accounts/Transfer | `01_37_20 PM-4.png` | `/app/accounts` | `comparison-C-accounts.png` |
| D Insights/Budgets | `01_37_21 PM-5.png` | `/app/insights` | `comparison-D-insights.png` |
| E Homepage Concept A | `01_37_17 PM-2.png` | `/` | `comparison-E-homepage.png` |

Full mobile M1–M8 source names, routes, original image classifications and the owner's explicit approvals are recorded in `docs/design-reference-register.md`. Each mobile has `comparison-M<number>-<view>.png`. `artifacts/design-recovery/asset-inventory.json` records dimensions and full SHA-256 values. Twenty surviving original PNGs are byte-identical to baseline; five approved additions are hash-registered. The owner explicitly said to keep the old round-logo source removed. The original 65 handoff hashes and 12 installed skill hashes are checked separately. The exact known Next.js-generated AGENTS appendix preserves the original instruction prefix.

## Actual visual evidence and corrections

`artifacts/design-recovery/actual-*.png` are browser renders of React, not mockup/source screenshots. Protected UI captures use a separate synthetic test host with an explicit QA banner and sample names. They cannot prove real hosted sessions or persistence. Public captures render the production Next build. Full captures are retained; desktop comparisons show the first 1086px at the exact reference width of 1448px. A 26px QA banner is visible in protected captures. Mobile reference device frames are retained; actual browser captures are unframed. Modal captures use the viewport so background scroll does not create a misleading full-page composite.

Corrections from actual renders: desktop table restored; preview alignment collision removed; dashboard chart height reduced to align the recent table; M1 oversized stacked charts replaced with side-by-side daily/category cards; compact budgets plus genuinely saved goals restored D's lower panels; settings reordered and compacted; mobile navigation's obsolete grid rule removed; duplicate SVG gradient IDs eliminated; profile labels and collapsed-rail link names corrected; duplicate Activity Add action removed on phone; account sparklines scoped to the selected account; zero-balance ring colors kept consistent. Standalone `/preview` decoration is bounded after its overflow was reproduced. White Google button appearance and POST semantics are browser-asserted.

Deliberate limits: institution source marks remain stylized and have no verified rights/accuracy evidence, so the handoff-authorized Lucide account icons and truthful provider labels remain. Manual accounts replace mockup “link” claims; invented account numbers, notifications, external-transfer tabs, photo identities and device-session counts are omitted. Transfer fees remain separate explicitly recorded expenses. The existing note field serves transaction description; there is no false second persistence field. Optional subcategory appears only when that category has one. Google branding, accessible native controls, truthful explanatory text and touch targets create documented differences from the pictures. Essential manual screen-reader, real device, hosted lifecycle and brand-rights acceptance remain open; no pixel-perfect or full-device acceptance claim is made.

## Verification results and failure history

- Full `npm run verify` passed: protected source audit, typecheck, lint, **76 unit/integration tests**, production build and custom source/browser secret scan. This scan is not Gitleaks. `npm audit --audit-level=moderate` reported **0 vulnerabilities**.
- Local database/probe rehearsal: **17 passed**, including eight-table owner/MFA denials, precision, parent consistency, restore/deletion cascade and planned probe behavior. These are local synthetic checks.
- New populated visual matrix: 24 checks for six views at 390/768/1448/1920, plus two exact-width/wide Concept A checks. Empty screens, pending/error goal saves, exact goal refresh, filter pagination reset, category chip binding and transfer preview have actual browser coverage.
- Earlier browser run: **24 passed, 7 failed** under dev-server/resource contention and genuine accessibility issues. After correction, the targeted production run passed **7/7**. No assertions/timeouts were weakened.
- Subsequent expanded run: **62 passed, 2 failed**. `/preview` had real decorative overflow. The stress case's layout assertion passed, then screenshot file opening returned Windows `UNKNOWN`; disk space was available and exclusive file access succeeded on inspection. The unchanged stress test passed on rerun. The focused repaired run passed **5/5**, covering both previous failures and all three new interactions. Its transfer test asserts dialog top=0. This is a targeted rerun, not a claim that the failed 64-case run was green.
- An earlier new-test selector incorrectly expected “Period”; it was changed to the actual “Reporting period”. A duplicate visible mobile Add control was fixed in the app, preserving the strict selector. Savings-goal loading/failure input survives, refreshed progress uses exact `1234.56`, and the synthetic transfer after-values are asserted exactly.
- Real PGlite checks now run with one worker on this 4 GB machine. This changes scheduling only; no security, financial, accessibility or timeout assertion was removed.

Final settings check, source publication/CI and receipt locations are appended once confirmed. Raw local logs remain in gitignored `artifacts/private/`; reviewed normalized result copies are published separately, preserving failures as well as successes.

## Hosted and deployment boundaries

Migration registration and metadata checks confirm eight RLS tables, goals owner + RESTRICTIVE session/MFA policies, authenticated-only CRUD grants, invoker snapshot with an empty search path, zero goals and unchanged aggregate ledger counts (2 accounts, 2 transactions, 1 transfer, 0 budgets). No real financial amounts, identity details or tokens were read for that check. Supabase security advisor still reports the existing disabled leaked-password-protection warning; Email is disabled and RFT is Google-only. No paid protection setting was enabled.

Latest aggregate Auth metadata: two Google identities, one RFT profile, two verified TOTP factors. The owner recognizes both identities; browser-profile mapping and disposable designation remain unconfirmed for isolation/deletion tests. A server-only deletion key is present locally, but presence does not prove correct-project deletion or authorized session revocation. Google audience remains owner-reported Testing. Owner reports Vercel Hobby (free); Supabase free tier was independently confirmed earlier.

The Vercel project list/deployment list was refreshed: only the original `main` baseline placeholder at `c669f6ea616d266e6d433efec4cf4ac9853602a2` exists. This implementation has no preview/production deployment or confirmed public URL. `vercel.json` disables Git-triggered deployments. The draft PR must remain unmerged. G01–G15 and the added visual acceptance gates still control release; G16 is unrun.

## Required owner actions

Use `docs/owner-actions.md` for exact menu steps. The owner recognizes both Google identities; map them to separate browser profiles and explicitly designate the identity to preserve and any disposable test identity. Complete MFA privately. Never send codes, QR material, credentials, keys or private financial records. Hosted controlled deletion needs explicit identity-specific authorization. The approved public operator/contact is now Ismail Studio, ismailstudio.my and contact@ismailstudio.my, implemented in both language notices. Public OAuth/branding, retention and owner/legal review, feasible encrypted backup/recovery, protected main and real device/screen-reader acceptance remain required before release. No purchase or paid plan is needed or authorized.

## Additional capture diagnosis and current checks

The repeated full delivery run was again 62 passed/2 failed: both failures were screenshot-file opens (home 430 and activity 320), after layout and axe assertions had passed. No assertion failed in that run. After repeated Windows in-place write errors, tests/e2e/capture.ts now captures bytes and atomically replaces a temporary file under artifacts; capture/rename failures still fail the test. The two affected cases plus transaction/transfer screens passed 4/4 with the new writer. Fresh type/lint and the final seven Settings checks passed. Both full-run failures and repaired-run logs are retained under artifacts/verification/recovery-*.log. Final modal captures use viewport mode and the transfer preview is placed after date/note. Main was independently read through the public GitHub branch API: protected=false and still c669f6e. No branch-protection change was made.

## Final M4 correction and resource limit

The last comparison found that M4 still inherited desktop card order. It now begins with exact daily recorded expenses for the selected period (up to 31 displayed days, explicitly dated), then the category ring, two factual summary cards, budgets and savings goals. The six-month comparison remains below. Three new unit tests pass for half-open Malaysia days, future exclusion, the 31-day limit, exact large amounts and empty intervals (reporting module 7/7). Current full-suite total is expected to be 79 until the fresh run confirms it.

Headless M4 checks encountered timeout/capture/context failures while Windows reported 15,936 KB free physical memory; a copy edit also invalidated one run through a Vite reload. No local full headless pass is claimed for that revision. Current rendering was independently inspected and captured through the existing in-app browser at CSS widths 390/768/1448/1920; it confirmed no horizontal overflow, mobile section positions and RM 2,596.20 exact synthetic daily total. Native screenshots exclude the 15px scrollbar; their true dimensions and observed metrics are recorded in artifacts/design-recovery/m4-native-verification.json. The viewport was reset and the temporary tab closed. The native full mobile capture is actual-insights-390-full.png. Reference captures use matching viewport mode; separate budget/goal captures are required in the frozen browser matrix. All assertions remain enabled. Fresh CI remains required before claiming clean current-source browser verification.

The frozen local full-suite attempt ran 79 tests: **64 passed, 15 skipped** because the database beforeAll hook exceeded 30 seconds; the run failed. The earlier unchanged database/probe rehearsal remains 17/17 historical evidence. Native M4 captures verify current rendering, while headless resource failures remain preserved. No timeouts, database, ownership or accessibility assertions were downgraded. The current source must receive a clean 79-test/full-browser CI receipt before it can be described as fully verified.
