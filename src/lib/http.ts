import { NextResponse } from "next/server";
export function safeError(error: unknown) {
  const known = [
    "NOT_CONFIGURED",
    "UNAUTHENTICATED",
    "MFA_REQUIRED",
    "INVALID_MFA_CODE",
    "REAUTH_REQUIRED",
    "VALIDATION_FAILED",
    "CONFLICT",
    "RECORD_NOT_ALLOWED",
    "LOAD_FAILED",
    "SAVE_FAILED",
    "DELETION_UNAVAILABLE",
  ];
  const code =
    error instanceof Error && known.includes(error.message)
      ? error.message
      : "SERVER_UNAVAILABLE";
  const status =
    code === "UNAUTHENTICATED"
      ? 401
      : code === "MFA_REQUIRED" || code === "REAUTH_REQUIRED"
        ? 403
        : code === "VALIDATION_FAILED" || code === "INVALID_MFA_CODE"
          ? 400
          : code === "CONFLICT" || code === "RECORD_NOT_ALLOWED"
            ? 409
            : 503;
  return NextResponse.json(
    { error: code },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}
export function assertSameOrigin(request: Request) {
  const expected =
    process.env.NEXT_PUBLIC_APP_ORIGIN || new URL(request.url).origin;
  if (request.headers.get("origin") !== expected)
    throw new Error("UNAUTHENTICATED");
}
export async function limitedJson(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("VALIDATION_FAILED");
  if (Number(request.headers.get("content-length") || 0) > 16384)
    throw new Error("VALIDATION_FAILED");
  const text = await request.text();
  if (text.length > 16384) throw new Error("VALIDATION_FAILED");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("VALIDATION_FAILED");
  }
}
