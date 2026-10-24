# Visual QA — real screens vs existing mockups

A screenshot **is not a test of functionality**, and a compiled app **is not evidence of visual quality**. Codex must use both.

## Per-screen review
| Screen | Focus |
|---|---|
| Public homepage | Distinctive, credible hero; large actual app visuals; real copy, spacing and CTA |
| Google login/MFA | Honest provider presentation, error state, keyboard flow |
| Dashboard | Accurate financial labels, amount hierarchy, period selector, empty data |
| Add transaction | Few interactions, sensible defaults, readable amount and keyboard behavior |
| Accounts & transfer | Bank/e-wallet icon correctness, accessible account selector, distinct source/destination |
| Activity | Dense but readable history, filters, dates, actions and long rows |
| Insights | Chart text alternatives, no fabricated claims, category color/legend consistency |
| Settings & deletion | Clear irreversible-action warning and robust controls |

## Review procedure
1. Establish visually verified source mockup(s) and design tokens; annotate deviations and why.
2. Run app with **synthetic** data in isolated environment. Capture screenshots at narrow/wide mobile, tablet and desktop, plus representative states (empty, errors, data-rich).
3. Compare typography, icon weights, line lengths, spacing, radii, grid rhythm, colors, responsive breakpoints, touch targets, fidelity and original brand feel.
4. Fix identifiable defects and rerun screenshots/tests. Don't treat pixel similarity as the sole goal; usability and accessibility are priority.
5. Record reviewed screenshots or paths in the actual implementation report, not fabricated links.

## Blockers
Unusable primary action, clipped balance/controls, illegible text/contrast, inconsistent brand marks, misleading chart, generic placeholder UI on essential screens, keyboard-inaccessible flows: **block release** until resolved.
