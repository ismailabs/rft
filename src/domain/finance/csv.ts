import type { Snapshot } from "./types";
import { inPeriod, type Period } from "./periods";

export function csvCell(value: string): string {
  // Leading whitespace/control characters can hide spreadsheet formula prefixes.
  const safe =
    /^[\s\u0000-\u001f]*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value)
      ? `'${value}`
      : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function exportCsv(data: Snapshot, period: Period): string {
  const rows = [
    [
      "Date (UTC)",
      "Type",
      "MYR amount",
      "Account / source",
      "Destination",
      "Category",
      "Subcategory",
      "Note",
      "Planned",
    ],
  ];
  for (const tx of data.transactions.filter((t) =>
    inPeriod(t.occurred_at, period),
  ))
    rows.push([
      tx.occurred_at,
      tx.type,
      tx.amount,
      data.accounts.find((a) => a.id === tx.account_id)?.name ?? "",
      "",
      data.categories.find((c) => c.id === tx.category_id)?.name ?? "",
      data.subcategories.find((c) => c.id === tx.subcategory_id)?.name ?? "",
      tx.note,
      tx.planned === null ? "" : String(tx.planned),
    ]);
  for (const tx of data.transfers.filter((t) =>
    inPeriod(t.occurred_at, period),
  ))
    rows.push([
      tx.occurred_at,
      "transfer",
      tx.amount,
      data.accounts.find((a) => a.id === tx.source_id)?.name ?? "",
      data.accounts.find((a) => a.id === tx.destination_id)?.name ?? "",
      "",
      "",
      tx.note,
      "",
    ]);
  return (
    "\uFEFF" +
    rows.map((row) => row.map(csvCell).join(",")).join("\r\n") +
    "\r\n"
  );
}
