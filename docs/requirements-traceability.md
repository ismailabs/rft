# Implementation traceability — 2026-10-24

“Implemented” below is source scope, not production acceptance. See the verification report for evidence boundaries and blocked gates.

| Requirement | Implementation and actual checks | Remaining acceptance |
|---|---|---|
| P01, P08, P09 | MYR bigint money; KL periods; dashboard, account detail, filters; reconciliation/property/boundary tests; live synthetic total RM170.10 reconciled to hosted rows | Full hosted edit/delete/filter regression |
| P02 | Manifest, source-derived icons, network-only worker, responsive navigation and install guidance; Chromium manifest/worker checks | Physical installation/update and account-switch privacy checks |
| P03 | Google-only PKCE/SSR; live Google login reached app; provider settings Google true, email/anonymous false | Public audience still Testing; intended production sign-in/session lifecycle |
| P04 | TOTP enrollment/challenge/removal APIs, server and restrictive database AAL2 policy; local bypass matrix passes; provider currently confirms two verified factors across two Google identities; owner reports challenge completed | Independent hosted direct-API/data bypass and removal verification |
| P05 | Cash/bank/e-wallet create, opening estimates/date policy, metadata/archive/delete; live synthetic two-account creation persisted | Full authenticated archive/ownership negative matrix |
| P06 | Owned income/expense/category/subcategory CRUD, note/reflection; strict schema/FK/date checks; live synthetic income and expense persisted | Hosted historical edits/deletes and second-user denials |
| P07 | Single-event atomic transfer, ordered locking, exact invariants and rollback tests; live RM10.34 transfer preserves total | Complete hosted negative matrix |
| P10 | Category shares, source-entry drill-down, four complete-week totals, sparse-week comparison suppression, monthly budgets, separate manual savings-goal CRUD/progress, reflection, six-month and seven-day reports; 76-test local suite plus browser checks | Hosted goals and complete behavioural acceptance |
| P11 | Owner-only CSV, formula neutralization, recent OAuth; live three-row synthetic download inspected | Hosted MFA/reauth expiry and second-user export denials |
| P12 | Recent identity + MFA, explicit phrase, privileged server-only admin deletion and cascades; local restore/cascade tests | Server-only key present but validity not exercised; explicitly designated disposable test identity and controlled hosted deletion not verified |
| P13 | EN/BM dictionaries/preferences, local time, original-category initialization; BM/unit/browser checks | Native speaker and assistive technology review limits remain |
| P14 | Public homepage, computed labelled sample, privacy and terms EN/BM, Google CTA; responsive route checks | Approved Ismail Studio public contact implemented; retention and owner/legal review remain draft |
| P15, P16 | All 25 current PNGs inspected; five binding desktop/homepage references and M1–M8 mapped; shared green leaf with approved teal mobile balance panels; locally hosted fonts/Google G; Lucide controls; actual responsive/axe/keyboard/comparison captures | No assertion of verified bank-logo rights; generic Lucide + labels used. Screen reader/physical device checks pending |
| P17, P18 | 12 installed skills audited; 65 original hashes; 20 original PNGs unchanged, one owner-authorized source removal, five hash-registered additions; skills unchanged; feature branch | Reviewed Git checkpoint and CI recorded separately |
| P19, P20 | No purchase/billing activation; Supabase organization reports free/tier_free; Vercel free noncommercial terms reviewed | Owner-reported Vercel Hobby; independent quotas, public OAuth/domain and free recovery feasibility |
| P21–P24 | Implementation, debugging, tests, evidence and beginner owner guide; deployment disabled while gates blocked | All mandatory gate evidence before production and post-release smoke |
