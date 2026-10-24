# Security/privacy threat model and mandatory controls

## Sensitive assets and threats
Financial transaction history is sensitive personal information. Threats include cross-user reads/changes, token theft, forged actions, CSRF/redirect misuse, SQL injection, accidental secret exposure, unsafe client caching, exported CSV formula injection, logs containing notes/amounts, uncontrolled deletion and inadequate recovery.

## Controls
- Strict owner RLS + user ID validation; deny unauthorized rows for every CRUD operation, including related parent IDs; test with two distinct accounts.
- Every Server Action and Route Handler is externally callable: authenticate, authorize, validate input, enforce MFA for enrolled sessions, return minimum required data.
- Server-only privileged Supabase credentials; no service-role/client bundle exposure; environment separation and secret scanning; no secrets printed in CI/logs.
- Verify OAuth state/redirect allowlist; secure cookie practices; HTTPS; robust session expiry/revocation handling.
- Numeric/date validation, output escaping, prepared/typed queries, request throttling or provider protection suitable to free tier.
- CSV escaping and defensive treatment of formula-leading values; output authorized rows only. Never store personal exports publicly.
- Data deletion must verify identity, require clear confirmation and handle dependencies/auth records; explain any retained backups/logs truthfully. Privileged deletion only through narrowly scoped server execution.
- PWA/service worker must not cache authenticated financial API responses, auth tokens or user-specific HTML in shared persistent cache.
- Privacy pages must match actual data practices. No advertising trackers or third-party AI transmission of user finance data without separately approved lawful basis.
- Logs/analytics: minimize and redact sensitive identifiers, notes, amounts and tokens; monitor operational failures without finance payloads.

## Governance
Assess Malaysian PDPA 2010 and 2024 amendments for actual applicability; cross-border transfer, retention, privacy notice, security, deletion and incident response may require appropriate review. Codex can prepare engineering evidence and draft notices, **not certify legal compliance**.

## Release blockers
Any cross-user data leakage, MFA bypass, exposed privilege key, unverifiable recovery, missing ownership constraint, failed deletion, unchecked destructive migration, or unsupported published privacy claim. No release via blanket waiver.
