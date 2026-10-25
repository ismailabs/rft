import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  Equal,
  Landmark,
  Wallet,
  Banknote,
  ShoppingCart,
  Utensils,
  CarFront,
  BriefcaseBusiness,
  FileText,
  Tag,
  Pencil,
  Trash2,
  ChevronRight,
  Info,
  TrendingUp,
  Target,
  ChartNoAxesColumn,
  ShoppingBag,
  Gamepad2,
  Plane,
  House,
  Laptop,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  CupSoda,
  Fuel,
  Plus,
  ChevronsUpDown,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { BalanceValue } from "./balance-value";
import { CopyReference } from "./copy-reference";
import type {
  Account,
  Locale,
  Snapshot,
  Transaction,
  Transfer,
  SavingsGoal,
  Budget,
} from "@/domain/finance/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { money, parseMoney, basisPoints } from "@/domain/finance/money";
import {
  monthlyReport,
  sevenDayExpenses,
  dailyExpenses,
} from "@/domain/finance/reporting";
import { totals } from "@/domain/finance/calculations";
import { periodFor, localDate } from "@/domain/finance/periods";

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
  const provider = (account.provider || account.name).toLowerCase();
  const artwork = /maybank/.test(provider)
    ? "maybank"
    : /cimb/.test(provider)
      ? "cimb"
      : /rhb/.test(provider)
        ? "rhb"
        : /tng|touch[\s'’]*n[\s'’]*go/.test(provider)
          ? "tng"
          : /grab\s*pay/.test(provider)
            ? "grabpay"
            : null;
  const Icon =
    account.type === "bank"
      ? Landmark
      : account.type === "cash"
        ? Banknote
        : Wallet;
  return (
    <span
      className={`account-mark ${account.type}${artwork ? " institution-artwork" : ""}`}
      title={account.provider || undefined}
    >
      {artwork ? (
        <Image
          src={`/institutions/${artwork}.png`}
          width={56}
          height={56}
          alt=""
          unoptimized
        />
      ) : (
        <Icon size={23} aria-hidden="true" />
      )}
    </span>
  );
}
export function CategoryMark({
  name = "",
  type = "expense",
  variant = "category",
}: {
  name?: string;
  type?: string;
  variant?: "category" | "insight" | "filter";
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
            ? CarFront
            : /grocer|runcit/.test(match)
              ? ShoppingCart
              : /shop|beli/.test(match)
                ? variant === "insight"
                  ? Calendar
                  : ShoppingBag
                : /entertain|hibur/.test(match)
                  ? Gamepad2
                  : /bill|bil|utilit/.test(match)
                    ? FileText
                    : /other|lain/.test(match)
                      ? MoreHorizontal
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
            : /grocer|runcit/.test(match)
              ? variant === "filter"
                ? "green"
                : "amber"
              : /shop|beli/.test(match)
                ? variant === "insight"
                  ? "blue"
                  : "pink"
                : variant === "insight" && /bill|utilit|other|lain/.test(match)
                  ? "slate"
                  : "purple";
  return (
    <span className={`category-mark ${tone}`}>
      {variant === "filter" && /entertain|hibur/.test(match) ? (
        <Image
          src="/institutions/netflix.png"
          alt=""
          width={13}
          height={20}
          unoptimized
        />
      ) : (
        <Icon size={19} aria-hidden="true" />
      )}
    </span>
  );
}
function TransactionMark({
  name,
  type,
  note,
}: {
  name: string;
  type: string;
  note: string;
}) {
  if (/netflix/i.test(note))
    return (
      <span className="category-mark merchant-mark">
        <Image
          src="/institutions/netflix.png"
          width={16}
          height={23}
          alt=""
          unoptimized
        />
      </span>
    );
  const Icon = /tealive/i.test(note)
    ? CupSoda
    : /petrol|petronas/i.test(note)
      ? Fuel
      : null;
  return Icon ? (
    <span className={`category-mark ${Icon === Fuel ? "pink" : "amber"}`}>
      <Icon size={19} aria-hidden="true" />
    </span>
  ) : (
    <CategoryMark name={name} type={type} />
  );
}
function categoryTone(name: string, type: string) {
  if (type === "transfer") return "transfer";
  if (type === "income") return /salary|gaji/i.test(name) ? "salary" : "green";
  return /grocer|runcit/i.test(name)
    ? "green"
    : /transport/i.test(name)
      ? "violet"
      : /entertain|shop|hibur/i.test(name)
        ? "pink"
        : /bill|utilit/i.test(name)
          ? "violet"
          : "amber";
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
  change,
  label,
}: {
  amount: bigint;
  d: Dictionary;
  asOf: string;
  locale: Locale;
  series: bigint[];
  account?: boolean;
  change?: string;
  label?: string;
}) {
  const min = series.reduce((a, b) => (a < b ? a : b), series[0] ?? 0n),
    max = series.reduce((a, b) => (a > b ? a : b), series[0] ?? 0n);
  const points = series
    .map(
      (v, i) =>
        `${10 + (i * 250) / Math.max(1, series.length - 1)},${80 - (max === min ? 20 : basisPoints(v - min, max - min) / 180)}`,
    )
    .join(" ");
  const coordinates = points.split(" ").map((p) => p.split(",").map(Number));
  const curve = coordinates
    .map(([x, y], i) =>
      i
        ? `C ${coordinates[i - 1][0] + (x - coordinates[i - 1][0]) / 2},${coordinates[i - 1][1]} ${coordinates[i - 1][0] + (x - coordinates[i - 1][0]) / 2},${y} ${x},${y}`
        : `M ${x},${y}`,
    )
    .join(" ");
  return (
    <section
      className={`balance-summary${money(amount).length > 20 ? " expanded-balance" : ""}`}
    >
      <div className="balance-copy">
        <p>
          {label ||
            (account
              ? d.estimatedAccount
              : d.home === "Utama"
                ? "Anggaran Baki"
                : "Estimated Balance")}
          <span title={d.estimateNote}>
            <Info size={15} aria-hidden="true" />
          </span>
        </p>
        <BalanceValue value={money(amount)} locale={locale} />
        {change ? (
          <small className="balance-change">
            <span>
              <ArrowUp size={16} aria-hidden="true" />
              {change}
            </span>{" "}
            {d.home === "Utama" ? "daripada bulan lalu" : "from last month"}
          </small>
        ) : (
          <small>
            {d.asOf}{" "}
            {new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
              dateStyle: "medium",
              timeZone: "Asia/Kuala_Lumpur",
            }).format(new Date(asOf))}
          </small>
        )}
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
        <path d={`${curve} L 260,85 L 10,85 Z`} fill="#e1f4eb" />
        <path d={curve} fill="none" stroke="#008765" strokeWidth="2.2" />
      </svg>
      <Skyline />
      <p className="balance-explanation" role="note">
        {d.estimateNote}
      </p>
    </section>
  );
}
export function FlowSummary({
  income,
  expenses,
  net,
  d,
  changes,
}: {
  income: bigint;
  expenses: bigint;
  net: bigint;
  d: Dictionary;
  changes?: [string, string, string];
}) {
  return (
    <div className="metric-grid">
      {[
        { label: d.income, value: income, Icon: ArrowDown, tone: "green" },
        { label: d.expenses, value: expenses, Icon: ArrowUp, tone: "coral" },
        { label: d.net, value: net, Icon: Equal, tone: "blue" },
      ].map((x, i) => (
        <div className="metric" key={x.label}>
          <span className={`metric-icon ${x.tone}`}>
            <x.Icon size={23} aria-hidden="true" />
          </span>
          <dl>
            <dt>{x.label}</dt>
            <dd>
              {money(x.value)}
              {changes?.[i] ? (
                <small className="metric-change">
                  <span>
                    {i === 1 ? "↓" : "↑"} {changes[i]}
                  </span>{" "}
                  {d.home === "Utama"
                    ? "daripada bulan lalu"
                    : "from last month"}
                </small>
              ) : null}
            </dd>
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
  values,
  range = 6,
  onRangeChange,
}: {
  data: Snapshot;
  asOf: string;
  locale: Locale;
  d: Dictionary;
  title?: string;
  values?: { income: bigint; expenses: bigint }[];
  range?: 3 | 6 | 12;
  onRangeChange?: (range: 3 | 6 | 12) => void;
}) {
  const rows = monthlyReport(data, asOf, range).map((row, i) => ({
    ...row,
    ...(range === 6 ? values?.[i] : undefined),
  }));
  const highest = rows.reduce(
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
  // Whole-ringgit nice scale, computed with bigint before bounded chart ratios.
  const step =
    highest > 400000n ? 200000n : highest > 100000n ? 50000n : 10000n;
  const max = highest
    ? ((highest + 4n * step - 1n) / (4n * step)) * 4n * step
    : 4n * step;
  const t = locale === "ms";
  return (
    <Panel
      title={
        title || (t ? "Pendapatan dan perbelanjaan" : "Income vs Expenses")
      }
      action={
        onRangeChange ? (
          <label className="chart-period chart-range">
            <span className="sr-only">
              {t ? "Julat carta" : "Chart reporting range"}
            </span>
            <select
              value={range}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value === 3 || value === 6 || value === 12)
                  onRangeChange(value);
              }}
            >
              {([3, 6, 12] as const).map((n) => (
                <option key={n} value={n}>
                  {t ? `${n} bulan terakhir` : `Last ${n} months`}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span className="chart-period">
            {t ? `${range} bulan terakhir` : `Last ${range} months`}
            <ChevronDown size={14} aria-hidden="true" />
          </span>
        )
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
            <span key={n}>{compactAxis((max * BigInt(n)) / 4n)}</span>
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
function compactAxis(value: bigint) {
  return value >= 100000n && value % 100000n === 0n
    ? `RM ${value / 100000n}K`
    : money(value).replace(".00", "");
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
  selection,
  columnOrder = "category-first",
  dateOrder = "descending",
  onDateSort,
}: {
  entries: HistoryEntry[];
  data: Snapshot;
  d: Dictionary;
  locale: Locale;
  groupDates?: boolean;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string, table: string) => void;
  selection?: { ids: string[]; setIds: (ids: string[]) => void };
  columnOrder?: "category-first" | "account-first";
  dateOrder?: "ascending" | "descending";
  onDateSort?: () => void;
}) {
  const cat = (e: HistoryEntry) =>
    data.categories.find((c) => c.id === e.category_id)?.name ||
    (e.kind === "transfer" ? d.transfer : d.expense);
  const account = (e: HistoryEntry) =>
    data.accounts.find((a) => a.id === e.account_id);
  const categoryContent = (e: HistoryEntry) => (
    <span className={`category-badge ${categoryTone(cat(e), e.kind)}`}>
      {cat(e)}
    </span>
  );
  const accountContent = (e: HistoryEntry) => (
    <span className="table-account">
      {account(e) ? <AccountMark account={account(e)!} /> : null}
      <span>
        {account(e)?.name}
        {"destination_id" in e
          ? ` → ${data.accounts.find((a) => a.id === e.destination_id)?.name || ""}`
          : ""}
      </span>
    </span>
  );
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
    <details className="row-action-menu">
      <summary
        aria-label={`${locale === "ms" ? "Tindakan" : "Actions"}: ${e.note || cat(e)}`}
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </summary>
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
              onDelete(
                e.id,
                e.kind === "transfer" ? "transfers" : "transactions",
              )
            }
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </details>
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
              {selection ? (
                <th className="selection-cell">
                  <input
                    type="checkbox"
                    aria-label={
                      locale === "ms"
                        ? "Pilih semua baris pada halaman ini"
                        : "Select all rows on this page"
                    }
                    checked={
                      entries.length > 0 &&
                      entries.every((e) => selection.ids.includes(e.id))
                    }
                    onChange={(e) =>
                      selection.setIds(
                        e.target.checked
                          ? [
                              ...new Set([
                                ...selection.ids,
                                ...entries.map((row) => row.id),
                              ]),
                            ]
                          : selection.ids.filter(
                              (id) => !entries.some((row) => row.id === id),
                            ),
                      )
                    }
                  />
                </th>
              ) : null}
              <th
                className="date-heading"
                aria-sort={onDateSort ? dateOrder : undefined}
              >
                {onDateSort ? (
                  <button
                    className="date-sort"
                    onClick={onDateSort}
                    aria-label={
                      locale === "ms"
                        ? `Tarikh: ${dateOrder === "descending" ? "paling lama" : "terkini"} dahulu`
                        : `Date: ${dateOrder === "descending" ? "oldest" : "newest"} first`
                    }
                  >
                    {locale === "ms" ? "Tarikh" : "Date"}
                    <ChevronsUpDown size={10} aria-hidden="true" />
                  </button>
                ) : locale === "ms" ? (
                  "Tarikh"
                ) : (
                  "Date"
                )}
              </th>
              <th>{locale === "ms" ? "Keterangan" : "Description"}</th>
              <th>
                {columnOrder === "account-first" ? d.account : d.category}
              </th>
              <th>
                {columnOrder === "account-first" ? d.category : d.account}
              </th>
              <th className="money-column">{d.amount.replace(" (RM)", "")}</th>
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
                {selection ? (
                  <td className="selection-cell">
                    <input
                      type="checkbox"
                      aria-label={`${locale === "ms" ? "Pilih" : "Select"}: ${e.note || cat(e)}`}
                      checked={selection.ids.includes(e.id)}
                      onChange={(event) =>
                        selection.setIds(
                          event.target.checked
                            ? [...selection.ids, e.id]
                            : selection.ids.filter((id) => id !== e.id),
                        )
                      }
                    />
                  </td>
                ) : null}
                <td className="date-cell">{formatDate(e)}</td>
                <td>
                  <span className="table-description">
                    <TransactionMark
                      name={cat(e)}
                      type={e.kind}
                      note={e.note}
                    />
                    <span>{e.note || cat(e)}</span>
                  </span>
                </td>
                <td>
                  {columnOrder === "account-first"
                    ? accountContent(e)
                    : categoryContent(e)}
                </td>
                <td>
                  {columnOrder === "account-first"
                    ? categoryContent(e)
                    : accountContent(e)}
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
              <TransactionMark name={cat(e)} type={e.kind} note={e.note} />
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
  onAdd,
  descriptions,
  references,
  primaryId,
}: {
  data: Snapshot;
  values: Map<string, bigint>;
  d: Dictionary;
  onEdit?: (a: Account) => void;
  onAdd?: () => void;
  descriptions?: Record<string, string>;
  references?: Record<string, string>;
  primaryId?: string;
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
        <article
          key={a.id}
          className={`financial-account${a.name.length > 16 || (a.provider || "").length > 24 || money(values.get(a.id) || 0n).length > 13 ? " account-card-expanded" : ""}`}
        >
          <AccountMark account={a} />
          <Link className="account-name" href={`/app/accounts/${a.id}`}>
            <b>{a.name}</b>
            <small>
              {descriptions?.[a.id] || a.provider || d[a.type]}
              {a.archived ? ` · ${d.archived}` : ""}
            </small>
          </Link>
          {references?.[a.id] ? (
            <span className="illustrative-account-reference">
              {references[a.id]}
              <CopyReference value={references[a.id]} ms={d.home === "Utama"} />
            </span>
          ) : null}
          {primaryId === a.id ? (
            <span className="illustrative-primary">
              {d.home === "Utama" ? "Utama" : "Primary"}
            </span>
          ) : null}
          <strong>{money(values.get(a.id) || 0n)}</strong>
          {onEdit ? (
            <div className="account-edit-actions">
              <button
                className="icon-button account-edit"
                aria-label={`${d.edit}: ${a.name}`}
                onClick={() => onEdit(a)}
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <ChevronRight size={17} aria-hidden="true" />
          )}
        </article>
      ))}
      {onAdd ? (
        <button className="add-account-tile" onClick={onAdd}>
          <span>
            <Plus size={26} aria-hidden="true" />
          </span>
          <div>
            <b>{d.addAccount}</b>
            <small>
              {d.home === "Utama"
                ? "Tambah catatan bank atau e-dompet"
                : "Record another bank or e-wallet"}
            </small>
          </div>
        </button>
      ) : null}
    </div>
  );
}
const ringColors = [
  "#52b788",
  "#fe796f",
  "#609efd",
  "#fdc742",
  "#ba89fc",
  "#79cafe",
  "#cfd4de",
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
  variant = "category",
  percentages,
  arcWeights,
}: {
  rows: { id: string; name: string; amount: bigint }[];
  total: bigint;
  label: string;
  d: Dictionary;
  variant?: "category" | "account";
  percentages?: Record<string, number>;
  arcWeights?: Record<string, number>;
}) {
  const colors =
    variant === "account"
      ? ["#ffca24", "#ff4259", "#7bddf8", "#0877ff", "#00bc5d"]
      : ringColors;
  // Round directly from the exact ratio, avoiding double-rounding through
  // basis points (e.g. 430 / 11,480.75 is 3.7%, not 3.8%).
  const shareLabel = (row: { id: string; amount: bigint }) => {
    const places = variant === "account" ? 1 : 0;
    if (percentages?.[row.id] !== undefined)
      return `${percentages[row.id].toFixed(places)}%`;
    if (denominator <= 0n || row.amount < 0n) return "—";
    const unit = places ? 10n : 1n;
    const rounded = (row.amount * 100n * unit + denominator / 2n) / denominator;
    return `${rounded / unit}${places ? `.${rounded % unit}` : ""}%`;
  };
  const positive = rows.filter((r) => r.amount > 0n);
  const hasNegative = rows.some((r) => r.amount < 0n);
  const denominator = positive.reduce((n, r) => n + r.amount, 0n);
  const chartWeights = arcWeights || percentages;
  const illustrationWeight = chartWeights
    ? positive.reduce((n, r) => n + (chartWeights[r.id] || 0), 0)
    : 0;
  let angle = 0;
  const stops: string[] = [];
  const labels: {
    id: string;
    value: string;
    x: number;
    y: number;
    dark: boolean;
  }[] = [];
  for (const r of positive) {
    const i = rows.findIndex((row) => row.id === r.id);
    const start = angle;
    angle += illustrationWeight
      ? ((chartWeights![r.id] || 0) / illustrationWeight) * 100
      : basisPoints(r.amount, denominator) / 100;
    stops.push(
      `${colors[i % colors.length]} ${start}% ${Math.max(start, angle - 0.2)}%, white ${Math.max(start, angle - 0.2)}% ${angle}%`,
    );
    const midpoint = (((start + angle) / 2) * Math.PI) / 50;
    labels.push({
      id: r.id,
      value: shareLabel(r),
      x: 50 + Math.sin(midpoint) * 39,
      y: 50 - Math.cos(midpoint) * 39,
      dark: i === 3 || i === 5 || i === 6,
    });
  }
  return (
    <div
      className={`breakdown breakdown-${variant}${variant === "account" && rows.some((r) => r.name.length > 18 || money(r.amount).length > 18) ? " expanded-breakdown" : ""}`}
    >
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
          {variant === "category"
            ? labels.map((l) => (
                <span
                  key={l.id}
                  className={`donut-slice-label${l.dark ? " dark" : ""}`}
                  style={{ left: `${l.x}%`, top: `${l.y}%` }}
                >
                  {l.value}
                </span>
              ))
            : null}
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
                style={{ background: colors[i % colors.length] }}
                aria-hidden="true"
              />
              {variant === "category" ? (
                <CategoryMark name={r.name} variant="insight" />
              ) : null}
              <span>{r.name}</span>
              <strong>{money(r.amount)}</strong>
              <small>
                {!hasNegative && r.amount >= 0n && denominator
                  ? shareLabel(r)
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
  icon: Icon = TrendingUp,
}: {
  title: string;
  children: ReactNode;
  tone?: string;
  icon?: LucideIcon;
}) {
  return (
    <article className="factual-insight">
      <span className={`metric-icon ${tone}`}>
        <Icon size={27} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div>
        <h3>
          {title.split(/(\d+(?:\.\d+)?% less)/).map((part, i) =>
            /% less/.test(part) ? (
              <span className="insight-emphasis" key={i}>
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </h3>
        <p>{children}</p>
      </div>
      <Link
        href="/app/insights#reports"
        className="insight-detail-link"
        aria-label={title}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function SavingsProgress({
  goals,
  d,
  locale,
  asOf,
  onEdit,
}: {
  goals: SavingsGoal[];
  d: Dictionary;
  locale: Locale;
  asOf: string;
  onEdit: (g: SavingsGoal) => void;
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
          const GoalIcon = /trip|travel|japan|cuti/i.test(g.name)
            ? Plane
            : /emergency|kecemasan/i.test(g.name)
              ? House
              : /laptop|computer|komputer/i.test(g.name)
                ? Laptop
                : Target;
          const now = localDate(new Date(asOf));
          const monthsLeft = g.target_date
            ? Math.max(
                0,
                (Number(g.target_date.slice(0, 4)) - Number(now.slice(0, 4))) *
                  12 +
                  Number(g.target_date.slice(5, 7)) -
                  Number(now.slice(5, 7)),
              )
            : null;
          return (
            <article className="savings-goal" key={g.id}>
              <span className="goal-symbol">
                <GoalIcon size={29} aria-hidden="true">
                  {GoalIcon === House ? (
                    <path
                      d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
                      fill="#006b4e"
                      stroke="none"
                    />
                  ) : null}
                </GoalIcon>
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
                  {monthsLeft !== null ? (
                    <small className="goal-time-left">
                      {monthsLeft}{" "}
                      {locale === "ms" ? "bulan lagi" : "months to go"}
                    </small>
                  ) : null}
                </div>
                {g.target_date ? (
                  <small className="goal-target-date">
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
                  <ChevronRight size={18} aria-hidden="true" />
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
  warningIds,
  onOpen,
}: {
  data: Snapshot;
  d: Dictionary;
  onDelete: (id: string, table: string) => void;
  warningIds?: string[];
  onOpen?: (budget: Budget) => void;
}) {
  if (!data.budgets.length) return <p className="empty-budget">{d.noGoals}</p>;
  return (
    <div
      className={`budget-lines${new Set(data.budgets.map((b) => b.month)).size > 1 ? " multiple-budget-months" : ""}`}
    >
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
          <article
            className={`budget-line${warningIds?.includes(b.category_id) || used > target ? " budget-warning" : ""}`}
            key={b.id}
          >
            <CategoryMark name={category} variant="insight" />
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
              className={`icon-button ${onOpen ? "" : "danger-text"}`}
              aria-label={`${onOpen ? (d.home === "Utama" ? "Lihat bajet" : "View budget") : d.remove}: ${category}`}
              onClick={() => (onOpen ? onOpen(b) : onDelete(b.id, "budgets"))}
            >
              {onOpen ? (
                <ChevronRight size={15} aria-hidden="true" />
              ) : (
                <Trash2 size={15} aria-hidden="true" />
              )}
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
