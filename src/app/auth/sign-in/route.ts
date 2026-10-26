import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { assertSameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const client = await serverClient();
    const origin =
      process.env.NEXT_PUBLIC_APP_ORIGIN || new URL(request.url).origin;
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error || !data.url) throw new Error("OAUTH_FAILED");
    return NextResponse.redirect(data.url, 303);
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=setup", request.url),
      303,
    );
  }
}
