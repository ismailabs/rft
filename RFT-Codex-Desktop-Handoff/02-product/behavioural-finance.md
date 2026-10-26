# Explainable behavioural insights (no external AI)

## Insights engine
Use deterministic calculations from the user's authorized transactions. Each insight needs inputs, window boundaries, rule/threshold, calculation, display text and source drill-down. Never invent facts or rank users against other people. If data is missing or insufficient, show a helpful neutral empty state instead of a guess.

### Supported rules
- **Category share:** `category expenses / total expenses` for the same valid period; handle 0 denominator without NaN/Infinity. Show value and percentage with explicit timeframe.
- **Period comparison:** compare equivalent complete periods; do not compare full prior week with a partial current week without clearly labeling partial nature. State absolute RM and percentage changes only when interpretable.
- **Trend:** time-bucket expense totals across comparable windows; line/bar chart must remain understandable in text/tabular form.
- **Budget progress:** compare actual expenses in category and target period with user-defined target; goals optional, no scolding or streak pressure.
- **Reflection:** optional "planned/unplanned" tag or short note, not a required input for every transaction.
- **Repeated expense observation:** never assert a confirmed subscription unless clearly recurring in reliable records; label as possible pattern.

## Examples (illustrative only, never seeded as real user data)
"Food spending this completed week was RM40 higher than the prior completed week." Show date boundaries and amount calculation. If only 2 days exist, suppress the comparison rather than claiming a trend.

## Anti-manipulation rules
No guilt-based warnings, debt/shame judgments, arbitrary financial health scoring, artificial engagement streaks, pressure to enable notifications or claims of professional financial advice. User autonomy and clarity outrank gamification.

## Tests
Empty account, 0 expenses, category rename, refund handling, data deletion, timezone boundary, outlier values, partial periods, inconsistent entry history, accessibility without chart interactions. Ensure every displayed amount equals a tested deterministic aggregation.
