# Repository audit — verified remote snapshot and required local audit

## Verified GitHub snapshot
- Remote: `https://github.com/ismailabs/rft` (public), default branch `main`.
- Commit at check: `c669f6ea616d266e6d433efec4cf4ac9853602a2`, 2026-10-24 00:38:07 UTC, "Initial commit: Ringgit Finance Tracker".
- Root paths: `.agents/`, `assets/`, `skills-lock.json`.
- Twelve skill directories exist beneath `.agents/skills/` (listed in `05-codex/skills-integration.md`).
- Twenty-one PNGs exist beneath `assets/` (see `03-design/assets-manifest.md`).
- No root `package.json`, Next.js `src/`, GitHub Actions workflow, Supabase migrations or root `AGENTS.md` in this remote snapshot.
- These observations are **not a live audit of the user's Windows local folder**. No source code was changed during handoff preparation.

## Stage 0 required commands (PowerShell; read-only)
Run from the local repo; don't discard work or clone over it:
```powershell
Set-Location 'C:\Users\moham\OneDrive\Desktop\rft'
pwd
git status --short --branch
git remote -v
git branch -vv
git log -1 --format='%H %cI %s'
git ls-files
git status --porcelain=v1 --untracked-files=all
Get-ChildItem -Force
Get-ChildItem -File -Recurse assets | Select-Object FullName,Length
Get-ChildItem -Directory .agents/skills | Select-Object Name
```
Before `git fetch`, determine whether network/credential access is permitted; fetch updates remote refs but does not modify the checked-out files. Never `git reset --hard`, `git clean -fd`, `git checkout` over unknown changes, or delete assets in Stage 0.

## Audit outputs Codex must report
Local branch/HEAD; remote and latest remote SHA; divergence; modified/untracked files; conflicts with incoming handoff `AGENTS.md`; asset audit plan with image previews; installed skills and whether scripts are safe to run; tool versions and current provider account access; whether any application source exists locally; preservation/cleanup inventory separated into "keep", "candidate", "blocked", not automatic deletion.

## Baseline correction
The remote snapshot is an initial **assets and skills** repository. Do not claim to have run tests or verified a built app. Actual app architecture and test commands are chosen during foundation work.
