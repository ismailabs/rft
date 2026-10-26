# Owner action guide — written for someone who is not a developer

**General rule:** Codex should perform technical work. Ask the owner only for access/consent, factual claims, compliance decisions or permissions Codex cannot supply. Never ask the owner to paste secret tokens, keys, codes or private financial records into chat or GitHub.

## Action 1 — Choose local project
Open Codex Desktop → open/select folder `C:\Users\moham\OneDrive\Desktop\rft` → allow access only to this project. Codex verifies `git status --short --branch`, `git remote -v`, `.agents/skills/` and `assets/`; do not delete files to "clean" the repo. Expected result: Codex confirms correct folder/branch and preserved work.

## Action 2 — GitHub consent (only if requested)
In your normal GitHub/browser authentication prompt, authorize the trusted Codex connection with project-appropriate repo access. Codex confirms remote is `https://github.com/ismailabs/rft`; expected result is authorized ability to read/create safe branches, not instant production release.

## Action 3 — Supabase connection (only if needed)
Open https://supabase.com/dashboard using the intended account → choose the existing RFT project matching `pvsvhfatkfcxgccfnxzq` → follow Codex's verified, current official CLI/MCP authentication steps. Never reveal admin/service role keys; enter them only in designated secure provider configuration. Codex checks project ref, RLS and migrations without touching real data before approval.

## Action 4 — Google OAuth publication
Open Google Cloud console via official Google account → select the project used for RFT Google login → review Google Auth Platform branding/audience, OAuth client redirect URIs and verification requirements using current console labels. Codex must give you the **exact** redirect URI and owned app domain from verified configuration, not an invented value. If domain verification or branding submission is needed, complete owner verification in Google console. Success means a real eligible Google account not merely a test user can sign in to intended app environment.

## Action 5 — Vercel scope
Open https://vercel.com/ismailstudio/rft → verify correct repository, framework, project configuration and Hobby noncommercial eligibility. Set env vars through Vercel project settings, not in Git or chat; check Environment scopes so preview doesn't receive unnecessary production privilege. Ask Codex for **names of keys**, not secret values in messages. Verify owner has not enabled billing/add-ons.

## Action 6 — Privacy and recovery review
Read actual prepared privacy notice/terms, and ensure they match how RFT will collect/store/delete/backup and log user data. Confirm applicable Malaysian obligations with qualified review where necessary. Review whether free backup/restore limitations are acceptable; blocked gates are not resolved by mere checkbox.

## Action 7 — After verified launch
Visit the real URL reported by Codex, sign in using your own Google account if desired, inspect mobile app; review operations guide for paused project, backups, quotas, future code updates. Do not share your private financial data with Codex to test.

## Format for any future action Codex needs from you
**Purpose → exact website/app navigation → what to select/type (no secrets in chat) → expected confirmation → Codex's next step → what could go wrong.** Avoid assuming familiarity with Git, OAuth, RLS, CI/CD or domain verification.
