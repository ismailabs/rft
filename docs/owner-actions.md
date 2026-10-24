# Owner actions — remaining launch gates

Production is blocked. Do not buy anything, enable billing, deploy, merge around a blocked check, or send keys, passwords, authenticator QR codes/seeds/codes, or private financial records in chat.

## Confirmed preparation

- Google-only Supabase configuration independently checked: Google true, Email false, anonymous false.
- Genuine Google sign-in reached the authenticated local app. Synthetic accounts, income, expense, transfer and CSV download worked against the hosted database.
- You report enrolling MFA and testing a fresh sign-in challenge. Supabase independently confirms one verified factor. Direct hosted bypass/removal checks remain separate.
- Supabase organization reports free/tier_free. No purchase or paid activation was performed.
- Google audience is Testing. That is suitable for the current test workflow, not public-launch evidence.
- You confirm Vercel shows Hobby (free). This is owner-reported dashboard evidence; the connected tools do not expose the billing field.
- You confirm you have only one Google account. A second legitimate test identity is not yet available; no further sign-in retry with the same account will resolve the two-user gate.

## 1. Complete the second Google test sign-in

You have confirmed that you only have one Google account. The last independent provider count agrees: **one** Auth user/profile. Do not keep repeating sign-in with that same account. The gate needs a second legitimate Google test identity. If you choose to create an additional free Google account, complete Google's account-creation, credentials and terms steps yourself; Codex must not fabricate a Google identity. Alternatively, use an explicitly authorized tester who controls their own Google account. Codex will not contact another person without your instruction. Once that separate test identity is available:

1. In [Google Cloud Console](https://console.cloud.google.com/), select RFT's OAuth project → **Google Auth Platform → Audience → Test users**. Ensure the second Google address is listed.
2. Open a **separate browser profile** from the one used for the first RFT login. In Edge, use the profile menu → **Add profile**, or use another browser already installed.
3. Open [local RFT login](http://127.0.0.1:3000/login), then **Continue with Google**.
4. On Google's account chooser, choose **Use another account** and select the **different** Google identity. Do not use the first account again. Enter credentials only on Google.
5. Expected result: the new user's RFT app starts empty, without the two “QA synthetic” accounts from the first profile. Tell Codex the browser/profile name and observed result, without the email address or credentials.
6. Codex must independently confirm two users and run owned/cross-owner negative checks before claiming hosted isolation.

The first profile contains two explicitly synthetic QA accounts and three entries. They were preserved; they are not live bank balances. No real account or record was deleted.

## 2. Controlled deletion verification

This is destructive and remains unperformed. Designate only a **disposable RFT test identity**, never your main Google/RFT identity, and explicitly authorize deletion of that identity's **RFT profile and synthetic RFT records**. This does not delete the Google account itself.

The deletion API currently fails closed because a server-only admin key is absent. When Codex is ready for the designated test:

1. Open Supabase → RFT → **Project Settings → API Keys**, using the secret-key section. Do not copy a secret into chat, GitHub or a browser application's public configuration.
2. In your local private `.env.local` file, set `SUPABASE_SECRET_KEY` to the correct project's existing server secret. Never use a `NEXT_PUBLIC_` name. Do not change the publishable key or enable billing.
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
2. Supply the operator identity and a public contact address you are willing to publish. Do not send a private phone number or personal financial information.
3. Review `docs/operations.md`: choose an existing, access-controlled encrypted backup location, identify who performs backups/restores, and settle retention and recovery limits. No paid service is assumed. If a safe feasible RM0 process cannot be verified, launch stays blocked.
4. Complete any applicable Malaysian privacy/legal review. Codex can implement accurate wording from verified facts but cannot invent legal approval or operational guarantees.

## 5. Public OAuth and device acceptance — after the earlier gates

1. Keep Google's Supabase redirect URI exactly `https://pvsvhfatkfcxgccfnxzq.supabase.co/auth/v1/callback`.
2. In **Google Auth Platform → Branding**, inspect any app/domain verification requirements. Do not buy a domain. Do not fill the homepage/privacy fields with a placeholder or unverified URL.
3. Public audience/branding and environment separation must be resolved under the release runbook before production. Do not click Publish as a substitute for the remaining security/legal/recovery checks.
4. Physical iPhone/Android installation, update and account-switching privacy checks still require a real device. Screen-reader verification is also unperformed; automated axe/keyboard checks are recorded separately.

## Release boundary

`vercel.json` disables all Git-triggered deployments. The existing Vercel placeholder is not this implementation. All G01–G15 must have actual passing evidence before deployment; G16 is verified after an authorized deployment. No implemented public URL is confirmed.
