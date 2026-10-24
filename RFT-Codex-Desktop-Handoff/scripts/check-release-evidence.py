#!/usr/bin/env python3
"""Fail-closed STRUCTURAL guard for a Codex release evidence JSON.
Not a verification of truth of attached test logs or provider compliance.
Usage: python scripts/check-release-evidence.py /path/to/evidence.json
"""
import json
import sys
from pathlib import Path

REQUIRED = {f"G{i:02d}" for i in range(1, 16)}

def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: check-release-evidence.py PATH_TO_EVIDENCE.json", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print(f"BLOCK: could not read valid JSON evidence: {exc}")
        return 2
    problems = []
    if document.get("project") != "RFT":
        problems.append("project not RFT")
    if document.get("environment") != "production":
        problems.append("environment is not production")
    commit = document.get("source_commit")
    if not isinstance(commit, str) or len(commit) != 40 or any(x not in '0123456789abcdef' for x in commit.lower()):
        problems.append("source_commit missing or invalid")
    if document.get("cost_verified_zero") is not True:
        problems.append("RM0 spending/provider compliance not verified")
    if document.get("has_unapproved_irreversible_change") is not False:
        problems.append("potentially destructive/unapproved production change")
    gates = document.get("gates", {})
    if not isinstance(gates, dict):
        problems.append("gates must be a dictionary")
        gates = {}
    for g in sorted(REQUIRED):
        record = gates.get(g)
        if not isinstance(record, dict):
            problems.append(f"{g} absent")
            continue
        if record.get("status") != "pass":
            problems.append(f"{g} did not pass")
        proof = record.get("evidence")
        if not isinstance(proof, list) or not proof or not all(isinstance(p, str) and p.strip() for p in proof):
            problems.append(f"{g} has no evidence references")
        if not record.get("verified_by") or not record.get("verified_at"):
            problems.append(f"{g} has no verifier/date")
    if not document.get("reviewed_at"):
        problems.append("release evidence not reviewed")
    if problems:
        print("BLOCKED — evidence structure is not release-ready:")
        for p in problems:
            print(" -", p)
        return 1
    print("STRUCTURE PASS only — manually inspect every referenced proof and live provider state before release.")
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
