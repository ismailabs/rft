# GitHub clean CI receipt

Source: 8caa5bcb7b37ec40201b7dbdabad24601b577512
Run: https://github.com/ismailabs/rft/actions/runs/40059370624
Job: verify (120769332020)
Observed conclusion: success; all steps success. Standard ubuntu-latest public-repository runner; no deployment credentials, paid services, cache or artifact upload.

Excerpt from provider job log (ANSI formatting removed):

2026-10-24T03:42:15.5342951Z ##[group]Run npm ci --ignore-scripts
2026-10-24T03:42:15.5343177Z npm ci --ignore-scripts
2026-10-24T03:42:23.0895596Z added 474 packages, and audited 475 packages in 8s
2026-10-24T03:42:23.0906675Z found 0 vulnerabilities
2026-10-24T03:42:23.1430989Z ##[group]Run npm run verify
2026-10-24T03:42:23.1431178Z npm run verify
2026-10-24T03:42:23.3720097Z PASS: 65 original handoff hashes; 12 skill names; original assets/skills unchanged.
2026-10-24T03:42:31.1602826Z  Test Files  3 passed (3)
2026-10-24T03:42:31.1603470Z       Tests  46 passed (46)
2026-10-24T03:42:36.9580533Z ✓ Compiled successfully in 5.4s
2026-10-24T03:42:40.0972258Z   Finished TypeScript in 3.1s ...
2026-10-24T03:42:40.8077418Z ✓ Generating static pages using 3 workers (14/14) in 106ms
2026-10-24T03:42:41.0172572Z PASS: custom source/asset scan (162 text files) and browser output checks. No configured privileged key patterns found. This is not a Gitleaks audit.
2026-10-24T03:42:41.0332520Z ##[group]Run npm audit --audit-level=moderate
2026-10-24T03:42:41.0332747Z npm audit --audit-level=moderate
2026-10-24T03:42:41.3655915Z found 0 vulnerabilities
2026-10-24T03:43:03.5930880Z ##[group]Run npm run test:e2e
2026-10-24T03:43:03.5931083Z npm run test:e2e
2026-10-24T03:43:05.0718401Z Running 31 tests using 1 worker
2026-10-24T03:43:36.2385884Z   31 passed (32.2s)

This receipt proves the clean local/synthetic CI checks only. See docs/verification-report.md for hosted and production blockers.
