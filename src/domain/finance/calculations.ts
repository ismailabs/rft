import { basisPoints, parseMoney } from "./money";
import { inPeriod, type Period, completedWeeks } from "./periods";
import type { Snapshot, Transaction } from "./types";

export function totals(rows: Transaction[], period: Period) {
  let income = 0n,
    expenses = 0n;
  for (const row of rows) {
    if (!inPeriod(row.occurred_at, period)) continue;
    const sen = parseMoney(row.amount);
    if (row.type === "income") income += sen;
    else expenses += sen;
  }
  return { income, expenses, net: income - expenses };
}

export function balances(data: Snapshot, end: string): Map<string, bigint> {
  const result = new Map(
    data.accounts.map((a) => [
      a.id,
      Date.parse(a.opened_at) < Date.parse(end)
        ? parseMoney(a.opening_balance, true)
        : 0n,
    ]),
  );
  const period = { start: null, end };
  for (const tx of data.transactions) {
    if (!inPeriod(tx.occurred_at, period)) continue;
    result.set(
      tx.account_id,
      (result.get(tx.account_id) ?? 0n) +
        parseMoney(tx.amount) * (tx.type === "income" ? 1n : -1n),
    );
  }
  for (const tx of data.transfers) {
    if (!inPeriod(tx.occurred_at, period)) continue;
    const sen = parseMoney(tx.amount);
    result.set(tx.source_id, (result.get(tx.source_id) ?? 0n) - sen);
    result.set(tx.destination_id, (result.get(tx.destination_id) ?? 0n) + sen);
  }
  return result;
}

export function categoryShares(data: Snapshot, period: Period) {
  const sums = new Map<string, bigint>();
  for (const tx of data.transactions)
    if (tx.type === "expense" && inPeriod(tx.occurred_at, period))
      sums.set(
        tx.category_id,
        (sums.get(tx.category_id) ?? 0n) + parseMoney(tx.amount),
      );
  const total = [...sums.values()].reduce((a, b) => a + b, 0n);
  return [...sums]
    .map(([id, amount]) => ({
      id,
      name: data.categories.find((c) => c.id === id)?.name ?? "",
      amount,
      share: basisPoints(amount, total),
    }))
    .sort((a, b) =>
      a.amount === b.amount
        ? a.name.localeCompare(b.name)
        : a.amount > b.amount
          ? -1
          : 1,
    );
}

export function weeklyComparison(data: Snapshot, now = new Date()) {
  const [previous, recent] = completedWeeks(now);
  const oldestAccount = data.accounts.reduce(
    (oldest, a) => Math.min(oldest, Date.parse(a.opened_at)),
    Infinity,
  );
  if (oldestAccount > Date.parse(previous.start!)) return null;
  const oldRows = data.transactions.filter(
    (t) => t.type === "expense" && inPeriod(t.occurred_at, previous),
  );
  const newRows = data.transactions.filter(
    (t) => t.type === "expense" && inPeriod(t.occurred_at, recent),
  );
  if (oldRows.length < 3 || newRows.length < 3) return null;
  const oldTotal = totals(oldRows, previous).expenses,
    newTotal = totals(newRows, recent).expenses;
  return {
    previous,
    recent,
    oldTotal,
    newTotal,
    difference: newTotal - oldTotal,
    percentBasisPoints:
      oldTotal === 0n
        ? null
        : basisPoints(
            newTotal >= oldTotal ? newTotal - oldTotal : oldTotal - newTotal,
            oldTotal,
          ),
  };
}

/** Recorded expenses in four complete Monday-to-Monday Malaysia weeks. */
export function weeklyTrend(data: Snapshot, now = new Date()) {
  const [, recent] = completedWeeks(now);
  const end = Date.parse(recent.end);
  const week = 7 * 86400000;
  return Array.from({ length: 4 }, (_, i) => {
    const period = {
      start: new Date(end - (4 - i) * week).toISOString(),
      end: new Date(end - (3 - i) * week).toISOString(),
    };
    const rows = data.transactions.filter(
      (t) => t.type === "expense" && inPeriod(t.occurred_at, period),
    );
    return {
      period,
      amount: totals(rows, period).expenses,
      count: rows.length,
    };
  });
}
