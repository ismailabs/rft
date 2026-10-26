# System architecture — modular monolith

## Topology
Browser (public marketing + private PWA) ↔ HTTPS Vercel Next.js (App Router, Server Components and server-side operations) ↔ Supabase Auth / PostgREST and PostgreSQL with Row Level Security. Browser may contact Supabase Auth to complete OAuth/TOTP per supported SDK architecture. Financial domain rules live centrally in shared server/domain functions and protected DB operations; **do not** duplicate business-critical money math independently across charts/components.

## Modules and responsibilities
1. Public experience: homepage, documentation, SEO, localized copy, no access to finance records.
2. Identity/security: Google OAuth, cookies/sessions, optional TOTP, assurance and account deletion.
3. Accounts: opening date/balance, owned bank/e-wallet/cash accounts, derived balances.
4. Transactions/categories: typed income/expense CRUD, validation, category mapping.
5. Transfers: atomic two-account movement; immutable event semantics and idempotency.
6. Financial reporting: exact aggregations, periods, consistent timezone conversion.
7. Behavioural insights: explainable rules, comparable periods, optional budgets.
8. Data management: export, deletion, locale/settings.

## Request lifecycle
`UI → schema validation → verified identity/MFA assurance → ownership check / RLS → domain operation → atomic DB persistence → authoritative results → refreshed UI`. Never treat a Server Action as private just because its button is hidden; treat it as externally callable.

## Technology contract
Next.js App Router + React + TypeScript + Tailwind + accessible shadcn/Radix primitives; Lucide, Motion, Recharts, Zod; Supabase PostgreSQL/Auth + typed client/SSR approach matching current docs; Vitest and Playwright (or equally justified alternatives); Vercel. Minimize service count and avoid extra ORM/backend unless verified need.

## Performance/privacy
Use server-rendered and client-interactive regions thoughtfully; pagination/filters for large histories; no sensitive response caching; avoid static or shared caches of per-user finance content. Measure actual results rather than claiming performance targets met.

## Failure boundaries
Supabase unavailable → explicit load/save failure; no false success. Expired auth → safe reauthentication. Stale client → server validates all mutations. Partial transfer failure → full transaction rollback. Provider free tier paused → operational incident, not invented data.
