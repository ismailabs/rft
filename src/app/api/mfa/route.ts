import { z } from "zod";
import { verifiedIdentity, requireRecentOAuth } from "@/lib/supabase/auth";
import { assertSameOrigin, limitedJson, safeError } from "@/lib/http";
const schema = z.discriminatedUnion("operation", [
  z
    .object({
      operation: z.literal("enroll"),
      name: z.string().trim().min(1).max(50),
    })
    .strict(),
  z
    .object({
      operation: z.literal("verify"),
      factorId: z.uuid(),
      code: z.string().regex(/^\d{6}$/),
    })
    .strict(),
  z.object({ operation: z.literal("unenroll"), factorId: z.uuid() }).strict(),
]);
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const parsed = schema.safeParse(await limitedJson(request));
    if (!parsed.success) throw new Error("VALIDATION_FAILED");
    const m = parsed.data,
      { client, factors, assurance } = await verifiedIdentity(false);
    if (m.operation === "enroll" || m.operation === "unenroll") {
      await requireRecentOAuth(client);
      if (
        factors.totp.some((f) => f.status === "verified") &&
        assurance.currentLevel !== "aal2"
      )
        throw new Error("MFA_REQUIRED");
    }
    if (m.operation === "enroll") {
      const { data, error } = await client.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: m.name,
        issuer: "Ringgit Finance Tracker",
      });
      if (error) throw new Error("SAVE_FAILED");
      return Response.json(
        { id: data.id, qr: data.totp.qr_code, secret: data.totp.secret },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const factor = factors.all.find(
      (f) => f.id === m.factorId && f.factor_type === "totp",
    );
    if (!factor) throw new Error("RECORD_NOT_ALLOWED");
    if (m.operation === "verify") {
      const { error } = await client.auth.mfa.challengeAndVerify({
        factorId: m.factorId,
        code: m.code,
      });
      if (error) throw new Error("INVALID_MFA_CODE");
    } else {
      const { error } = await client.auth.mfa.unenroll({
        factorId: m.factorId,
      });
      if (error) throw new Error("SAVE_FAILED");
      await client.auth.refreshSession();
    }
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return safeError(e);
  }
}
