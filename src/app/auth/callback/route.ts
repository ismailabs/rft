import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const url = new URL(request.url),
    code = url.searchParams.get("code");
  if (code)
    try {
      const client = await serverClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error)
        return NextResponse.redirect(
          new URL("/app", process.env.NEXT_PUBLIC_APP_ORIGIN || url.origin),
        );
    } catch {}
  return NextResponse.redirect(
    new URL(
      "/login?error=oauth",
      process.env.NEXT_PUBLIC_APP_ORIGIN || url.origin,
    ),
  );
}
