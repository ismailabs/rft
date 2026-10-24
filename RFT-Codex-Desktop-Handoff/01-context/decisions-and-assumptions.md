# Decision register and assumptions

## Fixed decisions
| Decision | Why / constraint |
|---|---|
| One Next.js TypeScript app | Agreed modular-monolith architecture; avoid premature backend services |
| Supabase Auth + PostgreSQL + RLS | Google-only sign-in, ownership and exact financial records |
| Vercel | Existing user project; only if free non-commercial eligibility remains verified |
| Optional TOTP MFA | User selected optional, not mandatory enrollment; enforce verification when enrolled |
| Rule-based insights | Transparent calculations; no AI processing of private financial records |
| `assets/` and `.agents/skills/` mandatory | Preserve existing design work and curated skills |
| Lucide UI icons | Consistency; branded bank/e-wallet marks only where legitimate and useful |
| Conditional automated release | User pre-authorized only after all evidence gates pass |

## Engineering questions Codex resolves during Stage 0–2
Exact Next.js release/dependency versions, implementation module boundaries, chosen decimal library, SQL migration tool conventions, React component composition, typography/color tokens after inspecting mockups, hosted staging feasibility, supported backup method and acceptable recovery point. Verify officially and record answers here rather than inventing them in advance.

## Non-negotiable conditional branches
- If Vercel account/project is not eligible for free noncommercial use, stop public deployment and report a no-cost-compliant alternative if demonstrably viable, not paid upgrade.
- If Google OAuth production use requires verified domains/ownership unavailable under RM0, report blocker; don't silently launch test-only authentication publicly.
- If robust user data recovery cannot be demonstrated for the proposed public use at zero cost, report risk and block a release that requires that assurance.
- If local repo has application code not on remote, preserve and inspect it before any initialization.
- If images are composite sheets, derive optimized separate source assets while keeping originals intact; confirm icon trademark/license conditions.
