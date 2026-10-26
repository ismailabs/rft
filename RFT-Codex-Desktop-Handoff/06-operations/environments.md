# Environment separation and safe testing

## Three logical environments
| Environment | Purpose | Allowed data | Credential policy |
|---|---|---|---|
| Local | Development and negative/security tests | Only synthetic finance test records | Local env, gitignored |
| Preview / isolated QA | Test real integrations and browser behavior where free resources permit | Dedicated synthetic users; no production records | No production service-role key or database write authority |
| Production | Real public free app only after every gate passes | Real user's protected records | Separate secure secrets and access |

Do not presume a second free Supabase project is available: confirm existing project count/limits. A local Supabase stack or isolated test schema may be an alternative **only if secure isolation is demonstrable**; no tests should mutate actual user data. Never use public Vercel preview tied to production finance database with admin privileges.

## Setup review
- Confirm specific Vercel project, repo integration, environment variable scopes and preview deployment protection.
- Confirm Supabase project and region, connection permissions, separate test strategy, OAuth redirect allowlist and database backup/recovery.
- No `.env.local`, token, refresh token, API key or OAuth client secret should reach GitHub. Review client bundles and artifacts.
- Names, URLs and project IDs are not proof of authentication or release readiness.
