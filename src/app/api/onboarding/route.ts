import { verifiedIdentity } from "@/lib/supabase/auth";
import { assertSameOrigin, safeError, limitedJson } from "@/lib/http";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = (await limitedJson(request)) as { locale?: unknown };
    if (body.locale !== "en" && body.locale !== "ms")
      throw new Error("VALIDATION_FAILED");
    const { client } = await verifiedIdentity();
    const { error } = await client.rpc("initialize_profile", {
      chosen_locale: body.locale,
    });
    if (error) throw new Error("SAVE_FAILED");
    return Response.json({ ok: true });
  } catch (e) {
    return safeError(e);
  }
}
