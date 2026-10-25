import { expect, test } from "vitest";
import { marketingExample } from "../../src/features/finance/marketing-example";
import {
  balances,
  totals,
  categoryShares,
} from "../../src/domain/finance/calculations";
test("public illustrative figures reconcile with the five shown accounts and dining share", () => {
  const period = {
    start: "2026-09-30T16:00:00.000Z",
    end: "2026-10-24T04:00:00.001Z",
  };
  expect([...balances(marketingExample, period.end).values()]).toEqual([
    632050n,
    285000n,
    120000n,
    68025n,
    43000n,
  ]);
  expect(totals(marketingExample.transactions, period)).toMatchObject({
    income: 520000n,
    expenses: 365040n,
    net: 154960n,
  });
  const food = categoryShares(marketingExample, period).find(
    (c) => c.id === "illustration-food",
  );
  expect(food).toMatchObject({ amount: 87620n, share: 2400 });
});
