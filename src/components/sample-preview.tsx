import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Wallet,
  Plus,
  Home,
  List,
  ChartNoAxesColumn,
  Settings,
} from "lucide-react";
import { balances, totals } from "@/domain/finance/calculations";
import { money } from "@/domain/finance/money";
import { sample } from "@/features/finance/sample";
import type { Dictionary } from "@/i18n/dictionaries";
const end = "2026-02-01T00:00:00Z";
export function SamplePreview({ d }: { d: Dictionary }) {
  const b = balances(sample, end),
    t = totals(sample.transactions, { start: null, end });
  return (
    <div className="sample-wrap">
      <p className="sample-label">{d.sample}</p>
      <div className="sample-app">
        <div className="sample-top">
          <b>RFT</b>
          <span>{d.home}</span>
        </div>
        <h2>{d.overview}</h2>
        <div className="balance-panel">
          <p>{d.estimated}</p>
          <strong>{money([...b.values()].reduce((a, v) => a + v, 0n))}</strong>
          <span>{d.estimateNote}</span>
          <div className="balance-motif" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
        <dl className="flow-grid">
          <div>
            <dt>
              <ArrowDownLeft size={17} />
              {d.income}
            </dt>
            <dd>{money(t.income)}</dd>
          </div>
          <div>
            <dt>
              <ArrowUpRight size={17} />
              {d.expenses}
            </dt>
            <dd>{money(t.expenses)}</dd>
          </div>
          <div>
            <dt>{d.net}</dt>
            <dd>{money(t.net)}</dd>
          </div>
        </dl>
        <div className="sample-history">
          <h3>{d.recent}</h3>
          {[
            {
              icon: ArrowLeftRight,
              title: d.transfer,
              amount: money(5000n),
              class: "teal",
            },
            {
              icon: ArrowUpRight,
              title: d.expense,
              amount: "−" + money(2490n),
              class: "rose",
            },
            {
              icon: ArrowDownLeft,
              title: d.income,
              amount: "+" + money(8000n),
              class: "teal",
            },
          ].map((row, i) => (
            <div className="activity-row" key={i}>
              <span className={`icon-disc ${row.class}`}>
                <row.icon size={20} />
              </span>
              <div>
                <b>{row.title}</b>
                <small>{i === 0 ? `${d.cash} → ${d.ewallet}` : d.cash}</small>
              </div>
              <strong>{row.amount}</strong>
            </div>
          ))}
        </div>
        <div className="sample-bottom" aria-hidden="true">
          <Home />
          <List />
          <span>
            <Plus />
          </span>
          <ChartNoAxesColumn />
          <Settings />
        </div>
      </div>
      <p className="sample-caption">
        <Wallet size={16} />
        {d.sampleHelp}
      </p>
    </div>
  );
}
