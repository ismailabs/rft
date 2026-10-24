# Financial domain architecture

Authoritative invariants and examples: [`02-product/financial-rules.md`](../02-product/financial-rules.md). This file specifies *software placement and transaction semantics*; avoid duplicating all formulas.

## Layered responsibility
- Input parsing: localized string → validated exact decimal/sen value, timestamp, owned IDs.
- Domain calculations: pure functions, explicit amounts/types, deterministic income/expense/transfer effects and reporting periods.
- Persistence: server-side authenticated operations with transactionality and RLS enforcement. Use Postgres atomic function/transaction for multi-row mutations as needed.
- Reporting queries: scope by owner/date, deterministic aggregation, coherent database snapshots where necessary.
- Presentation: format confirmed results and distinguish period net flow from accumulated account estimated balances.

## Engineering rules
- Do **not** compute money by adding JS floating `number` values. Check decimal serialization, JSON transport and DB numeric handling.
- Prefer derived balance over mutable duplicated balance column. If performance later requires snapshots, they must be reproducible and reconcilable.
- Idempotent save behavior for retries/double clicks; typed mutation outcomes and complete rollback on transfer failure.
- Editing/deleting a past transaction may change many later period balances; invalidate relevant caches, avoid stale client-side totals.
- Define and test refund semantics, account opening time, overdraft representation, account archive/deletion and duplicate records before launch.

## Property-based acceptance
For arbitrary synthetic histories: conservation for transfers; net=incomes−expenses; total tracked balance=total openings+life-to-date income−expenses (subject to start-date handling and fees); partitioning a date range into disjoint subranges sums to same total; non-owner mutations never succeed.
