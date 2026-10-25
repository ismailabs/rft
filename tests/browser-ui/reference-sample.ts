import { emptySnapshot } from "@/domain/finance/types";
import { parseMoney, decimal } from "@/domain/finance/money";
import type { FinancePresentation } from "@/features/finance/presentation";

/** Literal A–D illustration, isolated from the deployable Next application.
 * The source's 12,480.75 headline disagrees with its 11,480.75 account sum;
 * display overrides deliberately do not enter the domain ledger. */
export function referenceSample(view?: string) {
  const data = emptySnapshot();
  data.accounts = ["Maybank", "CIMB", "RHB", "TNG eWallet", "GrabPay"].map(
    (name, i) => ({
      id: `reference-account-${i}`,
      name,
      provider: name === "TNG eWallet" ? "Touch 'n Go eWallet" : name,
      type: i < 3 ? ("bank" as const) : ("ewallet" as const),
      opening_balance: "0.00",
      opened_at: "2026-05-01T00:00:00Z",
      archived: false,
    }),
  );
  data.categories = [
    "Food & Beverage",
    "Transport",
    "Shopping",
    "Bills & Utilities",
    "Entertainment",
    "Groceries",
    "Others",
    "Salary",
    "Freelance",
  ].map((name, i) => ({
    id: `reference-category-${i}`,
    name,
    type: i > 6 ? ("income" as const) : ("expense" as const),
    archived: false,
  }));
  if (view === "activity") data.categories[3].name = "Bills";
  const entries: [number, string, number, number, string][] = [
    [24, "Jaya Grocer Mid Valley", 5, 0, "182.30"],
    [23, "Salary - ABC Sdn Bhd", 7, 1, "5200.00"],
    [22, "GrabRide", 1, 4, "18.50"],
    [20, "Netflix", 4, 0, "44.90"],
    [18, "Tealive", 0, 3, "12.50"],
    [17, "Electricity Bill (TNB)", 3, 0, "210.00"],
    [15, "Freelance Project", 8, 1, "800.00"],
    [14, "Aeon Mall", 2, 2, "299.00"],
    [12, "Petrol - Petronas", 1, 0, "100.00"],
    [10, "Dinner with Friends", 0, 4, "76.20"],
  ];
  const categoryTotals = [
    "876.20",
    "657.10",
    "547.80",
    "438.00",
    "365.50",
    "328.90",
    "436.90",
  ];
  // 32 older entries bring the table to 42 and the seven expense totals to 3,650.40.
  for (let c = 0; c < 7; c++) {
    const used = entries
      .filter((e) => e[2] === c)
      .reduce((n, e) => n + parseMoney(e[4]), 0n);
    let remaining = parseMoney(categoryTotals[c]) - used;
    const count = c < 4 ? 5 : 4;
    for (let n = 0; n < count; n++) {
      const amount = remaining / BigInt(count - n);
      remaining -= amount;
      entries.push([
        8 - (n % 7),
        `${data.categories[c].name} entry ${n + 1}`,
        c,
        c % 5,
        decimal(amount),
      ]);
    }
  }
  data.transactions = entries.map(
    ([day, note, category, account, amount], i) => ({
      id: `reference-transaction-${i}`,
      account_id: data.accounts[account].id,
      category_id: data.categories[category].id,
      subcategory_id: null,
      type: category > 6 ? "income" : "expense",
      amount,
      note,
      occurred_at: `2026-10-${String(day).padStart(2, "0")}T00:00:00Z`,
      planned: null,
    }),
  );
  const balances = ["6320.50", "2850.00", "1200.00", "680.25", "430.00"];
  for (let i = 0; i < data.accounts.length; i++) {
    const movement = data.transactions
      .filter((t) => t.account_id === data.accounts[i].id)
      .reduce(
        (n, t) => n + (t.type === "income" ? 1n : -1n) * parseMoney(t.amount),
        0n,
      );
    data.accounts[i].opening_balance = decimal(
      parseMoney(balances[i]) - movement,
    );
  }
  data.budgets = [1000, 800, 700, 500, 400, 500].map((amount, i) => ({
    id: `reference-budget-${i}`,
    category_id: data.categories[i].id,
    month: "2026-10-01",
    amount: `${amount}.00`,
  }));
  data.goals = [
    {
      id: "reference-goal-1",
      name: "Japan Trip 2027",
      saved_amount: "3750.00",
      target_amount: "8000.00",
      target_date: "2027-02-24",
    },
    {
      id: "reference-goal-2",
      name: "Emergency Fund",
      saved_amount: "6200.00",
      target_amount: "12000.00",
      target_date: "2027-06-24",
    },
    {
      id: "reference-goal-3",
      name: "New Laptop",
      saved_amount: "2400.00",
      target_amount: "4500.00",
      target_date: "2027-01-24",
    },
  ];
  return data;
}
export function referencePresentation(view: string): FinancePresentation {
  return {
    periodLabel: "Oct 1, 2026 – Oct 31, 2026",
    budgetWarningIds: ["reference-category-0"],
    accountPercentages: Object.fromEntries(
      [55, 24.8, 10.5, 5.9, 3.7].map((n, i) => [`reference-account-${i}`, n]),
    ),
    balance: 1248075n,
    balanceChange: "2.4%",
    balanceSeries: [10, 12, 22, 18, 24, 38, 34, 46, 35, 49, 64, 62].map((n) =>
      BigInt(n),
    ),
    accountDescriptions: Object.fromEntries(
      [
        "Savings Account",
        "Current Account",
        "Savings Account",
        "eWallet",
        "eWallet",
      ].map((v, i) => [`reference-account-${i}`, v]),
    ),
    accountReferences: Object.fromEntries(
      [
        "1234 5678 9012",
        "8600 1234 5678",
        "2145 6789 0123",
        "+60 12-345 6789",
        "+60 12-987 6543",
      ].map((v, i) => [`reference-account-${i}`, v]),
    ),
    flows: { income: 520000n, expenses: 365040n, net: 154960n },
    flowChanges: ["12%", "8%", "42%"],
    monthly: (view === "insights"
      ? [
          [4900, 3500],
          [5100, 3900],
          [5000, 3600],
          [5400, 4000],
          [6000, 4400],
          [6500, 4900],
        ]
      : [
          [5100, 3500],
          [5500, 4000],
          [5400, 3800],
          [5100, 3500],
          [5700, 4000],
          [5800, 4200],
        ]
    ).map(([income, expenses]) => ({
      income: BigInt(income * 100),
      expenses: BigInt(expenses * 100),
    })),
    categoryPercentages: Object.fromEntries(
      [24, 18, 15, 12, 10, 9, 22].map((v, i) => [`reference-category-${i}`, v]),
    ),
    // Measured clockwise source-raster sector boundaries, independent of the
    // illustration's contradictory printed percentages; never posted data.
    categoryArcWeights: Object.fromEntries(
      [84.5, 58.25, 45.75, 39.5, 29.5, 32, 70.5].map((v, i) => [
        `reference-category-${i}`,
        v,
      ]),
    ),
    insights:
      view === "insights"
        ? [
            {
              title: "You're spending 8% less",
              detail:
                "Total expenses were RM 3,650.40\nin October, compared to\nRM 3,958.20 in September.",
              icon: "trend",
              tone: "green",
            },
            {
              title: "Dining out made up 24%\nof your expenses",
              detail:
                "That's RM 876.20 across\n18 transactions. Consider setting\na budget if you want to reduce this.",
              icon: "dining",
              tone: "amber",
            },
            {
              title: "You've stayed within budget",
              detail:
                "4 of 6 budget categories\nare on track this month.\nGreat job maintaining\ncontrol!",
              icon: "calendar",
              tone: "purple",
            },
          ]
        : [
            {
              title: "Dining out made up 24% of your\nexpenses this month.",
              detail: "That's RM 876.20 across 18 transactions.",
              icon: "dining",
              tone: "amber",
            },
            {
              title: "You're spending 8% less\nthan last month.",
              detail: "Great job staying on track!",
              icon: "trend",
              tone: "green",
            },
            {
              title: "Your subscription costs total\nRM 124.90/month.",
              detail: "Consider reviewing unused subscriptions.",
              icon: "calendar",
              tone: "purple",
            },
          ],
  };
}
