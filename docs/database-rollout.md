# Empty-project database setup

## Authority and limits

Approved Stage 4 permits reviewed, non-destructive schema setup after isolated rehearsal. This is not a public release. Before applying, recheck the intended RFT project has zero Auth users, zero public tables and no migrations. Do not alter or delete existing real data. If these assumptions differ, stop and reassess.

## Rehearsal evidence

`artifacts/verification/unit-db.log`: 45 tests passed, including PostgreSQL ownership, AAL1/AAL2, related IDs, exact scale rejection, atomic rollback, initialized BM taxonomy, synthetic full-data-directory restore/snapshot equality and restored isolation, and Auth-FK deletion cascades. Supabase-owned Auth tables/functions are stubbed locally; this does not prove the hosted OAuth lifecycle or operational backups.

## Candidate migrations

- Core: creates seven owner-scoped tables, ownership and temporal constraints, private session/MFA helper, invoker snapshot and first-run taxonomy functions. No existing records dropped or rewritten.
- Auto-RLS permissions: removes unnecessary public execution of the existing provider event-trigger helper, preserving the helper and trigger.

## Recovery and verification

The pre-state has no customer or application data. If setup fails, the migration transaction must abort; inspect provider history and schema before retrying. After success, retain the schema and fix forward with additive migrations. Do not drop tables merely to retry. Any later destructive rollback or real-data restore requires separate explicit authorization and a verified backup.

After apply: list migrations and align local version identifiers, compare table/RLS/grant state, run security/performance advisors, and verify anonymous REST/RPC denial using only the publishable key. No manually forged Google identities or synthetic financial data inserted into the hosted project. Real OAuth/MFA, admin deletion, encrypted operational backup/restore and production release gates remain separate.

## Actual hosted receipts — 2026-10-24

- Before apply: `auth_users: 0`, `public_tables: 0`, no migrations. Actual Auth session/identity/factor columns inspected for compatibility. No auth identity was fabricated.
- Applied successfully through the migration tool: `20261024025636 rft_core`, `20261024025648 rft_auto_rls_permissions`, `20261024025714 rft_budget_foreign_key_index`.
- Post-apply: all seven tables have RLS true; 14 policies; zero Auth users; anon cannot execute the provider helper. Security advisor returns no findings. Unused-index INFO notices are expected in this empty database; retain integrity indexes.
- Publishable-key-only hosted REST probes returned HTTP 401 for all seven tables and the snapshot/initialization/provider-helper RPCs. Receipt: `artifacts/verification/hosted-anonymous.json`.
- Local publishable configuration saved only in gitignored `.env.local`. No server admin key configured. No finance rows inserted and no deployment performed.

These are schema and anonymous-denial receipts, not proof of a complete hosted OAuth/MFA/deletion lifecycle or production readiness.
