# READ-ONLY local discovery; no Git reset/clean/checkout/push/migration/deploy.
# Run from anywhere: powershell -ExecutionPolicy Bypass -File scripts/audit-local-repo.ps1
$Project = 'C:\Users\moham\OneDrive\Desktop\rft'
if (-not (Test-Path -LiteralPath $Project)) { Write-Error "Missing expected project path: $Project"; exit 2 }
Set-Location -LiteralPath $Project
Write-Output '--- Local path ---'; (Get-Location).Path
Write-Output '--- Git status ---'; git status --short --branch
Write-Output '--- Git remotes ---'; git remote -v
Write-Output '--- Current commit ---'; git log -1 --format='%H %cI %s'
Write-Output '--- Top level ---'; Get-ChildItem -Force | Select-Object Mode,Name
Write-Output '--- Installed skills ---'
if (Test-Path '.agents/skills') { Get-ChildItem -Directory '.agents/skills' | Select-Object Name } else { Write-Warning 'No .agents/skills directory detected' }
Write-Output '--- PNG asset list ---'
if (Test-Path 'assets') { Get-ChildItem -File -Recurse 'assets' | Where-Object Extension -match '^\.(png|jpg|jpeg|webp|svg)$' | Select-Object FullName,Length } else { Write-Warning 'No assets directory detected' }
Write-Output '--- Tracked files ---'; git ls-files
Write-Output 'Stage 0 read-only inventory finished. This DOES NOT verify provider settings, asset pixel contents or test outcomes.'
