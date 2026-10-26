import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { evaluateEffectiveRelease } from "../../scripts/lib/release-policy";
// Synthetic validator fixtures only, never actual release evidence.
type GateFixture = {
  status: string;
  evidence: string[];
  verified_by: string;
  verified_at: string;
  recovery_verified?: boolean;
};
function fixture() {
  const policy = JSON.parse(readFileSync("docs/production-release-policy.json", "utf8"));
  const evidence = {
    project: "RFT", environment: "production", source_commit: "a".repeat(40),
    cost_verified_zero: true, has_unapproved_irreversible_change: false, reviewed_at: "2026-10-25",
    gates: Object.fromEntries<GateFixture>(Array.from({ length: 15 }, (_, i) => [`G${String(i + 1).padStart(2, "0")}`, {
      status: "pass", evidence: ["synthetic-proof"], verified_by: "unit fixture", verified_at: "2026-10-25",
    }])),
    owner_scope_changes: [{ request: "cancel encrypted backups, continue with the deployment and production", encrypted_backup_work: "cancelled", owner_notice_approval: "Approve these factual notices for publication" }],
  };
  evidence.gates.G14 = { ...evidence.gates.G14, status: "not-run", recovery_verified: false };
  return { evidence, policy };
}
describe("Effective release policy preserves every non-cancelled gate", () => {
  it("allows only the recorded G14 exclusion without claiming a recovery pass", () => {
    const { evidence, policy } = fixture();
    expect(evaluateEffectiveRelease(evidence, policy)).toEqual({ ready: true, problems: [], excluded: ["G14"] });
  });
  it.each(["G05", "G07", "G09", "G12", "G15"])("keeps %s mandatory", id => {
    const { evidence, policy } = fixture();
    evidence.gates[id].status = "blocked";
    expect(evaluateEffectiveRelease(evidence, policy).ready).toBe(false);
  });
  it("rejects a broad or second exception", () => {
    const { evidence, policy } = fixture();
    policy.owner_scope_exceptions.push({ ...policy.owner_scope_exceptions[0], gate: "G05" });
    expect(evaluateEffectiveRelease(evidence, policy).ready).toBe(false);
  });
  it("requires the independently recorded owner cancellation and notice approval", () => {
    const { evidence, policy } = fixture();
    evidence.owner_scope_changes = [];
    expect(evaluateEffectiveRelease(evidence, policy).ready).toBe(false);
  });
  it("rejects silently omitted gates and a false recovery pass", () => {
    const { evidence, policy } = fixture();
    policy.predeploy_required_gates = policy.predeploy_required_gates.filter((id: string) => id !== "G09");
    evidence.gates.G14.status = "pass";
    expect(evaluateEffectiveRelease(evidence, policy).ready).toBe(false);
  });
  it("does not waive RM0 or irreversible-change protection", () => {
    const { evidence, policy } = fixture();
    evidence.cost_verified_zero = false;
    evidence.has_unapproved_irreversible_change = true;
    expect(evaluateEffectiveRelease(evidence, policy).problems).toEqual(expect.arrayContaining(["RM0/provider compliance not verified", "Unapproved irreversible change"]));
  });
  it("does not accept missing proof references or remove postdeployment checks", () => {
    const { evidence, policy } = fixture();
    evidence.gates.G05.evidence = [];
    policy.postdeploy_required_gates = [];
    expect(evaluateEffectiveRelease(evidence, policy).ready).toBe(false);
  });
});
