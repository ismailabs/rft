# Scenario-based test matrix — not yet executed

| ID | Scenario | Expected invariant / denial |
|---|---|---|
| T01 | Decimal RM0.10 + RM0.20 | Exactly RM0.30 |
| T02 | Amount 0, negative, too many sen, NaN, huge input | Validation/DB rejection, no record created |
| T03 | Income RM3500, expense RM1250 | Period net exactly RM2250 |
| T04 | Transfer RM50 A→B | A-50/B+50, zero additional expense/income |
| T05 | Transfer source=destination or different owner account | Rejected atomically |
| T06 | DB operation fails mid-transfer | No half-transfer persists |
| T07 | Edit/delete past expense across month boundary | All subsequent balances and reports recomputed correctly |
| T08 | Local 23:59:59 vs midnight in Malaysia | Correct half-open period membership |
| T09 | Month/year leap and calendar boundaries | No omission/duplication |
| T10 | Account opening balance and earlier transaction | Defined start rule enforced consistently |
| T11 | User A selects User B's transaction ID | Read/update/delete denied |
| T12 | User A uses User B's account or category ID on own transaction | Insert/update denied at DB boundary |
| T13 | AAL1 enrolled user calls direct finance API | Denied until valid second factor |
| T14 | AAL1 not-enrolled user uses permitted finance route | Permitted subject to RLS |
| T15 | Expired/invalid session | Private data unavailable; safe reauth UX |
| T16 | Google cancel/mismatched callback/production non-test user | Safe error or successful valid login, never partial unsafe auth |
| T17 | CSV with `=SUM(...)`, `+`, `-`, `@` and newlines | Spreadsheet-formula injection defended, proper CSV escaping |
| T18 | Export while logged in as second user | Only user's owned records |
| T19 | Delete user with records, MFA | Controlled removal/re-auth, no orphan data or token privilege abuse |
| T20 | Empty and sparse histories | Accurate empty states, no fabricated behavioural trends |
| T21 | Category budgets when not configured | Entire app functional without budgets |
| T22 | English/BM, long names, large balances | No truncated core values, correct translations and currency |
| T23 | Narrow mobile + tablet + desktop, keyboard | Readable and usable navigation/actions |
| T24 | Service worker offline with finance POST | Clear no-network failure, no secret financial cache or false save |
| T25 | Blocked paid quota/billing attempt | No purchase/upgrade; release blocked and reported |
| T26 | Required gate incomplete | Release guard fails closed |
| T27 | Production smoke test after authorized release | Public URL, HTTPS, real OAuth and protected flows verified |

Use isolated synthetic fixtures for destructive/malicious tests. Fill actual result, commands, date, environment and evidence links separately; this matrix is **not** a completed test run.
