import { NextResponse } from "next/server";
import { loadSnapshot, mutateFinance } from "@/features/finance/service";
import { assertSameOrigin, limitedJson, safeError } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { data } = await loadSnapshot();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return safeError(e);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    return NextResponse.json(await mutateFinance(await limitedJson(request)));
  } catch (e) {
    return safeError(e);
  }
}
