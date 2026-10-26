# Version 1 product requirements

## Mission and positioning
RFT gives Malaysian users a fast way to manually record money movements and understand spending behavior. It is a **free non-commercial** tracker, not a bank connection service, investment platform or financial adviser. Its central repeatable flow: record a transaction, then see an accurate financial picture.

## Complete modules
- Google-only sign-in/sign-out, optional TOTP MFA, secure sessions and recoverable error states.
- Guided initial setup: language preference, at least one account, optional MFA encouragement.
- Account CRUD subject to referential integrity; cash, banks, e-wallets, names, icons, date/opening balance.
- Income/expense CRUD with type, positive amount, account, category, optional subcategory/note, and occurred timestamp.
- Atomic account-to-account transfers; no double count in income/expense; separate fee treatment.
- Defaults and user-defined category/subcategory taxonomy; consistent types and ownership.
- Dashboard current total funds and period income/expense/net flow distinctly labeled; filters for today, week, month, range and all time.
- Insights: category shares, comparable completed periods, trends, optional budgets, optional planned/unplanned annotations where unobtrusive.
- CSV timeframe/all-time export; settings and verified account deletion.
- Public homepage/product preview/how-it-works/privacy/terms and meaningful sign-in CTA.
- Mobile-first installable PWA; EN/BM translation and MYR display.

## Critical quality requirements
Exact money; cross-user privacy; authenticated server/database access; good mobile ergonomics; understandable, non-deceptive data visualizations; natural user language; non-punitive insights; accessible controls; no indefinite loading spinner after failed saves; no sensitive response caches. Avoid default generic dashboard tiles, fake social proof, decorative charts or unrelated features.

## Boundaries
No live bank link or sync; no verified bank balance; no paid plan/service; no additional sign-in providers; no external financial AI; no speculative exchange rates, multi-currency balances, financial scoring, investment execution or full offline transaction syncing. Never present estimates as confirmed live bank amounts.

## Availability and launch
Public non-commercial access with real production OAuth and adequate privacy/recovery practices is the intended goal, **not an unconditional promise**. Costs, legal considerations, operational restrictions and failed tests are release blockers.
