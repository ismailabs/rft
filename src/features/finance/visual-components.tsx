import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  Equal,
  Landmark,
  Wallet,
  Banknote,
  ShoppingBasket,
  Utensils,
  Car,
  BriefcaseBusiness,
  Receipt,
  Tag,
  Pencil,
  Trash2,
  ChevronRight,
  Info,
  TrendingUp,
  Target,
  ChartNoAxesColumn,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  Account,
  Locale,
  Snapshot,
  Transaction,
  Transfer,
  SavingsGoal,
} from "@/domain/finance/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { money, parseMoney, basisPoints } from "@/domain/finance/money";
import {
  monthlyReport,
  sevenDayExpenses,
  dailyExpenses,
} from "@/domain/finance/reporting";
import { totals } from "@/domain/finance/calculations";
import { periodFor } from "@/domain/finance/periods";

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rft-panel ${className}`}>
      {title ? (
        <div className="panel-heading">
          <h2>{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
export function AccountMark({ account }: { account: Account }) {
  const Icon =
    account.type === "bank"
      ? Landmark
      : account.type === "cash"
        ? Banknote
        : Wallet;
  // The supplied stylized institution marks have no verified rights record.
  return (
    <span
      className={`account-mark ${account.type}`}
      title={account.provider || undefined}
    >
      <Icon size={23} aria-hidden="true" />
    </span>
  );
}
export function CategoryMark({
  name = "",
  type = "expense",
}: {
  name?: string;
  type?: string;
}) {
  const match = name.toLowerCase();
  const Icon =
    type === "transfer"
      ? ArrowLeftRight
      : type === "income"
        ? BriefcaseBusiness
        : /food|drink|makan|minum/.test(match)
          ? Utensils
          : /transport|pengangkutan/.test(match)
            ? Car
            : /grocer|runcit/.test(match)
              ? ShoppingBasket
              : /bill|bil|utilit/.test(match)
                ? Receipt
                : Tag;
  const tone =
    type === "income"
      ? "green"
      : type === "transfer"
        ? "blue"
        : /food|drink|makan/.test(match)
          ? "amber"
          : /transport|pengangkutan/.test(match)
            ? "blue"
            : "purple";
  return (
    <span className={`category-mark ${tone}`}>
      <Icon size={19} aria-hidden="true" />
    </span>
  );
}
export function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 500 160" aria-hidden="true">
      <path
        fill="#347a75"
        d="M0 140 Q70 70 130 110T270 90T400 80T500 70V160H0Z"
      />
      <path fill="#205f5e" d="M0 150 Q80 135 180 140T350 120T500 100V160H0Z" />
      <circle fill="#f5dba4" cx="393" cy="38" r="17" />
      <g fill="#164f50">
        <path d="M283 151V94h8V77h3V53h3v24h3v17h7v57M323 151V72h7V52h4V25h2v27h4v20h6v79M351 151V72h7V52h4V25h2v27h4v20h6v79" />
        <path d="M231 151v-28h20v-22h18v50M307 151v-30h15v30M375 151v-40h20v-17h17v57M420 151v-28h20v28M449 151v-42h19v42M204 151v-24h17v24" />
      </g>
    </svg>
  );
}
export function BalanceSummary({
  amount,
  d,
  asOf,
  locale,
  series,
  account = false,
}: {
  amount: bigint;
  d: Dictionary;
  asOf: string;
  locale: Locale;
  series: bigint[];
  account?: boolean;
}) {
  const min = series.reduce((a, b) => (a < b ? a : b), series[0] ?? 0n),
    max = series.reduce((a, b) => (a > b ? a : b), series[0] ?? 0n);
  const points = series
    .map(
      (v, i) =>
        `${10 + (i * 250) / Math.max(1, series.length - 1)},${70 - (max === min ? 20 : basisPoints(v - min, max - min) / 200)}`,
    )
    .join(" ");
  return (
    <section className="balance-summary">
      <div className="balance-copy">
        <p>
          {account ? d.estimatedAccount : d.estimated}
          <Info size={15} aria-hidden="true" />
        </p>
        <strong>{money(amount)}</strong>
        <small>
          {d.asOf}{" "}
          {new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
            dateStyle: "medium",
            timeZone: "Asia/Kuala_Lumpur",
          }).format(new Date(asOf))}
        </small>
      </div>
      <svg
        viewBox="0 0 275 85"
        className="balance-spark"
        role="img"
        aria-label={
          locale === "ms"
            ? "Baki catatan pada akhir bulan"
            : "Recorded month-end balances"
        }
      >
        <polygon points={`10,85 ${points} 260,85`} fill="#e1f4eb" />
        <polyline
          points={points}
          fill="none"
          stroke="#008765"
          strokeWidth="2.2"
        />
      </svg>
      <Skyline />
      <p className="balance-explanation">{d.estimateNote}</p>
    </section>
  );
}
export function FlowSummary({
  income,
  expenses,
  net,
  d,
}: {
  income: bigint;
  expenses: bigint;
  net: bigint;
  d: Dictionary;
}) {
  return (
    <div className="metric-grid">
      {[
        { label: d.income, value: income, Icon: ArrowDown, tone: "green" },
        { label: d.expenses, value: expenses, Icon: ArrowUp, tone: "coral" },
        { label: d.net, value: net, Icon: Equal, tone: "blue" },
      ].map((x) => (
        <div className="metric" key={x.label}>
          <span className={`metric-icon ${x.tone}`}>
            <x.Icon size={23} aria-hidden="true" />
          </span>
          <dl>
            <dt>{x.label}</dt>
            <dd>{money(x.value)}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
}
export function MonthlyChart({
  data,
  asOf,
  locale,
  d,
  title,
}: {
  data: Snapshot;
  asOf: string;
  locale: Locale;
  d: Dictionary;
  title?: string;
}) {
  const rows = monthlyReport(data, asOf);
  const max = rows.reduce(
    (n, r) =>
      r.income > n
        ? r.income > r.expenses
          ? r.income
          : r.expenses
        : r.expenses > n
          ? r.expenses
          : n,
    0n,
  );
  const t = locale === "ms";
  return (
    <Panel
      title={
        title || (t ? "Pendapatan dan perbelanjaan" : "Income vs Expenses")
      }
      action={
        <span className="chart-period">
          {t ? "6 bulan terakhir" : "Last 6 months"}
        </span>
      }
      className="monthly-panel"
    >
      <div
        className="bar-chart"
        role="img"
        aria-label={
          t
            ? "Pendapatan dan perbelanjaan bulanan, nilai dalam jadual"
            : "Monthly income and expenses; exact amounts in the table below"
        }
      >
        <div className="chart-axis">
          {[4, 3, 2, 1, 0].map((n) => (
            <span key={n}>{money((max * BigInt(n)) / 4n)}</span>
          ))}
        </div>
        <div className="chart-plot">
          <div className="chart-grid-lines" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((n) => (
              <i key={n} />
            ))}
          </div>
          {rows.map((row) => (
            <div className="bar-month" key={row.key}>
              <div className="bar-pair">
                <i
                  className="income-bar"
                  style={{
                    height: `${max ? Math.max(row.income ? 1 : 0, basisPoints(row.income, max) / 100) : 0}%`,
                  }}
                />
                <i
                  className="expense-bar"
                  style={{
                    height: `${max ? Math.max(row.expenses ? 1 : 0, basisPoints(row.expenses, max) / 100) : 0}%`,
                  }}
                />
              </div>
              <span>
                {new Intl.DateTimeFormat(t ? "ms-MY" : "en-MY", {
                  month: "short",
                  timeZone: "Asia/Kuala_Lumpur",
                }).format(new Date(row.period.start!))}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-legend">
        <span>
          <i className="green-dot" />
          {d.income}
        </span>
        <span>
          <i className="coral-dot" />
          {d.expenses}
        </span>
      </div>
      <details className="chart-values">
        <summary>
          {t ? "Lihat nilai dan tempoh" : "View amounts and periods"}
        </summary>
        <p>
          {t
            ? "Bulan semasa sehingga tarikh paparan. Sifar bermaksud tiada catatan; bukan bukti tiada perbelanjaan."
            : "Current month is to date. Zero means no entries recorded; it does not establish that no spending occurred."}
        </p>
        <table>
          <caption className="sr-only">{title || d.month}</caption>
          <thead>
            <tr>
              <th>{d.month}</th>
              <th>{d.income}</th>
              <th>{d.expenses}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <th>
                  {r.key}
                  {r.partial ? " *" : ""}
                </th>
                <td>{money(r.income)}</td>
                <td>{money(r.expenses)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Panel>
  );
}
export type HistoryEntry =
  | (Transaction & { kind: string })
  | (Transfer & { kind: string; account_id: string; category_id: string });
export function TransactionHistory({
  entries,
  data,
  d,
  locale,
  onEdit,
  onDelete,
  groupDates = true,
}: {
  entries: HistoryEntry[];
  data: Snapshot;
  d: Dictionary;
  locale: Locale;
  groupDates?: boolean;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string, table: string) => void;
}) {
  const cat = (e: HistoryEntry) =>
    data.categories.find((c) => c.id === e.category_id)?.name ||
    (e.kind === "transfer" ? d.transfer : d.expense);
  const account = (e: HistoryEntry) =>
    data.accounts.find((a) => a.id === e.account_id);
  const formatDate = (e: HistoryEntry) =>
    new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
      dateStyle: "medium",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(e.occurred_at));
  const amount = (e: HistoryEntry) => (
    <strong className={`entry-money ${e.kind}`}>
      {e.kind === "income" ? "+ " : e.kind === "expense" ? "− " : "↔ "}
      {money(parseMoney(e.amount))}
    </strong>
  );
  const actions = (e: HistoryEntry) => (
    <div className="row-actions">
      {onEdit && e.kind !== "transfer" ? (
        <button
          className="icon-button"
          aria-label={`${d.edit}: ${e.note || cat(e)}`}
          onClick={() => onEdit(e as Transaction)}
        >
          <Pencil size={15} aria-hidden="true" />
        </button>
      ) : null}
      {onDelete ? (
        <button
          className="icon-button danger-text"
          aria-label={`${d.remove}: ${e.note || cat(e)}`}
          onClick={() =>
            onDelete(e.id, e.kind === "transfer" ? "transfers" : "transactions")
          }
        >
          <Trash2 size={15} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
  if (!entries.length)
    return (
      <div className="empty-state">
        <ChartNoAxesColumn size={30} aria-hidden="true" />
        <h3>{d.noResults}</h3>
        <p>{d.noActivityHelp}</p>
      </div>
    );
  return (
    <>
      <div
        className="desktop-history table-region"
        role="region"
        aria-label={d.recent}
        tabIndex={0}
      >
        <table className="transaction-table">
          <caption className="sr-only">{d.recent}</caption>
          <thead>
            <tr>
              <th>{locale === "ms" ? "Tarikh" : "Date"}</th>
              <th>{locale === "ms" ? "Keterangan" : "Description"}</th>
              <th>{d.category}</th>
              <th>{d.account}</th>
              <th className="money-column">{d.amount}</th>
              {onDelete ? (
                <th>
                  <span className="sr-only">{d.edit}</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="date-cell">{formatDate(e)}</td>
                <td>
                  <span className="table-description">
                    <CategoryMark name={cat(e)} type={e.kind} />
                    <span>{e.note || cat(e)}</span>
                  </span>
                </td>
                <td>
                  <span className={`category-badge ${e.kind}`}>{cat(e)}</span>
                </td>
                <td>
                  <span className="table-account">
                    {account(e) ? <AccountMark account={account(e)!} /> : null}
                    <span>
                      {account(e)?.name}
                      {"destination_id" in e
                        ? ` → ${data.accounts.find((a) => a.id === e.destination_id)?.name || ""}`
                        : ""}
                    </span>
                  </span>
                </td>
                <td className="money-column">{amount(e)}</td>
                {onDelete ? <td>{actions(e)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-history">
        {entries.map((e, i) => (
          <div key={e.id}>
            {groupDates &&
            (i === 0 || formatDate(entries[i - 1]) !== formatDate(e)) ? (
              <p className="activity-date">{formatDate(e)}</p>
            ) : null}
            <div className="mobile-transaction">
              <CategoryMark name={cat(e)} type={e.kind} />
              <div className="transaction-description">
                <b>{e.note || cat(e)}</b>
                <small>
                  {!groupDates ? `${formatDate(e)} · ` : ""}
                  {cat(e)} · {account(e)?.name}
                  {"destination_id" in e
                    ? ` → ${data.accounts.find((a) => a.id === e.destination_id)?.name || ""}`
                    : ""}
                </small>
                {onDelete ? actions(e) : null}
              </div>
              {amount(e)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export function AccountOverview({
  data,
  values,
  d,
  onEdit,
  onDelete,
}: {
  data: Snapshot;
  values: Map<string, bigint>;
  d: Dictionary;
  onEdit?: (a: Account) => void;
  onDelete?: (id: string, table: string) => void;
}) {
  if (!data.accounts.length)
    return (
      <div className="empty-state">
        <Wallet size={32} aria-hidden="true" />
        <h3>{d.noAccounts}</h3>
        <p>{d.noAccountsHelp}</p>
      </div>
    );
  return (
    <div className={onEdit ? "account-card-grid" : "account-overview-list"}>
      {data.accounts.map((a) => (
        <article key={a.id} className="financial-account">
          <AccountMark account={a} />
          <Link className="account-name" href={`/app/accounts/${a.id}`}>
            <b>{a.name}</b>
            <small>
              {a.provider || d[a.type]}
              {a.archived ? ` · ${d.archived}` : ""}
            </small>
          </Link>
          <strong>{money(values.get(a.id) || 0n)}</strong>
          {onEdit ? (
            <div className="account-edit-actions">
              <button
                className="icon-button"
                aria-label={`${d.edit}: ${a.name}`}
                onClick={() => onEdit(a)}
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
              {onDelete ? (
                <button
                  className="icon-button danger-text"
                  aria-label={`${d.remove}: ${a.name}`}
                  onClick={() => onDelete(a.id, "accounts")}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ) : (
            <ChevronRight size={17} aria-hidden="true" />
          )}
        </article>
      ))}
    </div>
  );
}
const ringColors = [
  "#40b587",
  "#fa8078",
  "#5593ec",
  "#f4be3b",
  "#a976e7",
  "#63b9df",
  "#a6b0c2",
];
export function AccountTypeSummary({
  data,
  values,
  d,
}: {
  data: Snapshot;
  values: Map<string, bigint>;
  d: Dictionary;
}) {
  return (
    <Panel
      title={d.home === "Utama" ? "Akaun mengikut jenis" : "Accounts by Type"}
      className="account-types-panel"
    >
      <div className="account-types">
        {(["bank", "ewallet", "cash"] as const).map((type) => {
          const accounts = data.accounts.filter((a) => a.type === type);
          const total = accounts.reduce(
            (n, a) => n + (values.get(a.id) || 0n),
            0n,
          );
          const Icon =
            type === "bank" ? Landmark : type === "cash" ? Banknote : Wallet;
          return (
            <div key={type}>
              <Icon size={20} aria-hidden="true" />
              <span>{d[type]}</span>
              <strong>{money(total)}</strong>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
export function Breakdown({
  rows,
  total,
  label,
  d,
}: {
  rows: { id: string; name: string; amount: bigint }[];
  total: bigint;
  label: string;
  d: Dictionary;
}) {
  const positive = rows.filter((r) => r.amount > 0n);
  const hasNegative = rows.some((r) => r.amount < 0n);
  const denominator = positive.reduce((n, r) => n + r.amount, 0n);
  let angle = 0;
  const stops: string[] = [];
  for (const r of positive) {
    const i = rows.findIndex((row) => row.id === r.id);
    const start = angle;
    angle += basisPoints(r.amount, denominator) / 100;
    stops.push(`${ringColors[i % ringColors.length]} ${start}% ${angle}%`);
  }
  return (
    <div className="breakdown">
      {!hasNegative ? (
        <div
          className="donut-chart"
          style={{
            background: stops.length
              ? `conic-gradient(${stops.join(",")})`
              : "#e9edf2",
          }}
          aria-hidden="true"
        >
          <div>
            <strong>{money(total)}</strong>
            <small>{label}</small>
          </div>
        </div>
      ) : (
        <p className="signed-balance-note">
          {d.home === "Utama"
            ? "Baki negatif ditunjukkan sebagai nilai bertanda; carta bahagian tidak digunakan."
            : "Negative balances are shown as signed amounts; a share chart would be misleading."}
        </p>
      )}
      <ul className="breakdown-legend">
        {rows.length ? (
          rows.map((r, i) => (
            <li key={r.id}>
              <i
                style={{ background: ringColors[i % ringColors.length] }}
                aria-hidden="true"
              />
              <span>{r.name}</span>
              <strong>{money(r.amount)}</strong>
              <small>
                {!hasNegative && r.amount >= 0n && denominator
                  ? `${(basisPoints(r.amount, denominator) / 100).toFixed(1)}%`
                  : "—"}
              </small>
            </li>
          ))
        ) : (
          <li>
            <p>{d.noInsights}</p>
          </li>
        )}
      </ul>
    </div>
  );
}
export function FactualInsight({
  title,
  children,
  tone = "green",
}: {
  title: string;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <article className="factual-insight">
      <span className={`metric-icon ${tone}`}>
        <TrendingUp size={23} aria-hidden="true" />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

export function SavingsProgress({
  goals,
  d,
  locale,
  onEdit,
  onDelete,
}: {
  goals: SavingsGoal[];
  d: Dictionary;
  locale: Locale;
  onEdit: (g: SavingsGoal) => void;
  onDelete: (id: string, table: string) => void;
}) {
  if (!goals.length)
    return (
      <div className="empty-goals">
        <Target size={30} aria-hidden="true" />
        <p>{d.noSavingsGoals}</p>
        <small>{d.savingsHelp}</small>
      </div>
    );
  return (
    <>
      <div className="savings-goal-list">
        {goals.map((g) => {
          const saved = parseMoney(g.saved_amount),
            target = parseMoney(g.target_amount),
            progress = Math.min(10000, basisPoints(saved, target));
          return (
            <article className="savings-goal" key={g.id}>
              <span className="goal-symbol">
                <Target size={27} aria-hidden="true" />
              </span>
              <div className="goal-copy">
                <h3>{g.name}</h3>
                <p>
                  {money(saved)} / {money(target)}
                </p>
                <div className="goal-progress-line">
                  <progress
                    max={10000}
                    value={progress}
                    aria-label={`${g.name}: ${money(saved)} / ${money(target)}`}
                  />
                  <span>{(progress / 100).toFixed(0)}%</span>
                </div>
                {g.target_date ? (
                  <small>
                    {d.targetDate}:{" "}
                    {new Intl.DateTimeFormat(
                      locale === "ms" ? "ms-MY" : "en-MY",
                      { dateStyle: "medium", timeZone: "Asia/Kuala_Lumpur" },
                    ).format(new Date(`${g.target_date}T00:00:00+08:00`))}
                  </small>
                ) : null}
              </div>
              <div className="row-actions">
                <button
                  className="icon-button"
                  aria-label={`${d.edit}: ${g.name}`}
                  onClick={() => onEdit(g)}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  className="icon-button danger-text"
                  aria-label={`${d.remove}: ${g.name}`}
                  onClick={() => onDelete(g.id, "goals")}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="hint">{d.savingsHelp}</p>
    </>
  );
}

export function BudgetProgress({
  data,
  d,
  onDelete,
}: {
  data: Snapshot;
  d: Dictionary;
  onDelete: (id: string, table: string) => void;
}) {
  if (!data.budgets.length) return <p className="empty-budget">{d.noGoals}</p>;
  return (
    <div className="budget-lines">
      {data.budgets.map((b) => {
        const year = Number(b.month.slice(0, 4)),
          month = Number(b.month.slice(5, 7));
        const last = new Date(Date.UTC(year, month, 0))
          .toISOString()
          .slice(0, 10);
        const period = periodFor(
          "custom",
          new Date(`${b.month}T00:00:00+08:00`),
          b.month,
          last,
        );
        const used = totals(
            data.transactions.filter((t) => t.category_id === b.category_id),
            period,
          ).expenses,
          target = parseMoney(b.amount),
          remaining = target - used;
        const category =
          data.categories.find((c) => c.id === b.category_id)?.name ||
          d.category;
        return (
          <article className="budget-line" key={b.id}>
            <CategoryMark name={category} />
            <div className="budget-category">
              <b>{category}</b>
              <small>{b.month.slice(0, 7)}</small>
            </div>
            <div className="budget-meter">
              <progress
                max={10000}
                value={Math.min(10000, basisPoints(used, target))}
                aria-label={`${category}: ${money(used)} / ${money(target)}`}
              />
              <small>
                {money(used)} / {money(target)}
              </small>
              <span className="sr-only">
                {remaining < 0n ? d.over : d.remaining}:{" "}
                {money(remaining < 0n ? -remaining : remaining)}
              </span>
            </div>
            <button
              className="icon-button danger-text"
              aria-label={`${d.remove}: ${category}`}
              onClick={() => onDelete(b.id, "budgets")}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </article>
        );
      })}
    </div>
  );
}

export function MobileDashboardOverview({
  data,
  asOf,
  shares,
  d,
  locale,
}: {
  data: Snapshot;
  asOf: string;
  shares: { id: string; name: string; amount: bigint; share: number }[];
  d: Dictionary;
  locale: Locale;
}) {
  const rows = sevenDayExpenses(data, asOf),
    max = rows.reduce((n, r) => (r.amount > n ? r.amount : n), 0n);
  const ms = locale === "ms";
  return (
    <div className="mobile-overview-grid">
      <Panel title={ms ? "7 hari terakhir" : "Last 7 days"}>
        <div
          className="mini-daily-chart"
          role="img"
          aria-label={rows
            .map((r) => `${localDay(r.start, locale)}: ${money(r.amount)}`)
            .join("; ")}
        >
          {rows.map((r) => (
            <div key={r.start}>
              <span>
                <i
                  style={{
                    height: `${max ? basisPoints(r.amount, max) / 100 : 0}%`,
                  }}
                />
              </span>
              <small>{localDay(r.start, locale)}</small>
            </div>
          ))}
        </div>
        <small className="mini-total">
          {money(rows.reduce((n, r) => n + r.amount, 0n))}
        </small>
      </Panel>
      <Panel title={ms ? "Kategori utama" : "Top Categories"}>
        <div className="mini-categories">
          {shares.length ? (
            shares.slice(0, 4).map((r) => (
              <div key={r.id}>
                <CategoryMark name={r.name} />
                <span>{r.name}</span>
                <strong>{money(r.amount)}</strong>
              </div>
            ))
          ) : (
            <p>{d.noInsights}</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
function localDay(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
    weekday: "narrow",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

export function MobileSpendingTrend({
  data,
  period,
  asOf,
  d,
  locale,
}: {
  data: Snapshot;
  period: import("@/domain/finance/periods").Period | null;
  asOf: string;
  d: Dictionary;
  locale: Locale;
}) {
  const rows = period ? dailyExpenses(data, period, asOf) : [];
  const max = rows.reduce((n, r) => (r.amount > n ? r.amount : n), 0n),
    total = rows.reduce((n, r) => n + r.amount, 0n);
  const date = new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kuala_Lumpur",
  });
  return (
    <Panel
      title={locale === "ms" ? "Trend Perbelanjaan" : "Spending Trend"}
      className="mobile-spending-trend"
    >
      <strong className="spending-trend-total">{money(total)}</strong>
      <p className="hint">
        {locale === "ms"
          ? "Perbelanjaan harian dicatat; sehingga 31 hari."
          : "Daily recorded expenses; up to 31 days."}
        {rows.length
          ? ` ${date.format(new Date(rows[0].start))} – ${date.format(new Date(Date.parse(rows.at(-1)!.end) - 1))}`
          : ""}
      </p>
      <div
        className="daily-spend-chart"
        role="img"
        aria-label={
          rows
            .map((r) => `${date.format(new Date(r.start))}: ${money(r.amount)}`)
            .join("; ") || d.noResults
        }
      >
        <div className="daily-spend-axis">
          <span>{money(max)}</span>
          <span>{money(max / 2n)}</span>
          <span>RM 0.00</span>
        </div>
        <div className="daily-spend-bars">
          {rows.map((r) => (
            <div key={r.start}>
              <i
                style={{
                  height: `${max ? basisPoints(r.amount, max) / 100 : 0}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <details className="daily-spend-values">
        <summary>
          {locale === "ms" ? "Lihat nilai harian" : "View daily amounts"}
        </summary>
        <table>
          <caption className="sr-only">{d.expenses}</caption>
          <thead>
            <tr>
              <th>{locale === "ms" ? "Tarikh" : "Date"}</th>
              <th>{d.amount}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.start}>
                <td>{date.format(new Date(r.start))}</td>
                <td>{money(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Panel>
  );
}
