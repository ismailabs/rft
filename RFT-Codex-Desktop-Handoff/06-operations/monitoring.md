# Runtime monitoring and incident response

## Monitor only what is needed
Public availability, authentication failures, application exceptions, migration health, slow user requests, low quota/storage, usage limits, financial invariant error signals and PWA update failure. Use free tools already available rather than billable analytics or log drains.

## Privacy
Never log full financial transaction descriptions, private notes, user tokens, OAuth secrets, passwords, MFA seeds or raw CSV exports. Use event type, synthetic request ID, non-sensitive status and redacted identifiers. Review retention, user access and exportability.

## Incident workflow
Detect → assess if user finance integrity/privacy affected → halt dangerous writes/deploy if necessary → record non-sensitive evidence → choose verified mitigation → notify owner of required steps → revalidate recovery and reconciliation. Account/data breach obligations may need legal review; Codex must not promise compliance alone.

## Owner runbook
Plain instructions for checking Vercel deployment failures, Supabase dashboard health and quota, logs without sensitive details, paused Free project recovery and when to contact platform support. Record provider limits and status check cadence only if useful; do not promise background monitoring by ChatGPT/Codex without an actual scheduled service.
