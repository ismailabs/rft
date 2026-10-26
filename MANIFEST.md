# Handoff manifest and static integrity information

**Version:** RFT approved Amended Requirements Confirmation Summary v2.0; prepared 2026-10-24. **Status:** handoff-only; no repository/provider mutation, no app tests, no deployment.

## Inclusion and exclusions
Includes all approved instruction/specification, implementation, operations, validation and safe template categories; original source Markdown copies are retained under `references/source-documents/` with a source-provided publishable key redacted. Existing `.agents/skills/` directories and original image binaries remain in the repository, **not duplicated** in ZIP. No app scaffold or secrets.

## Source baseline
GitHub `ismailabs/rft`, `main` commit `c669f6ea616d266e6d433efec4cf4ac9853602a2` on 2026-10-24. Local Windows worktree unverified. Image contents unverified. Provider credentials/production OAuth/unmetered eligibility/current compliance unverified. These factual limitations are intentional.

## Static validation commands
```powershell
python scripts/verify-handoff.py
python scripts/check-release-evidence.py templates/release-evidence.example.json
```
First command should return structural pass when run in extracted folder. Second should **fail and block** because every gate is intentionally `not-run`; that is the expected safe default. The second command checks only JSON evidence shape and still cannot independently verify actual logs/provider tests.

## Included-file hash inventory
Each truncated SHA-256 below refers to UTF-8 file bytes. The manifest itself is omitted from this table to avoid a self-reference. Full SHA-256 hashes are available from a local ZIP hashing command; no code-signing or external provenance claims.

