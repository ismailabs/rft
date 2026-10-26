import { emptySnapshot, type Snapshot } from "@/domain/finance/types";
/** Synthetic visual QA only. Never imported by the deployed application. */
export function fidelitySample(): Snapshot {
  const data = emptySnapshot();
  data.accounts = [
    {
      id: "qa-bank-1",
      name: "Maybank · sample",
      type: "bank",
      provider: "Maybank",
      opening_balance: "1000.00",
      opened_at: "2026-05-01T00:00:00Z",
      archived: false,
    },
    {
      id: "qa-bank-2",
      name: "CIMB · sample",
      type: "bank",
      provider: "CIMB",
      opening_balance: "4000.00",
      opened_at: "2026-05-01T00:00:00Z",
      archived: false,
    },
    {
      id: "qa-bank-3",
      name: "RHB · sample",
      type: "bank",
      provider: "RHB",
      opening_balance: "4000.00",
      opened_at: "2026-05-01T00:00:00Z",
      archived: false,
    },
    {
      id: "qa-wallet-1",
      name: "TNG · sample",
      type: "ewallet",
      provider: "TNG eWallet",
      opening_balance: "3000.00",
      opened_at: "2026-05-01T00:00:00Z",
      archived: false,
    },
    {
      id: "qa-wallet-2",
      name: "GrabPay · sample",
      type: "ewallet",
      provider: "GrabPay",
      opening_balance: "3000.00",
      opened_at: "2026-05-01T00:00:00Z",
      archived: false,
    },
  ];
  data.categories = [
    { id: "salary", name: "Salary", type: "income", archived: false },
    ...[
      "Food & Beverage",
      "Transport",
      "Groceries",
      "Bills & Utilities",
      "Entertainment",
      "Shopping",
    ].map((name, i) => ({
      id: `qa-category-${i}`,
      name,
      type: "expense" as const,
      archived: false,
    })),
  ];
  for (let m = 5; m <= 10; m++) {
    const month = String(m).padStart(2, "0");
    data.transactions.push({
      id: `income-${m}`,
      account_id: "qa-bank-1",
      category_id: "salary",
      subcategory_id: null,
      type: "income",
      amount: `${4800 + m * 40}.00`,
      occurred_at: `2026-${month}-03T01:00:00Z`,
      note: "Synthetic salary",
      planned: null,
    });
    for (let c = 0; c < 6; c++)
      data.transactions.push({
        id: `expense-${m}-${c}`,
        account_id: data.accounts[c % 5].id,
        category_id: `qa-category-${c}`,
        subcategory_id: null,
        type: "expense",
        amount: `${270 + c * 25 + m * 10}.20`,
        occurred_at: `2026-${month}-${String(10 + c * 2).padStart(2, "0")}T04:00:00Z`,
        note: [
          "Synthetic lunch",
          "Synthetic ride",
          "Synthetic groceries",
          "Synthetic electricity",
          "Synthetic cinema",
          "Synthetic purchase",
        ][c],
        planned: true,
      });
  }
  data.budgets = data.categories
    .filter((c) => c.type === "expense")
    .map((c, i) => ({
      id: `budget-${i}`,
      category_id: c.id,
      month: "2026-10-01",
      amount: `${500 + i * 50}.00`,
    }));
  data.goals = [
    {
      id: "qa-goal-1",
      name: "Synthetic trip",
      target_amount: "8000.00",
      saved_amount: "3750.00",
      target_date: "2027-04-01",
    },
    {
      id: "qa-goal-2",
      name: "Synthetic emergency fund",
      target_amount: "12000.00",
      saved_amount: "6200.00",
      target_date: null,
    },
    {
      id: "qa-goal-3",
      name: "Synthetic laptop",
      target_amount: "4500.00",
      saved_amount: "2400.00",
      target_date: "2027-01-01",
    },
  ];
  return data;
}
