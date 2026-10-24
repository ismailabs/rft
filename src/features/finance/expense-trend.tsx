"use client";
import { useState } from "react";
import { List } from "lucide-react";
import { weeklyTrend } from "@/domain/finance/calculations";
import { inPeriod, type Period } from "@/domain/finance/periods";
import { money, parseMoney } from "@/domain/finance/money";
import type { Locale, Snapshot } from "@/domain/finance/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { Sheet } from "@/components/ui/dialog";

export function ExpenseSources({
  data,
  period,
  categoryId,
  label,
  locale,
  d,
}: {
  data: Snapshot;
  period: Period;
  categoryId?: string;
  label: string;
  locale: Locale;
  d: Dictionary;
}) {
  const [open, setOpen] = useState(false),
    [limit, setLimit] = useState(40);
  const rows = data.transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        inPeriod(t.occurred_at, period) &&
        (!categoryId || t.category_id === categoryId),
    )
    .sort((a, b) => Date.parse(b.occurred_at) - Date.parse(a.occurred_at));
  const date = new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
    dateStyle: "medium",
    timeZone: "Asia/Kuala_Lumpur",
  });
  return (
    <>
      <button
        className="icon-button"
        aria-label={`${d.sourceEntries}: ${label}`}
        title={`${d.sourceEntries}: ${label}`}
        onClick={() => {
          setLimit(40);
          setOpen(true);
        }}
      >
        <List size={18} />
      </button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={d.sourceEntries}
        description={label}
        close={d.close}
      >
        <p>
          {d.expenses}:{" "}
          {money(rows.reduce((sum, t) => sum + parseMoney(t.amount), 0n))} ·{" "}
          {d.entryCount}: {rows.length}
        </p>
        {rows.length ? (
          <ul className="source-entries">
            {rows.slice(0, limit).map((t) => (
              <li key={t.id}>
                <div>
                  <b>
                    {t.note ||
                      data.categories.find((c) => c.id === t.category_id)?.name}
                  </b>
                  <small>
                    {date.format(new Date(t.occurred_at))} ·{" "}
                    {data.accounts.find((a) => a.id === t.account_id)?.name}
                  </small>
                </div>
                <strong>{money(parseMoney(t.amount))}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>{d.noResults}</p>
        )}
        {rows.length > limit ? (
          <button
            className="button secondary"
            onClick={() => setLimit((n) => n + 40)}
          >
            {d.seeAll} ({rows.length - limit})
          </button>
        ) : null}
      </Sheet>
    </>
  );
}

export function ExpenseTrend({
  data,
  asOf,
  locale,
  d,
}: {
  data: Snapshot;
  asOf: string;
  locale: Locale;
  d: Dictionary;
}) {
  const rows = weeklyTrend(data, new Date(asOf));
  const date = new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  });
  return (
    <section className="surface">
      <h2>{d.trend}</h2>
      <p className="hint">{d.trendHelp}</p>
      <ol className="trend-list">
        {rows.map((row) => {
          const label = `${date.format(new Date(row.period.start!))} – ${date.format(new Date(Date.parse(row.period.end) - 1))}`;
          return (
            <li className="trend-row" key={row.period.start}>
              <div>
                <b>{label}</b>
                <small>
                  {d.entryCount}: {row.count}
                </small>
              </div>
              <strong>{money(row.amount)}</strong>
              <ExpenseSources
                data={data}
                period={row.period}
                label={label}
                locale={locale}
                d={d}
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
