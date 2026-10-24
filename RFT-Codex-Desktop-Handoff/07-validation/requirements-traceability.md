# Requirement-to-implementation traceability (to be filled by Codex)

**All implementation and verification statuses here are `not-run` until actual code/testing exists.** The following is a map, not evidence.

| Req IDs | Primary specification | Likely implementation layer | Mandatory verification |
|---|---|---|---|
| P01,P13 | `02-product/localisation.md` | i18n, money/date format, account labels | EN/BM/MYR/timezone tests |
| P02 | `04-engineering/pwa.md` | manifest, icons, service worker | PWA/install/cache tests |
| P03,P04 | `04-engineering/auth-and-mfa.md` | Auth callbacks/sessions, DB policy | OAuth production test, AAL bypass negative tests |
| P05–P07 | `04-engineering/database-schema.md`, `financial-domain.md` | accounts/categories/transactions/transfers | Unit, integration, atomicity and RLS |
| P08–P09 | `02-product/financial-rules.md` | domain aggregation/report APIs | exact amounts, periods, balance reconciliation |
| P10 | `02-product/behavioural-finance.md` | insights/budgets | deterministic trends/insufficient data tests |
| P11,P12 | `04-engineering/security-and-privacy.md` | export/deletion handlers | safe CSV, MFA/reauth, data cleanup |
| P14 | `03-design/screen-specifications.md` | public routes | actual homepage/privacy/terms and SEO |
| P15,P16 | `03-design/design-direction.md`, `assets-manifest.md` | frontend/public derivatives | screenshots, responsive/accessibility and rights audit |
| P17,P18 | `05-codex/skills-integration.md`, repo audit | local repo/skills | verified file/skill inventory and Git diff |
| P19,P20 | `06-operations/zero-cost-policy.md` | provider configs | plan terms/quota/OAuth verification |
| P21–P23 | `05-codex/execution-contract.md`, quality gates | branches/CI/deploy | evidence completeness and conditional release |
| P24 | `06-operations/manual-actions.md` | instructions/handover | actionable owner walkthrough |

For each requirement, Codex must append **actual code paths, test paths, observed result, commit/environment and status** in implementation-side documentation. Never mark done from this proposed map alone.
