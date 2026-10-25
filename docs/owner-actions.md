# Owner actions — remaining launch gates

Production is blocked. Do not buy anything, enable billing, deploy, merge around a blocked check, or send keys, passwords, authenticator QR codes/seeds/codes, or private financial records in chat.

## Confirmed preparation

- Google-only Supabase configuration independently checked: Google true, Email false, anonymous false.
- Genuine Google sign-in reached the authenticated local app. Synthetic accounts, income, expense, transfer and CSV download worked against the hosted database.
- You report enrolling MFA and testing a fresh sign-in challenge. The latest aggregate provider check confirms two verified TOTP factors across two Google identities, with one RFT profile. Direct hosted bypass/removal checks remain separate.
- Supabase organization reports free/tier_free. No purchase or paid activation was performed.
- Google audience is Testing. That is suitable for the current test workflow, not public-launch evidence.
- You confirm Vercel shows Hobby (free). This is owner-reported dashboard evidence; the connected tools do not expose the billing field.
- GitHub's public API now independently confirms Active default-branch protection: a pull request, the GitHub Actions `verify` check, deletion prevention and force-push prevention. Main is unchanged. The endpoint does not expose bypass actors without write-scoped access, so no independent bypass-list claim is made.
- Current provider metadata shows two Google identities, one RFT profile and two verified TOTP factors. You recognize both and designate **A: Current profile (preserve)** and **B: New RFT Test**. Both must be preserved. **Neither is disposable; no deletion is authorized.** You report B reaches an empty app. Opening the app does not itself initialize a saved profile, so the one-profile count is not proof that B failed to sign in.
- The hosted read-only SQL claim-context probe passed five contexts across eight relations, including cross-user read denial, enrolled AAL1 denial and invalid-session denial. No persistent data changed. This is separate from signed-JWT browser/REST and write/related-ID tests, which remain incomplete. Only the in-app browser is connected; the two external browser profiles are not exposed for automated session checks.
- You approved publishing Ismail Studio, https://ismailstudio.my and contact@ismailstudio.my. The English/BM privacy and terms pages now include those details; the homepage credits Ismail Studio. Retention and owner/legal review remain open.

## 1. Preserve the two designated profiles

The current provider count is **two Google identities**, **one saved RFT profile**, **two verified factors**. The owner reports B reaches an empty app. Preserve both identities and all their records. Do not create another identity just to increase a count.

1. Keep A in **Current profile** and B in **New RFT Test**. Keep email addresses, IDs, keys and authentication details private.
2. Complete Google/MFA privately when prompted. Never send session cookies, tokens, authenticator QR material or codes for automation.
3. Signed-session browser/REST read/write, related-ID and MFA lifecycle checks still need an observable, authorized test session. Owner reports and SQL-context simulation cover narrower scopes. The current browser connection does not expose either external profile.
4. Any later synthetic write test must preserve both identities and existing rows. No deletion or factor removal is authorized by the empty-app check.

The first profile contains two explicitly synthetic QA accounts and three entries. They were preserved; they are not live bank balances. No real account or record was deleted.

## 2. Deletion gate — blocked by explicit preservation instruction

**Neither designated identity is disposable and no deletion is authorized. Do not run Settings → Delete my RFT account, revoke either identity, or remove their records.** Controlled hosted deletion verification remains unperformed, so G09 cannot pass. The current preservation instruction is binding; it is not a request to change your decision.

A server-only deletion key is present in the private local configuration; its validity has not been exercised. Presence is not deletion proof. The following is a **future recovery reference only**, usable only if you later independently choose a separate disposable identity and explicitly authorize that test:

1. Open Supabase → RFT → **Project Settings → API Keys**, using the secret-key section. Do not copy a secret into chat, GitHub or a browser application's public configuration.
2. If the existing key needs correction, in your local private `.env.local` file set `SUPABASE_SECRET_KEY` to the correct project's existing server secret. Never use a `NEXT_PUBLIC_` name. Do not change the publishable key or enable billing.
3. Tell Codex only that the private file is saved. Codex will restart and validate the server without printing the key.
4. In the disposable user's separate profile, sign in again with Google, complete MFA if enrolled, then **Settings → Delete my RFT account**. The final permanent deletion needs explicit authorization at that time.
5. Codex must verify user/record removal, revoked-session denial, remaining-user isolation and documented retention exceptions. No `pass` until those checks succeed.

Keep this credential local while release is blocked. Preview/test deployment scopes must not receive production admin credentials.

## 3. Confirm the actual Vercel plan and protected Git checks

1. You report **Hobby (free)** in Vercel Billing. Preserve that plan and avoid paid add-ons/trials; actual usage/quotas and independent intended-project confirmation still need a release review. The connected project/team tools did not expose billing, and browser audit timed out.
2. **Completed:** you saved **RFT main protection**. After correcting the missing PR/status rules, the public API confirms it is Active, targets the default branch, requires a pull request and the GitHub Actions **verify** check, and blocks force pushes/deletions. Receipt: `artifacts/verification/main-protection-receipt.json`.
3. Keep those rules and the empty bypass list. The API does not expose the bypass list to this read-only request; do not infer it from the protected=true flag. No paid feature is needed. Do not merge while other release gates are blocked.
4. Intended production/preview secret separation and current provider quotas still need release evidence; branch protection does not establish those settings.

## 4. Settle privacy and recovery facts on the prepared implementation

1. Review the actual local [privacy page](http://127.0.0.1:3000/privacy) and [terms page](http://127.0.0.1:3000/terms), including BM. Both are explicitly prelaunch drafts.
2. Your approved public details are now included: **Ismail Studio**, **ismailstudio.my**, **contact@ismailstudio.my**. Confirm the notices accurately describe your actual handling when reviewing retention and recovery below.
3. The existing Google Drive account is already selected as the backup destination; the observed storage was 22.4 MB of 15 GB used. Review `docs/operations.md` to identify who performs backups/restores and settle retention, key custody and recovery limits. No archive has been uploaded, and any actual upload needs separate review as previously agreed. Free tool archives were downloaded safely; no installation/execution, key creation or hosted dump occurred. If a safe feasible RM0 process cannot be verified, launch stays blocked.
4. Complete any applicable Malaysian privacy/legal review. Codex can implement accurate wording from verified facts but cannot invent legal approval or operational guarantees.

## 5. Public OAuth and device acceptance — after the earlier gates

1. Keep Google's Supabase redirect URI exactly `https://pvsvhfatkfcxgccfnxzq.supabase.co/auth/v1/callback`.
2. In **Google Auth Platform → Branding**, inspect any app/domain verification requirements. Do not buy a domain. Do not fill the homepage/privacy fields with a placeholder or unverified URL.
3. Public audience/branding and environment separation must be resolved under the release runbook before production. Do not click Publish as a substitute for the remaining security/legal/recovery checks.
4. Physical iPhone/Android installation, update and account-switching privacy checks still require a real device. Screen-reader verification is also unperformed; automated axe/keyboard checks are recorded separately.

## Release boundary

`vercel.json` disables all Git-triggered deployments. The existing Vercel placeholder is not this implementation. All G01–G15 must have actual passing evidence before deployment; G16 is verified after an authorized deployment. No implemented public URL is confirmed.
