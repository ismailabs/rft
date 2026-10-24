# PostgreSQL schema and ownership design

## Proposed tables (verify against actual local migration state)
| Table | Minimum responsibility | Key integrity rules |
|---|---|---|
| `auth.users` | Provider-backed auth identities | Managed by Supabase Auth |
| `profiles` | User display/locale | PK/FK `user_id` → auth user |
| `accounts` | Cash/bank/e-wallet, opening balance/start instant | `user_id`, UUID, type, positive/negative opening policy documented |
| `categories` | Income/expense taxonomy | owner and stable type, sensible uniqueness |
| `subcategories` | Category children | parent category ownership and matching user |
| `transactions` | Income/expense entries | user, account, category, optional subcategory, type, amount NUMERIC(18,2)>0, occurred_at |
| `transfers` | Atomic source→destination movement | source≠destination, both owned, positive exact amount, timestamp |
| `budgets` | Optional category caps | owned category, period scope, positive cap |
| `user_settings` | Locale/preferences | keyed by owner |

## Mandatory DB enforcement
- UUIDs, FK constraints, `CHECK`s, sensible `UNIQUE` keys, indexed `user_id` and `occurred_at`. RLS **enabled on every user-owned table**.
- For CRUD, allow only `auth.uid() = user_id` with applicable `USING` and `WITH CHECK` conditions; ensure update cannot reassign owner. Child rows must not reference other owner's accounts/categories — use composite ownership FKs or equivalent **DB-enforced** constraints, not just application checks.
- Role grants must be least privilege; keep service-role key server-only for strictly necessary admin operations; don't use it for ordinary user queries.
- Transfer entry is a **single atomic event** affecting two account balance derivations; prohibit same-account and cross-owner transfers. If stored as additional ledger entries, link them transactionally without double counting; choose one canonical invariant model.
- Derived balances should avoid independently mutable shadow totals unless consistency mechanisms are proven.
- Account/category archiving vs deletion must preserve historical transaction referential integrity; define cascading data removal only in verified account-deletion workflow.

## Migration and test policy
1. Version all SQL changes; inspect `supabase migration list` / local files first. Do not run `supabase db push` against production inadvertently.
2. Validate on local/isolated test DB with **synthetic data**, including negative RLS tests with two auth identities and malicious parent IDs.
3. Ensure migration compatibility, rollback/recovery plans and backups before any production migration.
4. Do not expose privileged keys or SQL bypass functions through public APIs.
5. Test permissions for SELECT, INSERT, UPDATE and DELETE separately; account for policy interactions with optional MFA (AAL1/AAL2).

## Useful index principles
Start with `transactions(user_id,occurred_at)`, transfers owner/time and child FK columns. Verify `EXPLAIN` and measured query plans before premature indexes. Supabase/Postgres tuning skill should be read for applicable rules.
