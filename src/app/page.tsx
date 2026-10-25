import { currentLocale } from "@/i18n/server";
import { PublicHome } from "@/components/public-home";
export default async function HomePage() {
  return <PublicHome locale={await currentLocale()} />;
}
