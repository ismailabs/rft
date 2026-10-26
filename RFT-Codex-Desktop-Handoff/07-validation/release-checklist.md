# Production release checklist — all pending until implementation

**Never check these off based on the handoff or on static reasoning.** See `05-codex/quality-gates.md` for pass evidence per ID and `templates/release-evidence.example.json` for evidence schema.

- [ ] G01 — local/remote Git integrity and reviewed changes.
- [ ] G02 — reproducible build, type, lint and dependency checks.
- [ ] G03 — exact RM financial math.
- [ ] G04 — transfer and DB integrity/historical edit/date tests.
- [ ] G05 — cross-user RLS negative tests.
- [ ] G06 — production Google OAuth/session verification.
- [ ] G07 — optional enrolled TOTP assurance/bypass tests.
- [ ] G08 — complete Version 1 functional acceptance.
- [ ] G09 — authorized CSV and verified account deletion.
- [ ] G10 — real UI screenshot/accessibility audit (no AI slop).
- [ ] G11 — PWA install and private caching protections.
- [ ] G12 — safe secrets and environment separation.
- [ ] G13 — accurate privacy/legal readiness.
- [ ] G14 — feasible verified backup and restore approach.
- [ ] G15 — eligibility and **RM0** compliance including OAuth.
- [ ] Once **all** G01–G15 backed by actual logs/proof, verify there is no irreversible/destructive data action and deploy in authorized scope.
- [ ] G16 — post-deployment HTTPS/public/auth/functional smoke evidence.
- [ ] Handover reports real URL and any limitations; no unverified completion claim.

**Fail-closed rule:** `blocked`, `fail`, `not-run` or missing evidence for a required predeploy gate => no production release. An automated `pass` JSON by itself is not independent evidence; validate log and provider state.
