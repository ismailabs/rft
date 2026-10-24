# Authoritative financial rules and invariants

## Representation
- MYR only in Version 1. Store PostgreSQL amounts as `NUMERIC(18,2)` or justified stricter scale; use a decimal-safe TypeScript library or integer sen at application boundaries. **Never sum finance amounts with binary floating-point `number`.**
- Transactions and transfers use **positive amounts**, with type/direction determining account effect. Reject zero, negative input, NaN, Infinity, excessive precision, unsupported formatting, duplicate unsafe submissions and values outside DB bounds.
- Store event time in consistent UTC instant (`timestamptz`), display/report by `Asia/Kuala_Lumpur` unless user preference implemented. Use start-inclusive, end-exclusive `[start,end)` UTC boundaries from local dates.
- Account opening balance is anchored to a documented opening timestamp/date. Historical entries before account opening need explicit rejection or a carefully specified business rule, not silent double counting.

## Invariants
1. For period `P`: `income(P) = sum(income in P)`, `expenses(P) = sum(expense in P)`, `net(P)=income(P)-expenses(P)`.
2. For account `A` at `T`: `opening(A) + sum(income<=T) - sum(expense<=T) + sum(incoming transfers<=T) - sum(outgoing transfers<=T)` (consistent with opening date). A transfer fee is separately recorded as an expense.
3. One tracked-account transfer of X decreases source X, increases destination X; changes neither net period income/expense nor total tracked funds (excluding separate fees).
4. Dashboard **period net cash flow** is not interchangeable with accumulated end-of-period account balance. Label separately.
5. An edit/delete of historical entries recomputes all affected period summaries and subsequent balance views; no mutable shadow balance totals that diverge from ledger.
6. Cross-user references never succeed, including changing an owned transaction's category/account to another owner's ID.
7. A single failed transfer must roll back completely; never leave only the debit or credit.
8. Different currencies are not mixed; bank balances are estimates from manual records.

## Test vectors (synthetic)
| Scenario | Account A | Account B | Reported income | Reported expense | Net flow |
|---|---:|---:|---:|---:|---:|
| Opening balances RM100 and RM20 | RM100.00 | RM20.00 | RM0.00 | RM0.00 | RM0.00 |
| Add RM0.10 + RM0.20 income to A | RM100.30 | RM20.00 | RM0.30 | RM0.00 | RM0.30 |
| Record RM24.90 expense on A | RM75.40 | RM20.00 | RM0.30 | RM24.90 | -RM24.60 |
| Transfer RM50 A→B | RM25.40 | RM70.00 | RM0.30 | RM24.90 | -RM24.60 |

## Decisions requiring implementation record
Refunds should not silently become earnings; decide and document explicit reversal/refund treatment. Transfers cannot be between identical accounts. Determine whether account overdrafts are allowed as manual estimates, rather than changing balances silently. Repeated requests require idempotency for risky mutations. Ensure no accidental category-filtering excludes transfers from account balance.

## Edge tests
Leap years; DST-safe conversion even though Malaysia has no seasonal daylight shifts; month/year boundary; inclusive displayed last day; editing time across periods; 0/one transaction; huge and fractional RM values; account closure/archive; shared categories; concurrent writes; deleted category; cancelled save. Prefer property-based testing for conservation and aggregation where useful.
