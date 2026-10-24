# Required screen specifications

| Route / view | Primary content | Key interactions and verifications |
|---|---|---|
| `/` public | Clear original headline, genuine visual preview, features, how it works, privacy note, Google CTA | Honest claims, no fabricated traction/testimonials, SEO and responsiveness |
| `/privacy` `/terms` | Owner-reviewed documents describing actual service and data practices | Legal review required; no promise of compliance just because page exists |
| `/login` | One Google sign-in option, explanations and errors | OAuth callback, state/redirect checks, no other provider |
| `/auth/callback` | Session exchange | Redirect validated, expired/cancelled flow safe |
| `/auth/mfa` | Optional enrollment and challenge | Existing MFA cannot be skipped; lost device recovery explained |
| `/app` Home | Estimated aggregate account funds, period income/expense/net, period filter, recent activity, Add CTA | Correct separate labels, no duplicate income from transfers |
| `/app/transactions` Activity | Filterable transaction list, add/edit/delete, account/category information | Ownership, long rows, pagination/empty/error states |
| `/app/accounts` Accounts | Cash/bank/e-wallet tiles, correct provider symbols, balances, transfers | Correct opening balances, source/destination picker, archive/deletion safety |
| `/app/insights` | Trends, category distribution, optional budget progress, plain-language insights | Adequate data warnings and explanation of comparison window |
| `/app/settings` | Language, categories/accounts link, MFA, export, privacy, deletion | Accessible dialogs, recent-auth for sensitive operations |
| PWA-install UI | Real install support/status | Safari/Add to Home Screen guidance, unsupported browser fallback |

## Common UX states for all authenticated screens
Loading, error, empty/no-data, disconnected, expired session, AAL1-with-enrolled-factor, success after persistence. Provide explicit recovery controls. Treat screen content as private: no inadvertent static pre-rendering shared across users; no public caching of auth responses.

## Transaction-entry sheet/form
Default Expense; prominent RM amount field with mobile numeric keypad; category and account selectors; date/time defaults; optional subcategory/note; accessible save/cancel. Validate exact amount and account/category ownership server-side; do not allow double-submit or optimistic false success.

## Acceptance viewports
Capture real screenshots and test at representative 320/375/430 mobile widths, tablet ~768 and desktop ~1280/1440; choose as actual available. Check clipped currency values, safe area, form keyboard, chart overflow, sticky navigation and long BM labels. Mockups are references, not the only acceptance evidence.
