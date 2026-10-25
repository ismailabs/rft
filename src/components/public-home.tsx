import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  ChartNoAxesColumn,
  Check,
  Zap,
  Map,
  Users,
  Target,
  PieChart,
  Menu,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { GoogleAction } from "@/components/google-action";
import { LocaleSwitch } from "@/components/locale-switch";
import { SamplePreview } from "@/components/sample-preview";
import type { Locale } from "@/domain/finance/types";
import type { ReactNode } from "react";
import { dictionary } from "@/i18n/dictionaries";
export function PublicHome({
  locale,
  preview,
}: {
  locale: Locale;
  preview?: ReactNode;
}) {
  const d = dictionary(locale),
    ms = locale === "ms";
  const features = [
    {
      Icon: CreditCard,
      title: ms ? "Semua catatan akaun anda" : "Track All Your Accounts",
      text: ms
        ? "Catat bank, tunai dan e-dompet di satu tempat."
        : "Record your bank accounts and eWallets to see everything in one place.",
    },
    {
      Icon: ChartNoAxesColumn,
      title: ms ? "Fahami perbelanjaan anda" : "Understand Your Spending",
      text: ms
        ? "Lihat pecahan jelas mengikut kategori."
        : "See clear breakdowns by category and merchant.",
    },
    {
      Icon: PieChart,
      title: ms ? "Tetapkan bajet" : "Set Budgets",
      text: ms
        ? "Pantau perbelanjaan dengan had bulanan pilihan."
        : "Keep your spending in check with flexible budgets.",
    },
    {
      Icon: Target,
      title: ms ? "Capai matlamat anda" : "Reach Your Goals",
      text: ms
        ? "Catat kemajuan simpanan anda untuk matlamat peribadi."
        : "Save for what matters — whether it’s a holiday, a new gadget or your future.",
    },
  ];
  return (
    <div className="homepage-recovered">
      <header className="public-header">
        <Brand />
        <nav aria-label="Main">
          <Link href="#features">{ms ? "Ciri" : "Features"}</Link>
          <Link href="#why">{ms ? "Mengapa RFT" : "Why RFT"}</Link>
          <Link href="#security">{ms ? "Keselamatan" : "Security"}</Link>
          <Link href="#free">{ms ? "Harga" : "Pricing"}</Link>
          <Link href="#faq">FAQ</Link>
        </nav>
        <LocaleSwitch locale={locale} />
        <Link className="button secondary small sign-in-link" href="/login">
          {ms ? "Log masuk" : "Sign in"}
        </Link>
        <GoogleAction
          label={ms ? d.getStarted : "Sign in with Google"}
          className="header-google"
        />
        <details className="public-mobile-menu">
          <summary aria-label={ms ? "Menu navigasi" : "Navigation menu"}>
            <Menu size={22} />
          </summary>
          <nav aria-label={ms ? "Navigasi mudah alih" : "Mobile navigation"}>
            <Link href="#features">{ms ? "Ciri" : "Features"}</Link>
            <Link href="#security">{d.security}</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
        </details>
      </header>
      <main id="main">
        <section className="concept-a-hero">
          <div className="concept-a-copy">
            <div className="marketing-pill">
              <ChartNoAxesColumn size={18} />
              {ms
                ? "Kewangan peribadi, untuk Malaysia"
                : "Personal finance, made for Malaysia"}
            </div>
            <h1>
              {ms ? (
                <>
                  Jejaki wang anda.
                  <br />
                  Esok yang <em>lebih cerah.</em>
                </>
              ) : (
                <>
                  Track your money.
                  <br />A <em>brighter</em> tomorrow.
                </>
              )}
            </h1>
            <p>
              {ms
                ? "RFT membantu anda mencatat perbelanjaan, mengurus bajet dan mencapai matlamat — semuanya dalam Ringgit, untuk rakyat Malaysia."
                : "RFT helps you track spending, manage budgets and reach your goals — all in Ringgit, built for Malaysians."}
            </p>
            <div className="hero-actions">
              <GoogleAction
                label={ms ? d.getStarted : "Sign in with Google"}
                className="google-primary"
              />
              <Link className="button secondary" href="#features">
                {ms ? "Terokai ciri" : "Explore Features"}
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hero-assurances">
              {[
                ms ? "Percuma digunakan" : "Free to use",
                ms ? "Catatan peribadi" : "Private records",
                ms ? "Untuk Malaysia" : "Built for Malaysia",
              ].map((text) => (
                <span key={text}>
                  <Check size={16} />
                  {text}
                </span>
              ))}
            </div>
          </div>
          {preview ?? <SamplePreview d={d} />}
        </section>
        <section
          id="why"
          className="benefit-strip"
          aria-label={ms ? "Mengapa RFT" : "Why RFT"}
        >
          <p className="benefit-eyebrow">
            {ms
              ? "UNTUK RAKYAT MALAYSIA YANG MAHU KEWANGAN LEBIH JELAS"
              : "FOR MALAYSIANS WHO WANT A CLEARER FINANCIAL FUTURE"}
          </p>
          {[
            {
              Icon: Zap,
              title: ms ? "Mudah digunakan" : "Simple & intuitive",
              text: ms ? "Mulakan dengan satu catatan" : "Start with one entry",
            },
            {
              Icon: ShieldCheck,
              title: ms ? "Keselamatan akaun" : "Account protection",
              text: ms
                ? "Google dan pengesah pilihan"
                : "Google sign-in and optional MFA",
            },
            {
              Icon: Map,
              title: ms ? "Untuk Malaysia" : "Made for Malaysia",
              text: ms
                ? "Ringgit, bank dan e-dompet tempatan"
                : "Ringgit, local banks & eWallets",
            },
            {
              Icon: Users,
              title: ms ? "Bina tabiat lebih baik" : "Build better habits",
              text: ms
                ? "Catat, fahami dan renungkan"
                : "Track, understand and reflect",
            },
          ].map((x) => (
            <article key={x.title}>
              <x.Icon size={31} strokeWidth={1.6} />
              <div>
                <h2>{x.title}</h2>
                <p>{x.text}</p>
              </div>
            </article>
          ))}
        </section>
        <section id="features" className="concept-features">
          <div className="features-heading">
            <p>{ms ? "Ciri utama" : "Key features"}</p>
            <h2>
              {ms ? (
                "Semua yang anda perlukan untuk memahami kewangan anda"
              ) : (
                <>
                  Everything you need to take
                  <br />
                  control of your finances
                </>
              )}
            </h2>
            <span>
              {ms
                ? "Alat mudah, gambaran jelas — untuk kegunaan harian."
                : "Simple tools, clear insights — designed for everyday Malaysians."}
            </span>
          </div>
          <div className="feature-card-grid">
            {features.map(({ Icon, title, text }, i) => (
              <Link href="/preview" className="feature-card" key={title}>
                <span className={`feature-icon feature-${i}`}>
                  <Icon size={28} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </section>
        <section className="privacy-band" id="security">
          <ShieldCheck size={40} />
          <div>
            <h2>{d.security}</h2>
            <p>{d.mfaHelp}</p>
          </div>
          <Link href="/privacy" className="text-link">
            {d.privacy}
            <ArrowRight size={18} />
          </Link>
        </section>
        <section id="free" className="free-band">
          <h2>{d.free}</h2>
          <p>
            {d.noBank}. {d.noAI}.
          </p>
          <Link href="/preview" className="text-link">
            {d.seePreview}
            <ArrowRight size={18} />
          </Link>
        </section>
        <section id="faq" className="faq-section">
          <div>
            <h2>{d.faq}</h2>
            <p>{d.manual}</p>
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
          {d.free} · {ms ? "Dihasilkan oleh " : "Made by "}
          <a href="https://ismailstudio.my">Ismail Studio</a>
        </p>
        <Link href="/privacy">{d.privacy}</Link>
        <Link href="/terms">{d.terms}</Link>
      </footer>
    </div>
  );
}
