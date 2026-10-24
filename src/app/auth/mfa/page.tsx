import { redirect } from "next/navigation";
import { verifiedIdentity } from "@/lib/supabase/auth";
import { currentLocale } from "@/i18n/server";
import { MfaClient } from "@/features/auth/mfa-client";
import { Brand } from "@/components/brand";
import { LocaleSwitch } from "@/components/locale-switch";
export const dynamic = "force-dynamic";
export default async function MfaPage() {
  const locale = await currentLocale();
  let identity;
  try {
    identity = await verifiedIdentity(false);
  } catch {
    redirect("/login");
  }
  return (
    <>
      <header className="public-header">
        <Brand />
        <LocaleSwitch locale={locale} />
      </header>
      <main id="main">
        <MfaClient
          key={
            identity.factors.all.map((f) => f.id + f.status).join() +
            identity.assurance.currentLevel
          }
          locale={locale}
          factors={identity.factors.all.filter((f) => f.factor_type === "totp")}
          level={identity.assurance.currentLevel}
        />
      </main>
    </>
  );
}
