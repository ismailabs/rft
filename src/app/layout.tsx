import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto/700.css";
import "./globals.css";
import "./recovery.css";
import "./fidelity.css";
import { currentLocale } from "@/i18n/server";
import { Pwa } from "@/components/pwa";
export const metadata: Metadata = {
  title: { default: "RFT — Ringgit Finance Tracker", template: "%s | RFT" },
  description:
    "Manually record your ringgit and understand your everyday spending. A free, non-commercial Malaysian finance tracker.",
  robots: { index: false, follow: true },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/rft-192.png", apple: "/icons/rft-192.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008565",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await currentLocale();
  return (
    <html lang={locale}>
      <body>
        <a href="#main" className="skip">
          {locale === "ms" ? "Langkau ke kandungan" : "Skip to content"}
        </a>
        {children}
        <Pwa />
      </body>
    </html>
  );
}
