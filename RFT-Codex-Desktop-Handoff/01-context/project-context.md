# Project context and approved intent

**Product:** Ringgit Finance Tracker (RFT), free non-commercial personal and behavioural finance tracker designed for Malaysians. **Status:** source specifications and images exist; implementation has not been verified in local repo. At documented GitHub commit only skill/asset material exists. **Goal:** build a usable public mobile-first installable PWA with verifiable financial correctness, security, understandable insights and original design.

## Audience and problem
Ordinary Malaysian users who want to record where money comes from, where it goes and how their behavior changes; do not assume professional accounting knowledge. Prioritize simple transaction entry, clear totals and calm non-shaming feedback. Do not market it as direct bank integration or professional financial advice.

## Approved decisions
- Google sign-in only; optional TOTP MFA strongly encouraged.
- Accounts for cash/banks/e-wallets; transactions, transfers, categories, balances, insights, goals, export and deletion.
- Local MYR, `Asia/Kuala_Lumpur`, English and Bahasa Melayu.
- Next.js App Router + React + TypeScript + Tailwind + shadcn/ui/Radix + Lucide + Motion + Recharts + Zod; Supabase Auth/PostgreSQL/RLS; Vercel; GitHub; PWA.
- No AI slop; inspect and use source `assets/` and 12 installed `.agents/skills/`.
- Total budget RM0, non-commercial, no fixed deadline, autonomous coding and conditional production release.

## Distinctions
- The supplied architecture document says "Proposed · Not implemented". That is not permission to label features done.
- The GitHub remote is the version-controlled counterpart of a Windows local folder, but the local working tree is uninspected at handoff generation.
- Proposed mockup tokens are design suggestions; visually inspect images and choose consistent user-appropriate design rather than blindly copying a suggested hex palette.
