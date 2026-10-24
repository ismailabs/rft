import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  ShieldCheck,
  Wallet,
  ChartNoAxesColumn,
  Check,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { LocaleSwitch } from "@/components/locale-switch";
import { SamplePreview } from "@/components/sample-preview";
import { currentLocale } from "@/i18n/server";
import { dictionary } from "@/i18n/dictionaries";
export default async function HomePage() {
  const locale = await currentLocale(),
    d = dictionary(locale);
  return (
    <>
      <header className="public-header">
        <Brand />
        <nav aria-label="Main">
          <Link href="#how">{d.how.split(".")[0]}</Link>
          <Link href="/privacy">{d.privacy}</Link>
        </nav>
        <LocaleSwitch locale={locale} />
        <Link className="button small" href="/login">
          {d.getStarted}
          <ArrowRight size={17} />
        </Link>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-stamp">
              <span />
              Ringgit Finance Tracker
            </div>
            <h1>{d.title}</h1>
            <p className="hero-description">{d.subtitle}</p>
            <div className="hero-actions">
              <Link href="/login" className="button">
                {d.getStarted}
                <ArrowRight size={19} />
              </Link>
              <Link href="/preview" className="text-link">
                {d.seePreview}
              </Link>
            </div>
            <p className="manual-note">
              <ShieldCheck size={18} />
              {d.manual}
            </p>
            <div className="hero-assurances">
              <span>
                <Check size={15} />
                {d.free}
              </span>
              <span>
                <Check size={15} />
                MYR · EN / BM
              </span>
            </div>
          </div>
          <SamplePreview d={d} />
        </section>
        <section id="how" className="how-section">
          <div className="section-heading">
            <span className="section-line" />
            <h2>{d.how}</h2>
          </div>
          <div className="how-grid">
            {[
              { icon: Wallet, title: d.how1, text: d.how1Help },
              { icon: ArrowLeftRight, title: d.how2, text: d.how2Help },
              { icon: ChartNoAxesColumn, title: d.how3, text: d.how3Help },
            ].map((x) => (
              <article key={x.title}>
                <x.icon size={29} strokeWidth={1.5} />
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="privacy-band">
          <ShieldCheck size={42} strokeWidth={1.5} />
          <div>
            <h2>{d.data}</h2>
            <p>{d.faq3Help}</p>
          </div>
          <Link href="/privacy" className="text-link">
            {d.privacy}
            <ArrowRight size={18} />
          </Link>
        </section>
        <section className="faq-section">
          <div>
            <BookOpen size={29} />
            <h2>{d.faq}</h2>
            <p>
              {d.noAI}. {d.noBank}.
            </p>
          </div>
          <div>
            {[
              [d.faq1, d.faq1Help],
              [d.faq2, d.faq2Help],
              [d.faq3, d.faq3Help],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <Brand />
        <p>
          {d.free}. {d.manual}
        </p>
        <Link href="/privacy">{d.privacy}</Link>
        <Link href="/terms">{d.terms}</Link>
      </footer>
    </>
  );
}
