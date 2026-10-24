# Source inventory and authority boundaries

| Source | Location | Role | Reliability/limitations |
|---|---|---|---|
| User's final amended approval | Current conversation requirement summary v2.0 | Governing user decisions | Controls selection, version scope and autonomy |
| `info.md` | `references/source-documents/info.md` | Product strategy and proposed stack | Includes recommendations and illustrative numbers; not implementation proof |
| `system architechture.md` | `references/source-documents/system architechture.md` | Detailed proposed architecture | Explicitly marked proposed/not implemented; V1.1 insights superseded |
| `plugins and connectors.md` | `references/source-documents/plugins and connectors.md` | User-supplied local/provider pointers | Does **not** prove connections/authentication; keys must not be promoted to secret policy |
| GitHub `ismailabs/rft` | `https://github.com/ismailabs/rft` | Verified remote tree snapshot | Commit `c669f6ea616d266e6d433efec4cf4ac9853602a2`; local Windows copy not verified |
| `.agents/skills/` | Existing repository | Skill workflows | Read relevant `SKILL.md` at task time; instructions don't grant permissions |
| `assets/` | Existing repository | Visual input | 21 PNGs verified by filename; **pixel contents not verified** during handoff |
| `skills-lock.json` | Existing repository | Skill provenance | 12 named skill source entries; compare with actual installed dirs |

## Source priority
Latest approved user decision > earlier proposal or illustrative guidance. Implementers must verify current external provider APIs/features with primary documentation at the time of execution. Keep private credentials out of source/reference materials.

## Verified remote details (as of 2026-10-24)
Public repo, `main`, listed `.agents/skills/`, `assets/`, `skills-lock.json` only; no tracked application foundation. Confirm latest branch head when Codex begins. The remote tree observation was read-only; **do not infer there are no untracked/local-only files**.

## Official verification starting points
- Vercel Hobby terms: https://vercel.com/legal/terms
- Supabase pricing: https://supabase.com/pricing
- Supabase production checklist: https://supabase.com/docs/guides/deployment/going-into-prod
- Supabase MFA: https://supabase.com/docs/guides/auth/auth-mfa
- Google OAuth brand verification: https://developers.google.com/identity/verification/authentication-verification
- Google OAuth policy: https://developers.google.com/identity/verification/authentication-policy-compliance
- Codex skills and project instructions: https://developers.openai.com/blog/skills-agents-sdk

No provider configuration is inferred from these documentation links. Recheck changing terms, product plans, API guidance and laws before release.
