import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const adapter = vi.hoisted(() => ({
  auth: {
    getUser: vi.fn(),
    getClaims: vi.fn(),
    refreshSession: vi.fn(),
    mfa: {
      listFactors: vi.fn(),
      getAuthenticatorAssuranceLevel: vi.fn(),
      enroll: vi.fn(),
      challengeAndVerify: vi.fn(),
      unenroll: vi.fn(),
    },
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ serverClient: async () => adapter }));
import { verifiedIdentity, requireRecentOAuth } from "@/lib/supabase/auth";
import { POST } from "@/app/api/mfa/route";
import type { serverClient } from "@/lib/supabase/server";

const origin = "http://127.0.0.1:3000";
const owner = "00000000-0000-4000-8000-000000000001";
const factorId = "00000000-0000-4000-8000-000000000011";
const foreignId = "00000000-0000-4000-8000-000000000022";
const now = Date.parse("2026-10-26T03:00:00Z") / 1000;
const client = adapter as unknown as Awaited<ReturnType<typeof serverClient>>;
function factors(status = "verified") {
  const factor = { id: factorId, factor_type: "totp", status };
  adapter.auth.mfa.listFactors.mockResolvedValue({
    data: { all: [factor], totp: [factor] },
    error: null,
  });
}
function assurance(level: string | null, next = level) {
  adapter.auth.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({
    data: { currentLevel: level, nextLevel: next },
    error: null,
  });
}
function request(body: unknown, from = origin) {
  return new Request(origin + "/api/mfa", {
    method: "POST",
    headers: { origin: from, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
async function denied(response: Response, status: number, code: string) {
  expect(response.status).toBe(status);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(await response.json()).toEqual({ error: code });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(now * 1000);
  vi.stubEnv("NEXT_PUBLIC_APP_ORIGIN", origin);
  adapter.auth.getUser.mockResolvedValue({
    data: { user: { id: owner, identities: [{ provider: "google" }] } },
    error: null,
  });
  adapter.auth.getClaims.mockResolvedValue({
    data: { claims: { amr: [{ method: "oauth", timestamp: now - 30 }] } },
    error: null,
  });
  adapter.auth.mfa.listFactors.mockResolvedValue({
    data: { all: [], totp: [] },
    error: null,
  });
  assurance("aal1");
  adapter.auth.mfa.enroll.mockResolvedValue({
    data: {
      id: factorId,
      totp: { qr_code: "synthetic-qr-only", secret: "synthetic-seed-only" },
    },
    error: null,
  });
  adapter.auth.mfa.challengeAndVerify.mockResolvedValue({ error: null });
  adapter.auth.mfa.unenroll.mockResolvedValue({ error: null });
  adapter.auth.refreshSession.mockResolvedValue({ error: null });
  vi.spyOn(globalThis, "fetch").mockImplementation(() => {
    throw Error("Isolated assurance tests must not access the network");
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("verified Google identity and assurance boundary", () => {
  it("allows a verified Google identity at AAL1 when no verified factor exists", async () => {
    expect((await verifiedIdentity()).user.id).toBe(owner);
  });
  it("does not treat a pending factor as enrolled MFA", async () => {
    factors("unverified");
    expect((await verifiedIdentity()).assurance.currentLevel).toBe("aal1");
  });
  it("denies an enrolled AAL1 identity and permits the same identity at AAL2", async () => {
    factors();
    assurance("aal1", "aal2");
    await expect(verifiedIdentity()).rejects.toThrow("MFA_REQUIRED");
    assurance("aal2");
    expect((await verifiedIdentity()).user.id).toBe(owner);
  });
  it.each([null, "aal3"])(
    "fails closed for unknown current assurance %s",
    async (level) => {
      assurance(level);
      await expect(verifiedIdentity()).rejects.toThrow("UNAUTHENTICATED");
    },
  );
  it.each(["factor", "assurance"])(
    "fails closed when the %s lookup fails",
    async (kind) => {
      const query =
        kind === "factor"
          ? adapter.auth.mfa.listFactors
          : adapter.auth.mfa.getAuthenticatorAssuranceLevel;
      query.mockResolvedValue({
        data: null,
        error: new Error("synthetic provider failure"),
      });
      await expect(verifiedIdentity()).rejects.toThrow("UNAUTHENTICATED");
    },
  );
  it("does not accept editable metadata as a Google identity", async () => {
    adapter.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: owner,
          identities: [{ provider: "email" }],
          user_metadata: { provider: "google" },
        },
      },
      error: null,
    });
    await expect(verifiedIdentity()).rejects.toThrow("UNAUTHENTICATED");
  });
});

describe("recent Google verification", () => {
  it.each([599, -29])(
    "accepts OAuth age %s within the bounded clock-skew window",
    async (age) => {
      adapter.auth.getClaims.mockResolvedValue({
        data: { claims: { amr: [{ method: "oauth", timestamp: now - age }] } },
        error: null,
      });
      await expect(requireRecentOAuth(client)).resolves.toBeUndefined();
    },
  );
  it.each([600, 601, -31])("rejects OAuth age %s", async (age) => {
    adapter.auth.getClaims.mockResolvedValue({
      data: { claims: { amr: [{ method: "oauth", timestamp: now - age }] } },
      error: null,
    });
    await expect(requireRecentOAuth(client)).rejects.toThrow("REAUTH_REQUIRED");
  });
  it("a new TOTP verification does not renew stale Google verification", async () => {
    adapter.auth.getClaims.mockResolvedValue({
      data: {
        claims: {
          amr: [
            { method: "oauth", timestamp: now - 900 },
            { method: "totp", timestamp: now },
          ],
        },
      },
      error: null,
    });
    await expect(requireRecentOAuth(client)).rejects.toThrow("REAUTH_REQUIRED");
  });
});

describe("actual MFA route with isolated provider adapter", () => {
  it("checks origin before accessing identity or creating credentials", async () => {
    await denied(
      await POST(
        request(
          { operation: "enroll", name: "Synthetic device" },
          "https://foreign.invalid",
        ),
      ),
      401,
      "UNAUTHENTICATED",
    );
    expect(adapter.auth.getUser).not.toHaveBeenCalled();
    expect(adapter.auth.mfa.enroll).not.toHaveBeenCalled();
  });
  it("requires recent Google verification for enrollment", async () => {
    adapter.auth.getClaims.mockResolvedValue({
      data: { claims: {} },
      error: null,
    });
    await denied(
      await POST(request({ operation: "enroll", name: "Synthetic device" })),
      403,
      "REAUTH_REQUIRED",
    );
    expect(adapter.auth.mfa.enroll).not.toHaveBeenCalled();
  });
  it.each(["enroll", "unenroll"])(
    "enrolled AAL1 cannot %s",
    async (operation) => {
      factors();
      assurance("aal1", "aal2");
      const body =
        operation === "enroll"
          ? { operation, name: "Synthetic device" }
          : { operation, factorId };
      await denied(await POST(request(body)), 403, "MFA_REQUIRED");
      expect(adapter.auth.mfa.enroll).not.toHaveBeenCalled();
      expect(adapter.auth.mfa.unenroll).not.toHaveBeenCalled();
    },
  );
  it("allows optional first-factor enrollment with recent Google verification", async () => {
    const r = await POST(
      request({ operation: "enroll", name: "Synthetic device" }),
    );
    expect(r.status).toBe(200);
    expect(r.headers.get("cache-control")).toBe("private, no-store");
    expect(adapter.auth.mfa.enroll).toHaveBeenCalledWith({
      factorType: "totp",
      friendlyName: "Synthetic device",
      issuer: "Ringgit Finance Tracker",
    });
  });
  it("rejects a foreign factor before verification", async () => {
    factors();
    await denied(
      await POST(
        request({ operation: "verify", factorId: foreignId, code: "123456" }),
      ),
      409,
      "RECORD_NOT_ALLOWED",
    );
    expect(adapter.auth.mfa.challengeAndVerify).not.toHaveBeenCalled();
  });
  it("verifies only an owned factor and safely rejects an invalid code", async () => {
    factors();
    adapter.auth.mfa.challengeAndVerify.mockResolvedValue({
      error: new Error("synthetic invalid code"),
    });
    await denied(
      await POST(request({ operation: "verify", factorId, code: "123456" })),
      400,
      "INVALID_MFA_CODE",
    );
    expect(adapter.auth.mfa.challengeAndVerify).toHaveBeenCalledWith({
      factorId,
      code: "123456",
    });
  });
  it("unenrolls only the selected owned factor after AAL2 and refreshes the session", async () => {
    factors();
    assurance("aal2");
    const r = await POST(request({ operation: "unenroll", factorId }));
    expect(r.status).toBe(200);
    expect(adapter.auth.mfa.unenroll).toHaveBeenCalledWith({ factorId });
    expect(adapter.auth.refreshSession).toHaveBeenCalledOnce();
    expect(adapter.auth.mfa.unenroll.mock.invocationCallOrder[0]).toBeLessThan(
      adapter.auth.refreshSession.mock.invocationCallOrder[0],
    );
  });
});
