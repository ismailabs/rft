import {
  Home,
  List,
  Wallet,
  ChartNoAxesColumn,
  Settings,
  Tag,
  Search,
  PieChart,
  Target,
  Download,
  Plus,
  Sparkles,
  Utensils,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import { balances, totals } from "@/domain/finance/calculations";
import { monthlyReport } from "@/domain/finance/reporting";
import { marketingExample } from "@/features/finance/marketing-example";
import type { Snapshot } from "@/domain/finance/types";
import type { FinancePresentation } from "@/features/finance/presentation";
import { Brand } from "@/components/brand";
import {
  MonthlyChart,
  AccountOverview,
  BalanceSummary,
  FlowSummary,
  Panel,
  FactualInsight,
} from "@/features/finance/visual-components";
import type { Dictionary } from "@/i18n/dictionaries";

/** Actual shared React UI with labeled synthetic manual records. No session,
 * mutations, bank connection or API access belongs to this illustration. */
export function SamplePreview({
  d,
  sample = marketingExample,
  presentation,
}: {
  d: Dictionary;
  sample?: Snapshot;
  presentation?: FinancePresentation;
}) {
  const asOf = "2026-10-24T04:00:00.000Z",
    end = "2026-10-24T04:00:00.001Z";
  const b = balances(sample, end),
    t = totals(sample.transactions, { start: "2026-09-30T16:00:00.000Z", end });
  const locale = d.home === "Utama" ? "ms" : "en",
    ms = locale === "ms";
  const descriptions = Object.fromEntries(
    sample.accounts.map((a, i) => [
      a.id,
      i < 3 ? (i === 1 ? "Current Account" : "Savings Account") : "eWallet",
    ]),
  );
  return (
    <div className="desktop-preview-wrap">
      <div className="preview-window" aria-hidden="true" inert>
        <div className="preview-native-canvas">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <aside className="preview-native-sidebar">
            <Brand />
            {[
              { Icon: Home, label: ms ? "Gambaran" : "Dashboard" },
              { Icon: List, label: ms ? "Transaksi" : "Transactions" },
              { Icon: Wallet, label: d.accounts },
              { Icon: PieChart, label: ms ? "Bajet" : "Budgets" },
              { Icon: Target, label: ms ? "Matlamat" : "Goals" },
              { Icon: ChartNoAxesColumn, label: ms ? "Laporan" : "Reports" },
              { Icon: Tag, label: d.categories },
              { Icon: Download, label: ms ? "Eksport data" : "Data export" },
              { Icon: Settings, label: d.settings },
            ].map(({ Icon, label }, i) => (
              <div className={i === 0 ? "active" : ""} key={label}>
                <Icon size={23} />
                {label}
              </div>
            ))}
          </aside>
          <div className="preview-native-body">
            <header className="preview-native-header">
              <span>
                <Search size={22} />
                {ms
                  ? "Cari transaksi, peniaga, kategori…"
                  : "Search transactions, merchants, categories…"}
              </span>
              <span className="preview-native-profile">
                <b>AM</b> Amirul <ChevronDown size={17} />
              </span>
            </header>
            <div className="preview-native-main">
              <div className="preview-native-heading">
                <div>
                  <h2>
                    {ms ? "Selamat pagi, Amirul" : "Good morning, Amirul"}
                  </h2>
                  <p>
                    {ms
                      ? "Gambaran kewangan anda untuk Oktober 2026."
                      : "Here's your financial overview for October 2026."}
                  </p>
                </div>
                <span>
                  <CalendarDays size={22} />
                  Oct 1, 2026 – Oct 31, 2026
                  <ChevronDown size={18} />
                </span>
              </div>
              <div className="reference-dashboard">
                <div className="primary-stack">
                  <BalanceSummary
                    amount={
                      presentation?.balance ??
                      [...b.values()].reduce((n, v) => n + v, 0n)
                    }
                    d={d}
                    asOf={asOf}
                    locale={locale}
                    series={
                      presentation?.balanceSeries ||
                      monthlyReport(sample, asOf).map((r) => r.closing)
                    }
                    change={presentation?.balanceChange}
                  />
                  <FlowSummary
                    {...(presentation?.flows || t)}
                    changes={presentation?.flowChanges}
                    d={d}
                  />
                  <MonthlyChart
                    data={sample}
                    asOf={asOf}
                    locale={locale}
                    d={d}
                    values={presentation?.monthly}
                  />
                </div>
                <div className="secondary-stack">
                  <Panel
                    title={d.accounts}
                    action={
                      <span className="text-link">
                        {ms ? "Urus" : "Manage"}
                      </span>
                    }
                  >
                    <AccountOverview
                      data={sample}
                      values={b}
                      d={d}
                      descriptions={descriptions}
                    />
                    <div className="preview-add-account">
                      <Plus size={20} />
                      {d.addAccount}
                    </div>
                  </Panel>
                  <Panel title={d.insights} className="dashboard-insights">
                    <Sparkles className="insights-heading-icon" size={25} />
                    <FactualInsight
                      title={
                        presentation?.insights?.[0]?.title ||
                        (ms
                          ? "Perbelanjaan mengikut kategori"
                          : "Dining out made up 24% of your expenses this month.")
                      }
                      tone="amber"
                      icon={Utensils}
                    >
                      {presentation?.insights?.[0]?.detail ||
                        (ms
                          ? "Contoh catatan manual."
                          : "That's RM 876.20 in this illustrative month.")}
                    </FactualInsight>
                  </Panel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="sample-label">
        {d.sample} ·{" "}
        {ms
          ? "Catatan manual, bukan sambungan bank"
          : "Manual records, not bank-connected"}
      </p>
      <p className="sample-caption">{d.sampleHelp}</p>
    </div>
  );
}
