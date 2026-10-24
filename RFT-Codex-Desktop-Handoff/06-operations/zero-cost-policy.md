# Absolute RM0 project-spend policy

## Fixed requirements
User declared **entire project budget zero** and **initial use non-commercial**. Do not buy domains, pay for tools, turn on paid tiers, accept metered paid overage or chargeable add-ons. Free sources/open-source packages may be used after license/security review. If a future feature needs spending, flag as out of scope; don't quietly approve.

## External plan eligibility to recheck at implementation/release
- Vercel Hobby terms: personal/non-commercial use only; provider may alter limits or discontinue/restrict projects. Source https://vercel.com/legal/terms . Confirm the actual RFT use remains non-commercial and the target project uses an eligible plan.
- Supabase Free: as of handoff research, 500 MB DB, 2 active projects, 50,000 MAU allowance, inactivity pausing after about a week, no included managed automatic backups; plans/limits can change. Source https://supabase.com/pricing . Use **no invented guarantee** of permanence, downtime or recovery.
- Google OAuth: basic sign-in may be free but published branding/domain/scopes can require verification; check actual Google owner/production setup. Source https://developers.google.com/identity/verification/authentication-verification .
- GitHub Actions/CI: review plan minute/storage limits, private/public repo policy and actual billing settings before using runners for long jobs.

## No-cost engineering strategy
- One Next.js app + Supabase, avoid paid observability, job queues, AI inference, premium design APIs, domain purchase and needless services.
- Use local tooling/synthetic data for tests where provider free quotas limit environments, while preserving adequate isolation.
- Monitor quotas and pause impact. A service that pauses is not a guaranteed always-on financial product.
- If user data recovery or operating obligations cannot be addressed honestly at RM0, **block public release**; provide exact tradeoffs and alternatives within budget if genuinely feasible.

## Enforcement
No blanket permission to accept billing prompts or vendor upgrades. Report any cost-required path, price/eligibility evidence, and no-charge fallback. Verify absence of unintended paid resources after deployment.
