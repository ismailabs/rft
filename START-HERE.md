# START HERE — owner instructions (Windows, beginner-friendly)

The ZIP is **a plan and instructions**, not a functioning website. Codex will write the application later. Preparing the ZIP has not altered your repository or production systems.

## Step 1 — Protect your working files
1. Do **not** delete `assets/`, `.agents/skills/`, `skills-lock.json`, or existing application code.
2. Confirm that your local project is `C:\Users\moham\OneDrive\Desktop\rft` and that GitHub remote is `https://github.com/ismailabs/rft`.
3. Open **Codex Desktop**, choose **Open folder/project**, and select that local folder. If Codex asks for directory access, grant only access you recognize.
4. Do not copy secret credentials into chats, committed files, GitHub issues, or the handoff.

## Step 2 — Give Codex the handoff
Unzip this package into a separate temporary location or add its documentation under a clearly named handoff folder **after examining local file collisions**. The root `AGENTS.md` in this ZIP is an *installation candidate*, not an instruction to overwrite a local `AGENTS.md` unseen. Tell Codex to review and integrate it safely. Do not create nested duplicated instruction systems.

### Suggested first Codex instruction (copy as one message)
> Work in `C:\Users\moham\OneDrive\Desktop\rft`. Read the provided RFT handoff `README.md`, `AGENTS.md`, requirements ledger, execution contract and implementation plan. Begin with **Stage 0 read-only audit**. Compare local Git state with `ismailabs/rft` main; inspect every installed `.agents/skills/*/SKILL.md` as relevant and all original images under `assets/`. Do not delete, overwrite, push, migrate, or deploy anything during the initial audit. Then follow the approved autonomous implementation contract, including RM0 cost guardrails and conditional production gates. Report blockers with exact beginner-friendly steps.

## Step 3 — Expected early Codex findings
- Is the current directory the correct repo? What is `git status --short --branch`?
- Does `git remote -v` point to `ismailabs/rft`? Are there local-only files or new commits?
- Are the 12 installed skills available? Is `skills-lock.json` consistent?
- What do the 21 images actually depict? Which are mockups, logo sheets, brand marks, favicons or duplicates?
- Are GitHub, Vercel, Supabase, Google OAuth, and their preview/production environments genuinely configured? **No guessing.**

## What only you may need to do
- Sign in / grant consent to GitHub, Supabase, Vercel and Google Cloud through their genuine interfaces.
- Enter provider secrets in the designated secure settings (**never** in a public repository).
- Complete Google OAuth ownership/branding/domain verification if required for public sign-in.
- Review factual privacy terms, actual data handling and legal requirements before public launch.
- Choose an acceptable recovery arrangement if the free infrastructure cannot provide a verified adequate one.
- Respond when a genuine external permission, zero-budget conflict or safety blocker is reported.

For each needed action, Codex must tell you **where to click, what to enter, why, how to verify**, and what to keep secret; see `06-operations/manual-actions.md`. You are **not** required to program the app or run a database migration manually.

## What "done" means
Only: verified working public URL; all approved Version 1 functions; security and financial tests; visual quality; no unauthorized spending; release-evidence report; operational limitations. A preview URL or green build alone does not count. If a gate fails, deployment is blocked and Codex must report progress truthfully.

## Safe optional installation (after Stage 0)
Codex may run `scripts/install-handoff.ps1` without arguments for a **dry run**, then `-Apply` after auditing local files. It copies this package into the repository under `codex-handoff/`, refusing to overwrite that directory. If root `AGENTS.md` exists, it remains untouched; otherwise the script creates a small pointer to the handoff. It never modifies original `assets/` or `.agents/skills/`, Git history or providers. Ask Codex to handle the installer if you do not want to run PowerShell yourself.
