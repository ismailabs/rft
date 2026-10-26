import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/features/finance/service", () => ({ loadSnapshot: vi.fn() }));
vi.mock("@/lib/supabase/auth", () => ({ requireRecentOAuth: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));
import { createClient } from "@supabase/supabase-js";
import { loadSnapshot } from "@/features/finance/service";
import { requireRecentOAuth } from "@/lib/supabase/auth";
import { POST } from "@/app/api/delete-account/route";
import { GET } from "@/app/api/export/route";
import { emptySnapshot } from "@/domain/finance/types";
const origin = "http://127.0.0.1:3000";
const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const client = { auth: { getSession: vi.fn(), signOut: vi.fn() } };
const admin = { auth: { admin: { signOut: vi.fn(), deleteUser: vi.fn() } } };
function deletion(
  body: unknown = { confirmation: "DELETE RFT" },
  requestOrigin = origin,
) {
  return new Request(`${origin}/api/delete-account`, {
    method: "POST",
    headers: { origin: requestOrigin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
async function error(response: Response, status: number, code: string) {
  expect(response.status).toBe(status);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(await response.json()).toEqual({ error: code });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_APP_ORIGIN", origin);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://synthetic.supabase.co");
  vi.stubEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "synthetic-public-test-value",
  );
  vi.stubEnv("SUPABASE_SECRET_KEY", "synthetic-test-only-value");
  vi.mocked(loadSnapshot).mockResolvedValue({
    data: emptySnapshot(),
    user: { id: owner },
    client,
  } as unknown as Awaited<ReturnType<typeof loadSnapshot>>);
  vi.mocked(createClient).mockReturnValue(
    admin as unknown as ReturnType<typeof createClient>,
  );
  client.auth.getSession.mockResolvedValue({
    data: { session: { access_token: "synthetic-access-token" } },
    error: null,
  });
  client.auth.signOut.mockResolvedValue({ error: null });
  admin.auth.admin.signOut.mockResolvedValue({ error: null });
  admin.auth.admin.deleteUser.mockResolvedValue({ error: null });
  vi.spyOn(globalThis, "fetch").mockImplementation(() => {
    throw new Error("Synthetic route tests must not access the network");
  });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
describe("controlled deletion route with synthetic provider adapters", () => {
  it("rejects cross-origin requests before identity or privilege access", async () => {
    await error(
      await POST(deletion(undefined, "https://foreign.invalid")),
      401,
      "UNAUTHENTICATED",
    );
    expect(loadSnapshot).not.toHaveBeenCalled();
    expect(createClient).not.toHaveBeenCalled();
  });
  it("requires the explicit phrase before identity or privilege access", async () => {
    await error(
      await POST(deletion({ confirmation: "delete" })),
      400,
      "VALIDATION_FAILED",
    );
    expect(loadSnapshot).not.toHaveBeenCalled();
    expect(createClient).not.toHaveBeenCalled();
  });
  it.each(["UNAUTHENTICATED", "MFA_REQUIRED"])(
    "blocks %s before privileged access",
    async (code) => {
      vi.mocked(loadSnapshot).mockRejectedValue(new Error(code));
      await error(
        await POST(deletion()),
        code === "UNAUTHENTICATED" ? 401 : 403,
        code,
      );
      expect(createClient).not.toHaveBeenCalled();
    },
  );
  it("blocks stale OAuth before privileged access", async () => {
    vi.mocked(requireRecentOAuth).mockRejectedValue(
      new Error("REAUTH_REQUIRED"),
    );
    await error(await POST(deletion()), 403, "REAUTH_REQUIRED");
    expect(createClient).not.toHaveBeenCalled();
  });
  it("does not claim deletion when no server key is configured", async () => {
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    await error(await POST(deletion()), 503, "DELETION_UNAVAILABLE");
    expect(createClient).not.toHaveBeenCalled();
  });
  it("does not delete when a current session cannot be obtained", async () => {
    client.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    await error(await POST(deletion()), 401, "UNAUTHENTICATED");
    expect(admin.auth.admin.deleteUser).not.toHaveBeenCalled();
  });
  it("requires successful global revocation before deletion", async () => {
    admin.auth.admin.signOut.mockResolvedValue({
      error: new Error("private provider message"),
    });
    await error(await POST(deletion()), 503, "SAVE_FAILED");
    expect(admin.auth.admin.deleteUser).not.toHaveBeenCalled();
  });
  it("does not claim success or local signout after provider deletion failure", async () => {
    admin.auth.admin.deleteUser.mockResolvedValue({
      error: new Error("private provider message"),
    });
    await error(await POST(deletion()), 503, "SAVE_FAILED");
    expect(client.auth.signOut).not.toHaveBeenCalled();
  });
  it("revokes first and deletes only the verified owner despite a forged body ID", async () => {
    const response = await POST(
      deletion({ confirmation: "DELETE RFT", user_id: other }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(admin.auth.admin.signOut).toHaveBeenCalledWith(
      "synthetic-access-token",
      "global",
    );
    expect(admin.auth.admin.deleteUser).toHaveBeenCalledWith(owner);
    expect(admin.auth.admin.signOut.mock.invocationCallOrder[0]).toBeLessThan(
      admin.auth.admin.deleteUser.mock.invocationCallOrder[0],
    );
    expect(
      admin.auth.admin.deleteUser.mock.invocationCallOrder[0],
    ).toBeLessThan(client.auth.signOut.mock.invocationCallOrder[0]);
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});
describe("CSV route with verified synthetic snapshot boundary", () => {
  it("exports only the authorized snapshot within Malaysia date boundaries, without admin access", async () => {
    const data = emptySnapshot();
    data.accounts = [
      {
        id: "account-a",
        name: "Synthetic cash",
        type: "cash",
        provider: "",
        opening_balance: "0.00",
        opened_at: "2026-01-01T00:00:00Z",
        archived: false,
      },
    ];
    data.categories = [
      {
        id: "category-a",
        name: "Synthetic category",
        type: "expense",
        archived: false,
      },
    ];
    data.transactions = ["2026-01-31T15:59:59Z", "2026-01-31T16:00:00Z"].map(
      (occurred_at, i) => ({
        id: `row-${i}`,
        account_id: "account-a",
        category_id: "category-a",
        subcategory_id: null,
        type: "expense",
        amount: i === 0 ? "0.10" : "99.99",
        occurred_at,
        note: i === 0 ? "=SUM(1,2)" : "Excluded next-day entry",
        planned: null,
      }),
    );
    vi.mocked(loadSnapshot).mockResolvedValue({
      data,
      client,
      user: { id: owner },
    } as unknown as Awaited<ReturnType<typeof loadSnapshot>>);
    const response = await GET(
      new Request(
        `${origin}/api/export?period=custom&from=2026-01-31&to=2026-01-31&user_id=${other}`,
      ),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("content-type")).toBe(
      "text/csv; charset=utf-8",
    );
    expect(response.headers.get("content-disposition")).toContain("attachment");
    const csv = await response.text();
    expect(csv).toContain('"0.10"');
    expect(csv).not.toContain("99.99");
    expect(csv).toContain("'=SUM(1,2)");
    expect(csv).not.toContain("Excluded next-day entry");
    expect(requireRecentOAuth).toHaveBeenCalledWith(client);
    expect(createClient).not.toHaveBeenCalled();
  });
  it.each(["UNAUTHENTICATED", "MFA_REQUIRED"])(
    "blocks %s without CSV output",
    async (code) => {
      vi.mocked(loadSnapshot).mockRejectedValue(new Error(code));
      await error(
        await GET(new Request(`${origin}/api/export`)),
        code === "UNAUTHENTICATED" ? 401 : 403,
        code,
      );
    },
  );
  it("requires recent OAuth for export", async () => {
    vi.mocked(requireRecentOAuth).mockRejectedValue(
      new Error("REAUTH_REQUIRED"),
    );
    await error(
      await GET(new Request(`${origin}/api/export`)),
      403,
      "REAUTH_REQUIRED",
    );
  });
  it.each([
    "period=invalid",
    "period=custom&from=2026-02-30&to=2026-03-01",
    "period=custom&from=2026-03-01&to=2026-02-01",
    "period=custom&from=2026-01-01",
  ])("rejects malformed range as a validation error: %s", async (query) => {
    await error(
      await GET(new Request(`${origin}/api/export?${query}`)),
      400,
      "VALIDATION_FAILED",
    );
  });
});
