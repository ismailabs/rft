# Operations — encrypted backup work cancelled by owner

On 2026-10-25 the owner directed: “cancel encrypted backups, continue with the deployment and production”. Encrypted backup implementation is cancelled. Do not generate a production backup key, make a hosted dump, upload to Drive, activate a backup schedule or resume that work without a new owner request. No plaintext cloud-backup replacement is authorized. This cancellation is an explicit scope change, not evidence that recovery was verified.

At cancellation, pinned portable tools had been extracted outside OneDrive and version-checked. A local synthetic age round-trip/wrong-key/tamper test passed; its two disposable keys were removed. No native database rehearsal started, no hosted record was exported, no production key was created and nothing was uploaded. Uncommitted tool-preparation scripts are preserved in ignored `artifacts/private/cancelled-backup-preparation/`; they are not shipped as an active workflow.

The application privacy/deletion copy now truthfully states that RFT does not operate application-managed backups and lost/deleted data may not be recoverable. The owner approved these factual EN/BM notices for publication and the dated final paragraph on 25 October. The targeted cancellation and effective release guard are documented in `docs/production-release-policy.md`. G14 stays untested, excluded only by the direct scope change, while all other gates remain mandatory. Source migrations and earlier isolated PGlite recovery tests remain available; they do not establish an operational backup service.

## Observed provider state

Supabase reports free/tier_free for the RFT organization (2026-10-25). Authenticated Vercel CLI independently confirms Hobby for the exact intended team, matching the owner report. Production-only environment metadata and Standard Protection are configured and independently reread; no implementation is deployed. Billing cost data is unavailable, not evidence of zero usage. No paid plan, domain, add-on, cron service, analytics service or storage service was purchased or enabled. Receipt: `artifacts/verification/production-preparation-receipt.json`.

Current official sources reviewed on 2026-10-24:

- [Supabase database backups](https://supabase.com/docs/guides/platform/backups): Free projects should make their own regular logical exports and keep off-site copies. Managed daily-backup entitlements apply to paid plans. A finance CSV is not a relational/database/Auth backup.
- [Vercel plans](https://vercel.com/docs/plans) and [pricing](https://vercel.com/pricing): Hobby is for personal/noncommercial use and pauses at included usage limits. Actual account eligibility, plan and quota state still need confirmation.
- [Google app audience](https://support.google.com/cloud/answer/15549945?hl=en): Testing and production audiences differ. Only basic identity scopes are used here; do not infer an arbitrary token lifetime or verification exemption from the Testing label alone.

## Historical recovery proposal — cancelled, not an active instruction

Earlier owner decision: use the existing Google Drive account (observed 22.4 MB used of 15 GB). This destination choice is superseded by cancellation of encrypted backup work. No folder/archive upload, hosted dump or scheduled job occurred. Downloaded portable tools were extracted/version-checked only; synthetic encryption-test keys were removed. Operator/substitute, retention, production key custody and operational restoration were not established.

The local PostgreSQL rehearsal restores an isolated synthetic database and verifies snapshot equality, exact money, ownership/MFA enforcement and Auth-FK deletion cascades. This is reproducible test evidence, **not** an operational backup of the hosted project.

The following was the original pre-cancellation proposal. It is retained for history and is not an active implementation or release instruction:

1. Use a compatible PostgreSQL 17 `pg_dump` client or the officially documented Supabase logical-dump workflow with project-authorized credentials. Inspect defaults: schema-only or an export excluding identity linkage is insufficient. Capture required public/private schema, policies/functions, relations and data; define how identity linkage is restored securely. Do not copy secrets or dump contents into Git, CI artifacts, logs or chat.
2. Select an existing no-cost destination with encryption, restricted access and a separately recoverable encryption key. Decide a second off-device location without enabling chargeable storage or exposing private data to the public repository.
3. Proposed initial schedule for review: daily when the app has writes, plus before each schema change; retain seven daily and four weekly encrypted copies. This schedule is **not active** and its egress/storage feasibility must be checked against the actual database size and shared free quotas.
4. Assign an operator and substitute; record last successful encrypted backup, integrity hash, retention purge and restore rehearsal dates outside public logs. Verify key recovery when the original computer is unavailable.
5. Restore only synthetic data to a disposable isolated destination first. Check counts, orphan/parent ownership constraints, exact opening+income−expense±transfer reconciliation, export and both-user/MFA denial. Authorize any later real-data restore separately and verify a recovery copy before overwriting anything.
6. State a truthful recovery point/time based on the working schedule and measured restore. Until then, RPO/RTO are unknown. Never promise no loss or continuous availability.

Under the original handoff this unverified process blocked G14. The owner's later explicit cancellation supersedes that one scope requirement, as recorded in the effective policy. No recovery test is claimed and no other gate is waived.

## Routine checks and incidents

- Vercel → RFT → Deployments: inspect failed builds/status. Logs must not contain notes, amounts, CSV data, tokens or MFA secrets. There is no configured log drain or external analytics.
- Supabase → RFT: inspect project health, database size and free usage. If paused, use the provider's Resume/Restore action after checking its current terms; do not upgrade to solve a limit without explicit new authorization and a changed budget.
- Keep Git deployment disabled until the release record passes. Roll back app code only to a verified compatible version; do not pretend code rollback reverses migrations. Prefer additive fixes.
- On suspected data integrity/privacy problems: stop affected writes/deployments, preserve redacted evidence, assess the affected scope, use a verified mitigation/recovery plan, then recheck reconciliation and isolation. Actual notifications/legal steps require factual owner review and separate communication authorization.

No unattended monitoring, automated backup schedule or alert delivery is currently active. This document is an actionable proposal, not proof that operations are running.
