# Engineering test strategy

A "pass" must identify command, environment, timestamp, versions, actual result and any skipped coverage. Never write green results into the handoff itself; gather them during implementation.

## Layers
| Layer | Required checks |
|---|---|
| Static | TS type check, lint, formatting, lockfile consistency, secret scan, dependency/security review |
| Unit | Exact RM math, transfers, period boundaries, input validation, insight calculation, i18n fallbacks |
| Database | Fresh migrations, CHECK/foreign keys, RLS SELECT/INSERT/UPDATE/DELETE, cross-owner parent IDs, atomic rollback |
| Integration | Service actions, sessions, accounts, transactions, summary recalculation, CSV, deletion on isolated environment |
| Auth | Real OAuth end-to-end, AAL1/AAL2 cases, enrolled MFA bypass attempts, expired/revoked session |
| Browser E2E | Core journeys with synthetic data, EN/BM, mobile widths, error/empty states |
| Accessibility/visual | axe where useful, keyboard, focus, contrast, screen reader check, actual screenshots reviewed |
| PWA | Manifest, secure context, install hints, offline failure and service-worker cache privacy |
| Performance | Representative mobile and safe query load; observe free-tier limits rather than inventing SLO |
| Operations | CI, secrets separation, migration recovery, provider eligibility, deployment smoke tests |

## Strong invariants
Use synthetic two-user tests for owner isolation; transfer conservation; edits affect historical totals; exact decimal precision; `[start,end)` date ranges; account deletion doesn't leave owned orphan records; aborted DB write never shown as saved; CSV doesn't execute spreadsheet expressions on open.

## Environments
Never run destructive migration/deletion tests against live production accounts or real user data. Free staging constraints may require local Supabase/isolated sandbox. Do not mark impossible tests as passed; describe limitation and gate decision.

## Exit criteria
All mandatory gates in `05-codex/quality-gates.md`, with evidence in implementation-side `verification-report.md`. An untestable required control remains a release blocker, not a silently accepted risk.
