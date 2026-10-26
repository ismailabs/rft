# Agent responsibilities and orchestration

A single competent Codex instance may fulfill all roles. Parallel subagents are **optional only when actually supported** and when they reduce dependencies/context; never invent agent execution or assign overlapping mutations that create merge conflicts.

## Responsibility map
| Role | Owns | Consults |
|---|---|---|
| Product | Requirements traceability, outcomes, exclusions | User-approved ledger |
| Design | Visual direction, source images, original brand quality | `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines` |
| Frontend | Accessible responsive UI, PWA, charts, locale | `vercel-react-best-practices`, `vercel-composition-patterns` |
| Identity | Google sign-in, SSR sessions, MFA AAL enforcement | `supabase`, official Google & Supabase docs |
| Data | Schema/migrations/RLS, owner integrity, atomic operations | `supabase-postgres-best-practices` |
| Domain | Money math, event timestamps, summaries, insights | `02-product/financial-rules.md` |
| QA/Security | Negative tests, browser review, release evidence | `webapp-testing`, `systematic-debugging`, `verification-before-completion` |
| Release | Git/CI, preview, recovery, eligibility, production | `deploy-to-vercel` (guarded), provider docs |

## Coordination contract
- Define one clear owner for each module/change; shared interfaces get signed-off types/contracts before concurrent work.
- Parallelize **independent** tasks (e.g. style reference inventory and isolated financial unit tests) only after dependencies are understood; avoid simultaneous edits of shared files/migrations.
- Before integrating an implementation branch: update local Git state, run relevant type checks/tests, review diff for secrets/asset deletions, reconcile downstream contracts.
- Skills are guidance sources; user safety/cost/release boundaries always outrank their suggested automation commands.
- A final QA/release reviewer must inspect actual evidence and remaining failures; don't accept a self-reported "tested" label from an implementation subtask.

## Context control
Summarize verified progress per stage in implementation-side `progress.md`; link real commit/test run or screenshot paths. Avoid copying all skills/docs into a single prompt. Only load module specs required for current work, plus stable root policy.
