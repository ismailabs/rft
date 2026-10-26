# Continuous integration and deployment design

## Workflow principles
- CI verifies code, types, lint, unit and integration tests, DB/RLS tests in safe isolated data, browser smoke if feasible, and secret scanning. Do not rely on pass labels without inspecting logs/artifacts.
- PRs allow reviewable change sets, reproducible builds, failure visibility; commits/pushes/PRs are permitted in the RFT repo after local preservation checks.
- Avoid duplicate Vercel auto-deploy and custom GitHub production triggers that could bypass gating; choose one explicit release owner/path.
- GitHub Actions free quota/eligibility must be verified; all workflows are candidates, not pre-installed scripts in the GitHub remote snapshot.

## Workflow sequence
1. Lint/type/unit/finance on push/PR.
2. DB migration and negative RLS tests against ephemeral local/test instance with synthetic users.
3. Playwright E2E and accessibility when feasible; artifact capture must exclude real finance data/secrets.
4. Preview deployment only when configured securely and within free tier; test against isolated data.
5. **Protected production gate:** actual evidence record for G01–G15 all pass, current provider compliance/recovery/privacy signoff, no prohibited irreversible migration or cost. Validate gate record with `scripts/check-release-evidence.py` as *additional* defense, not proof.
6. Deploy production via verified Vercel project; test live HTTPS URL and core login/finance workflows; record G16.

## Operational failures
A failed required CI job blocks production; rerun only after reasoned fix. Permission error or zero-budget runner exhaustion is a blocker, not justification to disable tests. No provider/environment configuration changed during handoff creation.
