# RFT production release — 26 October 2026

Confirmed public app: [Ringgit Finance Tracker](https://ringgitft.vercel.app). Existing Vercel project dpl_FztyjpriKrefH4BHCwMCTmCQgmx6 is READY from protected merged commit 1076e996ee3c64fd710831767018e6ef92127f6d. The existing rft-tau.vercel.app alias redirects to this primary. No domain purchase or new paid service.

## Design references and source

All five original references are 1448×1086, DPR1 comparisons. The owner accepted the corrections with documented font/vector/texture and truthful/accessibility differences on 25 October; no pixel-perfect claim.

| Reference | Original assets/ image suffix | Route | Equal-scale reference/current evidence |
|---|---|---|---|
| A — Dashboard | 01_37_16 PM-1.png | /app | [comparison](../artifacts/pixel-fidelity/delivery/A-comparison.png) |
| B — Transactions | 01_37_18 PM-3.png | /app/transactions | [comparison](../artifacts/pixel-fidelity/delivery/B-comparison.png) |
| C — Accounts & Transfers | 01_37_20 PM-4.png | /app/accounts | [comparison](../artifacts/pixel-fidelity/delivery/C-comparison.png) |
| D — Insights & Budgets | 01_37_21 PM-5.png | /app/insights | [comparison](../artifacts/pixel-fidelity/delivery/D-comparison.png) |
| E — Homepage Concept A | 01_37_17 PM-2.png | / | [comparison](../artifacts/pixel-fidelity/delivery/E-comparison.png) |

[Full visual discrepancy/source/icon register](pixel-fidelity-correction.md), [before captures](../artifacts/pixel-fidelity/before/) and [delivery captures/geometry/source manifest](../artifacts/pixel-fidelity/delivery/) retain actual before/after evidence. Corrections include measured rail/header/card/table/form/chart geometry, typography, density, institution marks and specific insight symbols. Shared leaf and Maybank/CIMB/RHB/Touch ’n Go/GrabPay/Netflix artwork were cropped from provided sheets with provenance; Lucide supplies general/insight/category controls. No fabricated official mark, bank connection or live-bank balance. Approved mobile M1–M8 and minimum responsive adaptations remain.

This release adds only three final source changes: src/lib/supabase/auth.ts rejects null/unknown assurance, src/app/layout.tsx registers the existing network-only PWA worker publicly, and src/features/finance/finance-app.tsx removes duplicate registration. tests/integration/auth-assurance.test.ts adds22 actual helper/MFA-route regression cases. Earlier visual modifications are enumerated in the visual register; no backend rewrite, package/lock or migration change in this final phase.

## Actual verification

Clean candidate e0d171a passes [Actions40266053232](https://github.com/ismailabs/rft/actions/runs/40266053232):113/113 unit/database/route and78/78Chromium, preserved65handoff hashes/12skills/20originalPNGs, approved one removal, type/lint/production build, dependency audit0 and custom source/browser scan328files. The test/source merge trees match. Readiness commit and protected merge checks are recorded in [production receipt](../artifacts/verification/autonomous-release/production-release.json); deployment application/test/release paths are identical to this tested source. Custom scanning is not a Gitleaks audit.

Real Google AAL2 A and distinct unenrolled-AAL1 C passed nine hosted core/isolation/related-parent/CSV groups across two phases. A/B retain all21rows/two factors with the same ordered-row checksum. Current hosted read-only SQL-context probe passes5contexts/8tables without persistent changes, separately identified from signed REST sessions. Isolated PostgreSQL tests cover all8tables’ read/update/delete isolation, parent integrity, optional MFA, revoked sessions, atomic exact-money transfers and complete cascades. Actual server/route adapter tests cover recent Google verification, trusted identity, factor ownership/removal, safe export and revoke-before-caller-only deletion. No hosted identity deletion or factor change was performed.

Deployed [public-page/protocol receipt](../artifacts/verification/autonomous-release/production-public-1792987388652/receipt.json) captures eight actual desktop/mobile/public/legal pages with loaded fonts and zero axe violations, overflow, missing images, page errors or unexpected external requests. Actual production Google initialization/callback/S256/secure-SameSite cookie/basic-scope redirect checks pass without credential entry. Anonymous private APIs return401/private-no-store, protected pages redirect to login and cross-origin writes are denied. [PWA receipt](../artifacts/verification/autonomous-release/production-pwa-1792987388780/receipt.json) passes six actual worker-control/update/installability/cache/privacy checks; zero installability errors and no persistent finance/auth caches.

## Providers, preservation and limits

Exact existing Vercel team is Hobby and Supabase organization Free/tier_free. [Provider preflight](../artifacts/verification/autonomous-release/provider-preflight.json) and [canonical-origin correction](../artifacts/verification/autonomous-release/oauth-canonical-origin.json) record verified free domains, Production-only sensitive server key, Google-only configuration, basic scopes and accepted Supabase callback. No billing/trial/purchase/paid activation. Historical account billing usage is unavailable and is not asserted zero. Free quota restrictions can pause availability. One Supabase password-protection advisor warning remains; password/email provider is disabled. It is not a zero-finding advisory audit.

The owner explicitly cancelled further manual procedures and instructed autonomous production completion. [Exact scope and omitted cases](autonomous-release-scope.md) remain explicit: no new interactive production Google/MFA journey, hosted identity erasure/stale-session rehearsal, physical phone test or human screen-reader listening. Prior actual Google sessions and current automated protocol/authorization tests are separately evidenced. No legal certification. Encrypted application-managed backups remain cancelled and recovery unverified; approved EN/BM notices disclose possible unrecoverable data loss. These cases are not relabelled as tested.

All existing identities/records/authenticators are preserved; deployment performs no migration or destructive data operation. Git-triggered deployments remain disabled. Main protection requires PR/verify and blocks force pushes/deletions with no bypass. No follow-up owner setup or QA action is requested. Normal Google sign-in is how users access their own app.
