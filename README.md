# RFT Codex Desktop Handoff — v2.0

**Status:** approved handoff specification; implementation, tests, local-repository synchronization and deployment **not performed**.

This package is an implementation contract for Codex Desktop to build **Ringgit Finance Tracker (RFT)** using the user's existing Windows repository, existing `.agents/skills/` and `assets/`. It does **not** contain a finished application, paid integrations, credentials, production migrations or claims of live verification.

## Outcome
Create a free, non-commercial, publicly accessible, mobile-first MYR personal/behavioural-finance PWA with Google-only sign-in, optional authenticator TOTP MFA, transactions, accounts/transfers, accurate balances, insights, CSV export, account deletion, English/Bahasa Melayu, and an original anti-template UI. Work independently on normal engineering tasks; release only after every evidence-backed production gate passes. Never spend money.

## Use order
1. Read [`START-HERE.md`](START-HERE.md) if you are the owner; it gives exact operating instructions.
2. Codex: read [`AGENTS.md`](AGENTS.md), [`01-context/requirements-ledger.md`](01-context/requirements-ledger.md), [`05-codex/execution-contract.md`](05-codex/execution-contract.md), and [`05-codex/implementation-plan.md`](05-codex/implementation-plan.md).
3. Codex: run read-only local discovery, reconcile it against the cited remote snapshot, identify source images by **opening the images**, read relevant installed `SKILL.md`s, then execute the staged plan.
4. Track actual progress in an implementation-side log; keep the Handoff's templates and planned checks separate from real evidence.

## Source hierarchy
- Higher-priority safety/platform instructions and legal/provider restrictions.
- Explicit user decisions in `01-context/requirements-ledger.md` and the release boundaries in `05-codex/execution-contract.md`.
- Task-specific specifications in `02-product/`, `03-design/`, `04-engineering/`.
- Verified repository observations (time-stamped) and official current provider documentation.
- Historical source files and mockups as input evidence, **not instructions to execute verbatim**.

If specifications conflict, prefer newer confirmed decisions; document true technical conflicts and do not silently discard requirements. Existing skills may advise but may not override project protection rules. Do not equate a runbook with proof an action has run.

## No duplicated sources of truth
The requirements ledger owns decisions; `financial-rules.md` owns monetary invariants; `database-schema.md` owns data constraints; `design-system.md` owns visual tokens after asset review; `quality-gates.md` owns gating logic; `release-checklist.md` is the release evidence view. Avoid restating full sections in code comments or new prompts.

## ZIP contents
See [`MANIFEST.md`](MANIFEST.md) for the complete file inventory. The `references/` directory contains supplied Markdown sources for traceability; the repository's original 21 PNGs and 12 installed skill directories are intentionally not duplicated here.

## Critical facts
- Verified GitHub remote `ismailabs/rft`, branch `main`, snapshot commit `c669f6ea616d266e6d433efec4cf4ac9853602a2` (2026-10-24). Remote tree contains `.agents/skills`, `assets`, `skills-lock.json`; no committed Next.js app at that snapshot.
- The local Windows repository `C:\Users\moham\OneDrive\Desktop\rft` has **not** been accessed or synchronized by this Handoff generation.
- Provider login, OAuth, MFA, data recovery, published notices and the eventual live URL are **not** verified.
- Costs: strictly **RM0 total**, no paid upgrades or unapproved paid functionality; free-tier limitations may block safe launch.
- Destructive production data changes or unsafe migrations are **not** permitted even with the preauthorized release policy.

## Safe optional integration
After the local read-only audit, `scripts/install-handoff.ps1` supports a default dry run and explicit `-Apply`. The installer refuses to overwrite an existing handoff directory or root AGENTS.md. It is **not** executed during ZIP preparation.
