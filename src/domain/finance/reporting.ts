import { balances, totals } from "./calculations";
import { localDate, localMidnight, type Period } from "./periods";
import type { Snapshot } from "./types";

/** Malaysia calendar months; the current bucket ends at the snapshot instant. */
export function monthlyReport(data: Snapshot, asOf: string, count = 6) {
  const now = new Date(asOf);
  const day = localDate(now);
  const year = Number(day.slice(0, 4));
  const month = Number(day.slice(5, 7)) - 1;
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, month - count + 1 + index, 1));
    const next = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1),
    );
    const key = date.toISOString().slice(0, 7);
    const period: Period = {
      start: localMidnight(`${key}-01`).toISOString(),
      end:
        index === count - 1
          ? new Date(now.getTime() + 1).toISOString()
          : localMidnight(next.toISOString().slice(0, 10)).toISOString(),
    };
    const amounts = totals(data.transactions, period);
    const closing = [...balances(data, period.end).values()].reduce(
      (a, b) => a + b,
      0n,
    );
    return { key, period, ...amounts, closing, partial: index === count - 1 };
  });
}

export function sevenDayExpenses(data: Snapshot, asOf: string) {
  const now = new Date(asOf),
    midnight = localMidnight(localDate(now));
  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(
      midnight.getTime() - (6 - i) * 86400000,
    ).toISOString();
    const end =
      i === 6
        ? new Date(now.getTime() + 1).toISOString()
        : new Date(Date.parse(start) + 86400000).toISOString();
    return {
      start,
      end,
      amount: totals(data.transactions, { start, end }).expenses,
    };
  });
}

/** A bounded daily expense view of the selected period, never beyond the snapshot. */
export function dailyExpenses(data: Snapshot, period: Period, asOf: string) {
  const end = Math.min(Date.parse(period.end), Date.parse(asOf) + 1);
  if (!Number.isFinite(end)) return [];
  const lastDay = localMidnight(localDate(new Date(end - 1))).getTime();
  const first = Math.max(
    period.start ? Date.parse(period.start) : -Infinity,
    lastDay - 30 * 86400000,
  );
  if (!Number.isFinite(first) || first >= end) return [];
  const firstDay = localMidnight(localDate(new Date(first))).getTime();
  const rows = [];
  for (let day = firstDay; day < end; day += 86400000) {
    const start = new Date(Math.max(day, first)).toISOString();
    const finish = new Date(Math.min(day + 86400000, end)).toISOString();
    rows.push({
      start,
      end: finish,
      amount: totals(data.transactions, { start, end: finish }).expenses,
    });
  }
  return rows;
}
