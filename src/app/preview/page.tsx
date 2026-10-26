import Link from "next/link";
import { Brand } from "@/components/brand";
import { LocaleSwitch } from "@/components/locale-switch";
import { SamplePreview } from "@/components/sample-preview";
import { currentLocale } from "@/i18n/server";
import { dictionary } from "@/i18n/dictionaries";
export default async function Preview() {
  const l = await currentLocale(),
    d = dictionary(l);
  return (
    <>
      <header className="public-header">
        <Brand />
        <LocaleSwitch locale={l} />
        <Link className="button" href="/login">
          {d.getStarted}
        </Link>
      </header>
      <main id="main" className="preview-page">
        <h1>{d.seePreview}</h1>
        <p>{d.sampleHelp}</p>
        <SamplePreview d={d} />
        <p>{d.manual}</p>
      </main>
    </>
  );
}
