# Operations and recovery — proposed RM0 procedure, release blocked

## Observed provider state

Supabase reports free/tier_free for the RFT organization (2026-10-24). The Vercel project and existing placeholder are identified. Owner reports its Billing page shows Hobby (free); the billing plan is not independently exposed by the connected read tools. No paid plan, domain, add-on, cron service, analytics service or storage service was purchased or enabled.

Current official sources reviewed on 2026-10-24:

- [Supabase database backups](https://supabase.com/docs/guides/platform/backups): Free projects should make their own regular logical exports and keep off-site copies. Managed daily-backup entitlements apply to paid plans. A finance CSV is not a relational/database/Auth backup.
- [Vercel plans](https://vercel.com/docs/plans) and [pricing](https://vercel.com/pricing): Hobby is for personal/noncommercial use and pauses at included usage limits. Actual account eligibility, plan and quota state still need confirmation.
- [Google app audience](https://support.google.com/cloud/answer/15549945?hl=en): Testing and production audiences differ. Only basic identity scopes are used here; do not infer an arbitrary token lifetime or verification exemption from the Testing label alone.

## Recovery proposal for owner review

Owner decision checkpoint: use the existing Google Drive account (observed 22.4 MB used of 15 GB). This selects a destination only. No folder/archive upload, key creation, hosted dump or scheduled job has occurred; an actual upload requires the separately agreed review. Downloaded PostgreSQL/age archives are preserved outside OneDrive without extraction or execution. Operator/substitute, retention, key recovery and witnessed restoration remain unresolved.

The local PostgreSQL rehearsal restores an isolated synthetic database and verifies snapshot equality, exact money, ownership/MFA enforcement and Auth-FK deletion cascades. This is reproducible test evidence, **not** an operational backup of the hosted project.

Before release, all of the following need actual configuration and a witnessed restore:

1. Use a compatible PostgreSQL 17 `pg_dump` client or the officially documented Supabase logical-dump workflow with project-authorized credentials. Inspect defaults: schema-only or an export excluding identity linkage is insufficient. Capture required public/private schema, policies/functions, relations and data; define how identity linkage is restored securely. Do not copy secrets or dump contents into Git, CI artifacts, logs or chat.
2. Select an existing no-cost destination with encryption, restricted access and a separately recoverable encryption key. Decide a second off-device location without enabling chargeable storage or exposing private data to the public repository.
3. Proposed initial schedule for review: daily when the app has writes, plus before each schema change; retain seven daily and four weekly encrypted copies. This schedule is **not active** and its egress/storage feasibility must be checked against the actual database size and shared free quotas.
4. Assign an operator and substitute; record last successful encrypted backup, integrity hash, retention purge and restore rehearsal dates outside public logs. Verify key recovery when the original computer is unavailable.
5. Restore only synthetic data to a disposable isolated destination first. Check counts, orphan/parent ownership constraints, exact opening+income−expense±transfer reconciliation, export and both-user/MFA denial. Authorize any later real-data restore separately and verify a recovery copy before overwriting anything.
6. State a truthful recovery point/time based on the working schedule and measured restore. Until then, RPO/RTO are unknown. Never promise no loss or continuous availability.

If this cannot be implemented and verified at RM0, G14 remains blocked. No “accepted risk” checkbox silently waives the mandatory recovery evidence.

## Routine checks and incidents

- Vercel → RFT → Deployments: inspect failed builds/status. Logs must not contain notes, amounts, CSV data, tokens or MFA secrets. There is no configured log drain or external analytics.
- Supabase → RFT: inspect project health, database size and free usage. If paused, use the provider's Resume/Restore action after checking its current terms; do not upgrade to solve a limit without explicit new authorization and a changed budget.
- Keep Git deployment disabled until the release record passes. Roll back app code only to a verified compatible version; do not pretend code rollback reverses migrations. Prefer additive fixes.
- On suspected data integrity/privacy problems: stop affected writes/deployments, preserve redacted evidence, assess the affected scope, use a verified mitigation/recovery plan, then recheck reconciliation and isolation. Actual notifications/legal steps require factual owner review and separate communication authorization.

No unattended monitoring, automated backup schedule or alert delivery is currently active. This document is an actionable proposal, not proof that operations are running.
