# Google-only authentication and optional TOTP MFA

## Supported identity flow
1. Google OAuth is the **only** sign-in option; use Supabase Auth and verified permitted OAuth scopes (prefer basic identity: `openid`, email/profile as needed). No email password provider exposed.
2. Secure OAuth state/PKCE/redirect handling in supported Next.js + Supabase SSR configuration; server-side user validation for protected pages and mutations.
3. New user guided setup; optional TOTP enrollment strongly encouraged but **not mandatory**.
4. If user has a verified TOTP factor, after Google sign-in they must complete challenge before protected financial access. If unenrolled, AAL1 permitted by approved policy. Enforce at authenticated server/data-access boundary and appropriate restrictive RLS/AAL policies, **not UI hiding alone**.
5. Safe MFA unenrollment and device-loss recovery plan before public launch; don't create insecure email bypass paths.
6. Sensitive deletion/export and MFA changes require appropriate recent identity and assurance verification.

## Required tests
Cancel sign-in, stale state, callback handling, cookie refresh, expired JWT, sign-out, private-route denial, direct Server Action/API bypass, MFA factor pending vs verified, enrolled user AAL1 blocked, AAL2 allowed, AAL1 unenrolled allowed, factor removal, browser session switching, account deletion invalidating future usage as feasible.

## Practical external dependency
Google OAuth production settings, branding and domains must be verified; published app may need domain ownership and brand verification. **Don't assume a free `vercel.app` URL satisfies every Google requirement.** The owner handles necessary console consent and ownership proof. Production cannot be declared ready with test-user-only OAuth.

Official technical starting point: https://supabase.com/docs/guides/auth/auth-mfa and https://developers.google.com/identity/verification/authentication-policy-compliance. Recheck the latest provider details at implementation.
