import { expect, it } from "vitest";
import fc from "fast-check";
import {
  balances,
  totals,
  categoryShares,
  weeklyTrend,
} from "@/domain/finance/calculations";
import { decimal, parseMoney } from "@/domain/finance/money";
import { emptySnapshot } from "@/domain/finance/types";
import { sample } from "@/features/finance/sample";
import { mutation } from "@/features/finance/validation";
import { assertSameOrigin, limitedJson, safeError } from "@/lib/http";
const end = "2026-03-01T00:00:00Z";
it("completed-week trend partitions Malaysia boundary expenses without transfers or partial weeks", () => {
  const d = emptySnapshot();
  const tx = (occurred_at: string, amount: string) => ({
    id: crypto.randomUUID(),
    account_id: "a",
    category_id: "c",
    subcategory_id: null,
    type: "expense" as const,
    amount,
    occurred_at,
    note: "",
    planned: null,
  });
  d.transactions = [
    tx("2026-09-20T16:00:00Z", "0.10"),
    tx("2026-09-27T15:59:59Z", "0.20"),
    tx("2026-09-27T16:00:00Z", "5.10"),
    tx("2026-10-18T15:59:59Z", "9.99"),
    tx("2026-10-18T16:00:00Z", "100.00"),
  ];
  const rows = weeklyTrend(d, new Date("2026-10-24T00:00:00Z"));
  expect(rows.map((r) => r.amount)).toEqual([30n, 510n, 0n, 999n]);
  expect(rows.map((r) => r.count)).toEqual([2, 1, 0, 1]);
  expect(rows[0].period.start).toBe("2026-09-20T16:00:00.000Z");
  expect(rows[3].period.end).toBe("2026-10-18T16:00:00.000Z");
  expect(
    weeklyTrend(emptySnapshot(), new Date("2026-10-24T00:00:00Z")),
  ).toHaveLength(4);
});
it("reconciles the exact handoff vector and historical edit/delete", () => {
  const d = emptySnapshot();
  d.accounts = ["a", "b"].map((id, i) => ({
    id,
    name: id,
    type: "cash",
    provider: "",
    opening_balance: i === 0 ? "100.00" : "20.00",
    opened_at: "2026-01-01T00:00:00Z",
    archived: false,
  }));
  d.transactions = ["0.10", "0.20", "24.90"].map((amount, i) => ({
    id: String(i),
    account_id: "a",
    category_id: "food",
    subcategory_id: null,
    type: i === 2 ? "expense" : "income",
    amount,
    occurred_at: "2026-02-01T00:00:00Z",
    note: "",
    planned: null,
  }));
  d.transfers = [
    {
      id: "t",
      source_id: "a",
      destination_id: "b",
      amount: "50.00",
      occurred_at: "2026-02-01T00:00:00Z",
      note: "",
    },
  ];
  expect(balances(d, end).get("a")).toBe(2540n);
  expect(balances(d, end).get("b")).toBe(7000n);
  expect(totals(d.transactions, { start: null, end })).toEqual({
    income: 30n,
    expenses: 2490n,
    net: -2460n,
  });
  d.transactions[2].amount = "4.90";
  expect(balances(d, end).get("a")).toBe(4540n);
  d.transactions.pop();
  expect(balances(d, end).get("a")).toBe(5030n);
});
it("arbitrary ledgers reconcile and disjoint periods partition exactly", () =>
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          sen: fc.bigInt({ min: 1n, max: 999999999999999n }),
          income: fc.boolean(),
          early: fc.boolean(),
        }),
        { maxLength: 80 },
      ),
      (entries) => {
        const d = emptySnapshot();
        d.accounts = [
          {
            id: "a",
            name: "cash",
            type: "cash",
            provider: "",
            opening_balance: "0.00",
            opened_at: "2026-01-01T00:00:00Z",
            archived: false,
          },
        ];
        d.transactions = entries.map((e, i) => ({
          id: String(i),
          account_id: "a",
          category_id: "c",
          subcategory_id: null,
          type: e.income ? "income" : "expense",
          amount: decimal(e.sen),
          occurred_at: e.early
            ? "2026-01-15T00:00:00Z"
            : "2026-02-15T00:00:00Z",
          note: "",
          planned: null,
        }));
        const expected = entries.reduce(
          (sum, e) => sum + (e.income ? e.sen : -e.sen),
          0n,
        );
        expect(balances(d, end).get("a")).toBe(expected);
        const first = totals(d.transactions, {
            start: null,
            end: "2026-02-01T00:00:00Z",
          }),
          second = totals(d.transactions, {
            start: "2026-02-01T00:00:00Z",
            end,
          });
        expect(first.net + second.net).toBe(expected);
      },
    ),
    { numRuns: 500 },
  ));
it("sample is explicitly synthetic and computed", () => {
  expect([...balances(sample, end).values()]).toEqual([10510n, 7000n]);
  expect(categoryShares(sample, { start: null, end })[0]).toMatchObject({
    amount: 2490n,
    share: 10000,
  });
});
it("strict schemas reject forged user ID, malformed amount and missing date", () => {
  const base = {
    kind: "transaction",
    id: crypto.randomUUID(),
    account_id: crypto.randomUUID(),
    category_id: crypto.randomUUID(),
    subcategory_id: null,
    type: "expense",
    amount: "1.20",
    occurred_at: "2026-01-01T00:00:00Z",
    note: "",
    planned: null,
  };
  expect(mutation.safeParse(base).success).toBe(true);
  expect(
    mutation.safeParse({ ...base, user_id: crypto.randomUUID() }).success,
  ).toBe(false);
  expect(mutation.safeParse({ ...base, amount: 1.2 }).success).toBe(false);
  expect(mutation.safeParse({ ...base, amount: "0.001" }).success).toBe(false);
  expect(
    mutation.safeParse({ ...base, occurred_at: "2026-01-01" }).success,
  ).toBe(false);
  expect(parseMoney("0.00")).toBe(0n);
});
it("blocks cross-origin mutations and large bodies", async () => {
  const url = "http://localhost:3000/api/finance";
  expect(() =>
    assertSameOrigin(
      new Request(url, {
        method: "POST",
        headers: { origin: "https://foreign.invalid" },
      }),
    ),
  ).toThrow();
  expect(() =>
    assertSameOrigin(
      new Request(url, {
        method: "POST",
        headers: { origin: "http://localhost:3000" },
      }),
    ),
  ).not.toThrow();
  await expect(
    limitedJson(
      new Request(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "x".repeat(17000),
      }),
    ),
  ).rejects.toThrow();
  const response = safeError(new Error("secret database message"));
  expect(await response.json()).toEqual({ error: "SERVER_UNAVAILABLE" });
});
