import { redirect } from "next/navigation";
import { loadSnapshot } from "./service";
import { FinanceApp } from "./finance-app";
import { currentLocale } from "@/i18n/server";
import { dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import { Brand } from "@/components/brand";
export async function ProtectedPage({
  view,
  accountId,
}: {
  view: React.ComponentProps<typeof FinanceApp>["view"];
  accountId?: string;
}) {
  const locale = await currentLocale();
  let loaded;
  try {
    loaded = await loadSnapshot();
  } catch (e) {
    const code = e instanceof Error ? e.message : "";
    if (code === "MFA_REQUIRED") redirect("/auth/mfa");
    if (code === "UNAUTHENTICATED" || code === "NOT_CONFIGURED")
      redirect("/login");
    const d = dictionary(locale);
    return (
      <>
        <header className="public-header">
          <Brand />
        </header>
        <main id="main" className="legal-page">
          <h1>{d.errors.LOAD_FAILED}</h1>
          <p>{d.errors.SAVE_FAILED}</p>
          <Link href="/app" className="button">
            {d.retry}
          </Link>
          <Link href="/login" className="text-link">
            {d.reauth}
          </Link>
        </main>
      </>
    );
  }
  return (
    <FinanceApp
      key={`${view}-${accountId || ""}`}
      initial={loaded.data}
      locale={locale}
      view={view}
      accountId={accountId}
      initialAsOf={new Date().toISOString()}
    />
  );
}
