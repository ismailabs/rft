# Server/API/validation contract

## Boundaries
Use Next.js App Router server capabilities (Route Handlers and Server Actions) with shared domain services. Treat each as a public-callable endpoint: verify session, MFA policy, ownership and Zod schemas for **every mutation**. RLS is defense in depth, not excuse to skip server checks.

## Representative operations (names are illustrative)
| Operation | Required validation | Output or error |
|---|---|---|
| `createTransaction` | exact amount, type, date, owned category/account | authoritative persisted record + updated query invalidation |
| `updateTransaction` | record owner, mutable fields, owned refs | safe update, deterministic summary refresh |
| `deleteTransaction` | record ownership and confirm | controlled delete, report actual persistence outcome |
| `createTransfer` | two distinct owned accounts, exact amount, timestamp, idempotency | atomic event or full rollback |
| `getDashboard` | signed-in user, period boundaries | period totals, current estimated balances, data-as-of explanation |
| `exportCsv` | verified owner and range, safe generation | streaming or safe download; no publicly stored files |
| `deleteMyAccount` | recent auth and MFA assurance as applicable, explicit confirmation | server-controlled deletion and safe session end |

## API behavior
- Validate JSON shapes and size limits. Never trust client-provided `user_id` or financial aggregate fields.
- Avoid disclosing whether another user's record exists. Return useful codes (`UNAUTHENTICATED`, `MFA_REQUIRED`, `VALIDATION_FAILED`, `CONFLICT`, `SERVER_UNAVAILABLE`) with localized safe messages.
- Define idempotency for repeated write requests and retry behavior; no false UI success.
- Tests call endpoints/actions directly with altered IDs and user contexts (not just browser UI).
- Use appropriate Next.js/Supabase SSR current API methods, pinned dependencies; check official docs before coding.
