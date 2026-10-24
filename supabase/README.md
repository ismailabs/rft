# Database workflow

The first three additive migrations were applied to the empty hosted RFT project on 2026-10-24 after isolated rehearsal. Local filenames match provider-assigned migration versions. Run `npm test` to rehearse the schema in an isolated PostgreSQL runtime with synthetic Auth stubs. Never substitute these results for hosted Google/GoTrue acceptance. Actual rollout evidence: `docs/database-rollout.md`.

The proposed empty-hosted-project rollout must:

1. Reconfirm intended project ref, zero public tables, zero users and migration history.
2. Save the exact before-state and demonstrate synthetic restore/reconciliation/isolation in an isolated runtime.
3. Review all DDL and grants; confirm no actual customer data exists. No dropping existing tables or functions.
4. Use the provider migration tool to apply the reviewed additive SQL, record version/hash, run security advisors and compare schema.
5. Verify direct hosted REST/RLS/auth controls using authorized synthetic identities and a safe separate environment. No fake Google identities or manual inserts into production auth.users.

`NUMERIC` without a scale typemod is deliberate: CHECKs reject fractional sen and values beyond the approved NUMERIC(18,2) bounds instead of rounding them during input conversion. Amounts must be cast to text at every JSON boundary.

All user rows cascade from auth.users in verified account deletion. Parent account/category/subcategory deletion otherwise uses restrictive foreign keys. Archived records remain in historical balances/reports, but cannot receive new entries. Edits to account opening values with history are blocked.
