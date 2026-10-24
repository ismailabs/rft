# Design system — tokens and component rules

**Tokens are provisional until Codex visually audits the mockups.** Source proposal: warm off-white `#F7F7F4`, charcoal `#202521`, muted teal `#287566`, radius ~14–20px and readable sans such as DM Sans. These are **suggested**, not user-final brand constants. Confirm contrast before accepting.

## Component foundations
Use Tailwind semantic CSS variables + shadcn/ui and accessible Radix primitives where they materially help; avoid rigid copy-and-paste aesthetics. Define tokens for: canvas/surface/subtle surface, primary/secondary text, interactive primary/hover/disabled, borders, focus, success/warning/error, income/expense/transfer semantics, spacing, typography, radius, shadow, and motion.

## Visual hierarchy
- Primary: current financial value (clearly labeled estimate vs period), selection period, prominent Add action.
- Secondary: income, expenses, net flow, recent transactions, one meaningful insight.
- Tertiary: detailed breakdowns, filters, optional goals and settings.
- Numbers must be visually clear, aligned/tabular where useful; negative signs and currency symbols explicit. Never rely solely on red/green to distinguish transaction types.

## Icons
`lucide-react` is the preferred general action/navigation icon source: Home, list, plus, analytics, settings, calendar, edit, trash, upload/download, close, chevron, alert, etc. Choose one consistent weight/size and add accessible labels. For Maybank, CIMB, RHB, TNG eWallet, GrabPay and other institution identities, prefer **verified, suitable brand assets** from `assets/`, with rights review; if uncertain show neutral account-type icon and truthful provider name, not invented official logos. A source mockup does not confer usage rights.

## Layout & responsive behavior
- Mobile: four main destinations Home, Activity, Insights, Settings; prominent Add action; account management accessible from Home/Settings. Account for safe areas and small viewports.
- Tablet/desktop: navigation may adapt to side/top layout; keep identical tasks and information architecture; no arbitrary feature disparity.
- Touchable controls target at least ~44 CSS pixels where reasonable; keyboard navigable, focus visible, readable 16px-ish body baseline; responsive whitespace and line breaking; 320px narrow viewport not clipped.
- Aim WCAG 2.2 AA-relevant checks on contrast, labels, focus and target sizing; verify actual design rather than claiming compliance.

## Motion and feedback
Use Motion for purposeful transition/feedback, brief and reduced-motion aware; no continuously animated money widgets or distracting chart sweeps. Save success **only after DB success**; descriptive errors; loading skeleton only when needed; clear empty-state next action.

## Charts and explanation
Choose chart types that match question; use Recharts where appropriate, accessible legends/units/labels, clear selected period, non-color-dependent distinctions, table/text fallback and honest empty states. No fake analytics data in real dashboards.
