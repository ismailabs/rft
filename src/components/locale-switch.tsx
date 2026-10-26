"use client";
import { useRouter } from "next/navigation";
import type { Locale } from "@/domain/finance/types";
export function LocaleSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();
  return (
    <div className="locale-switch" aria-label="Language / Bahasa">
      {(["en", "ms"] as const).map((l) => (
        <button
          key={l}
          aria-pressed={locale === l}
          onClick={() => {
            document.cookie = `rft-locale=${l}; Path=/; SameSite=Lax; Max-Age=31536000${location.protocol === "https:" ? "; Secure" : ""}`;
            router.refresh();
          }}
        >
          {l === "en" ? "EN" : "BM"}
        </button>
      ))}
    </div>
  );
}
