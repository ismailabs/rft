# Proposed feature-oriented repository structure

The remote currently has no application foundation. **Codex must audit the local repo before initializing.** This is a recommended target structure, not a command to overwrite existing source.

```text
rft/
├── .agents/skills/                 # EXISTING — preserve
├── assets/                         # EXISTING originals — preserve
├── skills-lock.json                # EXISTING — preserve
├── AGENTS.md                       # Integrate carefully with existing local instructions
├── src/
│   ├── app/                        # public, auth, protected routes, API/manifest
│   ├── components/{ui,layout}/
│   ├── features/{auth,accounts,transactions,dashboard,insights,settings}/
│   ├── domain/finance/             # exact money & invariants
│   ├── lib/{supabase,validation,utils}/
│   └── i18n/                       # en/ms dictionaries
├── supabase/{migrations,tests}/
├── tests/{unit,integration,e2e}/
├── public/{icons,images}/          # derivatives, not original replacement
├── docs/                            # short living implementation docs
├── .github/workflows/              # verified free CI when appropriate
└── package.json
```

## Conventions
- Feature directories contain UI, service, typed schema and tests where practical; domain core has no direct UI coupling.
- Prefer explicit imports, standard TS settings, pinned compatible dependency versions, clear server/client boundaries, short source files.
- Do not create multiple redundant `AGENTS.md` files or copy huge agent-skill rules into app docs.
- Avoid committing `.env*` with secrets; commit only `.env.example`. `assets/` originals and existing skill lock are protected.
- Before restructuring or deleting existing local files, produce keep/migrate/candidate inventory; honor uncommitted changes.
- Use iterative commits/PRs for reviewable modifications, no forced push or destructive Git reset.
