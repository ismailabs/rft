# Final application-source CI receipt

Source: dd5f90e6fc43d030064dad4c6371112c4c744596
Run: https://github.com/ismailabs/rft/actions/runs/40060470069
Job: verify (120772653663)
Conclusion: success; all steps success, independently read from provider job metadata.

Provider log excerpt (ANSI formatting removed):

2026-10-24T03:58:36.5875146Z ##[group]Run npm ci --ignore-scripts
2026-10-24T03:58:36.5875562Z npm ci --ignore-scripts
2026-10-24T03:58:49.7983401Z added 474 packages, and audited 475 packages in 13s
2026-10-24T03:58:49.7997009Z found 0 vulnerabilities
2026-10-24T03:58:49.8528703Z ##[group]Run npm run verify
2026-10-24T03:58:49.8529036Z npm run verify
2026-10-24T03:58:50.1267929Z PASS: 65 original handoff hashes; 12 skill names; original assets/skills unchanged.
2026-10-24T03:59:01.9305579Z  Test Files  4 passed (4)
2026-10-24T03:59:01.9306960Z       Tests  48 passed (48)
2026-10-24T03:59:09.7819803Z ✓ Compiled successfully in 7.2s
2026-10-24T03:59:14.4594244Z   Finished TypeScript in 4.7s ...
2026-10-24T03:59:15.5608546Z ✓ Generating static pages using 3 workers (14/14) in 170ms
2026-10-24T03:59:15.8395698Z PASS: custom source/asset scan (166 text files) and browser output checks. No configured privileged key patterns found. This is not a Gitleaks audit.
2026-10-24T03:59:15.8587394Z ##[group]Run npm audit --audit-level=moderate
2026-10-24T03:59:15.8587791Z npm audit --audit-level=moderate
2026-10-24T03:59:16.3132970Z found 0 vulnerabilities
2026-10-24T03:59:35.1657600Z ##[group]Run npm run test:e2e
2026-10-24T03:59:35.1657949Z npm run test:e2e
2026-10-24T03:59:37.3975863Z Running 31 tests using 1 worker
2026-10-24T04:00:19.7064633Z   31 passed (43.8s)

Includes HTTPS/localhost real SSR PKCE cookie integration tests. This is clean local/synthetic CI verification, not a production launch or a hosted two-user/deletion/MFA bypass claim.
