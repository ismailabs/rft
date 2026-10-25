"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  List,
  ChartNoAxesColumn,
  Settings,
  Plus,
  ArrowLeftRight,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Download,
  LogOut,
  SlidersHorizontal,
  X,
  Search,
  Tag,
  PieChart,
  Target,
  Utensils,
  TrendingUp,
  Calendar,
  CreditCard,
  Sparkles,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { dictionary } from "@/i18n/dictionaries";
import {
  balances,
  totals,
  categoryShares,
  weeklyComparison,
} from "@/domain/finance/calculations";
import { money } from "@/domain/finance/money";
import { periodFor, inPeriod, localDate } from "@/domain/finance/periods";
import type { Snapshot, Locale } from "@/domain/finance/types";
import { Brand } from "@/components/brand";
import { Sheet } from "@/components/ui/dialog";
import { Pwa } from "@/components/pwa";
import { EntryForm, type FormKind, type Editable } from "./entry-form";
import { PeriodFilter } from "./period-filter";
import { ExpenseTrend, ExpenseSources } from "./expense-trend";
import { monthlyReport } from "@/domain/finance/reporting";
import type { FinancePresentation } from "./presentation";
import {
  Panel,
  BalanceSummary,
  FlowSummary,
  MonthlyChart,
  TransactionHistory,
  AccountOverview,
  AccountTypeSummary,
  Breakdown,
  FactualInsight,
  MobileDashboardOverview,
  MobileSpendingTrend,
  SavingsProgress,
  BudgetProgress,
  CategoryMark,
} from "./visual-components";
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
  displayName = "",
  initialSearch = "",
  presentation,
}: {
  initial: Snapshot;
  locale: Locale;
  view: View;
  accountId?: string;
  initialAsOf: string;
  displayName?: string;
  initialSearch?: string;
  presentation?: FinancePresentation;
}) {
  const d = dictionary(locale),
    router = useRouter();
  const [asOf, setAsOf] = useState(initialAsOf);
  const [data, setData] = useState(initial),
    [form, setForm] = useState<{ kind: FormKind; initial?: Editable } | null>(
      null,
    );
  const [budgetInfo, setBudgetInfo] = useState<string | null>(null);
  const [entryPanelOpen, setEntryPanelOpen] = useState(true);
  const [manager, setManager] = useState<
    "budgets" | "goals" | "accounts" | null
  >(null);
  const [deleting, setDeleting] = useState<{
      id: string;
      table: string;
    } | null>(null),
    [deleteAccount, setDeleteAccount] = useState(false),
    [confirmation, setConfirmation] = useState("");
  const [kind, setKind] = useState("month"),
    [from, setFrom] = useState(localDate(new Date(initialAsOf))),
    [to, setTo] = useState(localDate(new Date(initialAsOf)));
  const [search, setSearch] = useState(initialSearch),
    [type, setType] = useState("all"),
    [account, setAccount] = useState(accountId || "");
  const [oldestFirst, setOldestFirst] = useState(false);
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
    goal: d.addSavingsGoal,
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
    .sort(
      (a, b) =>
        (oldestFirst ? 1 : -1) *
        (Date.parse(a.occurred_at) - Date.parse(b.occurred_at)),
    );
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [inlineRevision, setInlineRevision] = useState(0);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [chartRange, setChartRange] = useState<3 | 6 | 12>(6);
  const report = monthlyReport(data, asOf);
  const ms = locale === "ms";
  const malaysiaHour = (new Date(asOf).getUTCHours() + 8) % 24;
  const greeting = presentation
    ? ms
      ? "Selamat pagi"
      : "Good morning"
    : ms
      ? malaysiaHour < 12
        ? "Selamat pagi"
        : malaysiaHour < 18
          ? "Selamat petang"
          : "Selamat malam"
      : malaysiaHour < 12
        ? "Good morning"
        : malaysiaHour < 18
          ? "Good afternoon"
          : "Good evening";
  const selectedEntries = entries.filter(
    (t) => !categoryFilter || t.category_id === categoryFilter,
  );
  const displayEntries =
    view === "home" || view === "accounts" || view === "account"
      ? entries.slice(0, 5)
      : selectedEntries.slice((page - 1) * 10, page * 10);
  const filter = (
    <PeriodFilter
      d={d}
      kind={kind}
      setKind={(v) => {
        setKind(v);
        setPage(1);
      }}
      from={from}
      setFrom={(v) => {
        setFrom(v);
        setPage(1);
      }}
      to={to}
      rangeLabel={
        presentation?.periodLabel ||
        (period?.start && kind === "month"
          ? `${new Intl.DateTimeFormat(ms ? "ms-MY" : "en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(period.start))} – ${new Intl.DateTimeFormat(ms ? "ms-MY" : "en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(Date.parse(period.end) - 1))}`
          : undefined)
      }
      setTo={(v) => {
        setTo(v);
        setPage(1);
      }}
    />
  );
  const activityList = (
    <TransactionHistory
      entries={displayEntries}
      groupDates={view !== "home"}
      columnOrder={view === "accounts" ? "account-first" : "category-first"}
      dateOrder={oldestFirst ? "ascending" : "descending"}
      onDateSort={
        view === "activity"
          ? () => {
              setOldestFirst((v) => !v);
              setPage(1);
            }
          : undefined
      }
      selection={
        view === "activity"
          ? { ids: selectedHistoryIds, setIds: setSelectedHistoryIds }
          : undefined
      }
      data={data}
      d={d}
      locale={locale}
      onEdit={
        view === "home" || view === "accounts"
          ? undefined
          : (t) => setForm({ kind: "transaction", initial: t })
      }
      onDelete={
        view === "home" || view === "accounts"
          ? undefined
          : (id, table) => setDeleting({ id, table })
      }
    />
  );
  const desktopNav = [
    {
      href: "/app",
      name: ms ? "Gambaran" : "Dashboard",
      icon: Home,
      active: view === "home",
    },
    {
      href: "/app/transactions",
      name: ms ? "Transaksi" : "Transactions",
      icon: List,
      active: view === "activity",
    },
    {
      href: "/app/accounts",
      name: d.accounts,
      icon: CreditCard,
      active: view === "accounts" || view === "account",
    },
    {
      href: "/app/insights#budgets",
      name: ms ? "Bajet" : "Budgets",
      icon: PieChart,
      active: view === "insights",
    },
    {
      href: "/app/insights#goals",
      name: ms ? "Matlamat" : "Goals",
      icon: Target,
      active: false,
    },
    {
      href: "/app/insights#reports",
      name: ms ? "Laporan" : "Reports",
      icon: ChartNoAxesColumn,
      active: false,
    },
    {
      href: "/app/categories",
      name: d.categories,
      icon: Tag,
      active: view === "categories",
    },
    {
      href: "/app/settings#data",
      name: ms ? "Eksport data" : "Data export",
      icon: Download,
      active: false,
    },
    {
      href: "/app/settings",
      name: d.settings,
      icon: Settings,
      active: view === "settings",
    },
  ];
  async function saveInline(value: unknown) {
    await save(value);
    setInlineRevision((n) => n + 1);
  }
  const recentPanel = (
    <Panel
      title={
        ms
          ? "Transaksi terkini"
          : view === "accounts"
            ? "Recent Account Transactions"
            : "Recent Transactions"
      }
      className="recent-transactions"
      action={
        <Link className="text-link" href="/app/transactions">
          {d.seeAll}
        </Link>
      }
    >
      {activityList}
    </Panel>
  );
  const balancePanel = (
    <BalanceSummary
      amount={
        view === "account"
          ? accountBalances.get(accountId || "") || 0n
          : (presentation?.balance ?? funds)
      }
      d={d}
      asOf={new Date(Date.parse(period?.end || asOf) - 1).toISOString()}
      locale={locale}
      series={
        presentation?.balanceSeries ||
        report.map((r) =>
          view === "account"
            ? balances(data, r.period.end).get(accountId || "") || 0n
            : r.closing,
        )
      }
      account={view === "account"}
      label={
        view === "accounts"
          ? ms
            ? "Jumlah Baki (Semua Akaun)"
            : "Total Balance (All Accounts)"
          : undefined
      }
      change={presentation?.balanceChange}
    />
  );
  const accountFlow =
    view === "account" && period
      ? totals(
          data.transactions.filter((t) => t.account_id === accountId),
          period,
        )
      : tally;
  const flows = accountFlow ? (
    <FlowSummary
      {...(presentation?.flows || accountFlow)}
      changes={presentation?.flowChanges}
      d={d}
    />
  ) : null;
  const insightSummary = presentation?.insights ? (
    presentation.insights.map((item) => (
      <FactualInsight
        key={item.icon}
        title={item.title}
        tone={item.tone}
        icon={
          item.icon === "dining"
            ? Utensils
            : item.icon === "calendar"
              ? Calendar
              : TrendingUp
        }
      >
        {item.detail}
      </FactualInsight>
    ))
  ) : (
    <>
      <FactualInsight
        title={ms ? "Catatan perbelanjaan anda" : "Your recorded spending"}
      >
        {tally ? money(tally.expenses) : "—"}.{" "}
        {ms
          ? "Perbelanjaan dicatat dalam tempoh dipilih."
          : "Expenses recorded in the selected period."}
      </FactualInsight>
      <FactualInsight
        title={shares[0]?.name || d.categoryShare}
        tone="amber"
        icon={Utensils}
      >
        {shares[0]
          ? `${money(shares[0].amount)} · ${(shares[0].share / 100).toFixed(1)}%`
          : d.noInsights}
      </FactualInsight>
      <FactualInsight
        title={ms ? "Bajet bulanan" : "Monthly budgets"}
        tone="purple"
        icon={Calendar}
      >
        {data.budgets.length
          ? `${data.budgets.length} ${ms ? "had bulanan disimpan" : "saved monthly category limits"}`
          : d.noGoals}
      </FactualInsight>
    </>
  );
  return (
    <div className={`app-shell recovered view-${view}`}>
      <Pwa />
      <aside
        className="app-sidebar"
        aria-label={ms ? "Navigasi RFT" : "RFT navigation"}
      >
        <Brand />
        <nav aria-label={d.home}>
          {desktopNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-label={n.name}
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
          <form
            className="global-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (view !== "home" && view !== "activity")
                router.push(
                  `/app/transactions?search=${encodeURIComponent(search)}`,
                );
            }}
          >
            <Search size={20} aria-hidden="true" />
            <label className="sr-only" htmlFor="global-search">
              {d.search}
            </label>
            <input
              id="global-search"
              name="search"
              type="search"
              placeholder={
                ms
                  ? "Cari transaksi, akaun, kategori…"
                  : "Search transactions, merchants, categories…"
              }
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </form>
          <Link className="profile-link" href="/app/settings">
            <span className="profile-avatar" aria-hidden="true">
              {displayName ? (
                displayName.slice(0, 2).toUpperCase()
              ) : (
                <Settings size={19} aria-hidden="true" />
              )}
            </span>
            <span>{displayName || d.settings}</span>
            <ChevronDown size={15} aria-hidden="true" />
            {displayName ? (
              <span className="sr-only"> · {d.settings}</span>
            ) : null}
          </Link>
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
              <h1>
                {view === "home"
                  ? displayName
                    ? `${greeting}, ${displayName}`
                    : ms
                      ? "Gambaran kewangan anda"
                      : "Your financial overview"
                  : view === "activity"
                    ? ms
                      ? "Transaksi"
                      : "Transactions"
                    : view === "accounts"
                      ? ms
                        ? "Akaun & Pindahan"
                        : "Accounts & Transfer"
                      : view === "insights"
                        ? ms
                          ? "Analisis & Bajet"
                          : "Insights & Budgets"
                        : names[view]}
              </h1>
              <p>
                {view === "home"
                  ? ms
                    ? d.overviewIntro
                    : `Here's your financial overview for ${new Intl.DateTimeFormat("en-MY", { month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(asOf))}.`
                  : view === "accounts"
                    ? ms
                      ? d.accountIntro
                      : "Manage your accounts and transfer money between your own accounts."
                    : view === "insights"
                      ? ms
                        ? d.insightsIntro
                        : "Understand your spending, spot opportunities, and stay on track."
                      : view === "activity"
                        ? ms
                          ? d.manual
                          : "View and manage all your income and expenses."
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
            ) : ["home", "insights", "account"].includes(view) ? (
              filter
            ) : view === "activity" ? (
              <button
                className="button"
                onClick={() => {
                  if (window.matchMedia("(min-width:1200px)").matches)
                    setEntryPanelOpen(true);
                  else setForm({ kind: "transaction" });
                }}
              >
                <Plus size={19} aria-hidden="true" />
                {d.add}
              </button>
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
          {!period ? (
            <p className="error" role="alert">
              {d.errors.VALIDATION_FAILED}
            </p>
          ) : null}
          {view === "home" ? (
            <div className="reference-dashboard">
              <div className="primary-stack">
                {balancePanel}
                <div className="home-flow-block">
                  <div className="mobile-flow-heading">
                    <h2>{d.month}</h2>
                    {filter}
                  </div>
                  {flows}
                </div>
                <MonthlyChart
                  data={data}
                  range={chartRange}
                  onRangeChange={setChartRange}
                  asOf={asOf}
                  locale={locale}
                  d={d}
                  values={presentation?.monthly}
                />
                <MobileDashboardOverview
                  data={data}
                  asOf={asOf}
                  shares={shares}
                  d={d}
                  locale={locale}
                />
                {recentPanel}
              </div>
              <aside
                className="secondary-stack"
                aria-label={ms ? "Ringkasan tambahan" : "Additional summaries"}
              >
                <Panel
                  title={d.accounts}
                  className="dashboard-accounts"
                  action={
                    <Link className="text-link" href="/app/accounts">
                      {ms ? "Urus" : "Manage"}
                    </Link>
                  }
                >
                  <AccountOverview
                    data={data}
                    values={accountBalances}
                    d={d}
                    descriptions={presentation?.accountDescriptions}
                  />
                  <button
                    className="button secondary wide"
                    onClick={() => setForm({ kind: "account" })}
                  >
                    <Plus size={18} />
                    {d.addAccount}
                  </button>
                </Panel>
                <Panel
                  title={d.insights}
                  className="dashboard-insights"
                  action={
                    <Link className="text-link" href="/app/insights">
                      {ms ? "Lihat semua" : "View all"}
                    </Link>
                  }
                >
                  <Sparkles
                    className="insights-heading-icon"
                    size={23}
                    aria-hidden="true"
                  />
                  {insightSummary}
                </Panel>
              </aside>
            </div>
          ) : null}
          {view === "activity" ? (
            <div className="reference-transactions">
              <div className="primary-stack">
                <Panel className="transaction-controls">
                  <div className="transaction-tabs">
                    {["all", "income", "expense"].map((v) => (
                      <button
                        key={v}
                        className={type === v ? "active" : ""}
                        aria-pressed={type === v}
                        onClick={() => {
                          setType(v);
                          setPage(1);
                        }}
                      >
                        {v === "all"
                          ? ms
                            ? "Semua transaksi"
                            : "All Transactions"
                          : v === "income"
                            ? d.income
                            : v === "expense"
                              ? d.expenses
                              : d.transfer}
                      </button>
                    ))}
                    {filter}
                  </div>
                  <label className="search-control">
                    <Search size={20} aria-hidden="true" />
                    <span className="sr-only">{d.search}</span>
                    <input
                      type="search"
                      placeholder={
                        ms
                          ? "Cari keterangan atau kategori…"
                          : "Search by description, merchant, or reference…"
                      }
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </label>
                  <div className="filter-select-row">
                    <label>
                      <span className="sr-only">{d.account}</span>
                      <select
                        value={account}
                        onChange={(e) => {
                          setAccount(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">{d.accountAll}</option>
                        {data.accounts.map((a) => (
                          <option value={a.id} key={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">{d.category}</span>
                      <select
                        value={categoryFilter}
                        onChange={(e) => {
                          setCategoryFilter(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">
                          {ms ? "Semua kategori" : "All categories"}
                        </option>
                        {data.categories.map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">{d.type}</span>
                      <select
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="all">
                          {ms ? "Semua jenis" : "All Types"}
                        </option>
                        <option value="income">{d.income}</option>
                        <option value="expense">{d.expenses}</option>
                        <option value="transfer">{d.transfer}</option>
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">
                        {ms
                          ? "Penapis tarikh transaksi"
                          : "Transaction date filter"}
                      </span>
                      <select
                        value={kind}
                        onChange={(e) => {
                          setKind(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="month">
                          {ms ? "Bulan ini" : "All Dates"}
                        </option>
                        <option value="today">{d.today}</option>
                        <option value="week">{d.week}</option>
                        <option value="all">{d.all}</option>
                        <option value="custom">{d.custom}</option>
                      </select>
                    </label>
                    <button
                      className="text-link"
                      onClick={() => {
                        setType("all");
                        setAccount("");
                        setCategoryFilter("");
                        setSearch("");
                        setPage(1);
                      }}
                    >
                      {ms ? "Kosongkan penapis" : "Clear Filters"}
                    </button>
                  </div>
                  <div className="category-strip-shell">
                    <div className="category-filter-strip">
                      <button
                        aria-pressed={!categoryFilter}
                        onClick={() => {
                          setCategoryFilter("");
                          setPage(1);
                        }}
                      >
                        <LayoutGrid size={21} />
                        {ms ? "Semua" : "All"}
                      </button>
                      {data.categories
                        .filter((c) => !c.archived && c.type === "expense")
                        .map((c) => (
                          <button
                            key={c.id}
                            aria-pressed={categoryFilter === c.id}
                            onClick={() => {
                              setCategoryFilter(c.id);
                              setPage(1);
                            }}
                          >
                            <CategoryMark name={c.name} variant="filter" />
                            {c.name}
                          </button>
                        ))}
                    </div>
                    <button
                      className="category-strip-next icon-button"
                      aria-label={ms ? "Lagi kategori" : "More categories"}
                      onClick={(event) =>
                        event.currentTarget.previousElementSibling?.scrollBy({
                          left: 300,
                          behavior: "instant",
                        })
                      }
                    >
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </Panel>
                <Panel>
                  {activityList}
                  <div className="table-pagination">
                    <span>
                      {selectedEntries.length
                        ? `${ms ? "Memaparkan" : "Showing"} ${(page - 1) * 10 + 1}–${Math.min(page * 10, selectedEntries.length)} ${ms ? "daripada" : "of"} ${selectedEntries.length}`
                        : "0"}{" "}
                      {ms ? "transaksi" : "transactions"}
                    </span>
                    <div>
                      <button
                        className="icon-button"
                        aria-label={ms ? "Halaman sebelumnya" : "Previous page"}
                        disabled={page === 1}
                        onClick={() => setPage((n) => n - 1)}
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                      </button>
                      {Array.from(
                        { length: Math.ceil(selectedEntries.length / 10) },
                        (_, i) => i + 1,
                      )
                        .filter(
                          (n) =>
                            selectedEntries.length <= 70 ||
                            n === 1 ||
                            n === Math.ceil(selectedEntries.length / 10) ||
                            Math.abs(n - page) <= 2,
                        )
                        .map((n) => (
                          <button
                            key={n}
                            className="icon-button"
                            aria-label={`${ms ? "Halaman" : "Page"} ${n}`}
                            aria-current={n === page ? "page" : undefined}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        ))}
                      <button
                        className="icon-button"
                        aria-label={ms ? "Halaman seterusnya" : "Next page"}
                        disabled={page * 10 >= selectedEntries.length}
                        onClick={() => setPage((n) => n + 1)}
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </Panel>
              </div>
              <aside
                className="desktop-composer rft-panel"
                aria-label={d.add}
                hidden={!entryPanelOpen}
              >
                <h2>{ms ? d.add : "Add Transaction"}</h2>
                <button
                  className="icon-button composer-close"
                  aria-label={
                    ms ? "Tutup panel transaksi" : "Close transaction panel"
                  }
                  onClick={() => setEntryPanelOpen(false)}
                >
                  <X size={20} aria-hidden="true" />
                </button>
                <EntryForm
                  key={inlineRevision}
                  kind="transaction"
                  defaultDateTime={asOf}
                  defaults={
                    presentation
                      ? {
                          account: data.accounts[0]?.id,
                          category: data.categories[0]?.id,
                        }
                      : undefined
                  }
                  data={data}
                  d={d}
                  onSave={saveInline}
                  onCancel={() => setInlineRevision((n) => n + 1)}
                />
              </aside>
            </div>
          ) : null}
          {view === "accounts" ? (
            <div className="reference-accounts">
              <div className="primary-stack">
                {balancePanel}
                <Panel
                  title={ms ? "Akaun anda" : "Your Accounts"}
                  action={
                    <button
                      className="text-link"
                      onClick={() => setManager("accounts")}
                    >
                      {ms ? "Urus" : "Manage"}
                    </button>
                  }
                >
                  <AccountOverview
                    data={data}
                    values={accountBalances}
                    d={d}
                    descriptions={presentation?.accountDescriptions}
                    references={presentation?.accountReferences}
                    primaryId={
                      presentation?.accountReferences
                        ? data.accounts[0]?.id
                        : undefined
                    }
                    onAdd={() => setForm({ kind: "account" })}
                    onEdit={(a) =>
                      setForm({ kind: "account_meta", initial: a })
                    }
                  />
                </Panel>
                <div className="mobile-transfer-action">
                  <AccountTypeSummary
                    data={data}
                    values={accountBalances}
                    d={d}
                  />
                  <button
                    className="button wide"
                    disabled={
                      data.accounts.filter((a) => !a.archived).length < 2
                    }
                    onClick={() => setForm({ kind: "transfer" })}
                  >
                    <ArrowLeftRight size={19} />
                    {d.transfer}
                  </button>
                </div>
                {recentPanel}
              </div>
              <aside
                className="secondary-stack"
                aria-label={ms ? "Ringkasan tambahan" : "Additional summaries"}
              >
                <Panel
                  title={ms ? "Pindahan antara akaun" : "Transfer Money"}
                  className="desktop-composer"
                >
                  <div className="transfer-tabs">
                    <span>
                      {ms ? "Antara akaun saya" : "Between My Accounts"}
                    </span>
                    <span>{ms ? "Catatan manual" : "Manual records"}</span>
                  </div>
                  <p className="manual-transfer-note">
                    {ms
                      ? "Catatan manual sahaja — wang tidak dipindahkan."
                      : "Manual entry only — no funds are moved."}
                  </p>
                  <EntryForm
                    key={inlineRevision}
                    kind="transfer"
                    placement="inline"
                    defaultDateTime={asOf}
                    defaults={
                      presentation
                        ? {
                            account: data.accounts[0]?.id,
                            destination: data.accounts[1]?.id,
                            noteLimit: 100,
                          }
                        : undefined
                    }
                    data={data}
                    d={d}
                    onSave={saveInline}
                    onCancel={() => setInlineRevision((n) => n + 1)}
                  />
                </Panel>
                <Panel
                  title={ms ? "Ringkasan akaun" : "Account Summary"}
                  className="desktop-account-summary"
                  action={filter}
                >
                  <Breakdown
                    rows={data.accounts.map((a) => ({
                      id: a.id,
                      name: a.name,
                      amount: accountBalances.get(a.id) || 0n,
                    }))}
                    total={funds}
                    label={ms ? "Jumlah baki" : "Total Balance"}
                    d={d}
                    variant="account"
                    percentages={presentation?.accountPercentages}
                  />
                </Panel>
              </aside>
            </div>
          ) : null}
          {view === "account" ? (
            <div className="account-detail-stack">
              {balancePanel}
              {flows}
              <MonthlyChart
                range={chartRange}
                onRangeChange={setChartRange}
                data={{
                  ...data,
                  transactions: data.transactions.filter(
                    (t) => t.account_id === accountId,
                  ),
                }}
                asOf={asOf}
                locale={locale}
                d={d}
              />
              <Panel title={d.recent}>{activityList}</Panel>
            </div>
          ) : null}
          {view === "insights" ? (
            <>
              <MobileSpendingTrend
                data={data}
                period={period}
                asOf={asOf}
                d={d}
                locale={locale}
              />
              <h2 className="sr-only">
                {ms ? "Ringkasan kewangan" : "Financial summaries"}
              </h2>
              <div className="insight-summary-grid">{insightSummary}</div>
              <div className="insight-chart-grid">
                <Panel
                  title={
                    ms
                      ? "Perbelanjaan mengikut kategori"
                      : "Expenses by Category"
                  }
                  className="category-breakdown"
                  action={
                    <label className="category-chart-period">
                      <span className="sr-only">
                        {ms ? "Tempoh kategori" : "Category reporting period"}
                      </span>
                      <select
                        value={kind}
                        onChange={(e) => {
                          setKind(e.target.value);
                          setPage(1);
                        }}
                      >
                        {(
                          ["today", "week", "month", "all", "custom"] as const
                        ).map((v) => (
                          <option key={v} value={v}>
                            {d[v]}
                          </option>
                        ))}
                      </select>
                    </label>
                  }
                >
                  <p className="hint chart-help">{d.shareHelp}</p>
                  <Breakdown
                    rows={
                      presentation?.categoryPercentages
                        ? [...shares].sort(
                            (a, b) =>
                              data.categories.findIndex((c) => c.id === a.id) -
                              data.categories.findIndex((c) => c.id === b.id),
                          )
                        : shares
                    }
                    total={tally?.expenses || 0n}
                    label={ms ? "Jumlah perbelanjaan" : "Total Expenses"}
                    d={d}
                    percentages={presentation?.categoryPercentages}
                    arcWeights={presentation?.categoryArcWeights}
                  />
                  {period && shares.length ? (
                    <div className="insight-sources">
                      {shares.map((r) => (
                        <ExpenseSources
                          key={r.id}
                          data={data}
                          period={period!}
                          categoryId={r.id}
                          label={r.name}
                          locale={locale}
                          d={d}
                        />
                      ))}
                    </div>
                  ) : null}
                </Panel>
                <MonthlyChart
                  data={data}
                  range={chartRange}
                  onRangeChange={setChartRange}
                  asOf={asOf}
                  locale={locale}
                  d={d}
                  title={
                    ms ? "Perbandingan bulanan" : "Month-to-Month Comparison"
                  }
                  values={presentation?.monthly}
                />
              </div>
              <div className="insight-bottom-grid">
                {" "}
                <section className="rft-panel budget-progress" id="budgets">
                  <div className="section-row">
                    <h2>{ms ? "Kemajuan bajet" : "Budget Progress"}</h2>
                    <button
                      className="text-link"
                      onClick={() => setManager("budgets")}
                    >
                      {ms ? "Urus bajet" : "Manage Budgets"}
                    </button>
                  </div>
                  <p className="hint">{d.goalHelp}</p>
                  <BudgetProgress
                    data={data}
                    d={d}
                    warningIds={presentation?.budgetWarningIds}
                    onOpen={(b) => setBudgetInfo(b.id)}
                    onDelete={(id, table) => setDeleting({ id, table })}
                  />
                </section>
                <section id="goals">
                  <Panel
                    title={ms ? "Kemajuan matlamat" : "Goals Progress"}
                    action={
                      <button
                        className="text-link"
                        onClick={() => setManager("goals")}
                      >
                        {ms ? "Urus matlamat" : "Manage Goals"}
                      </button>
                    }
                  >
                    <SavingsProgress
                      goals={data.goals || []}
                      d={d}
                      locale={locale}
                      asOf={asOf}
                      onEdit={(g) => setForm({ kind: "goal", initial: g })}
                    />
                  </Panel>
                </section>
              </div>
              <section id="reports">
                <div className="comparison-context">
                  <h2>{d.comparison}</h2>
                  {comparison ? (
                    <p>
                      {money(comparison.newTotal)} {d.comparedWith}{" "}
                      {money(comparison.oldTotal)}. {d.difference}:{" "}
                      {money(comparison.difference)}.
                    </p>
                  ) : null}
                  <p>{d.comparisonHelp}</p>
                </div>
              </section>
              <ExpenseTrend data={data} asOf={asOf} locale={locale} d={d} />
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
              <section className="surface settings-section settings-profile">
                <h2>{ms ? "Profil" : "Profile"}</h2>
                <div className="settings-profile-row">
                  <span className="profile-avatar" aria-hidden="true">
                    {displayName
                      ? displayName.slice(0, 2).toUpperCase()
                      : "RFT"}
                  </span>
                  <div>
                    <b>{displayName || (ms ? "Akaun anda" : "Your account")}</b>
                    <p>{ms ? "Log masuk dengan Google" : "Google sign-in"}</p>
                  </div>
                </div>
              </section>
              <section className="surface settings-section settings-accounts">
                <h2>{d.accounts}</h2>
                <AccountOverview data={data} values={accountBalances} d={d} />
                <button
                  className="text-link"
                  onClick={() => setForm({ kind: "account" })}
                >
                  <Plus size={18} aria-hidden="true" />
                  {d.addAccount}
                </button>
              </section>
              <section className="surface settings-section settings-preferences">
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
                <Link className="settings-row" href="/app/categories">
                  <List />
                  <div>
                    <b>{d.categories}</b>
                    <p>{d.categoryHelp}</p>
                  </div>
                  <ChevronRight />
                </Link>
              </section>
              <section className="surface settings-section settings-security">
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
              <section className="surface settings-section" id="data">
                <h2>{d.data}</h2>
                <details className="export-options">
                  <summary>
                    <Download size={18} aria-hidden="true" />
                    {d.export}
                  </summary>
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
                </details>
                <hr />
                <button
                  className="text-link danger-text"
                  onClick={() => setDeleteAccount(true)}
                >
                  <Trash2 size={18} />
                  {d.deleteAccount}
                </button>
                <p className="delete-summary">
                  {ms
                    ? "Padam rekod RFT anda secara kekal."
                    : "Permanently remove your RFT records."}
                </p>
              </section>
              <details className="surface settings-install">
                <summary>{d.install}</summary>
                <p>{d.installHelp}</p>
                <div className="button-row">
                  <Link href="/privacy">{d.privacy}</Link>
                  <Link href="/terms">{d.terms}</Link>
                </div>
              </details>
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
            defaultDateTime={asOf}
            initial={form.initial}
            data={data}
            d={d}
            onSave={save}
            onCancel={() => setForm(null)}
            onDelete={
              form.initial &&
              (form.kind === "account_meta" || form.kind === "goal")
                ? () => {
                    const current = form;
                    setForm(null);
                    setDeleting({
                      id: current.initial!.id,
                      table: current.kind === "goal" ? "goals" : "accounts",
                    });
                  }
                : undefined
            }
          />
        ) : null}
      </Sheet>
      <Sheet
        open={!!budgetInfo}
        onOpenChange={(open) => {
          if (!open) setBudgetInfo(null);
        }}
        title={ms ? "Butiran bajet" : "Budget details"}
        close={d.close}
      >
        <BudgetProgress
          data={{
            ...data,
            budgets: data.budgets.filter((b) => b.id === budgetInfo),
          }}
          d={d}
          onDelete={(id, table) => {
            setBudgetInfo(null);
            setDeleting({ id, table });
          }}
        />
        <button
          className="button secondary"
          onClick={() => setBudgetInfo(null)}
        >
          {d.close}
        </button>
      </Sheet>
      <Sheet
        open={!!manager}
        onOpenChange={(open) => {
          if (!open) setManager(null);
        }}
        title={
          manager === "goals"
            ? ms
              ? "Urus matlamat"
              : "Manage Goals"
            : manager === "accounts"
              ? ms
                ? "Urus akaun"
                : "Manage Accounts"
              : ms
                ? "Urus bajet"
                : "Manage Budgets"
        }
        close={d.close}
      >
        <button
          className="button"
          onClick={() => {
            const kind =
              manager === "goals"
                ? "goal"
                : manager === "accounts"
                  ? "account"
                  : "budget";
            setManager(null);
            setForm({ kind });
          }}
        >
          <Plus size={18} aria-hidden="true" />
          {manager === "goals"
            ? d.addSavingsGoal
            : manager === "accounts"
              ? d.addAccount
              : d.addGoal}
        </button>
        {manager === "goals" ? (
          <SavingsProgress
            goals={data.goals}
            d={d}
            locale={locale}
            asOf={asOf}
            onEdit={(g) => {
              setManager(null);
              setForm({ kind: "goal", initial: g });
            }}
          />
        ) : manager === "accounts" ? (
          <AccountOverview
            data={data}
            values={accountBalances}
            d={d}
            onEdit={(a) => {
              setManager(null);
              setForm({ kind: "account_meta", initial: a });
            }}
          />
        ) : (
          <BudgetProgress
            data={data}
            d={d}
            onOpen={(b) => {
              setManager(null);
              setBudgetInfo(b.id);
            }}
            onDelete={(id, table) => {
              setManager(null);
              setDeleting({ id, table });
            }}
          />
        )}
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
