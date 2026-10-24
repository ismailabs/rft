import { loadSnapshot } from "@/features/finance/service";
import { requireRecentOAuth } from "@/lib/supabase/auth";
import { exportCsv } from "@/domain/finance/csv";
import { periodFor } from "@/domain/finance/periods";
import { safeError } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { data, client } = await loadSnapshot();
    await requireRecentOAuth(client);
    const params = new URL(request.url).searchParams;
    const period = periodFor(
      params.get("period") || "all",
      new Date(),
      params.get("from") || undefined,
      params.get("to") || undefined,
    );
    return new Response(exportCsv(data, period), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="rft-transactions.csv"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    return safeError(e);
  }
}
