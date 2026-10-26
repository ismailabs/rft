# Long-running Codex context and resumption

## Stable context
Keep root `AGENTS.md` focused (rules and links). Current choices live in `01-context/requirements-ledger.md`; task specs in matching module doc. Read the relevant skill on demand. Avoid repeating dozens of pages in every Codex prompt.

## Actual progress record
Use an implementation-side file such as `docs/progress.md` or a designated handoff progress copy. Record: ISO date, stage, branch/commit, files changed, tested commands/results, current blockers, next task, and provider environment. Never mark tasks tested if only static reasoning was performed.

## Resumption sequence
1. Verify current directory, branch, worktree and remote before writing.
2. Read most recent progress record and open PR/CI status.
3. Recheck any external provider state that may have changed since last session.
4. Resume smallest safe next task, run relevant tests, update record.

## Token and usage conservation
Task-specific docs, selective skill reads, concise changeset notes, context-bounded file scans, no repeated entire image/language catalogs in prompt, no unnecessary regenerated handoff packages. Preserve comprehensiveness in reference docs without duplicating mandates across files.
