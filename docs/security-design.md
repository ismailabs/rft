# Security and financial boundary

- `verifiedIdentity()` calls Supabase Auth for the current user, confirms a Google identity and checks verified TOTP factors against the session assurance. Every API mutation uses it. RLS separately checks ownership and the private `session_allowed()` predicate, including current auth.users/auth.sessions rows, expiry, Google identity and enrolled MFA. No user-editable metadata authorizes access.
- The SQL helper is SECURITY DEFINER only because auth session/factor lookup requires protected schema access. It has no caller-supplied arguments, a fixed empty search_path, checks only the caller, lives outside the exposed public schema and has no anonymous grant. Finance functions remain SECURITY INVOKER. Table grants are explicit and owner policies include both USING and WITH CHECK.
- Composite FKs bind account/category/subcategory ownership and category transaction type. A single canonical transfer event is atomic. Account row locks coordinate opening-date edits and entry writes, in canonical account-ID order for transfers.
- Amounts use unbounded NUMERIC with `scale <= 2`, positive/bounds checks (opening values may be signed), rather than typemod rounding. Snapshot RPC casts every amount to text. TypeScript parses text into bigint sen. Percentages and chart positions use numbers only after exact aggregation.
- Every browser mutation checks Origin and JSON shape/size. Values go through Zod and provider query parameters. IDs are generated once per submitted form, retained on a failed request and never silently upserted; duplicate-ID retries produce a conflict requiring refresh, preventing duplicate money movement.
- Finance/auth/export responses have private no-store policies. The network-only service worker has no fetch handler, Cache Storage, queues or finance persistence. No localStorage finance records, advertising tracker or external AI service.
- Deletion requires fresh Google authentication, verified MFA when enrolled, explicit DELETE RFT confirmation, and a separate server-only admin key. A server-controlled global session revocation precedes Auth identity deletion with FK cascades. If deletion fails after revocation, the user must sign in again and retry; no success is reported. No admin key is configured by this repository.
- CSV exports verify identity/assurance/recent Google sign-in and neutralize formula prefixes after leading whitespace/control characters. They never become public stored assets.

## Evidence limits

Local PostgreSQL/RLS tests stub only Supabase-owned Auth tables/functions with synthetic rows. They cannot prove GoTrue/Google/MFA lifecycle or hosted PostgREST configuration. Hosted security must be rehearsed in a safe environment and checked before release. Provider rate limits, abuse controls, session revocation behavior, lost-device recovery, legal retention and encrypted operational recovery remain release gates.

The additive schema and permission migrations were applied after an empty-project recheck and local rehearsal; see `docs/database-rollout.md`. The provider-created `rls_auto_enable()` event-trigger helper and trigger were preserved while unnecessary public EXECUTE grants were revoked. Current security advisors return no findings. Hosted authenticated lifecycle and two-user REST verification remain outstanding.

## Deployment control

`vercel.json` disables all Git-triggered deployments, following the current official git.deploymentEnabled configuration. No production workflow is supplied. A future explicit production deployment must first validate the actual G01–G15 evidence and provider state. A successful source push, build or schema test is not release authorization.
