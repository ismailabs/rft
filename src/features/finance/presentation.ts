/** Display-only inputs for explicitly synthetic examples. Authenticated routes do
 * not pass these inputs; mutations and domain calculations never consume them. */
export type InsightPresentation = {
  title: string;
  detail: string;
  icon: "trend" | "dining" | "calendar";
  tone: "green" | "amber" | "purple";
};
export type FinancePresentation = {
  periodLabel?: string;
  balance?: bigint;
  balanceChange?: string;
  balanceSeries?: bigint[];
  accountDescriptions?: Record<string, string>;
  accountReferences?: Record<string, string>;
  flows?: { income: bigint; expenses: bigint; net: bigint };
  flowChanges?: [string, string, string];
  monthly?: { income: bigint; expenses: bigint }[];
  insights?: InsightPresentation[];
  categoryPercentages?: Record<string, number>;
  categoryArcWeights?: Record<string, number>;
  accountPercentages?: Record<string, number>;
  budgetWarningIds?: string[];
};
