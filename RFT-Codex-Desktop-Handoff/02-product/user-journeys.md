# User journeys and exception behaviors

Use **given → action → expected result → failure response**. Every journey requires a mobile and desktop check where relevant.

| Journey | Given/action | Expected behavior | Failure/edge coverage |
|---|---|---|---|
| Discovery | Public visitor opens `/` | Honest value/feature/privacy summary; Google CTA | Empty/unavailable app states; usable at 320px |
| Google login | User selects Google | Real OAuth callback and protected session | Cancel, expired state, incorrect redirect, missing configuration |
| MFA opt-in | Signed-in user enrolls TOTP | QR/manual secret via controlled UI; verified factor status | Invalid codes, duplicate factor, recovery, safe unenroll |
| MFA sign-in | Enrolled user signs in | Challenge before protected data, AAL2 enforced | AAL1 direct API bypass denied, lost device handling |
| Onboarding | New user chooses EN/BM and first account | Defaults stored once per user | Interrupted flow resumes without duplicate records |
| Expense | User enters RM24.90, selects food and cash | Saved expense, balance reduced, reporting updated | Malformed amount, race/double submit, missing category, offline failure |
| Income | User enters salary transaction | Balance increases, income report updates | Wrong category type, invalid dates, zero/negative amount |
| Transfer | User moves RM50 bank→e-wallet | Both account balances change, net flow unaffected | Same account, cross-owner, insufficient data, atomic rollback |
| Filters | User selects month/range/all-time | Matching data and explicit period boundaries | Empty ranges, timezone midnight, reversed dates |
| Insights | User opens Insights | Category trends and comparisons with math explained | Low history hides unreliable comparison; no fabricated insight |
| Goals | User sets optional category limit | Clear remaining/used figures without shaming | No budget doesn't block dashboard; overage neutral tone |
| Export | User downloads CSV | Only own selected rows with safe escaping | Formula injection, stale session, Unicode/BM and invalid dates |
| Delete account | User confirms destructive account deletion | Verifies identity, executes controlled cleanup, signs out | Network failure, re-auth failure, retries, retention disclosure |
| PWA | User chooses install guidance | Honest device-specific instructions | Unsupported browser, offline API calls, update interruptions |

## Data entry speed
Default date/time to current local value; remember last-used account if user allows; keep note/subcategory optional. Never let convenience defaults result in silently incorrect transaction type, account or amount. Prefer clear undo for reversible UI actions, but permanent deletion requires explicit confirmation.

## Recovery and accessibility
Loading, empty, error, success, logged-out, MFA-pending and no-network states each need understandable text and concrete next action; don't imply success until persisted. Dialogs trap/manage focus appropriately, have visible labels and safe keyboard dismissal. Users must not need charts alone to read totals.
