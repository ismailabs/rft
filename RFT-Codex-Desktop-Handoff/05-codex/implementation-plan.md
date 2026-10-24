# Implementation phases and exit criteria

Work in verified, resumable stages. Do not pretend this plan has already run. Prerequisites in `task-dependencies.md`; gates in `quality-gates.md`.

## Stage 0 — Read-only discovery
Inspect local Git (including untracked/uncommitted work) vs GitHub remote; image pixels/versions; existing `.agents/skills/` and lockfile; installed CLIs; configured connections/credentials presence without exposing secrets; branch protection, Vercel/Supabase/Google actual state. **No modifications, migrations, pushes or deploys.** Exit: actual audit report and safe initial implementation inventory.

## Stage 1 — Repository and architecture contract
Reconcile actual state with approved v2.0 ledger, identify changed/extra code, select compatibility-pinned Next.js/TypeScript/Supabase versions, draft module/API ownership boundaries, settle unresolved safe engineering details. Exit: documented decisions, no unexplained scope drift.

## Stage 2 — Art direction and assets
Visually inspect every `assets/` image; classify versions, derive project logos/icons as permitted, select coherent design direction; set tokens, responsive navigation and screen structure. Use installed frontend-design/UI skills; no stock template look. Exit: asset manifest filled with evidence, implementable design system, no unsupported invented logos.

## Stage 3 — Application foundation
Initialize TypeScript Next.js only after verifying no local app; configure components, i18n keys, formatting, unit testing, lint/CI, manifest basics, protected-route structure. Exit: clean reproducible build, no secrets, mobile shell and public route render.

## Stage 4 — Identity and database security
Create migrations, RLS, owner-consistent constraints; Google OAuth, SSR sessions, optional TOTP, correct enrolled AAL enforcement. Test two-user cross-owner denials and bypass attempts in isolated environment. Exit: core security negative tests pass; production credentials isolated.

## Stage 5 — Financial core
Accounts, category/subcategory taxonomy, income/expense CRUD, atomic transfers, exact decimal library and opening timestamp policy, timezone-safe period summaries. Exit: reconciliation properties and historical-edit tests pass.

## Stage 6 — Behavioural features
Rule-based category reports, comparable periods, insights, optional budgets; clear explanations and uncertainty suppression. Exit: deterministic unit tests, no false claims or manipulative engagement UI.

## Stage 7 — Complete user experience
Finish all pages/routes, adaptive mobile UX, authentic assets/icons, EN/BM, CSV export, deletion, safe PWA caching and install guidance. Exit: end-to-end primary journeys work with synthetic users, no missing mandatory module.

## Stage 8 — End-to-end QA and hardening
Run type/lint/tests/security, database negative tests, real OAuth/MFA where possible, visual screenshots at representative widths, keyboard/contrast, PWA and production-like smoke checks. Fix and retest. Exit: all available mandatory checks pass, any unexecuted critical check remains explicitly blocked.

## Stage 9 — Release readiness
Confirm free noncommercial provider eligibility, OAuth public status, real privacy notice/legal checks, secrets, recovery/rollback, account deletion policies, isolated environment, protected CI and post-release monitoring. Exit: each mandatory gate has actual evidence, current provider terms reviewed; zero paid activation.

## Stage 10 — Conditional automatic deployment
Only if every mandatory gate passes and no irreversible destructive operation is required: deploy to Vercel production, verify HTTPS URL, anonymous site, Google sign-in/MFA, private isolation and major workflows using safe synthetic test accounts. Exit: live verified public URL and no critical regression. Otherwise **do not deploy**.

## Stage 11 — Handover
Record actual commits/PRs, file changes, test commands/results, screenshots, production URL, provider free-tier limitations, backup/recovery instructions, remaining nonblocking issues and exact owner actions. Exit: evidence-backed report; no inflated completion claim.
