type ObjectValue = Record<string, unknown>;
const allGates = Array.from({ length: 15 }, (_, i) => `G${String(i + 1).padStart(2, "0")}`);
const cancellation = "cancel encrypted backups, continue with the deployment and production";
const noticeApproval = "Approve these factual notices for publication";
const object = (value: unknown): ObjectValue | undefined =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as ObjectValue
    : undefined;
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const references = (value: unknown): boolean => Array.isArray(value) && value.length > 0 && value.every(nonempty);
export function evaluateEffectiveRelease(evidence: unknown, policy: unknown) {
  const problems: string[] = [], excluded: string[] = [];
  const record = object(evidence), rules = object(policy);
  if (!record || !rules) return { ready: false, problems: ["Evidence and policy must be objects"], excluded };
  if (record.project !== "RFT" || rules.project !== "RFT") problems.push("Wrong project");
  if (record.environment !== "production") problems.push("Wrong environment");
  if (typeof record.source_commit !== "string" || !/^[0-9a-f]{40}$/.test(record.source_commit)) problems.push("Invalid source commit");
  if (record.cost_verified_zero !== true) problems.push("RM0/provider compliance not verified");
  if (record.has_unapproved_irreversible_change !== false) problems.push("Unapproved irreversible change");
  if (!nonempty(record.reviewed_at)) problems.push("Missing evidence review date");
  const gates = object(record.gates) || {};
  const exceptions = rules.owner_scope_exceptions;
  if (!Array.isArray(exceptions)) problems.push("Scope exceptions must be an explicit array");
  else for (const raw of exceptions) {
    const exception = object(raw);
    if (!exception || exception.gate !== "G14" || excluded.includes("G14")) {
      problems.push("Only one targeted G14 owner scope exception is supported");
      continue;
    }
    const changes = Array.isArray(record.owner_scope_changes) ? record.owner_scope_changes : [];
    const ownerRecord = changes.map(object).find(change =>
      change?.request === cancellation && change.encrypted_backup_work === "cancelled" && change.owner_notice_approval === noticeApproval);
    const recovery = object(gates.G14);
    if (exception.scope !== "application_managed_encrypted_backups_and_operational_restore" ||
      exception.owner_request !== cancellation || exception.owner_notice_approval !== noticeApproval ||
      exception.no_application_managed_backups_disclosed !== true || exception.data_loss_limitation_disclosed !== true ||
      exception.recovery_verified !== false || exception.plaintext_cloud_backup_authorized !== false ||
      !nonempty(exception.authority) || !references(exception.evidence) || !ownerRecord ||
      !recovery || recovery.status !== "not-run" || recovery.recovery_verified !== false) {
      problems.push("G14 cancellation/notice approval provenance or honest recovery status is missing");
      continue;
    }
    excluded.push("G14");
  }
  const required = allGates.filter(id => !excluded.includes(id));
  if (!Array.isArray(rules.predeploy_required_gates) ||
    JSON.stringify([...rules.predeploy_required_gates].sort()) !== JSON.stringify([...required].sort()))
    problems.push("Policy cannot remove or add mandatory predeployment gates");
  if (JSON.stringify(rules.postdeploy_required_gates) !== JSON.stringify(["G16"]))
    problems.push("Postdeployment G16 must remain required");
  for (const id of required) {
    const gate = object(gates[id]);
    if (!gate || gate.status !== "pass") problems.push(`${id} did not pass`);
    if (!gate || !references(gate.evidence) || !nonempty(gate.verified_by) || !nonempty(gate.verified_at))
      problems.push(`${id} has incomplete evidence references/verifier/date`);
  }
  return { ready: problems.length === 0, problems, excluded };
}
