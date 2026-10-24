# Owner actions — remaining launch gates

Production is blocked. Do not buy anything, enable billing, deploy, merge around a blocked check, or send keys, passwords, authenticator QR codes/seeds/codes, or private financial records in chat.

## Confirmed preparation

- Google-only Supabase configuration independently checked: Google true, Email false, anonymous false.
- Genuine Google sign-in reached the authenticated local app. Synthetic accounts, income, expense, transfer and CSV download worked against the hosted database.
- You report enrolling MFA and testing a fresh sign-in challenge. The latest aggregate provider check confirms two verified TOTP factors across two Google identities, with one RFT profile. Direct hosted bypass/removal checks remain separate.
- Supabase organization reports free/tier_free. No purchase or paid activation was performed.
- Google audience is Testing. That is suitable for the current test workflow, not public-launch evidence.
- You confirm Vercel shows Hobby (free). This is owner-reported dashboard evidence; the connected tools do not expose the billing field.
- Current provider metadata shows two Google identities, one RFT profile and two verified TOTP factors. You confirm recognizing both identities. Their separate browser-profile mapping and disposable designation remain unconfirmed. No identity has been impersonated or deleted.
- You approved publishing Ismail Studio, https://ismailstudio.my and contact@ismailstudio.my. The English/BM privacy and terms pages now include those details; the homepage credits Ismail Studio. Retention and owner/legal review remain open.

## 1. Identify the two test profiles privately

The current provider count is **two Google identities**, but only **one RFT profile**. A second successful empty-app bootstrap is not established. Do not create another identity just to increase the count, and do not delete either existing identity.

1. You have confirmed recognizing both entries. Keep email addresses, IDs, keys and authentication details private.
2. Open each account in a separate browser profile. Tell Codex the browser/profile names you choose for **A (preserve)** and **B (test)**. Only designate B as disposable if you control it and accept deleting its synthetic RFT records later.
3. In Google Cloud Console → **Google Auth Platform → Audience → Test users**, ensure the chosen test account is listed.
4. With the local RFT server running, open **http://127.0.0.1:3000/login** in B's browser profile, choose the correct Google identity and complete MFA privately if prompted. Expected result: an empty RFT app rather than A's QA accounts. Share only the screen/result and profile name.
5. Codex can then run the prepared, locally rehearsed hosted checks for the explicitly designated identities. Counts, recognition or a second sign-in alone do not prove isolation or authorize deletion.

The first profile contains two explicitly synthetic QA accounts and three entries. They were preserved; they are not live bank balances. No real account or record was deleted.

## 2. Controlled deletion verification

This is destructive and remains unperformed. Designate only a **disposable RFT test identity**, never your main Google/RFT identity, and explicitly authorize deletion of that identity's **RFT profile and synthetic RFT records**. This does not delete the Google account itself.

A server-only deletion key is now present in the private local configuration; its validity has not been exercised against an authorized disposable identity. Presence is not deletion proof. When Codex is ready for the designated test:

1. Open Supabase → RFT → **Project Settings → API Keys**, using the secret-key section. Do not copy a secret into chat, GitHub or a browser application's public configuration.
2. If the existing key needs correction, in your local private `.env.local` file set `SUPABASE_SECRET_KEY` to the correct project's existing server secret. Never use a `NEXT_PUBLIC_` name. Do not change the publishable key or enable billing.
3. Tell Codex only that the private file is saved. Codex will restart and validate the server without printing the key.
4. In the disposable user's separate profile, sign in again with Google, complete MFA if enrolled, then **Settings → Delete my RFT account**. The final permanent deletion needs explicit authorization at that time.
5. Codex must verify user/record removal, revoked-session denial, remaining-user isolation and documented retention exceptions. No `pass` until those checks succeed.

Keep this credential local while release is blocked. Preview/test deployment scopes must not receive production admin credentials.

## 3. Confirm the actual Vercel plan and protected Git checks

1. You report **Hobby (free)** in Vercel Billing. Preserve that plan and avoid paid add-ons/trials; actual usage/quotas and independent intended-project confirmation still need a release review. The connected project/team tools did not expose billing, and browser audit timed out.
2. After the first green GitHub workflow, open GitHub → **ismailabs/rft → Settings → Rules → Rulesets → New branch ruleset**.
3. Name it **RFT main protection**, target the default branch, require a pull request and the **verify** check from **RFT verification**, block force pushes/deletions, then set enforcement **Active**. Do not enable a paid feature if prompted.
4. Tell Codex when saved so protection can be independently inspected. A green CI run alone does not protect main.

## 4. Settle privacy and recovery facts on the prepared implementation

1. Review the actual local [privacy page](http://127.0.0.1:3000/privacy) and [terms page](http://127.0.0.1:3000/terms), including BM. Both are explicitly prelaunch drafts.
2. Your approved public details are now included: **Ismail Studio**, **ismailstudio.my**, **contact@ismailstudio.my**. Confirm the notices accurately describe your actual handling when reviewing retention and recovery below.
3. Review `docs/operations.md`: choose an existing, access-controlled encrypted backup location, identify who performs backups/restores, and settle retention and recovery limits. No paid service is assumed. If a safe feasible RM0 process cannot be verified, launch stays blocked.
4. Complete any applicable Malaysian privacy/legal review. Codex can implement accurate wording from verified facts but cannot invent legal approval or operational guarantees.

## 5. Public OAuth and device acceptance — after the earlier gates

1. Keep Google's Supabase redirect URI exactly `https://pvsvhfatkfcxgccfnxzq.supabase.co/auth/v1/callback`.
2. In **Google Auth Platform → Branding**, inspect any app/domain verification requirements. Do not buy a domain. Do not fill the homepage/privacy fields with a placeholder or unverified URL.
3. Public audience/branding and environment separation must be resolved under the release runbook before production. Do not click Publish as a substitute for the remaining security/legal/recovery checks.
4. Physical iPhone/Android installation, update and account-switching privacy checks still require a real device. Screen-reader verification is also unperformed; automated axe/keyboard checks are recorded separately.

## Release boundary

`vercel.json` disables all Git-triggered deployments. The existing Vercel placeholder is not this implementation. All G01–G15 must have actual passing evidence before deployment; G16 is verified after an authorized deployment. No implemented public URL is confirmed.
