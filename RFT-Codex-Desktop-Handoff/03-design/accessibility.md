# Accessibility acceptance contract

Target relevant WCAG 2.2 AA expectations where feasible; verify instead of asserting certification. Include contrast checks for primary/secondary text, semantic headings, visible labels, keyboard-only operation, discernible icon names, meaningful error feedback, reduced motion and mobile zoom. Avoid color-only income/expense distinctions.

## Essential manual checks
1. Tab through login, dashboard, Add flow, accounts, filters, export and deletion; visible focus should never be obscured by fixed navigation.
2. Open/close modal/dialog/sheet via keyboard, manage focus and return it to trigger.
3. Read page with a screen reader where available; account balances and charts have labels, units and text alternatives.
4. At 200% zoom or narrow viewport, primary actions remain reachable and no horizontal scrolling is required for basic tasks.
5. Distinguish validation and permission failure without relying on color; error appears near field, summarized if multiple errors.
6. Check contrast with actual palette after reviewing images; not only recommended hex values.
7. Ensure EN/BM translations, dynamic text updates and currency amounts remain understandable.

## Automated vs manual
Automated checks (e.g. axe via Playwright) detect only part of accessibility defects. Record both actual automated results and manual keyboard/screen-reader limitations. Failed essential tasks block release.
