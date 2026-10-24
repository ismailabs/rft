# RFT verification report — in progress, 2026-10-24

Status: **IMPLEMENTATION_IN_PROGRESS / RELEASE_BLOCKED**. No implemented production deployment or verified public application URL.

## Observed passes

| Check | Actual evidence | Limit |
|---|---|---|
| Original handoff/source | 65 manifest sizes/hash prefixes match; 12 skills; tracked assets/skills unchanged | Split extraction requires the supplied layout-aware audit, original structural script assumes a different root |
| Static/build | `artifacts/verification/verify-final.log`: typecheck, lint, 46 tests and Next.js build pass | Git/clean CI checkpoint pending; final local run in verify-final.log |
| Finance/database | `artifacts/verification/unit-db-final.log`: 46 tests; 2,000 property iterations, exact vector/history/partition/conservation, RLS, MFA, parent IDs, atomic rollback, synthetic restore and deletion cascades | Supabase Auth tables/functions stubbed in local PostgreSQL; not a hosted Auth lifecycle result |
| Browser | `artifacts/verification/browser-final.log`: 31/31 Chromium checks; 320/375/430/768/1440 public widths and 320/430/1440 app-component views, axe, EN/BM, failed-save retention, focus return, reduced motion, anonymous API denial | App-component host has synthetic props and no authentication/persistence. Live Google test sign-in and synthetic writes separately observed; physical-device/screen-reader checks outstanding |
| Added edge checks | Two additional Chromium checks pass: maximum amounts/long names at 320px and same-account transfer rejection before a request | Included in the final 31-test aggregate |
| Hosted setup | `docs/database-rollout.md`, provider migration history: seven RLS tables, 14 policies, three additive migrations, zero users at setup | Schema setup was empty; later genuine Google login and clearly labelled synthetic workflow recorded separately |
| Hosted anonymous denial | `artifacts/verification/hosted-anonymous.json`: ten probes return 401 | Does not prove two-user authenticated isolation |
| Provider security | Supabase security advisor returns no findings; public helper execution revoked; FK indexes complete | No claim of an independent penetration test |
| Secrets/dependencies | Custom source/browser-output scan passes; npm audit reports zero vulnerabilities | Custom scan is not Gitleaks; privileged deletion key is not configured |

## Release gate status

| Gate | Status | Remaining requirement |
|---|---|---|
| G01 repository integrity | in progress | Reviewed Git checkpoint, remote SHA and CI receipt |
| G02 reproducible build | in progress | Fresh clean npm ci and CI confirmation |
| G03 monetary arithmetic | pass locally | Exact tests above; maintain regression |
| G04 transfer/data integrity | pass locally | Hosted lifecycle still part of G08 |
| G05 RLS isolation | blocked | Local negative matrix passes; real two-user hosted REST evidence absent |
| G06 Google OAuth/session | blocked | Owner reports Google audience Testing; actual intended public session lifecycle unverified |
| G07 optional MFA | blocked | Local AAL policy passes; real enrollment/challenge/removal and direct hosted bypass tests absent |
| G08 complete feature acceptance | blocked | Real authenticated account/transaction/transfer/report workflows and all mandatory cases need hosted evidence |
| G09 export/deletion | blocked | CSV defenses/local cascades pass; real export reauth and privileged deletion not verified; no admin key configured |
| G10 design/accessibility | partial | Automated Chromium/visual captures available; remaining dialogs, screen reader and physical-device gaps recorded |
| G11 PWA privacy | partial | Manifest/icons/network-only worker checks pass; physical installation/update/session-switching verification absent |
| G12 secrets/infrastructure | partial | No privileged client key; production/preview scopes and full infrastructure configuration not verified |
| G13 privacy/legal | blocked | Operator contact, factual retention and owner/needed legal review unresolved; pages clearly marked prelaunch drafts |
| G14 recovery | blocked | Synthetic database restore passed; actual encrypted operational backup storage/schedule/retention/owner and recovery rehearsal unresolved |
| G15 RM0/provider compliance | blocked | No paid services enabled by this work; actual Vercel/Supabase plan/billing/public-OAuth eligibility still unverified |
| G16 deployment/smoke | not run | Predeployment gates not all passed; no production release authorized yet |

No blocked gate is waived by a successful build, a generated JSON record, or the empty hosted schema setup. Keep Vercel Git deployments disabled and do not merge/deploy around these gates.


## Live workflow and limits

`artifacts/verification/live-workflow.md` records actual Google test login, two synthetic accounts, income/expense and atomic transfer, independently reconciled hosted balances, and an inspected authenticated CSV. Provider confirms one verified TOTP factor; owner reports fresh-login challenge. These are testing-environment receipts, not production OAuth or a hosted bypass/removal/deletion result. Last provider metadata still showed one user/profile. No identities or records were deleted.

Supabase organization reports free/tier_free. Vercel project/team reads omit billing plan, and browser audit timed out. Actual plan/quotas remain blocked. Official current provider sources and the unactivated recovery proposal are in `docs/operations.md`. No new public deployment is claimed.

Log copies in source have trailing whitespace normalized for Git; raw local copies remain gitignored under artifacts/private/raw-logs. Result text is preserved. Handoff attributes prevent line-ending conversion of its byte-hashed originals.
