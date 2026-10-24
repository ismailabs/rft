> The results below describe the earlier source checkpoint. Current visual recovery, 76-test local results, hosted additive goal migration, failure diagnoses and new screenshots are tracked in docs/visual-recovery-verification.md, docs/progress.md and docs/savings-goals-migration.md. Earlier 48-test CI does not verify the current recovery changes. No production release has occurred.

# RFT verification report — 2026-10-24

Status: **IMPLEMENTED CANDIDATE, PRODUCTION BLOCKED**. Draft PR: https://github.com/ismailabs/rft/pull/1, unmerged. Tested source: `dd5f90e6fc43d030064dad4c6371112c4c744596`. No implemented production deployment or verified public application URL.

## Actual verification

| Check | Observed result and evidence | Practical limit |
|---|---|---|
| Repository/handoff | 65 manifest size/hash prefixes match; all 21 original PNGs visually inspected; 12 installed skills; original assets/skills/lock unchanged. Local/tracking/advertised remote feature SHA matched; main remains baseline. Staged diff/check reviewed, no deletions | Split extraction needs the layout-aware audit; original validator bytes preserved |
| Clean CI | [Run 40060470069](https://github.com/ismailabs/rft/actions/runs/40060470069), verify job 120772653663: success for clean npm ci, type, zero-warning lint, unit/database, production build, custom secret scan, dependency audit and Chromium. Receipt: artifacts/verification/ci-final-receipt.md | Standard public Ubuntu runner, no deployment credentials/step; clean CI does not prove production gates |
| Finance/database | 48 unit/integration tests on Windows and clean Linux CI; 2,000 property iterations, exact vector/history/date/partition/conservation, all-table owner denials, MFA/session/parent IDs, atomic rollback, synthetic restore, deletion cascades and real SSR PKCE HTTPS/localhost cookie options. artifacts/verification/verify-final.log | Local PostgreSQL stubs Supabase-owned Auth tables/functions; no claim of hosted Auth lifecycle from those tests |
| Browser/accessibility | 31/31 Chromium checks, zero skipped/unexpected/flaky; public 320/375/430/768/1440 widths; six app-component views 320/430/1440; axe, BM/reduced motion, failed-save retention, focus, maximum amounts, transfer validation and expense-source drill-down. browser-final.log, playwright.json and screenshots | Component host has synthetic props and no Auth/persistence. Screen reader, physical device and complete authenticated manual acceptance unperformed |
| Real Google/synthetic journey | Authenticated local app observed after real Google login; two QA accounts, synthetic income/expense/transfer persisted; app and restricted hosted SQL reconcile 109.76 + 60.34 = 170.10. CSV downloaded and inspected. live-workflow.md and live-synthetic-export.csv | Testing audience; no real financial data. Full historical edit/delete/second-user hosted regression incomplete |
| MFA | Owner reports enrollment plus sign-out/sign-in challenge; provider independently confirms one verified factor | Direct hosted bypass/removal not independently tested; no QR, seed, code or session token extracted |
| Hosted schema/anonymous | Three additive migrations, seven RLS tables/14 policies, initial empty state confirmed before setup; ten publishable-only REST/RPC probes all 401. database-rollout.md and hosted-anonymous.json | Later Google test account and QA records exist; never repeat empty-project destructive assumptions |
| Current advisors/config | Database/helper findings resolved. Latest advisor has one disabled-password-protection Auth warning; live Auth settings show only Google enabled, email and anonymous false | Password warning is recorded and not called a zero-finding result; no paid password feature enabled |
| Secrets/dependencies | Custom source/browser scan passes, including modern secret and legacy service-role JWT patterns; npm audit zero vulnerabilities locally and in CI | Custom scan is not Gitleaks or an independent penetration test. Server deletion key is absent |
| Costs/deployment | Supabase organization free/tier_free. No purchase/paid activation. Post-push Vercel list still contains only baseline placeholder at c669f6e; Git deployment disabled | Owner reports Vercel Hobby (free); independent plan/quotas, intended env scopes and public OAuth eligibility still unverified |

## Production gates

| Gate | Status | Remaining evidence |
|---|---|---|
| G01 repository integrity | pass | Maintain preserved sources and exact Git receipt |
| G02 reproducible build | pass | Clean CI receipt above |
| G03 money | pass | Exact local/Linux regression evidence above |
| G04 transfer/data integrity | pass | Isolated negative matrix and live synthetic reconciliation; hosted lifecycle also covered by G08 |
| G05 RLS isolation | blocked | Real two-user/direct hosted REST matrix; owner confirms only one Google account is available, matching the one-user provider count |
| G06 public Google/session | blocked | Audience Testing; public intended-production session lifecycle unverified |
| G07 optional MFA | blocked | Hosted direct AAL1/AAL2 bypass and removal checks |
| G08 full scope | blocked | Complete real authenticated P01–P14 acceptance, including historical mutations/goals/second-user checks |
| G09 export/deletion | blocked | CSV works; recent-auth expiry/second-user denials and controlled hosted identity deletion missing |
| G10 design/accessibility | blocked | Automated/visual/keyboard results pass; complete authenticated essential manual acceptance and device gaps unresolved |
| G11 PWA | blocked | Physical installation/update/account-switch privacy verification |
| G12 infrastructure | blocked | Intended env isolation, admin-key scope, protected main and full configuration |
| G13 privacy/legal | blocked | Operator/contact/retention facts and applicable owner/legal review; public pages remain explicit drafts |
| G14 recovery | blocked | Operational encrypted backup destination/schedule/key recovery and real feasible restore procedure; synthetic restore is separate |
| G15 RM0/compliance | blocked | Owner reports Vercel Hobby (free); independent quotas and public OAuth/domain/noncommercial eligibility remain |
| G16 deployment/smoke | not-run | G01–G15 must pass first; no implemented public URL |

`docs/release-evidence.json` deliberately contains blocked gates and cost_verified_zero=false. The original release guard must reject it. An evidence JSON cannot prove its own truth. No gate is waived by successful CI or schema setup.

Owner steps: docs/owner-actions.md. Operational proposal and official provider sources: docs/operations.md. Requirements/code/test mapping: docs/requirements-traceability.md. Local setup: docs/development.md.

Generated log copies have trailing whitespace normalized for Git; raw local copies remain gitignored under artifacts/private/raw-logs. Result text is preserved. Handoff attributes prevent line-ending conversion of byte-hashed originals. Local updated server is a test environment, not a public release. No unattended monitoring/backup automation is configured.
