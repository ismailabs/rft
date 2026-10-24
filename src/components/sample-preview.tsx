import {
  Home,
  List,
  Wallet,
  ChartNoAxesColumn,
  Settings,
  Tag,
  Search,
  ArrowDown,
  ArrowUp,
  Equal,
} from "lucide-react";
import { balances, totals } from "@/domain/finance/calculations";
import { monthlyReport } from "@/domain/finance/reporting";
import { money } from "@/domain/finance/money";
import { marketingExample as sample } from "@/features/finance/marketing-example";
import { LeafMark } from "@/components/brand";
import {
  MonthlyChart,
  AccountOverview,
  BalanceSummary,
} from "@/features/finance/visual-components";
import type { Dictionary } from "@/i18n/dictionaries";

/** Real DOM preview, with synthetic data explicitly labeled outside its scaled frame. */
export function SamplePreview({ d }: { d: Dictionary }) {
  const asOf = "2026-10-24T04:00:00.000Z",
    end = "2026-10-24T04:00:00.001Z";
  const b = balances(sample, end),
    t = totals(sample.transactions, { start: "2026-09-30T16:00:00.000Z", end });
  const locale = d.home === "Utama" ? "ms" : "en";
  return (
    <div className="desktop-preview-wrap">
      <div className="preview-window" aria-hidden="true" inert>
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="preview-dashboard">
          <aside>
            <div className="preview-brand">
              <LeafMark />
              <b>
                RFT<small>Ringgit Finance Tracker</small>
              </b>
            </div>
            {[
              { Icon: Home, label: d.home },
              { Icon: List, label: d.activity },
              { Icon: Wallet, label: d.accounts },
              { Icon: ChartNoAxesColumn, label: d.insights },
              { Icon: Tag, label: d.categories },
              { Icon: Settings, label: d.settings },
            ].map((n, i) => (
              <div className={i === 0 ? "active" : ""} key={n.label}>
                <n.Icon size={19} />
                {n.label}
              </div>
            ))}
          </aside>
          <div className="preview-main">
            <div className="preview-topbar">
              <Search size={16} />
              {d.search}
              <span>MYR</span>
            </div>
            <div className="preview-dashboard-page">
              <h2>
                {locale === "ms"
                  ? "Gambaran kewangan anda"
                  : "Your financial overview"}
              </h2>
              <p>{d.overviewIntro}</p>
              <div className="preview-grid">
                <div>
                  <BalanceSummary
                    amount={[...b.values()].reduce((n, v) => n + v, 0n)}
                    d={d}
                    asOf={asOf}
                    locale={locale}
                    series={monthlyReport(sample, asOf).map((r) => r.closing)}
                  />
                  <dl className="preview-metrics">
                    {[
                      { label: d.income, value: t.income, Icon: ArrowDown },
                      { label: d.expenses, value: t.expenses, Icon: ArrowUp },
                      { label: d.net, value: t.net, Icon: Equal },
                    ].map((x) => (
                      <div key={x.label}>
                        <x.Icon size={19} />
                        <dt>{x.label}</dt>
                        <dd>{money(x.value)}</dd>
                      </div>
                    ))}
                  </dl>
                  <MonthlyChart
                    data={sample}
                    asOf={asOf}
                    locale={locale}
                    d={d}
                  />
                </div>
                <section className="preview-accounts">
                  <h3>{d.accounts}</h3>
                  <AccountOverview data={sample} values={b} d={d} />
                  <div className="preview-insight">
                    <h3>{d.insights}</h3>
                    <p>{d.sampleHelp}</p>
                    <p>{d.estimateNote}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="sample-label">{d.sample}</p>
      <p className="sample-caption">{d.sampleHelp}</p>
    </div>
  );
}
