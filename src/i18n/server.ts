import { cookies } from "next/headers";
import type { Locale } from "@/domain/finance/types";
export async function currentLocale(): Promise<Locale> {
  return (await cookies()).get("rft-locale")?.value === "ms" ? "ms" : "en";
}
