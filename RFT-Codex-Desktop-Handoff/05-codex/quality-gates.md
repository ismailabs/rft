# Mandatory quality and release gates — fail closed

A checkbox or generated JSON does not prove success. For each gate provide: tested version/environment, exact command or manual procedure, observed result, evidence path/link, and status `pass`, `fail`, `blocked`, or `not-run`. **No mandatory gate can be `not-run` or `blocked` at production release.**

| ID | Gate | Required evidence |
|---|---|---|
| G01 | Repo integrity | Local branch, remote relationship, preserved user files, reviewed diff |
| G02 | Reproducible build | Clean dependency install, locked versions, type/lint/build results |
| G03 | Monetary arithmetic | Exact decimal and property-based/reconciliation tests |
| G04 | Transfer/data integrity | Atomic transfer rollback, FK/CHECK, historical edits, date boundaries |
| G05 | RLS data isolation | Negative two-user tests across read/write and related ID swaps |
| G06 | OAuth/session | Real intended production Google sign-in and session lifecycle |
| G07 | Optional MFA | Opt-in setup, enrolled AAL2 enforcement, AAL1 unenrolled policy and bypass tests |
| G08 | Feature scope | Every P01–P14 mandatory acceptance criterion implemented/tested |
| G09 | Export/deletion | Safe CSV formulas, owned records only, re-auth and controlled deletion |
| G10 | UI quality/accessibility | Source-image review, responsive screenshots, keyboard, contrast and essential accessibility |
| G11 | PWA privacy | Manifest/install support, service worker does not cache auth finance responses |
| G12 | Secrets/infrastructure | No client secrets, env isolation, correct protected configuration and safe logging |
| G13 | Privacy/legal | Accurate public notices and documented needed owner/legal review completed |
| G14 | Recovery | Proven feasible backup/recovery process, limitations and restoration verification |
| G15 | RM0/provider compliance | No charges, Hobby noncommercial eligibility, quotas/Google domain verification, proper public OAuth |
| G16 | Deployment and smoke | All previous gates pass before deploy; after deploy HTTPS/public access/auth core verification |

## Two-stage release logic
- **Pre-deploy:** G01–G15 all pass with verifiable evidence; this grants conditional preauthorized release.
- **Post-deploy:** G16 smoke tests must pass, otherwise rollback/mitigate appropriately and report failure. Do not erase a failed result.
- If a gate cannot be validated due to free-tier or OAuth limitations, mark **blocked** and halt production release. No default "pass" for absent tests.
- Destructive operations against actual customer data require separate authorization regardless of gate status.

## Template validator
`scripts/check-release-evidence.py` checks JSON structure and rejects missing/nonpass predeployment gates. It cannot establish that recorded evidence is genuine; Codex must inspect source test logs and provider state before release.
