# Current visual recovery CI receipt

Verified 2026-10-24T13:30:29.513Z.

- Source: 7612ed76c9bd03ec53d30adb3c3d74cba7827e0b; draft PR https://github.com/ismailabs/rft/pull/1 remains open and unmerged.
- Clean Linux CI: https://github.com/ismailabs/rft/actions/runs/40095971680, verify job 120878198607, completed success. Every job step succeeded.
- PR test merge: 406b8f0e0f1595020edf0e519cfb36354881b8a5. Both tested merge and source have tree e5fd10361e5c07222ef80499dd6daccd1ef9b47f, independently compared after fetching that exact test merge.
- Clean npm ci --ignore-scripts; source/asset audit; typecheck; lint; **79/79 unit/integration tests**; production build; custom source/browser secret scan; npm audit **zero vulnerabilities**; Chromium install; **64/64 browser checks**. No skipped/failed/flaky browser result is reported.
- Evidence excerpt: recovery-ci-excerpt.log. The full decoded job log is retained locally in gitignored artifacts/private/recovery-ci-raw.log; SHA-256 d9465dba059e5d9aff73c5f60299a3f63261cd69cdfec0be106b714b954413ec.
- Local failed attempts are separately preserved in recovery-frozen-local-resource-limit.log, recovery-m4-local-resource-limit.log and the earlier browser failure logs. A clean CI run does not erase them.
- Local HEAD, tracking ref and advertised feature ref independently matched source after push. Main remained c669f6ea616d266e6d433efec4cf4ac9853602a2.
- Post-push Vercel list still showed one baseline placeholder at main c669f6e; no implementation deployment.

Scope: synthetic local/Linux tests, real component renders and public unauthenticated routes. This does not establish signed-session hosted isolation/MFA/deletion, legal/retention, operational recovery, provider/public OAuth eligibility, branch protection or physical-device/screen-reader acceptance. Both designated identities are preserved; neither is disposable and no deletion is authorized.
