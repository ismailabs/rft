// Test-only component host, outside Next's app/public output. No auth bypass,
// database credentials, real persistence or hosted acceptance is provided here.
import React from "react";
import { createRoot } from "react-dom/client";
import { FinanceApp } from "@/features/finance/finance-app";
import { sample } from "@/features/finance/sample";
import { emptySnapshot } from "@/domain/finance/types";
import { fidelitySample } from "./fidelity-sample";
import { referenceSample, referencePresentation } from "./reference-sample";
import { PublicHome } from "@/components/public-home";
import { SamplePreview } from "@/components/sample-preview";
import { dictionary } from "@/i18n/dictionaries";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto/700.css";
import "@/app/globals.css";
import "@/app/recovery.css";
import "@/app/fidelity.css";
const params = new URLSearchParams(location.search);
const locale = params.get("locale") === "ms" ? "ms" : "en";
document.documentElement.lang = locale;
const views = {
  home: "home",
  activity: "activity",
  accounts: "accounts",
  insights: "insights",
  settings: "settings",
  categories: "categories",
  account: "account",
} as const;
const key = params.get("view") as keyof typeof views;
const data = params.has("empty")
  ? emptySnapshot()
  : params.has("reference")
    ? referenceSample(key)
    : params.has("fidelity")
      ? fidelitySample()
      : structuredClone(sample);
if (params.has("stress")) {
  data.accounts[0].name = "Synthetic long account name ".repeat(2).slice(0, 60);
  data.accounts[0].opening_balance = "9999999999999999.99";
  data.transactions[1].amount = "9999999999999999.99";
  data.transactions[1].note = "Synthetic long transaction note "
    .repeat(8)
    .slice(0, 300);
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <aside
      className={params.has("reference") ? "sr-only" : "test-only-banner"}
      aria-label="Isolated test environment"
    >
      Isolated synthetic UI test — no real account or database
    </aside>
    {params.get("view") === "homepage" ? (
      <PublicHome
        locale={locale}
        preview={
          <SamplePreview
            d={dictionary(locale)}
            sample={data}
            presentation={referencePresentation("home")}
          />
        }
      />
    ) : (
      <FinanceApp
        accountId={key === "account" ? data.accounts[0]?.id : undefined}
        initial={data}
        locale={locale}
        view={views[key] || "home"}
        initialAsOf={
          params.has("fidelity") || params.has("reference")
            ? "2026-10-24T04:00:00.000Z"
            : "2026-01-20T04:00:00.000Z"
        }
        displayName={
          params.has("reference")
            ? "Amirul"
            : params.has("fidelity")
              ? "Sample"
              : ""
        }
        presentation={
          params.has("reference") && !params.has("calculated")
            ? referencePresentation(key)
            : undefined
        }
      />
    )}
  </React.StrictMode>,
);