| Relative path | Bytes | SHA-256 prefix | Purpose |
| --- | --- | --- | --- |
| `01-context/decisions-and-assumptions.md` | 2115 | 7274cc4409c414e1 | Decisions, evidence and source provenance |
| `01-context/project-context.md` | 1914 | 987ec839ae060d06 | Decisions, evidence and source provenance |
| `01-context/repository-audit.md` | 2252 | 64790cad8ba73c0d | Decisions, evidence and source provenance |
| `01-context/requirements-ledger.md` | 4463 | cebc8292ecb620e4 | Decisions, evidence and source provenance |
| `01-context/source-inventory.md` | 2791 | 0e6535f0e26de04c | Decisions, evidence and source provenance |
| `02-product/acceptance-criteria.md` | 1883 | 4a244e4654a88af6 | User journeys, exact finance rules and acceptance |
| `02-product/behavioural-finance.md` | 2186 | f3afc51871a1230a | User journeys, exact finance rules and acceptance |
| `02-product/feature-specifications.md` | 3066 | cfd34bc0ad403d6d | User journeys, exact finance rules and acceptance |
| `02-product/financial-rules.md` | 3437 | 9fc6e9553313939a | User journeys, exact finance rules and acceptance |
| `02-product/localisation.md` | 1530 | e63b3ea571386224 | User journeys, exact finance rules and acceptance |
| `02-product/product-requirements.md` | 2551 | 369325021e181862 | User journeys, exact finance rules and acceptance |
| `02-product/user-journeys.md` | 3096 | 8d30a5d623fc3995 | User journeys, exact finance rules and acceptance |
| `03-design/accessibility.md` | 1436 | a073709db33dce49 | No AI Slop, Lucide, asset mapping and visual QA |
| `03-design/assets-manifest.md` | 4376 | bfff36050d3b1cc6 | No AI Slop, Lucide, asset mapping and visual QA |
| `03-design/design-direction.md` | 2262 | d33d0a0a237d3279 | No AI Slop, Lucide, asset mapping and visual QA |
| `03-design/design-system.md` | 3054 | 3c664a4ae22bea8d | No AI Slop, Lucide, asset mapping and visual QA |
| `03-design/interaction-and-motion.md` | 1328 | cc13bb395ef96400 | No AI Slop, Lucide, asset mapping and visual QA |
| `03-design/screen-specifications.md` | 2768 | 4502c5e795857d07 | No AI Slop, Lucide, asset mapping and visual QA |
| `03-design/visual-qa.md` | 1912 | 7ae84ec844af02e8 | No AI Slop, Lucide, asset mapping and visual QA |
| `04-engineering/api-and-validation.md` | 1945 | cbfd639c8c51a58c | Secure modular-monolith architecture, data and tests |
| `04-engineering/auth-and-mfa.md` | 2019 | 425aa0553ec47866 | Secure modular-monolith architecture, data and tests |
| `04-engineering/database-schema.md` | 3104 | 004fc3c16e5f03ac | Secure modular-monolith architecture, data and tests |
| `04-engineering/financial-domain.md` | 1942 | e056b4ab76cce69d | Secure modular-monolith architecture, data and tests |
| `04-engineering/pwa.md` | 1304 | 23c951403a154031 | Secure modular-monolith architecture, data and tests |
| `04-engineering/repository-architecture.md` | 2050 | 2e58359b1e3d998d | Secure modular-monolith architecture, data and tests |
| `04-engineering/security-and-privacy.md` | 2529 | 0da857607d4a1f60 | Secure modular-monolith architecture, data and tests |
| `04-engineering/system-architecture.md` | 2511 | 296d223f746e597a | Secure modular-monolith architecture, data and tests |
| `04-engineering/testing-strategy.md` | 2192 | 622ff26128ddd6a3 | Secure modular-monolith architecture, data and tests |
| `05-codex/agent-orchestration.md` | 2340 | 1fefb1377539b783 | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/blocker-recovery.md` | 2200 | 5822dbf8f5331a2a | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/context-management.md` | 1245 | ee1b9f98b3fa6dbd | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/execution-contract.md` | 2754 | ccb248ad89cda438 | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/implementation-plan.md` | 4152 | 5962c793598d66e3 | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/quality-gates.md` | 2889 | 4fc85dff0a3b82b3 | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/skills-integration.md` | 3225 | 8a94c3c5144847dd | Autonomy, skill coordination, task sequencing and gates |
| `05-codex/task-dependencies.md` | 2094 | ea381a61f43cc477 | Autonomy, skill coordination, task sequencing and gates |
| `06-operations/backup-and-recovery.md` | 1801 | 034d2c3746745978 | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/ci-cd.md` | 1758 | 872b03d596824bac | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/deployment-runbook.md` | 2570 | 0acc52e647189ed7 | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/environments.md` | 1450 | 52ba9c5a2a99fe63 | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/integration-setup.md` | 2959 | fac19d41934ceb29 | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/manual-actions.md` | 3500 | b1b29071e9c86424 | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/monitoring.md` | 1372 | 52e65788c3c054dd | Integrations, RM0 policy, CI, deployment and recovery |
| `06-operations/zero-cost-policy.md` | 2238 | 8010e988f8b96516 | Integrations, RM0 policy, CI, deployment and recovery |
| `07-validation/completion-report-template.md` | 1428 | 3b7b3c622681bf60 | Traceability, tests, visual review and completion criteria |
| `07-validation/release-checklist.md` | 1672 | cf3afc81c0ca75d2 | Traceability, tests, visual review and completion criteria |
| `07-validation/requirements-traceability.md` | 2109 | 0b7969a9b214d97d | Traceability, tests, visual review and completion criteria |
| `07-validation/test-matrix.md` | 2808 | 8d983c4821b9c841 | Traceability, tests, visual review and completion criteria |
| `07-validation/visual-review-checklist.md` | 1634 | fb0a7d2bd2bd65d0 | Traceability, tests, visual review and completion criteria |
| `AGENTS.md` | 3952 | 6504b710f076b1c6 | Candidate repository-level instructions |
| `README.md` | 4128 | 382651451012d44c | Scope, safety and source hierarchy |
| `START-HERE.md` | 4202 | 01673757e7a313f2 | Nonexpert setup and first Codex instruction |
| `references/source-documents/info.md` | 23428 | 8bdf564ed6fb7ae0 |  |
| `references/source-documents/plugins and connectors.md` | 1113 | 3aac2d111201e9c1 |  |
| `references/source-documents/system architechture.md` | 34653 | 8f7ce4a65a7bf0e4 |  |
| `scripts/audit-local-repo.ps1` | 1321 | 1db03667d5c29aad | Non-destructive inventory, structural validation and fail-closed guard |
| `scripts/check-release-evidence.py` | 2620 | 661529070cd838d4 | Non-destructive inventory, structural validation and fail-closed guard |
| `scripts/install-handoff.ps1` | 2089 | 717801de4a76fa01 | Non-destructive inventory, structural validation and fail-closed guard |
| `scripts/verify-handoff.py` | 2433 | fa7651ba7fab4bfe | Non-destructive inventory, structural validation and fail-closed guard |
| `templates/.env.example` | 584 | 8b89d933dee5c506 | Safe non-secret progress/decision/evidence templates |
| `templates/blocker-report.md` | 492 | 1bc7da9e68985efb | Safe non-secret progress/decision/evidence templates |
| `templates/decisions.md` | 511 | 3b9c17907c68cda1 | Safe non-secret progress/decision/evidence templates |
| `templates/progress.md` | 554 | a95096d15c53b67d | Safe non-secret progress/decision/evidence templates |
| `templates/release-evidence.example.json` | 2027 | 42a38c20b47dbb87 | Safe non-secret progress/decision/evidence templates |
| `templates/verification-report.md` | 439 | db472e08586a285a | Safe non-secret progress/decision/evidence templates |

## Important
A handoff-package integrity pass is not an application-quality pass, a security audit, OAuth verification or permission to deploy. Production authorization remains conditional on verified G01–G15 evidence and separate restrictions on destructive real-data operations.
