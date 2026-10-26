# Task dependency graph and resource ownership

```text
Local audit ──> source/image/skills inventory ──> actual design system
           └─> architecture/version contract ──> Next.js foundation
                                           └─> migrations + RLS + auth/MFA
                                                          └─> owned accounts/categories
                                                                  ├─> transactions/transfer ledger
                                                                  │        └─> financial reports
                                                                  │                └─> insights/budgets
                                                                  └─> export & deletion
Actual screens + domain services + security ──> end-to-end QA ──> release evidence
Provider free-tier + OAuth + legal + recovery ────────────────────> release evidence
Every release gate passes ──> production deployment ──> live smoke tests
```

## Critical dependency constraints
- No live financial workflow before identity, authorization and owner-scoped DB rules are working.
- No truthful dashboard without validated financial domain and time-range policies.
- No production deployment based on visual mockups or a TypeScript green build alone.
- No bulk migration to production before migration rehearsal and recovery/rollback plan.
- No brand/logo rendering without actual asset inspection and rights consideration.
- No extra staging project if it exceeds free project quotas; use isolated local/test alternative and document coverage.
- No reliance on third-party UI skill output that contradicts user requirements.

## Parallel-safe tasks
Reading design assets and reading official provider docs can run independently. Writing multiple migrations touching same tables cannot. Frontend interaction shell can be developed using synthetic placeholders in parallel with pure money tests but must not be reported as final backend integration.
