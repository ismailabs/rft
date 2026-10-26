import { describe, expect, it } from "vitest";
import { monthlyReport, dailyExpenses } from "@/domain/finance/reporting";
import { emptySnapshot, type Transaction } from "@/domain/finance/types";

describe("Malaysia monthly reporting", () => {
  const tx = (
    id: string,
    amount: string,
    occurred_at: string,
    type: "income" | "expense" = "expense",
  ): Transaction => ({
    id,
    amount,
    occurred_at,
    type,
    account_id: "a",
    category_id: "c",
    subcategory_id: null,
    note: "synthetic",
    planned: null,
  });
  it("uses six calendar buckets across the year boundary", () => {
    const rows = monthlyReport(emptySnapshot(), "2026-01-20T04:00:00Z");
    expect(rows.map((r) => r.key)).toEqual([
      "2025-08",
      "2025-09",
      "2025-10",
      "2025-11",
      "2025-12",
      "2026-01",
    ]);
    expect(rows[0].period.start).toBe("2025-07-31T16:00:00.000Z");
    expect(rows[5].partial).toBe(true);
  });
  it("counts a Malaysia midnight once and excludes future entries", () => {
    const data = emptySnapshot();
    data.transactions = [
      tx("before", "0.10", "2025-12-31T15:59:59Z"),
      tx("edge", "0.20", "2025-12-31T16:00:00Z"),
      tx("now", "0.30", "2026-01-20T04:00:00Z"),
      tx("future", "999.00", "2026-01-20T04:00:00.001Z"),
    ];
    const rows = monthlyReport(data, "2026-01-20T04:00:00Z");
    expect(rows[4].expenses).toBe(10n);
    expect(rows[5].expenses).toBe(50n);
  });
  it("retains cents beyond the safe floating-point money range", () => {
    const data = emptySnapshot();
    data.transactions = [
      tx("large", "9999999999999999.99", "2026-01-01T01:00:00Z", "income"),
      tx("cent", "0.01", "2026-01-02T01:00:00Z"),
    ];
    expect(monthlyReport(data, "2026-01-20T04:00:00Z").at(-1)?.net).toBe(
      999999999999999998n,
    );
  });
  it("reconciles closing balances without treating transfers as cash flow", () => {
    const data = emptySnapshot();
    data.accounts = [
      {
        id: "a",
        name: "Synthetic A",
        type: "cash",
        provider: "",
        opening_balance: "100.00",
        opened_at: "2026-01-01T00:00:00Z",
        archived: false,
      },
      {
        id: "b",
        name: "Synthetic B",
        type: "ewallet",
        provider: "",
        opening_balance: "20.00",
        opened_at: "2026-01-01T00:00:00Z",
        archived: false,
      },
    ];
    data.transactions = [
      tx("income", "0.10", "2026-01-02T00:00:00Z", "income"),
      tx("expense", "0.03", "2026-01-02T00:00:01Z"),
    ];
    data.transfers = [
      {
        id: "transfer",
        source_id: "a",
        destination_id: "b",
        amount: "50.00",
        occurred_at: "2026-01-03T00:00:00Z",
        note: "Synthetic",
      },
    ];
    const current = monthlyReport(data, "2026-01-20T04:00:00Z").at(-1)!;
    expect(current.income).toBe(10n);
    expect(current.expenses).toBe(3n);
    expect(current.closing).toBe(12007n);
  });
});

describe("bounded Malaysia daily expense reporting", () => {
  const expense = (
    id: string,
    amount: string,
    occurred_at: string,
    type: "income" | "expense" = "expense",
  ): Transaction => ({
    id,
    amount,
    occurred_at,
    type,
    account_id: "synthetic-a",
    category_id: "synthetic-c",
    subcategory_id: null,
    note: "Synthetic",
    planned: null,
  });
  it("uses half-open KL days and stops at the snapshot", () => {
    const data = emptySnapshot();
    data.transactions = [
      expense("before", "10.00", "2026-09-30T15:59:59Z"),
      expense("start", "0.10", "2026-09-30T16:00:00Z"),
      expense("next", "0.20", "2026-10-01T16:00:00Z"),
      expense("now", "0.30", "2026-10-02T04:00:00Z"),
      expense("future", "99.00", "2026-10-02T04:00:00.001Z"),
      expense("income", "500.00", "2026-10-02T03:00:00Z", "income"),
    ];
    const rows = dailyExpenses(
      data,
      { start: "2026-09-30T16:00:00Z", end: "2026-10-31T16:00:00Z" },
      "2026-10-02T04:00:00Z",
    );
    expect(rows.map((r) => r.amount)).toEqual([10n, 50n]);
    expect(rows[1].end).toBe("2026-10-02T04:00:00.001Z");
  });
  it("caps all-time display to 31 explicitly bounded days without including older entries", () => {
    const data = emptySnapshot();
    data.transactions = [
      expense("old", "99.00", "2026-09-22T15:59:59Z"),
      expense("first", "0.01", "2026-09-23T16:00:00Z"),
    ];
    const rows = dailyExpenses(
      data,
      { start: null, end: "2026-10-24T04:00:00.001Z" },
      "2026-10-24T04:00:00Z",
    );
    expect(rows).toHaveLength(31);
    expect(rows[0].start).toBe("2026-09-23T16:00:00.000Z");
    expect(rows.reduce((n, r) => n + r.amount, 0n)).toBe(1n);
  });
  it("preserves maximum exact money and handles an empty interval", () => {
    const data = emptySnapshot();
    data.transactions = [
      expense("large", "9999999999999999.99", "2026-10-24T00:00:00Z"),
    ];
    expect(
      dailyExpenses(
        data,
        { start: "2026-10-23T16:00:00Z", end: "2026-10-24T04:00:00.001Z" },
        "2026-10-24T04:00:00Z",
      )[0].amount,
    ).toBe(999999999999999999n);
    expect(
      dailyExpenses(
        data,
        { start: "2026-10-25T16:00:00Z", end: "2026-10-26T16:00:00Z" },
        "2026-10-24T04:00:00Z",
      ),
    ).toEqual([]);
  });
});
