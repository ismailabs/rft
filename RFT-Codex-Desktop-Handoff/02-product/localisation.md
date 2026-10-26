# Malaysian localisation

- Currency `MYR`, display `RM` and two fractional sen digits (except controlled internal exact calculation representation); **no FX** in V1.
- Default timezone `Asia/Kuala_Lumpur`; dates in a clear Malaysian convention (e.g. `24 Oct 2026`, or locale-aware day/month/year), avoid ambiguous `02/03` without locale context.
- Initial languages: `en` English and `ms` Bahasa Melayu. Use externalized dictionary keys for headings, controls, errors, dates, accessibility descriptions and empty states; don't hardcode visible English strings deep in React features.
- Verify BM translations for financial meaning, not machine-translated word-for-word UI; preserve stable abbreviations when customary.
- Account types: cash, bank, e-wallet. Provider icon names are display affordances only; no real bank connection or endorsement implied.
- Suggested categories: salary, freelance, gift, food/drinks, groceries, petrol, tolls, transport, bills, rent, subscriptions, personal, healthcare, education and savings transfers (do **not** count transfers as expense categories).
- Numeric inputs must accept mobile decimal input safely and normalize to exact sen. Do not parse culturally ambiguous separators without validation and visible interpretation.
- RTL is not required by the two approved languages; remain accessible for longer translated strings and wrapping.

Test cross-language navigation, long labels, punctuation, keyboard input, CSV Unicode, timezone boundary and consistency of all displayed figures.
