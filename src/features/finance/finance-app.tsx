"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Home,
  List,
  ChartNoAxesColumn,
  Settings,
  Plus,
  Wallet,
  Landmark,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Pencil,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Download,
  LogOut,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { dictionary } from "@/i18n/dictionaries";
import {
  balances,
  totals,
  categoryShares,
  weeklyComparison,
} from "@/domain/finance/calculations";
import { money, parseMoney } from "@/domain/finance/money";
import { periodFor, inPeriod, localDate } from "@/domain/finance/periods";
import type { Snapshot, Locale, Transaction } from "@/domain/finance/types";
import { Brand } from "@/components/brand";
import { Sheet } from "@/components/ui/dialog";
import { Pwa } from "@/components/pwa";
import { EntryForm, type FormKind, type Editable } from "./entry-form";
import { PeriodFilter } from "./period-filter";
import { ExpenseTrend, ExpenseSources } from "./expense-trend";
const SpendingChart = dynamic(
  () => import("./spending-chart").then((m) => m.SpendingChart),
  { ssr: false },
);
type View =
  | "home"
  | "activity"
  | "accounts"
  | "insights"
  | "settings"
  | "categories"
  | "account";
export function FinanceApp({
  initial,
  locale,
  view,
  accountId,
  initialAsOf,
}: {
  initial: Snapshot;
  locale: Locale;
  view: View;
  accountId?: string;
  initialAsOf: string;
}) {
  const d = dictionary(locale),
    router = useRouter();
  const [asOf, setAsOf] = useState(initialAsOf);
  const [data, setData] = useState(initial),
    [form, setForm] = useState<{ kind: FormKind; initial?: Editable } | null>(
      null,
    );
  const [deleting, setDeleting] = useState<{
      id: string;
      table: string;
    } | null>(null),
    [deleteAccount, setDeleteAccount] = useState(false),
    [confirmation, setConfirmation] = useState("");
  const [kind, setKind] = useState("month"),
    [from, setFrom] = useState(localDate(new Date(initialAsOf))),
    [to, setTo] = useState(localDate(new Date(initialAsOf)));
  const [search, setSearch] = useState(""),
    [type, setType] = useState("all"),
    [account, setAccount] = useState(accountId || "");
  const [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  let period;
  try {
    period = periodFor(kind, new Date(asOf), from, to);
  } catch {
    period = null;
  }
  const tally = period ? totals(data.transactions, period) : null;
  const accountBalances = balances(data, period?.end || asOf);
  const funds = [...accountBalances.values()].reduce((sum, v) => sum + v, 0n);
  const shares = period ? categoryShares(data, period) : [];
  const comparison = weeklyComparison(data, new Date(asOf));
  const names = {
    home: d.overview,
    activity: d.activity,
    accounts: d.accounts,
    insights: d.insights,
    settings: d.settings,
    categories: d.categories,
    account: data.accounts.find((a) => a.id === accountId)?.name || d.account,
  };
  const formNames = {
    transaction: d.add,
    transfer: d.transfer,
    account: d.addAccount,
    account_meta: d.edit,
    category: d.addCategory,
    subcategory: d.addSubcategory,
    category_meta: d.edit,
    subcategory_meta: d.edit,
    budget: d.addGoal,
  };
  const errorText = (code: string) =>
    d.errors[code as keyof typeof d.errors] || d.errors.SERVER_UNAVAILABLE;
  async function request(path: string, value?: unknown) {
    if (!navigator.onLine) throw new Error("OFFLINE");
    const response = await fetch(path, {
      method: value === undefined ? "GET" : "POST",
      headers:
        value === undefined
          ? undefined
          : { "Content-Type": "application/json" },
      body: value === undefined ? undefined : JSON.stringify(value),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }
  async function refresh() {
    setData(await request("/api/finance"));
    setAsOf(new Date().toISOString());
  }
  async function save(value: unknown) {
    await request("/api/finance", value);
    await refresh();
    setForm(null);
    setStatus(d.saved);
  }
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error && e.message === "OFFLINE"
          ? d.offline
          : errorText(e instanceof Error ? e.message : ""),
      );
    } finally {
      setBusy(false);
    }
  }
  const nav = [
    {
      href: "/app",
      name: d.home,
      icon: Home,
      active: view === "home" || view === "accounts" || view === "account",
    },
    {
      href: "/app/transactions",
      name: d.activity,
      icon: List,
      active: view === "activity",
    },
    {
      href: "/app/insights",
      name: d.insights,
      icon: ChartNoAxesColumn,
      active: view === "insights",
    },
    {
      href: "/app/settings",
      name: d.settings,
      icon: Settings,
      active: view === "settings" || view === "categories",
    },
  ];
  const accountIcon = (type: string) =>
    type === "bank" ? Landmark : type === "cash" ? Banknote : Wallet;
  const entries = [
    ...data.transactions.map((t) => ({ ...t, kind: t.type as string })),
    ...data.transfers.map((t) => ({
      ...t,
      kind: "transfer",
      account_id: t.source_id,
      category_id: "",
      subcategory_id: null,
      planned: null,
    })),
  ]
    .filter(
      (t) =>
        period &&
        inPeriod(t.occurred_at, period) &&
        (type === "all" || t.kind === type) &&
        (!account ||
          t.account_id === account ||
          ("destination_id" in t && t.destination_id === account)) &&
        `${t.note} ${data.categories.find((c) => c.id === t.category_id)?.name || ""} ${data.accounts.find((a) => a.id === t.account_id)?.name || ""}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
    )
    .sort((a, b) => Date.parse(b.occurred_at) - Date.parse(a.occurred_at));
  const [page, setPage] = useState(1);
  const displayEntries =
    view === "home" ? entries.slice(0, 5) : entries.slice(0, page * 40);
  const filter = (
    <PeriodFilter
      d={d}
      kind={kind}
      setKind={setKind}
      from={from}
      setFrom={setFrom}
      to={to}
      setTo={setTo}
    />
  );
  const activityList = (
    <div className="activity-list">
      {displayEntries.length ? (
        displayEntries.map((t) => {
          const Icon =
            t.kind === "transfer"
              ? ArrowLeftRight
              : t.kind === "income"
                ? ArrowDownLeft
                : ArrowUpRight;
          const category = data.categories.find(
            (c) => c.id === t.category_id,
          )?.name;
          return (
            <div className="activity-row" key={t.id}>
              <span
                className={`icon-disc ${t.kind === "expense" ? "rose" : "teal"}`}
              >
                <Icon size={20} />
              </span>
              <div className="row-description">
                <b>{t.note || category || d.transfer}</b>
                <small>
                  {t.kind === "transfer"
                    ? d.transfer
                    : t.kind === "income"
                      ? d.income
                      : d.expense}{" "}
                  · {data.accounts.find((a) => a.id === t.account_id)?.name}
                  {"destination_id" in t
                    ? ` → ${data.accounts.find((a) => a.id === t.destination_id)?.name}`
                    : ""}
                </small>
                <small>
                  {new Intl.DateTimeFormat(
                    locale === "ms" ? "ms-MY" : "en-MY",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kuala_Lumpur",
                    },
                  ).format(new Date(t.occurred_at))}
                </small>
              </div>
              <div className="row-value">
                <strong>
                  {t.kind === "income" ? "+" : t.kind === "expense" ? "−" : ""}
                  {money(parseMoney(t.amount))}
                </strong>
                {view !== "home" ? (
                  <div className="row-actions">
                    {t.kind !== "transfer" ? (
                      <button
                        className="icon-button"
                        aria-label={`${d.edit}: ${t.note || category}`}
                        onClick={() =>
                          setForm({
                            kind: "transaction",
                            initial: t as Transaction,
                          })
                        }
                      >
                        <Pencil size={16} />
                      </button>
                    ) : null}
                    <button
                      className="icon-button danger-text"
                      aria-label={`${d.remove}: ${t.note || category || d.transfer}`}
                      onClick={() =>
                        setDeleting({
                          id: t.id,
                          table:
                            t.kind === "transfer"
                              ? "transfers"
                              : "transactions",
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <List size={31} strokeWidth={1.4} />
          <h3>{view === "home" ? d.noActivity : d.noResults}</h3>
          <p>{d.noActivityHelp}</p>
        </div>
      )}
      {view !== "home" && entries.length > displayEntries.length ? (
        <button
          className="button secondary"
          onClick={() => setPage((p) => p + 1)}
        >
          {d.seeAll} ({entries.length - displayEntries.length})
        </button>
      ) : null}
    </div>
  );
  return (
    <div className="app-shell">
      <Pwa />
      <aside className="app-sidebar">
        <Brand />
        <nav aria-label={d.home}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={n.active ? "page" : undefined}
            >
              <n.icon size={21} />
              <span>{n.name}</span>
            </Link>
          ))}
        </nav>
        <button
          className="button"
          disabled={!data.accounts.some((a) => !a.archived)}
          onClick={() => setForm({ kind: "transaction" })}
        >
          <Plus size={21} />
          {d.add}
        </button>
        <p>{d.manual}</p>
        <Link href="/privacy">{d.privacy}</Link>
      </aside>
      <div className="app-body">
        <header className="app-header">
          <Brand />
          <span>MYR / Asia/Kuala_Lumpur</span>
          <Link
            className="icon-button"
            href="/app/settings"
            aria-label={d.settings}
          >
            <SlidersHorizontal size={21} />
          </Link>
        </header>
        <main id="main" className="app-main">
          <div className="page-heading">
            <div>
              <h1>{names[view]}</h1>
              <p>
                {view === "home"
                  ? d.overviewIntro
                  : view === "accounts"
                    ? d.accountIntro
                    : view === "insights"
                      ? d.insightsIntro
                      : view === "settings"
                        ? d.data
                        : d.manual}
              </p>
            </div>
            {view === "accounts" ? (
              <button
                className="button"
                onClick={() => setForm({ kind: "account" })}
              >
                <Plus size={19} />
                {d.addAccount}
              </button>
            ) : view === "home" ? (
              <Link className="text-link" href="/app/accounts">
                {d.accounts}
                <ChevronRight size={18} />
              </Link>
            ) : null}
          </div>
          <div aria-live="polite">
            {status ? (
              <p className="success">
                {status}
                <button
                  className="icon-button"
                  onClick={() => setStatus("")}
                  aria-label={d.close}
                >
                  <X size={15} />
                </button>
              </p>
            ) : null}
          </div>
          {error ? (
            <div className="error" role="alert">
              <p>{error}</p>
              <button className="text-link" onClick={() => run(refresh)}>
                {d.retry}
              </button>
              <Link href="/login">{d.reauth}</Link>
              <Link href="/auth/mfa">{d.manageMfa}</Link>
            </div>
          ) : null}
          {!data.categories.length ? (
            <section className="onboarding-panel">
              <h2>{d.welcome}</h2>
              <p>{d.setupHelp}</p>
              <button
                className="button"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await request("/api/onboarding", { locale });
                    await refresh();
                  })
                }
              >
                {d.setup}
              </button>
            </section>
          ) : null}
          {["home", "activity", "insights", "account"].includes(view) ? (
            <>
              {filter}
              {!period ? (
                <p className="error" role="alert">
                  {d.errors.VALIDATION_FAILED}
                </p>
              ) : null}
            </>
          ) : null}
          {view === "home" || view === "accounts" || view === "account" ? (
            <>
              <section className="balance-panel">
                <p>{view === "account" ? d.estimatedAccount : d.estimated}</p>
                <strong>
                  {money(
                    view === "account"
                      ? accountBalances.get(accountId || "") || 0n
                      : funds,
                  )}
                </strong>
                <span>{d.estimateNote}</span>
                <div className="balance-motif" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
              </section>
              <p className="as-of">
                {d.asOf}{" "}
                {new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kuala_Lumpur",
                }).format(
                  new Date(
                    (period?.end ? Date.parse(period.end) : Date.parse(asOf)) -
                      1,
                  ),
                )}
              </p>
            </>
          ) : null}
          {(view === "home" || view === "account") && tally ? (
            <dl className="flow-grid">
              <div>
                <dt>
                  <ArrowDownLeft size={18} />
                  {d.income}
                </dt>
                <dd>
                  {money(
                    view === "account"
                      ? totals(
                          data.transactions.filter(
                            (t) => t.account_id === accountId,
                          ),
                          period!,
                        ).income
                      : tally.income,
                  )}
                </dd>
              </div>
              <div>
                <dt>
                  <ArrowUpRight size={18} />
                  {d.expenses}
                </dt>
                <dd>
                  {money(
                    view === "account"
                      ? totals(
                          data.transactions.filter(
                            (t) => t.account_id === accountId,
                          ),
                          period!,
                        ).expenses
                      : tally.expenses,
                  )}
                </dd>
              </div>
              <div>
                <dt>{d.net}</dt>
                <dd>
                  {money(
                    view === "account"
                      ? totals(
                          data.transactions.filter(
                            (t) => t.account_id === accountId,
                          ),
                          period!,
                        ).net
                      : tally.net,
                  )}
                </dd>
              </div>
            </dl>
          ) : null}
          {view === "home" ? (
            <div className="dashboard-grid">
              <section className="surface history-section">
                <div className="section-row">
                  <h2>{d.recent}</h2>
                  <Link href="/app/transactions" className="text-link">
                    {d.seeAll}
                  </Link>
                </div>
                {activityList}
              </section>
              <section className="surface category-summary">
                <h2>{d.categoryShare}</h2>
                {shares.length ? (
                  <>
                    {shares.slice(0, 4).map((row) => (
                      <div className="share-row" key={row.id}>
                        <span>{row.name}</span>
                        <b>{money(row.amount)}</b>
                        <small>{(row.share / 100).toFixed(1)}%</small>
                      </div>
                    ))}
                    <Link className="text-link" href="/app/insights">
                      {d.insights}
                      <ChevronRight size={17} />
                    </Link>
                  </>
                ) : (
                  <p>{d.noInsights}</p>
                )}
              </section>
            </div>
          ) : null}
          {view === "activity" || view === "account" ? (
            <>
              <div className="activity-filters">
                <label className="field">
                  <span>{d.search}</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>{d.type}</span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="all">{d.allTypes}</option>
                    <option value="income">{d.income}</option>
                    <option value="expense">{d.expense}</option>
                    <option value="transfer">{d.transfer}</option>
                  </select>
                </label>
                {view === "activity" ? (
                  <label className="field">
                    <span>{d.account}</span>
                    <select
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                    >
                      <option value="">{d.accountAll}</option>
                      {data.accounts.map((a) => (
                        <option value={a.id} key={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
              <section className="surface">{activityList}</section>
            </>
          ) : null}
          {view === "accounts" ? (
            <>
              <div className="account-list">
                {data.accounts.length ? (
                  data.accounts.map((a) => {
                    const Icon = accountIcon(a.type);
                    return (
                      <article className="account-row" key={a.id}>
                        <span className="icon-disc teal">
                          <Icon size={24} />
                        </span>
                        <Link
                          className="account-name"
                          href={`/app/accounts/${a.id}`}
                        >
                          <b>{a.name}</b>
                          <small>
                            {d[a.type]}
                            {a.provider ? ` · ${a.provider}` : ""}
                            {a.archived ? ` · ${d.archived}` : ""}
                          </small>
                        </Link>
                        <strong>
                          {money(accountBalances.get(a.id) || 0n)}
                        </strong>
                        <button
                          className="icon-button"
                          aria-label={`${d.edit}: ${a.name}`}
                          onClick={() =>
                            setForm({ kind: "account_meta", initial: a })
                          }
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          className="icon-button danger-text"
                          aria-label={`${d.remove}: ${a.name}`}
                          onClick={() =>
                            setDeleting({ id: a.id, table: "accounts" })
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </article>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <Wallet size={34} />
                    <h2>{d.noAccounts}</h2>
                    <p>{d.noAccountsHelp}</p>
                  </div>
                )}
              </div>
              <button
                className="button secondary"
                disabled={data.accounts.filter((a) => !a.archived).length < 2}
                onClick={() => setForm({ kind: "transfer" })}
              >
                <ArrowLeftRight size={19} />
                {d.transfer}
              </button>
              <p className="hint">{d.transferHelp}</p>
            </>
          ) : null}
          {view === "insights" ? (
            <>
              <ExpenseTrend data={data} asOf={asOf} locale={locale} d={d} />
              <section className="surface">
                <h2>{d.categoryShare}</h2>
                <p className="hint">{d.shareHelp}</p>
                {shares.length ? (
                  <>
                    <SpendingChart
                      rows={shares.map((r) => ({
                        name: r.name,
                        share: r.share / 100,
                        formatted: money(r.amount),
                      }))}
                    />
                    <table>
                      <caption className="sr-only">{d.categoryShare}</caption>
                      <thead>
                        <tr>
                          <th>{d.category}</th>
                          <th>{d.amount}</th>
                          <th>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shares.map((r) => (
                          <tr key={r.id}>
                            <td>
                              {r.name}
                              {period ? (
                                <ExpenseSources
                                  data={data}
                                  period={period}
                                  categoryId={r.id}
                                  label={r.name}
                                  locale={locale}
                                  d={d}
                                />
                              ) : null}
                            </td>
                            <td>{money(r.amount)}</td>
                            <td>{(r.share / 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div className="empty-state">
                    <ChartNoAxesColumn size={32} />
                    <p>{d.noInsights}</p>
                  </div>
                )}
              </section>
              <section className="insight-note">
                <h2>{d.comparison}</h2>
                {comparison ? (
                  <>
                    <p>
                      {money(comparison.newTotal)} {d.comparedWith}{" "}
                      {money(comparison.oldTotal)}. {d.difference}:{" "}
                      {money(comparison.difference)}.
                    </p>
                    <p>
                      {localDate(new Date(comparison.recent.start!))} –{" "}
                      {localDate(
                        new Date(Date.parse(comparison.recent.end) - 1),
                      )}
                      ; {localDate(new Date(comparison.previous.start!))} –{" "}
                      {localDate(
                        new Date(Date.parse(comparison.previous.end) - 1),
                      )}
                      .
                    </p>
                  </>
                ) : null}
                <p>{d.comparisonHelp}</p>
              </section>
              <section className="surface">
                <div className="section-row">
                  <h2>{d.goals}</h2>
                  <button
                    className="text-link"
                    onClick={() => setForm({ kind: "budget" })}
                  >
                    <Plus size={18} />
                    {d.addGoal}
                  </button>
                </div>
                <p className="hint">{d.goalHelp}</p>
                {data.budgets.length ? (
                  data.budgets.map((b) => {
                    const y = +b.month.slice(0, 4),
                      m = +b.month.slice(5, 7);
                    const last = new Date(Date.UTC(y, m, 0))
                      .toISOString()
                      .slice(0, 10);
                    const bp = periodFor("custom", new Date(), b.month, last);
                    const used = totals(
                        data.transactions.filter(
                          (t) => t.category_id === b.category_id,
                        ),
                        bp,
                      ).expenses,
                      remaining = parseMoney(b.amount) - used;
                    return (
                      <div className="budget-row" key={b.id}>
                        <div>
                          <b>
                            {
                              data.categories.find(
                                (c) => c.id === b.category_id,
                              )?.name
                            }
                          </b>
                          <small>{b.month.slice(0, 7)}</small>
                          <p>
                            {d.used}: {money(used)} /{" "}
                            {money(parseMoney(b.amount))}
                          </p>
                          <span>
                            {remaining < 0n ? d.over : d.remaining}:{" "}
                            {money(remaining < 0n ? -remaining : remaining)}
                          </span>
                        </div>
                        <button
                          className="icon-button danger-text"
                          aria-label={`${d.remove}: ${data.categories.find((c) => c.id === b.category_id)?.name}`}
                          onClick={() =>
                            setDeleting({ id: b.id, table: "budgets" })
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>{d.noGoals}</p>
                )}
              </section>
            </>
          ) : null}
          {view === "categories" ? (
            <>
              <p>{d.categoryHelp}</p>
              <div className="button-row">
                <button
                  className="button"
                  onClick={() => setForm({ kind: "category" })}
                >
                  {d.addCategory}
                </button>
                <button
                  className="button secondary"
                  onClick={() => setForm({ kind: "subcategory" })}
                >
                  {d.addSubcategory}
                </button>
              </div>
              <section className="surface">
                {data.categories.map((c) => (
                  <div className="taxonomy-group" key={c.id}>
                    <div className="section-row">
                      <div>
                        <b>{c.name}</b>
                        <small>
                          {c.type === "income" ? d.income : d.expense}
                          {c.archived ? ` · ${d.archived}` : ""}
                        </small>
                      </div>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          aria-label={`${d.edit}: ${c.name}`}
                          onClick={() =>
                            setForm({ kind: "category_meta", initial: c })
                          }
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          className="icon-button danger-text"
                          aria-label={`${d.remove}: ${c.name}`}
                          onClick={() =>
                            setDeleting({ id: c.id, table: "categories" })
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                    {data.subcategories
                      .filter((s) => s.category_id === c.id)
                      .map((s) => (
                        <div className="subcategory-row" key={s.id}>
                          <span>
                            {s.name}
                            {s.archived ? ` · ${d.archived}` : ""}
                          </span>
                          <button
                            className="icon-button"
                            aria-label={`${d.edit}: ${s.name}`}
                            onClick={() =>
                              setForm({ kind: "subcategory_meta", initial: s })
                            }
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button danger-text"
                            aria-label={`${d.remove}: ${s.name}`}
                            onClick={() =>
                              setDeleting({ id: s.id, table: "subcategories" })
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </section>
            </>
          ) : null}
          {view === "settings" ? (
            <>
              <section className="surface settings-section">
                <h2>{d.preferences}</h2>
                <label className="settings-row">
                  <div>
                    <b>{d.language}</b>
                    <p>{d.languageHelp}</p>
                  </div>
                  <select
                    aria-label={d.language}
                    value={locale}
                    disabled={busy}
                    onChange={(e) => {
                      const l = e.target.value;
                      run(async () => {
                        await request("/api/finance", {
                          kind: "locale",
                          locale: l,
                        });
                        document.cookie = `rft-locale=${l}; Path=/; SameSite=Lax; Max-Age=31536000${location.protocol === "https:" ? "; Secure" : ""}`;
                        router.refresh();
                      });
                    }}
                  >
                    <option value="en">English</option>
                    <option value="ms">Bahasa Melayu</option>
                  </select>
                </label>
                <Link className="settings-row" href="/app/accounts">
                  <Wallet />
                  <div>
                    <b>{d.accounts}</b>
                    <p>{d.accountIntro}</p>
                  </div>
                  <ChevronRight />
                </Link>
                <Link className="settings-row" href="/app/categories">
                  <List />
                  <div>
                    <b>{d.categories}</b>
                    <p>{d.categoryHelp}</p>
                  </div>
                  <ChevronRight />
                </Link>
              </section>
              <section className="surface settings-section">
                <h2>{d.security}</h2>
                <Link className="settings-row" href="/auth/mfa">
                  <ShieldCheck />
                  <div>
                    <b>{d.mfa}</b>
                    <p>{d.mfaHelp}</p>
                  </div>
                  <ChevronRight />
                </Link>
                <form method="post" action="/auth/sign-out">
                  <button className="text-link">
                    <LogOut size={19} />
                    {d.signout}
                  </button>
                </form>
              </section>
              <section className="surface settings-section">
                <h2>{d.data}</h2>
                <p>{d.exportHelp}</p>
                <label className="field">
                  <span>{d.period}</span>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value)}
                  >
                    <option value="all">{d.all}</option>
                    <option value="today">{d.today}</option>
                    <option value="week">{d.week}</option>
                    <option value="month">{d.month}</option>
                    <option value="custom">{d.custom}</option>
                  </select>
                </label>
                {kind === "custom" ? filter : null}
                <button
                  className="button secondary"
                  disabled={busy || !period}
                  onClick={() =>
                    run(async () => {
                      const response = await fetch(
                        `/api/export?${new URLSearchParams({ period: kind, from, to })}`,
                        { cache: "no-store" },
                      );
                      if (!response.ok) {
                        const body = await response.json();
                        throw new Error(body.error);
                      }
                      const url = URL.createObjectURL(await response.blob());
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "rft-transactions.csv";
                      a.click();
                      URL.revokeObjectURL(url);
                    })
                  }
                >
                  <Download size={18} />
                  {d.export}
                </button>
                <Link href="/login" className="text-link">
                  {d.reauth}
                </Link>
                <hr />
                <button
                  className="text-link danger-text"
                  onClick={() => setDeleteAccount(true)}
                >
                  <Trash2 size={18} />
                  {d.deleteAccount}
                </button>
                <p>{d.deleteAccountHelp}</p>
              </section>
              <section className="surface">
                <h2>{d.install}</h2>
                <p>{d.installHelp}</p>
                <div className="button-row">
                  <Link href="/privacy">{d.privacy}</Link>
                  <Link href="/terms">{d.terms}</Link>
                </div>
              </section>
            </>
          ) : null}
          {view === "home" && !data.accounts.length ? (
            <button
              className="button"
              onClick={() => setForm({ kind: "account" })}
            >
              <Plus size={19} />
              {d.addAccount}
            </button>
          ) : null}
        </main>
      </div>
      <nav className="mobile-nav" aria-label={d.home}>
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={n.active ? "page" : undefined}
          >
            <n.icon size={21} />
            <span>{n.name}</span>
          </Link>
        ))}
      </nav>
      <button
        className="mobile-add"
        disabled={!data.accounts.some((a) => !a.archived)}
        onClick={() => setForm({ kind: "transaction" })}
        aria-label={data.accounts.length ? d.add : d.addFirst}
      >
        <Plus size={28} />
      </button>
      <Sheet
        open={!!form}
        onOpenChange={(v) => {
          if (!v) setForm(null);
        }}
        title={form ? formNames[form.kind] : ""}
        close={d.close}
      >
        {form ? (
          <EntryForm
            key={`${form.kind}-${form.initial?.id || "new"}`}
            kind={form.kind}
            initial={form.initial}
            data={data}
            d={d}
            onSave={save}
            onCancel={() => setForm(null)}
          />
        ) : null}
      </Sheet>
      <Sheet
        open={!!deleting}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title={d.deleteConfirm}
        description={d.deleteRecordHelp}
        close={d.close}
      >
        <div className="form-actions">
          <button
            className="button secondary"
            onClick={() => setDeleting(null)}
          >
            {d.cancel}
          </button>
          <button
            className="button danger"
            disabled={busy}
            onClick={() =>
              run(async () => {
                await request("/api/finance", {
                  kind: "delete_record",
                  ...deleting,
                });
                await refresh();
                setDeleting(null);
                setStatus(d.saved);
              })
            }
          >
            {d.remove}
          </button>
        </div>
      </Sheet>
      <Sheet
        open={deleteAccount}
        onOpenChange={setDeleteAccount}
        title={d.deleteAccount}
        description={d.deleteAccountHelp}
        close={d.close}
      >
        <label className="field">
          <span>{d.deletePhrase}</span>
          <input
            autoComplete="off"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </label>
        <div className="form-actions">
          <button
            className="button secondary"
            onClick={() => setDeleteAccount(false)}
          >
            {d.cancel}
          </button>
          <button
            className="button danger"
            disabled={busy || confirmation !== "DELETE RFT"}
            onClick={() =>
              run(async () => {
                await request("/api/delete-account", { confirmation });
                router.replace("/");
                router.refresh();
              })
            }
          >
            {d.deleteAccount}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
