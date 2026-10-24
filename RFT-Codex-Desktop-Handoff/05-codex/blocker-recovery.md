# Blocker diagnosis and safe recovery

## Classify before acting
| Blocker | Safe automatic work | Must not do | Owner message |
|---|---|---|---|
| Broken build/test | Inspect logs/root cause, patch, rerun regression | Claim pass, disable test | Name command and reason if still failing |
| RLS/financial discrepancy | Stop affected feature, replicate with synthetic test and fix | Allow insecure policy or floating sums | Explain affected requirement and fix status |
| Git divergence/uncommitted files | Preserve files, inspect diffs, work on safe branch | `reset --hard`, force-push, delete unknown | State specific conflict/path |
| Missing OAuth/provider consent | Complete safe local implementation, document exact setup | Pretend configured, paste secrets | Provider console path + required setting |
| Free-tier capacity/paid requirement | Optimize or seek documented free permitted path | Activate billing or promise uptime | State zero-budget conflict and alternatives |
| Destructive production migration | Develop non-destructive alternative, isolated rehearsal | Run deletion/irreversible schema change | State intended data effect and required separate approval |
| Asset/brand uncertainty | Preserve originals, use neutral placeholder where acceptable | Invent copyrighted official marks or delete variants | Identify files and selection question if material |
| Backup/recovery unavailable | Design workable free backup+restore rehearsal if lawful/secure | Claim CSV=full backup, release without needed assurance | State data-loss risk and blocked gate |

## Retry discipline
A retry must have a changed hypothesis or external state. Limit repetition; don't loop indefinitely on identical errors or delete caches/data without understanding consequences. Stop to report genuine blockers while continuing independent safe tasks.

## Report format
- **What is blocked and why:** plain-language sentence.
- **Evidence:** exact failed command/documentation/observed state, redacted.
- **What remains usable:** verified safe work.
- **What you must do:** exact owner steps with settings path; never ask for secrets in chat.
- **Resume from:** phase, branch, checkpoint, next verification.
