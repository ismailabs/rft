# Protected Preview verification — 25 October 2026

The existing RFT project now has one protected **Preview**, built from `904913ba94df1fef21d40a7613adacfabe97c2fd`. Its application/test/release source is unchanged from verified `ea6666dba37f997aa14c79faa2df5669204737cd`; the intervening changes are documentation and evidence. This is an intermediate verification environment, not a production release. All remaining production gates continue to apply.

Deployment: `dpl_8R9AmtEN4PGdSKK43FKGdS3tnqiV`, `https://rft-ovpxnmtjm-ismailstudio.vercel.app`. The authenticated provider returns READY and target null (the API's default Preview). A fresh project/environment/deployment read confirms Standard Protection remains enabled, all five provider variables target Production only, Preview/Development have no Supabase configuration, and the production deployment remains the original `c669f6e` baseline. `vercel.json` still disables Git-triggered deployment. No promotion, merge, domain change, share link, persistent bypass secret, billing or protection change occurred.

## Actual checks

The verifier used the existing authenticated Vercel CLI with a short-lived Development OIDC token. The token stayed in process memory, was attached only to the exact Preview origin and was excluded from the browser process environment. It was never printed, stored in a receipt, passed in a URL or sent to Google/third-party origins. No finance session was loaded; no traces, videos or browser storage exports were produced. `.env.local` had the same SHA256 before/after both verification attempts.

The native Node entry point preserves the CLI command separator on Windows:

```powershell
node C:/Users/moham/AppData/Roaming/npm/node_modules/vercel/dist/vc.js env run -e development --project prj_eM0EcPUzjg3G31h4jc6uhfo60dBo --scope ismailstudio -- node artifacts/private/verify-protected-preview.mjs
```

The local ignored verifier is retained for review; screenshots/receipts contain only public pages and synthetic illustrative content. Its first wrapper invocation failed with `missing_command` before running the child. The first actual HTTP/browser attempt passed eight HTTP/source checks but failed its initial render assertion. The failed receipt is preserved at `artifacts/verification/protected-preview-904913b/receipt.json`.

Diagnosis identified two harness issues: it counted images before asynchronous lazy-image loading completed, and classified Vercel's injected `https://vercel.live/_next-live/feedback/feedback.js` as an RFT request. A separate diagnostic captured all ten homepage images successfully and identified that single external path. See `artifacts/verification/protected-preview-diagnostic-904913b/diagnostic.json`. No application source was changed. The corrected verifier waits for visible images to load/decode, captures the entire page and separately records the blocked platform-toolbar request. Every other external request remains blocked and fails verification.

The corrected run exited **0**, with **eight HTTP/source checks and eight actual Chromium captures**. Evidence: `artifacts/verification/protected-preview-904913b-attempt2/receipt.json` and its PNG files. Each capture uses DPR 1, loaded fonts, zero missing visible images, zero page errors, no horizontal overflow, zero unexpected external requests and zero axe violations. The injected platform toolbar was blocked once per page and reported explicitly.

| Page | Viewport | Captured evidence |
|---|---|---|
| Homepage | 1448 × 1086 | `homepage-1448.png` |
| Homepage | 390 × 900 | `homepage-390.png` |
| Labeled public example | 1448 × 1086 | `public-preview-1448.png` |
| Unconfigured sign-in | 390 × 900 | `login-unconfigured-390.png` |
| Privacy EN/BM | 1100 × 900 | `privacy-en.png`, `privacy-ms.png` |
| Terms EN/BM | 1100 × 900 | `terms-en.png`, `terms-ms.png` |

All eight images were visually inspected. Anonymous access returns 302 to protection; authenticated access returns the real homepage. `/api/finance` and `/api/export` return 503 `NOT_CONFIGURED` with private/no-store, as required in this credential-free environment. All three manifest PNGs match reviewed source hashes/dimensions. Hosted worker source contains no finance response cache handler.

## Limits and release status

This evidence verifies public rendering and fail-closed configuration in a protected Preview. It does not verify production OAuth, signed financial operations, manual screen-reader behavior, a physical installed PWA, account-switch privacy or deletion. Automated visual contexts block service workers; source inspection is recorded separately. The existing install icons retain the documented older vector-leaf variation. Accepted A–E comparison evidence remains in `docs/pixel-fidelity-correction.md`.

Production remains blocked and unchanged. No implemented public production URL is confirmed. `docs/release-evidence.json` retains every unmet gate; the cancelled G14 backup scope is not relabeled as passed.
