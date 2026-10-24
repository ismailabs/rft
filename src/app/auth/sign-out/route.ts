import { NextResponse } from "next/server";
import { verifiedIdentity } from "@/lib/supabase/auth";
import { assertSameOrigin, safeError } from "@/lib/http";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { client } = await verifiedIdentity(false);
    const { error } = await client.auth.signOut();
    if (error) throw new Error("SAVE_FAILED");
    return NextResponse.redirect(new URL("/login", request.url), 303);
  } catch (e) {
    return safeError(e);
  }
}
