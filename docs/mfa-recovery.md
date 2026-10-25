# Authenticator access and loss procedure

Applies to RFT's optional TOTP protection. Google remains the only sign-in provider. This procedure does not authorize removing any owner's factor, reset an account, or establish a tested hosted recovery service. A/B identities and authenticators remain protected during launch QA.

## While a verified authenticator is available

RFT's existing authenticator screen supports multiple named factors and a factor selector. A user who wants a second authenticator can sign in with Google, verify the existing factor, then open **Settings → Authenticator protection → Manage authenticator**. Enter a distinguishable name, choose **Set up authenticator**, and complete the QR/code steps privately. A newly created factor is pending until its code is verified. RFT must not treat a pending factor as proof of second-factor access.

Adding or removing a factor requires a Google OAuth verification less than ten minutes old. An already enrolled user must also have AAL2. If prompted to sign in again, complete Google and a currently available authenticator; neither the operator nor the assistant should receive QR material, setup keys or codes. No authenticator credential belongs in Git, logs, tickets or screenshots.

## A device is lost but another verified factor is available

1. Sign in to RFT with Google. At the authenticator challenge, use the **Authenticator name** selector to choose the available verified factor and enter its current code privately.
2. Open **Settings → Authenticator protection → Manage authenticator**. Choose **Remove authenticator**. In the confirmation sheet, select only the lost device by its known friendly name. Verify the choice before confirming; keep the available factor if continued MFA protection is intended.
3. RFT's handler checks recent Google authentication, AAL2 and ownership of the selected factor, calls Supabase's unenrollment API, then refreshes the session. If another challenge appears after refresh, verify the remaining factor before opening records.
4. Confirm the lost factor is absent and the intended factor remains. A later fresh sign-in must challenge enrolled users. If the user intentionally removes every factor, the approved optional-MFA policy permits AAL1 after the session is refreshed and no verified factor remains.

These are the implemented source paths, not a claim that the complete hosted multi-factor/removal scenario has passed. Rehearse them only with C's separately prepared synthetic identity; do not remove A/B factors to complete a test.

## Every authenticator is unavailable

RFT has no implemented recovery-code, email reset or automatic MFA-bypass endpoint. Google sign-in alone must continue to leave an enrolled user at AAL1 with finance access denied. Do not promise that Supabase support can restore an RFT end user's account; Supabase dashboard-account recovery documentation describes a different account system.

The user can contact **contact@ismailstudio.my** for help identifying an already available verified factor or their authenticator provider's own recovery options. Support must not ask for codes, seeds, passwords, cookies, tokens or financial record contents. An email message, screenshot, familiar name or successful Google-only login is insufficient authority to remove a verified factor.

If no factor can be recovered, access may remain unavailable. Do not remove factors through the Supabase dashboard/admin API, edit Auth tables, weaken RLS, add a password provider or issue a privileged replacement session to make progress. A future assisted reset would require a separately approved identity-proof and session-revocation design with abuse tests before it is offered. No such reset is currently authorized or verified.

## Source and verification references

- `src/features/auth/mfa-client.tsx`: factor naming, selector, enrollment/verification and removal confirmation.
- `src/app/api/mfa/route.ts`: verified identity, recent OAuth, AAL2 checks, selected-factor ownership and session refresh.
- `src/lib/supabase/auth.ts` and `private.session_allowed()` in the preserved core migration: server and database assurance checks.
- Current official [application MFA guide](https://supabase.com/docs/guides/auth/auth-mfa) and [unenrollment reference](https://supabase.com/docs/reference/javascript/auth-mfa-unenroll), retrieved through Supabase documentation search on 25 October 2026, specify verified-factor AAL2 and session-refresh behavior. The TOTP guide documents app enrollment; no SMS service or paid feature is introduced.

G07 remains blocked until the actual signed-session enrolled-AAL1, challenge and removal checks pass. The application-managed backup cancellation remains in force; this procedure creates no application backup, key-custody or recovery promise.
