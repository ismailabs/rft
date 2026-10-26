# Interaction, navigation and motion

- Mobile bottom nav: Home / Activity / Insights / Settings; Add transaction is prominent and independently accessible. Consistent focus indicators, hit areas and back behavior.
- Forms: field labels remain visible; optional content progressively disclosed; date/time controls show Malaysia-local interpretation. Show inline errors and preserve unfinished input safely in current session where appropriate.
- Feedback: persistence confirmed before success; failed writes show actionable retry; destructive account deletion requires explicit confirmation + recent assurance.
- Transitions: Motion only for meaningful state change (sheet open/close, tab change, save feedback). Respect `prefers-reduced-motion`; avoid page-wide scroll reveals, flashy cards, gradient loops, animated balances.
- Accessibility: screen reader labels for icon-only controls, proper modal focus/escape, avoid hover-dependent actions, keyboard route navigation and visible current selection.
- Time-dependent UI: make filters and local date ranges explicit; no hidden assumption that past/boundary rows appear in current day.

Visual QA must confirm no layout jumps in actual browser and no flaky animations obscuring test results. Limit dependencies and motion costs under Vercel Hobby/free bandwidth constraints.
