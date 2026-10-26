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
  initialSearch,
}: {
  view: React.ComponentProps<typeof FinanceApp>["view"];
  accountId?: string;
  initialSearch?: string;
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
      initialSearch={initialSearch}
      initialAsOf={new Date().toISOString()}
      displayName={
        typeof loaded.user.user_metadata?.given_name === "string"
          ? loaded.user.user_metadata.given_name.slice(0, 60)
          : typeof loaded.user.user_metadata?.full_name === "string"
            ? loaded.user.user_metadata.full_name.split(" ")[0].slice(0, 60)
            : ""
      }
    />
  );
}
