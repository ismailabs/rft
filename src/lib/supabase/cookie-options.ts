/** Match the fixed application origin; local HTTP testing remains supported. */
export function authCookieOptions() {
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN;
  return {
    path: "/",
    sameSite: "lax" as const,
    secure: origin ? new URL(origin).protocol === "https:" : false,
  };
}
