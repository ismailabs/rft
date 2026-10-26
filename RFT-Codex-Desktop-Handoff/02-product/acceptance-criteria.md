# Product acceptance criteria (functional)

A feature is done only with implementation + reproducible test evidence + applicable UX review. Trace IDs to `01-context/requirements-ledger.md` and `07-validation/requirements-traceability.md`.

| IDs | Observable pass criteria |
|---|---|
| P03/P04 | A real Google production account can complete OAuth; enrolled MFA sessions cannot bypass second factor by direct API/data access; non-enrolled users can use the permitted AAL1 flow |
| P05–P07 | Users create owned accounts/categories and income/expenses; transfers are atomic; invalid cross-owner/parent mismatches fail; historical edits update totals |
| P08–P09 | Dashboard period figures reconcile; end balance separately labeled; filters cover requested ranges, month boundaries and all time |
| P10 | Insights explain calculation and timeframe; low data doesn't produce false trends; goals optional and neutrally worded |
| P11/P12 | User can export correctly escaped authorized CSV; deletion workflow verifies identity, handles dependent data and does not expose privileged credentials |
| P13/P14 | EN/BM UI, MYR/local time, working public homepage/privacy/terms and honest product claims |
| P02/P15/P16 | Installable PWA, source-image-informed design, Lucide action icons, coherent mobile-first visuals, keyboard and touch behavior, real screenshot review |
| P17/P18 | Existing `.agents/skills/`, `assets/` and local Git state are inspected, referenced and preserved rather than blindly overwritten |
| P19–P23 | No billable services; noncommercial provider eligibility; QA/reporting evidence; deployment only after every mandatory gate passes |
| P24 | Owner-facing manual steps and final report are beginner-readable, precise and falsifiable |

**Do not treat these criteria as already passed.** The tests and screenshots are work for Codex after handoff preparation.
