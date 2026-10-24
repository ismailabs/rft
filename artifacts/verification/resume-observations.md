# Resumed verification observations — 2026-10-24

Baseline at the start of this resumed run: clean local/tracking branch codex/rft-v1 at 0a51dc048d65208108ae2c9a8256de043b5a9a02; its GitHub CI run 40060724678 is confirmed successful. The previous goal turn made authoritative implementation, test and GitHub progress. This resumed turn rechecks the current state rather than treating old blockers as permanent.

## Current provider/session evidence

- Read-only provider counts now show 2 Auth users, 1 app profile and 2 verified authenticator factors.
- A metadata-only join confirms both users have Google identities and one verified factor each; the profiled user has two unexpired session rows, and the other has one. No emails, names, credentials, tokens, seeds or session identifiers were returned or saved.
- The owner replied “nothing” to the question about a second test account/profile. The additional identity is therefore **not designated as an authorized disposable test identity**. Do not treat its existence as successful two-user acceptance, impersonate it for hosted tests, or delete either identity without the necessary designation/authorization.
- Private .env.local now has a nonempty server deletion key. Only a boolean presence check was emitted; neither value nor provider-key validation is claimed. The existing server had been started before this check; the final restarted server will read the private configuration.
- The Auth settings endpoint returns HTTP 200 and only Google enabled. Other providers remain disabled.
- A fresh IAB tab using the existing session reached the original QA app, still showing only the known synthetic workflow. The running local server was independently confirmed alive (port 3000, /login HTTP 200) after a browser observation timeout. It was not restarted just because observation timed out.
- Navigating the same browser session to /api/export?period=all visibly returned {"error":"REAUTH_REQUIRED"}. This is actual recent-OAuth-denial evidence for that older session. No CSV was downloaded, session token extracted or user deleted. The temporary probe tab was closed.

## Endpoint and database probe work

- Direct handler regression tests first reproduced four malformed export inputs returning 503 SERVER_UNAVAILABLE instead of the required 400 VALIDATION_FAILED. The cause was domain INVALID_DATE/INVALID_RANGE escaping through the unknown-error fallback. The fix maps only these expected date/range failures at the export boundary; genuine unexpected errors retain the safe fallback.
- All 18 focused export/deletion handler tests passed after the fix. They exercise current request/response handlers with synthetic provider adapters and block network access. Coverage includes recent auth/MFA/Origin, missing key/session, provider revocation/deletion failures, verified-owner-only deletion ordering, spreadsheet escaping and exact Malaysia range boundaries. They are not real provider deletion evidence.
- supabase/tests/hosted-read-only.sql is prepared for a future owner-designated two-user check. It uses BEGIN READ ONLY, transaction-local claims/role, existing identity/session rows, eight owner relations after the later additive goals migration, enrolled AAL1 denials, AAL2 contexts and an invalid session; it rolls back and returns no private identifiers or financial values. SQL claim simulation is explicitly different from signed-JWT REST verification.
- The probe was rehearsed locally against real migrations with isolated synthetic Auth stubs. Two tests passed, including a deliberate disposable-database RLS disable that the probe correctly detects. A PL/pgSQL FOREACH syntax error was found and corrected during the isolated rehearsal, before any hosted execution.
- **The hosted claim-context probe has not been executed.** Both identities must first be designated by the owner for testing; real hosted write/REST/MFA/deletion gates remain open.

Full regression/build/CI receipts are recorded separately after their actual completion. No production release, provider migration, data mutation or paid activation was performed in this endpoint-verification phase. The later additive goal migration and unchanged ledger counts are recorded in docs/savings-goals-migration.md.
