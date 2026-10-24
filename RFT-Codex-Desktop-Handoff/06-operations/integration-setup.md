# Integration guide — owner-assisted and verified

## Project pointers from user-provided document (not authentication proof)
- Windows local repo: `C:\Users\moham\OneDrive\Desktop\rft`
- GitHub: `https://github.com/ismailabs/rft`
- Vercel project: `https://vercel.com/ismailstudio/rft`
- Supabase endpoint: `https://pvsvhfatkfcxgccfnxzq.supabase.co` (project ref: `pvsvhfatkfcxgccfnxzq`)
- User source document proposes: `supabase login`, `supabase init`, `supabase link --project-ref pvsvhfatkfcxgccfnxzq` and a project-scoped Supabase MCP connection.

**Do not automatically execute** these commands without first checking repository files, installed CLI, actual account/project identity, permissions, current platform guidance and whether `supabase init` would conflict with local work. OAuth/service-role/client secrets must remain private; no raw keys included in handoff.

## Connection order
1. **GitHub:** authenticate authorized account, verify `git remote -v`, `git status`, upstream branch and permission for feature push/PR; protect existing local modifications.
2. **Supabase:** owner authenticates through official dashboard/CLI/MCP where available; verify intended project ref, role and auth settings. Inspect existing DB schema/migrations before linking or pushing anything.
3. **Google Cloud OAuth:** owner identifies project and configures consent branding, exact allowed redirect URIs for Supabase OAuth, verified domain/homepage/privacy pages and production publication as required. Use minimum identity scopes. Verify publicly usable login (not just test users).
4. **Vercel:** owner authorizes repo and correct RFT project. Verify Hobby eligibility for *noncommercial* use, free limits, build root/framework, preview/production env vars and domain.
5. **Local runtime:** use pinned compatible Node/npm, `@supabase/supabase-js` and supported SSR package, local-only environment variables; test safe synthetic workflows.

## Secure variable families (names illustrative; verify deployed SDK requirement)
- Browser: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (**publishable**, not privileged), public app origin.
- Server secrets: only what specifically needed for secure admin tasks, protected in provider env scope and excluded from client/build logs. Google OAuth secret is normally configured through provider consoles, not placed indiscriminately in Next.js browser vars.
- Never serialize admin/service-role keys into client code, public assets, or preview logs.

## MCP safety
`codex mcp login supabase` can grant tool access only after informed owner consent. Verify tool resource scope and actual permissions. MCP tools are optional convenience, **not** an implied approval for destructive production DB changes.

## Truthfulness
A successful ping or configured URL is not proof that RLS, MFA, backups, OAuth production status or public user flows work. Each requires dedicated checks and documentation.
