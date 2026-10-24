export type Locale = "en" | "ms";
export type Account = {
  id: string;
  name: string;
  type: "cash" | "bank" | "ewallet";
  provider: string;
  opening_balance: string;
  opened_at: string;
  archived: boolean;
};
export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  archived: boolean;
};
export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  archived: boolean;
};
export type Transaction = {
  id: string;
  account_id: string;
  category_id: string;
  subcategory_id: string | null;
  type: "income" | "expense";
  amount: string;
  occurred_at: string;
  note: string;
  planned: boolean | null;
};
export type Transfer = {
  id: string;
  source_id: string;
  destination_id: string;
  amount: string;
  occurred_at: string;
  note: string;
};
export type Budget = {
  id: string;
  category_id: string;
  month: string;
  amount: string;
};
export type SavingsGoal = {
  id: string;
  name: string;
  target_amount: string;
  saved_amount: string;
  target_date: string | null;
};
export type Snapshot = {
  accounts: Account[];
  categories: Category[];
  subcategories: Subcategory[];
  transactions: Transaction[];
  transfers: Transfer[];
  budgets: Budget[];
  goals: SavingsGoal[];
  locale: Locale;
};
export const emptySnapshot = (): Snapshot => ({
  accounts: [],
  categories: [],
  subcategories: [],
  transactions: [],
  transfers: [],
  budgets: [],
  goals: [],
  locale: "en",
});
