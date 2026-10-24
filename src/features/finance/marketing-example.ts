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
    opening_balance: i ? "250.00" : "1000.00",
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
  ];
  for (let month = 5; month <= 10; month++)
    for (const type of ["income", "expense"] as const)
      data.transactions.push({
        id: `illustration-${month}-${type}`,
        account_id: data.accounts[0].id,
        category_id: `illustration-${type === "income" ? "income" : "spend"}`,
        subcategory_id: null,
        type,
        amount:
          type === "income"
            ? `${2000 + month * 100}.00`
            : `${1200 + month * 70}.00`,
        occurred_at: `2026-${String(month).padStart(2, "0")}-05T04:00:00Z`,
        note: `Sample ${type}`,
        planned: null,
      });
  return data;
})();
