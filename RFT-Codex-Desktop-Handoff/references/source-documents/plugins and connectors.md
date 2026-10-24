- local repo: C:\Users\moham\OneDrive\Desktop\rft (where codex will be working)
- github: https://github.com/ismailabs/rft
- vercel: https://vercel.com/ismailstudio/rft
- supabase:
	- https://pvsvhfatkfcxgccfnxzq.supabase.co
	- [SOURCE-PUBLISHABLE-KEY-REDACTED]
	- supabase login
supabase init
supabase link --project-ref pvsvhfatkfcxgccfnxzq

1. Add the Supabase MCP server to Codex
Run this command to add the server.
Code:
File: Code
```
codex mcp add supabase --url https://mcp.supabase.com/mcp?project_ref=pvsvhfatkfcxgccfnxzq&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching
```

2. Authenticate
Run the authentication command.
Code:
File: Code
```
codex mcp login supabase
```

3. Verify authentication
Confirm the MCP server is authenticated.
Details:
Run this inside Codex to verify authentication.
Code:
File: Code
```
/mcp
```

4. Install Agent Skills (optional)
Agent Skills give AI coding tools ready-made instructions, scripts, and resources for working with Supabase more accurately and efficiently.
Code:
File: Code
```
npx skills add supabase/agent-skills
```
