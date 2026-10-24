# Deployment and rollback runbook — preauthorized only under gates

## Before attempting first release
1. Confirm owner has approved this handoff and Codex future production policy; inspect current branch, planned PR/merge target and remote status.
2. Confirm Vercel project identity and eligible Hobby **non-commercial** use; total charge exposure RM0; exact publicly accessible domain/HTTPS.
3. Confirm Google OAuth is usable by intended public users, including consent brand/domain and redirect requirements.
4. Confirm Supabase schema/RLS/MFA, environment isolation, secrets, no sensitive auth caches, deletion/export controls, privacy notice and feasible recovery.
5. Complete and review actual mandatory G01–G15 test evidence; no `fail`, `blocked`, `not-run`, forged or stale passes.
6. Review all production migrations for data effects. Any destructive/irreversible real-data operation requires separate explicit authorization; automatic release does not override.

## Production release
Use the verified provider workflow in the user's existing Vercel project, not a substitute paid host. Deploy the reviewed artifact/source reference. Avoid exposing sensitive logs or environment variables. If release fails, stop and assess; do not repeatedly redeploy blindly.

## After deploy
- Verify actual public HTTPS URL resolves to correct RFT site. No invented link.
- Verify homepage/privacypages, nonexpert sign-in, real Google OAuth callback and enrolled MFA challenge on approved **synthetic** test accounts.
- Verify session isolation, protected routes, core account/transaction/transfer summary flows with safe test data, and no test data leaking into user records.
- Check PWA manifest and critical mobile layout, runtime logs redacted, no unexpected charges.
- Record G16 evidence and report URL **only when verified**.

## Failure/rollback
- On critical security/financial failure, stop exposure and use documented Vercel rollback/mitigation appropriate to verified provider capability. App rollback **does not undo database migrations**.
- Use rehearsed DB recovery plan if needed; never improvise destructive DB changes to "fix" a release.
- Public status must describe limitations truthfully; a failed smoke test means rollout not complete even if Vercel reported deployment succeeded.

## Stop conditions
Missing production OAuth verification, any RLS bypass, incomplete account deletion, no acceptable recovery plan, privacy/legal gap, paid requirement, unverified destructive migrations, or failed essential UI flow => **no production deployment**.
