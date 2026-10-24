# Backup, restoration and resilience — no unsupported guarantees

## Why this matters
Financial records are highly sensitive. Supabase Free currently does not include managed automatic downloadable database backups and may pause due to inactivity. A user's CSV export is a useful portability feature, **not** a full secure backup/restore system. Never promise zero data loss on free infrastructure.

## Required design decisions and evidence before launch
1. Identify realistic data-loss threats: accidental deletions, corruption, broken migration, provider outage, credential compromise and paused project.
2. Establish an available no-cost method for consistent **authorized** database backups (including schema, account/category relationships, transactions/transfers and identity linkage policies) without exporting credentials or private data to GitHub/public URLs. Confirm provider plan and current tooling support it.
3. Define storage location, access permissions, encryption/protection, retention limits, cost/quotas, restore authorization and operational ownership. Never create insecure copies or leak financial records in test files.
4. Rehearse restore to an isolated disposable environment using only synthetic data. Verify financial invariants and owner isolation on restored data.
5. Specify actual recovery-point/recovery-time limitations honestly and when owner intervention is required. Do not assume zero RPO/RTO.
6. Keep versioned DB migrations in source control; a source-code rollback alone cannot reverse a DB migration.

## RM0 contradiction branch
If an adequate verified recovery process cannot be provided free and legally/operationally appropriately, stop public release and report the remaining risk and required owner decision; do not silently mark recovery gate pass.
