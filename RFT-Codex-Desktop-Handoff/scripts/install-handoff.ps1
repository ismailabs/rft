# Documentation-only handoff installer — DRY RUN unless -Apply given.
# Intended for future Codex execution after Stage 0 read-only local Git audit.
param(
  [switch]$Apply,
  [string]$Project = 'C:\Users\moham\OneDrive\Desktop\rft'
)
$ErrorActionPreference = 'Stop'
$Source = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$Destination = Join-Path $Project 'codex-handoff'
$RootAgents = Join-Path $Project 'AGENTS.md'
if (-not (Test-Path -LiteralPath $Project)) { throw "Project does not exist: $Project" }
if (-not (Test-Path -LiteralPath (Join-Path $Project '.git'))) { throw 'No existing .git in selected project; refuse to modify unknown folder.' }
if (-not (Test-Path -LiteralPath (Join-Path $Source 'MANIFEST.md'))) { throw 'Extract and run from correct handoff package.' }
if (Test-Path -LiteralPath $Destination) { throw "Existing handoff target: $Destination. Refusing to overwrite." }
Write-Output "Handoff source: $Source"
Write-Output "Project target: $Destination"
if (Test-Path -LiteralPath $RootAgents) { Write-Warning 'Existing root AGENTS.md WILL NOT be overwritten. Codex must inspect/reconcile.' }
if (-not $Apply) { Write-Output 'DRY RUN: no changes. Use -Apply after local repo audit.'; exit 0 }
Copy-Item -LiteralPath $Source -Destination $Destination -Recurse -ErrorAction Stop
if (-not (Test-Path -LiteralPath $RootAgents)) {
@'
# RFT Codex project entrypoint
Read `codex-handoff/AGENTS.md`, `codex-handoff/01-context/requirements-ledger.md`,
`codex-handoff/05-codex/execution-contract.md`, and
`codex-handoff/05-codex/implementation-plan.md` before coding.
Mandatory use of existing `.agents/skills/` and `assets/`, Lucide UI icons,
and no generic AI-slop design. RM0 total budget, noncommercial use,
financial accuracy/RLS/optional TOTP MFA, and preauthorized production release
ONLY after all evidence-backed gates pass. No destructive real-data changes.
'@ | Set-Content -LiteralPath $RootAgents -Encoding UTF8 -NoNewline
}
Write-Output 'Handoff docs installed without touching original skills, assets, app code, Git history, or providers.'
