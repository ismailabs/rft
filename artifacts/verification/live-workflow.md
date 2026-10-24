# Actual local-to-hosted synthetic verification — 2026-10-24

Environment: locally served Next.js production build at 127.0.0.1:3000, connected to the RFT Supabase project. Google audience Testing. This is not a public production launch.

- Owner completed genuine Google sign-in. Independently observed authenticated /app with zero accounts and transactions; metadata at that point: 1 Auth user, 1 profile, 0 verified factors.
- Through the actual app, created QA synthetic cash (RM100.00) and QA synthetic wallet (RM50.00), both opening 1 October 2026, 00:00 Malaysia time.
- Saved synthetic expense RM5.10 and income RM25.20 to cash, then a RM10.34 transfer record from cash to wallet. No bank connection or real money movement occurred.
- App confirmed persistence before success. Accounts screen showed cash RM109.76, wallet RM60.34, combined RM170.10. Home showed income RM25.20, expenses RM5.10 and net RM20.10. A separate read-only SQL query restricted to these synthetic account names and QA notes independently returned 109.76 and 60.34.
- Settings Export CSV downloaded three exact synthetic entries with expected source/destination, category, UTC timestamps and amounts. Reviewed copy: live-synthetic-export.csv. No owner email, session tokens or personal finance are included.
- Owner reports completing authenticator enrollment and sign-out/sign-in challenge. Provider metadata independently confirms 1 verified factor and 0 unverified factors. This corroborates enrollment, not a direct hosted bypass or removal test.
- Owner reports second sign-in preparation, but repeated provider counts still show 1 Auth user and 1 profile. Two-user hosted isolation therefore remains unverified; do not infer two identities from that report.
- Browser control later timed out. No auth credentials/session tokens were extracted, and no MFA QR/secret/code was captured.

The two clearly named QA accounts and three QA entries remain in the owner's test profile. No records or identities were deleted. Destructive testing requires a separately designated disposable identity and scoped authorization.
