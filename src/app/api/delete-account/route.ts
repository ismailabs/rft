import { createClient } from "@supabase/supabase-js";
import { loadSnapshot } from "@/features/finance/service";
import { requireRecentOAuth } from "@/lib/supabase/auth";
import { assertSameOrigin, limitedJson, safeError } from "@/lib/http";
import { supabaseConfig } from "@/lib/supabase/config";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = (await limitedJson(request)) as { confirmation?: unknown };
    if (body?.confirmation !== "DELETE RFT")
      throw new Error("VALIDATION_FAILED");
    const { client, user } = await loadSnapshot();
    await requireRecentOAuth(client);
    const config = supabaseConfig(),
      secret = process.env.SUPABASE_SECRET_KEY;
    if (!config || !secret) throw new Error("DELETION_UNAVAILABLE");
    const admin = createClient(config.url, secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: session, error: sessionError } =
      await client.auth.getSession();
    if (sessionError || !session.session) throw new Error("UNAUTHENTICATED");
    const revoked = await admin.auth.admin.signOut(
      session.session.access_token,
      "global",
    );
    if (revoked.error) throw new Error("SAVE_FAILED");
    const deleted = await admin.auth.admin.deleteUser(user.id);
    if (deleted.error) throw new Error("SAVE_FAILED");
    await client.auth.signOut({ scope: "local" });
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return safeError(e);
  }
}
