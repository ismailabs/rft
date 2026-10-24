# Functional module contracts

| Module | Inputs & operations | Validation / authorization | State & output |
|---|---|---|---|
| Account | Create, rename, set type/provider/icon, archive where safe; initial balance and start date | Ownership, name/amount bounds, no cross-owner changes; prevent invalid deletion with linked history | Estimated balance derived from movement history; no false bank-sync claim |
| Category | Default and custom income/expense; optional subcategory | Enforce type, parent owner, uniqueness policy, association integrity | Clear selectors and safe handling for categories in existing history |
| Transaction | Create/read/update/delete income or expense | Strict positive decimal amount, date/time, matching owned account/category/subcategory, authenticated request | Acknowledged save only after confirmed persistence; recalculate summaries |
| Transfer | Source, destination, positive amount, occurred time, optional note/fee | Distinct accounts, both owned, atomic single transfer event | Two balances move equally and oppositely; no income/expense inflation |
| Dashboard | Selected timeframe | Timezone-adjusted half-open UTC boundaries, owner-scoped queries | Period income/expenses/net; separately accumulated end balance |
| Insights | Date range + categorized transactions | Comparable periods, denominator guards, sufficient history | Explain category shares/trends; suppress low-quality conclusions |
| Budgets | Category, period, target amount | Owner-scoped category, positive decimal target; no duplications | Actual/limit progress, neutral over-limit wording |
| CSV | Selection range and export scope | Verified session, export only own data, CSV escaping and formula-protection | Download with explicit columns, decimal and timezone convention |
| Deletion | Confirmed user request | Recent authentication, MFA assurance if enrolled, server-only privileged access, retention checks | Delete associated data/auth identity, invalidate future access as possible, explain limitations |
| Settings | Language, timezone default, privacy preferences | Valid locale and owned settings; never expose privileged configuration | Persist preference; localize visible UI/errors where feasible |

## Error handling contract
Return safe errors and traceable internal code; do not reveal another user's data, raw SQL, secrets or system internals. Surface retry only when idempotency is safe; handle interrupted writes, repeated submissions and stale tabs. Show explicit confirmation for permanent deletion.

## Ownership and dependent records
Changes to accounts/categories must not orphan transaction history. Preserve historical interpretability, reject unsafe deletions or provide explicit archival/reassignment rules. Enforce owner consistency at DB layer, not only in Zod/UI.

## Version 1 cut line
Version 1 includes behavioural features and goals per the latest approved selection; the older proposal that put them in V1.1 is superseded. No speculative extra accounts integration or financial advisor features without approval.
