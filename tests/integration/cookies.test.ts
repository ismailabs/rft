import { afterEach, beforeEach, expect, it, vi } from "vitest";
const store = vi.hoisted(() => ({
  writes: [] as { name: string; options: Record<string, unknown> }[],
}));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    getAll: () => [],
    set: (name: string, _value: string, options: Record<string, unknown>) =>
      store.writes.push({ name, options }),
  }),
}));
import { serverClient } from "@/lib/supabase/server";
beforeEach(() => {
  store.writes = [];
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://synthetic.supabase.co");
  vi.stubEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "synthetic-public-test-value",
  );
  vi.spyOn(globalThis, "fetch").mockImplementation(() => {
    throw new Error("Cookie test must not make network requests");
  });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
it.each([
  ["https://rft.example.test", true],
  ["http://127.0.0.1:3000", false],
] as const)(
  "real SSR PKCE cookie uses the configured origin protection: %s",
  async (origin, secure) => {
    vi.stubEnv("NEXT_PUBLIC_APP_ORIGIN", origin);
    const client = await serverClient();
    const result = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: origin + "/auth/callback",
        skipBrowserRedirect: true,
      },
    });
    expect(result.error).toBeNull();
    expect(store.writes.length).toBeGreaterThan(0);
    expect(store.writes.some((w) => w.name.includes("code-verifier"))).toBe(
      true,
    );
    for (const cookie of store.writes)
      expect(cookie.options).toMatchObject({
        path: "/",
        sameSite: "lax",
        secure,
      });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  },
);
