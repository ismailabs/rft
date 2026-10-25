import { emptySnapshot, type Snapshot } from "@/domain/finance/types";
/** Public, explicitly labeled illustration. Never persisted or loaded as user data. */
export const marketingExample: Snapshot = (() => {
  const data = emptySnapshot();
  data.accounts = [
    ["Maybank", "bank"],
    ["CIMB", "bank"],
    ["RHB", "bank"],
    ["TNG eWallet", "ewallet"],
    ["GrabPay", "ewallet"],
  ].map(([name, type], i) => ({
    id: `illustration-${i}`,
    name,
    type: type as "bank" | "ewallet",
    provider: name,
    opening_balance: ["-3770.90", "2850.00", "1200.00", "680.25", "430.00"][i],
    opened_at: "2026-05-01T00:00:00Z",
    archived: false,
  }));
  data.categories = [
    {
      id: "illustration-income",
      name: "Sample income",
      type: "income",
      archived: false,
    },
    {
      id: "illustration-spend",
      name: "Sample expenses",
      type: "expense",
      archived: false,
    },
    {
      id: "illustration-food",
      name: "Food & Beverage",
      type: "expense",
      archived: false,
    },
  ];
  for (let month = 5; month <= 10; month++)
    for (const type of ["income", "expense"] as const)
      data.transactions.push({
        id: `illustration-${month}-${type}`,
        account_id: data.accounts[0].id,
        category_id: `illustration-${type === "income" ? "income" : "spend"}`,
        subcategory_id: null,
        type,
        amount: (type === "income"
          ? ["5200.00", "5600.00", "5500.00", "5200.00", "5800.00", "5200.00"]
          : ["3500.00", "4000.00", "3800.00", "3500.00", "3958.20", "2774.20"])[
          month - 5
        ],
        occurred_at: `2026-${String(month).padStart(2, "0")}-05T04:00:00Z`,
        note: `Sample ${type}`,
        planned: null,
      });
  data.transactions.push({
    id: "illustration-dining",
    account_id: data.accounts[0].id,
    category_id: "illustration-food",
    subcategory_id: null,
    type: "expense",
    amount: "876.20",
    occurred_at: "2026-10-18T04:00:00Z",
    note: "Illustrative dining entries",
    planned: null,
  });
  return data;
})();
