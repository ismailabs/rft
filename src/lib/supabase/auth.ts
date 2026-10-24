import "server-only";
import { serverClient } from "./server";

export async function verifiedIdentity(requireAssurance = true) {
  const client = await serverClient();
  const { data, error } = await client.auth.getUser();
  if (
    error ||
    !data.user ||
    !data.user.identities?.some((i) => i.provider === "google")
  )
    throw new Error("UNAUTHENTICATED");
  const { data: factors, error: factorError } =
    await client.auth.mfa.listFactors();
  const { data: assurance, error: assuranceError } =
    await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (factorError || assuranceError || !factors || !assurance)
    throw new Error("UNAUTHENTICATED");
  if (
    requireAssurance &&
    factors.totp.some((f) => f.status === "verified") &&
    assurance.currentLevel !== "aal2"
  )
    throw new Error("MFA_REQUIRED");
  return { client, user: data.user, assurance, factors };
}

export async function requireRecentOAuth(
  client: Awaited<ReturnType<typeof serverClient>>,
) {
  const { data, error } = await client.auth.getClaims();
  if (error || !data) throw new Error("UNAUTHENTICATED");
  const methods = data.claims.amr as
    { method: string; timestamp: number }[] | undefined;
  const now = Date.now() / 1000;
  if (
    !methods?.some(
      (m) =>
        m.method === "oauth" &&
        m.timestamp <= now + 30 &&
        now - m.timestamp < 600,
    )
  )
    throw new Error("REAUTH_REQUIRED");
}
