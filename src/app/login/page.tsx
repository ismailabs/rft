import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { LocaleSwitch } from "@/components/locale-switch";
import { dictionary } from "@/i18n/dictionaries";
import { currentLocale } from "@/i18n/server";
import { supabaseConfig } from "@/lib/supabase/config";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const l = await currentLocale(),
    d = dictionary(l),
    { error } = await searchParams;
  const configured = !!supabaseConfig();
  return (
    <>
      <header className="public-header">
        <Brand />
        <LocaleSwitch locale={l} />
      </header>
      <main id="main" className="auth-layout">
        <div className="auth-art">
          <ShieldCheck size={62} strokeWidth={1.2} />
          <h1>{d.loginIntro}</h1>
          <p>{d.manual}</p>
        </div>
        <section className="auth-form">
          <h2>{configured ? d.getStarted : d.unavailable}</h2>
          <p>{configured ? d.loginHelp : d.configHelp}</p>
          {error ? (
            <p role="alert" className="error">
              {error === "oauth"
                ? d.errors.UNAUTHENTICATED
                : d.errors.NOT_CONFIGURED}
            </p>
          ) : null}
          {configured ? (
            <form method="post" action="/auth/sign-in">
              <button className="button wide" type="submit">
                {d.getStarted}
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <Link href="/preview" className="button">
              {d.seePreview}
            </Link>
          )}
          <p className="fine-print">
            <Link href="/privacy">{d.privacy}</Link> ·{" "}
            <Link href="/terms">{d.terms}</Link>
          </p>
        </section>
      </main>
    </>
  );
}
