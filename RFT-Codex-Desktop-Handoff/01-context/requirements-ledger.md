# Requirements ledger — approved, protected contract

**Approved:** RFT Amended Requirements Confirmation Summary Version 2.0; user subsequently explicitly authorized **handoff preparation only**, not app changes or deployment during preparation. Codex's future authorized behavior is separately bounded below. **Priority:** security and mathematical correctness; functionality; accessibility and UX quality; zero-cost compliance; release readiness. No deadline.

## Confirmed product
| ID | Requirement | Acceptance intent |
|---|---|---|
| P01 | RFT for Malaysians | Correct project identity, MYR and familiar local account types |
| P02 | Mobile-first installable PWA | Responsive app, manifest and supported installation guidance |
| P03 | Google-only OAuth | No password, anonymous or second sign-in provider |
| P04 | Optional TOTP MFA | Enrollment, unenrollment, challenge; enforce for enrolled sessions |
| P05 | Financial accounts | Cash, bank, e-wallet, opening balance and dates |
| P06 | Income/expense CRUD | Category, subcategory, account, date/time, amount, optional note |
| P07 | Account-to-account transfers | Atomic, zero change to income/expense totals |
| P08 | Accurate dashboard | Income, expenses, period net flow, estimated account balances |
| P09 | Reporting filters | Today, week, month, custom ranges, all time |
| P10 | Behavioural Version 1 | Trends, rule-based insights, optional goals; no shame or fake claims |
| P11 | CSV export | Authorized, safe spreadsheet output |
| P12 | Account deletion | Controlled, verified, complete with documented retention exceptions |
| P13 | Languages | English and Bahasa Melayu UI, MYR, Malaysia default timezone |
| P14 | Public website | Genuine product explanation, privacy/terms and CTA |
| P15 | No AI slop | Original, readable, consistent, professional and visually reviewed |
| P16 | Lucide and assets | Lucide UI icons; valid institutional marks; reuse verified `assets/` |
| P17 | Installed skills | Use verified `.agents/skills/` without blind duplication |
| P18 | Existing repository | Work in local `rft`, confirm synchronization with `ismailabs/rft` |
| P19 | RM0 total | No paid feature, domain, upgrade or surprise billing |
| P20 | Non-commercial public launch | Host and OAuth eligibility verified before production |
| P21 | Autonomous engineering | Read, implement, test, correct, commit/push/PR under contract |
| P22 | Conditional auto release | Only after all evidence-backed gates pass |
| P23 | No fixed deadline | Never sacrifice security for schedule |
| P24 | Beginner-friendly handover | Exact owner actions and honest blockers |

## Protected exclusions
No paid infrastructure; bank-account synchronization; verified bank-balance claims; separate auth provider; external financial AI; overly complex backends/microservices; full offline transaction syncing; fabricated analytics/test evidence; unauthorized production data destruction; unrestricted publication without gates.

## Proposed, not binding until repository audit
Feature folder arrangement, individual design hex values/typeface, initial source code shape, test runners if repo already uses a viable equivalent, exact Git workflow conventions. Implement within stated architecture and record justified deviations. Source docs may differ on V1 vs V1.1 insights; newest **approved** choice puts insights/goals in V1.

## Unverified facts
- Local Windows Git status, uncommitted files, available assets beyond tracked remote files.
- Image content, visual reference priority, bank-logo extraction suitability and rights.
- Real tool/provider authentication and roles, Google OAuth publication, domain suitability, hosted env separation.
- Actual operational cost/usage, recovery assurance, legal/privacy readiness, deploy outcome.

## Conflicts and resolutions
- `.agent/skills` versus `.agents/skills`: verified remote path is `.agents/skills`.
- Autonomy without production release versus preauthorized conditional release: latest explicit decision permits release **only after all mandatory gates pass**; destructive data changes and money movement remain prohibited.
- RM0 vs robust public reliability: never claim or promise uptime/backup safeguards that free tiers do not provide. If recovery/privacy/terms cannot be satisfactorily verified at RM0, report blocked release.
- Source architecture suggests behavioural Version 1.1; latest approved selection places behavioural insights in Version 1.
