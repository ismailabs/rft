# RFT implementation guide

The original root entry documents and handoff remain byte-for-byte intact. This guide describes the implemented app; release readiness is in `verification-report.md` and required owner steps are in `owner-actions.md`.

## Run locally

1. Use Node 24.x (verified with 24.19.0) and the committed package lock.
2. Run `npm ci --ignore-scripts`.
3. Copy `.env.example` to `.env.local` **only if `.env.local` does not already exist**. Keep it out of Git.
4. Set the Supabase project URL and publishable key in that private file. Set the origin to `http://127.0.0.1:3000`. These public configuration values do not grant privileged database access.
5. Google provider and redirect configuration must match the intended test project. Redirect allow-list entry: `http://127.0.0.1:3000/auth/callback`. Do not broaden this to arbitrary origins.
6. Run `npm run build`, then `npm run start -- --port 3000`, or `npm run dev` during editing. Open `http://127.0.0.1:3000`.

Public pages build without provider credentials. Private operations fail closed without valid configuration, Google identity, session, ownership, and enrolled MFA assurance. Account deletion additionally requires a server-only `SUPABASE_SECRET_KEY`; never prefix that variable with `NEXT_PUBLIC_` or provide production privilege to a preview/test environment.

## Verify

- `npm run verify`: preserved handoff/assets/skills audit, TypeScript, lint, unit/property/PostgreSQL tests, production build and custom secret scan.
- `npm audit --audit-level=moderate`: dependency audit.
- `npx playwright install chromium`, then `npm run test:e2e`: public routes and isolated synthetic component QA. CI installs the browser with OS dependencies.

Tests under `tests/browser-ui/` host actual components with synthetic props; they provide neither authentication nor real persistence. They are outside Next's application/public output. Local PostgreSQL tests stub Supabase-owned Auth tables/functions. Neither substitute for real hosted OAuth, two-user REST isolation, MFA bypass, deletion, installation, or recovery verification.

## Module boundaries

`src/domain/finance/` owns exact bigint-sen arithmetic, decimal-text transport, Malaysia half-open periods, reconciliation, reports and CSV escaping. `src/features/finance/service.ts` owns authenticated database access. API routes validate origin, bounded JSON and strict schemas. `src/lib/supabase/auth.ts` enforces Google/session/MFA identity before protected server operations. The SQL helper independently enforces session validity and enrolled AAL2 at the data boundary.

Balances are derived user-recorded estimates. Transfers are one atomic event with two ownership-consistent foreign keys, without duplicated income/expense or mutable balance fields. Migrations are additive history; never reset or drop the hosted database to repeat setup.

## Deployment boundary

Git deployment is disabled for all branches in `vercel.json`. Keep `RFT_PUBLIC_RELEASE_READY=false` while gates are blocked. This flag controls indexing metadata; it does not waive any release gate. Do not deploy or promote a preview as an alternative way around G01–G15. An existing Vercel placeholder is not this application.
