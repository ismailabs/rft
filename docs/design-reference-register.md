# Visual fidelity recovery — reference authority

Recorded 2026-10-24 after opening every current PNG individually. This register supersedes the **implementation-side visual choices** in `docs/assets-audit.md` and `docs/decisions.md`; it does not rewrite the original handoff. Source: the owner's “RFT — Codex Visual Fidelity Recovery & Implementation Directive”, supplied in the current chat. No Version 2.1 correction file is installed: the root manifest still identifies v2.0, and searching the entry files and complete handoff found no v2.1 design-authority addendum. The newer direct owner instruction controls.

## Binding desktop sources

All five new images are 1448 × 1086. Their visual contents unambiguously match the five already approved conversation concepts. Approval is established by the owner's directive, not inferred from filenames. Common directory: `assets/`; common filename prefix: `ChatGPT Image Oct 24, 2026, `.

| ID / approved conversation name | Exact local filename | Route | Contents and fidelity requirements | Status / exclusions |
|---|---|---|---|---|
| A — Dashboard / image-gen-1(9).png | `ChatGPT Image Oct 24, 2026, 01_37_16 PM-1.png` | `/app` | 255px left sidebar; 77px top bar; greeting/period header; left balance, three metrics, grouped income/expense bars, transaction table; 408px right accounts/insights column | Approved; no ambiguity. Old single-column implementation is not accepted evidence. |
| E — Homepage Concept A / image-gen-2(9).png | `ChatGPT Image Oct 24, 2026, 01_37_17 PM-2.png` | `/` | Top brand/navigation; left “Track your money. A brighter tomorrow.”; Google CTA; dominant desktop dashboard preview on right; benefit strip; feature heading/four cards | Approved; `08_25_23 AM-2.png` two-phone homepage expressly excluded as primary. |
| B — Transactions / image-gen-3(8).png | `ChatGPT Image Oct 24, 2026, 01_37_18 PM-3.png` | `/app/transactions` | Shared shell; title; tabs, period, search, selects and category strip; transaction table/pagination; 366px right Add Transaction form. Desktop field order: type, amount, date, description, category, account, note, actions | Approved; no ambiguity. Functional fields required by existing data model remain available. |
| C — Accounts & Transfers / image-gen-4(8).png | `ChatGPT Image Oct 24, 2026, 01_37_20 PM-4.png` | `/app/accounts` | Left balance and two-column institution cards, recent transaction table; 420px right internal transfer form and account breakdown ring | Approved; no ambiguity. Manual account recording replaces “link”; no external transfer tab or invented account numbers. |
| D — Insights & Budgets / image-gen-5(4).png | `ChatGPT Image Oct 24, 2026, 01_37_21 PM-5.png` | `/app/insights` | Three insight summaries; expense category ring and legend; six-month income/expense grouped bars; budget progress and goal progress below | Approved; no ambiguity. Sparse history must show factual limits; goal progress requires genuine saved goal data. |

Open the exact source PNG to inspect fine details. Machine-readable dimensions and SHA-256 values for all current sources: `artifacts/design-recovery/asset-inventory.json`. Thumbnail sheets below are review aids; neither they nor the sources are implementation screenshots.

## Mobile selections — approved by owner

There are **eight**, not seven, distinct mobile screen references. They form one coherent family; no competing phone concepts were found. Their existence does not establish approval. The phone frame/status bar are presentation, not browser UI to reproduce. All eight IDs were selected by the owner.

| ID | Exact filename | Intended UI | Review thumbnail | Approval |
|---|---|---|---|---|
| M1 | `ChatGPT Image Oct 24, 2026, 08_25_17 AM-1.png` | `/app`: greeting, skyline balance, three-column period summary, spending/categories, recent rows, four destinations and central Add | `artifacts/design-recovery/mobile-M1-M4.png` top left | Approved in chat |
| M2 | `ChatGPT Image Oct 24, 2026, 08_25_27 AM-3.png` | Transaction entry: type, large amount, category chips, subcategory, account, date/time, note/reflection, Save | Same sheet, top right | Approved in chat |
| M3 | `ChatGPT Image Oct 24, 2026, 08_25_30 AM-4.png` | `/app/transactions`: search, type pills, period, date-grouped activity rows | Same sheet, bottom left | Approved in chat |
| M4 | `ChatGPT Image Oct 24, 2026, 08_25_35 AM-5.png` | `/app/insights`: trend, category ring, factual insight summaries, budgets, category list | Same sheet, bottom right | Approved in chat |
| M5 | `ChatGPT Image Oct 24, 2026, 08_26_02 AM-1.png` | `/app/accounts`: skyline balance, account list, type breakdown, Add | `artifacts/design-recovery/mobile-M5-M8.png` top left | Approved in chat |
| M6 | `ChatGPT Image Oct 24, 2026, 08_26_08 AM-2.png` | Transfer entry: source/destination, large amount, date/time, optional fee/note, exact preview, Save | Same sheet, top right | Approved in chat |
| M7 | `ChatGPT Image Oct 24, 2026, 08_26_15 AM-3.png` | `/app/accounts/[id]`: institution heading, skyline balance, movement summary/chart, recent activity | Same sheet, bottom left | Approved in chat |
| M8 | `ChatGPT Image Oct 24, 2026, 08_26_21 AM-4.png` | `/app/settings`: profile, accounts, security, data, preferences sections | Same sheet, bottom right | Approved in chat |

Owner-approved selection: all eight layouts, preserving the mobile teal skyline treatment and adapting shared branding/navigation to the approved desktop leaf mark and green. Copy and figures remain truthful, localized and derived from the current account. No fake avatar, notifications, linked-bank state or session count. Both selections were explicitly approved in the owner reply.

## Minimum responsive adaptations — approved by owner

No mobile homepage or tablet mockup exists in the current inventory. Proposed layout order:

```text
HOME, 320–767px                  TABLET, 768–1199px
brand       menu / sign in       compact navigation / brand
headline                        page title          period
value proposition               balance / metrics
Google CTA                      chart / primary content
Explore features                accounts / secondary content
desktop dashboard preview       transaction or transfer form below
benefits (2 × 2, 1 column narrow) (open on Add, full available width)
feature heading / cards         category / transaction tables may scroll
security / free use / FAQ        inside their labeled region only
footer                          no document-level horizontal overflow
```

The mobile homepage keeps the **desktop dashboard preview**, not two phones. Auth, MFA, onboarding and category screens use the same approved fields, colors and type, in one readable column. Mobile forms open in a full-height accessible sheet with persistent title/close and visible Save after the fields. At desktop, transaction/transfer forms occupy the approved right column. At 1200px and above the desktop sidebar and reference column proportions return. These are approved initial breakpoints, subject to content-fit verification rather than fixed device assumptions. Large amounts/long labels may wrap; 44px touch targets, keyboard focus and contrast can justify documented small differences.

## Complete remaining source classification

| Exact filename (common prefix omitted) | Class / actual contents | Decision |
|---|---|---|
| `08_24_06 AM-2.png` | Stylized multicolor Google G, transparent surround | Preserve; official Google sign-in branding must be verified before reuse as an official mark. |
| `08_24_10 AM-3.png` | Teal shield/lock/check illustration | Optional supporting security artwork; no certification claim. |
| `08_24_14 AM-4.png` | Stylized TNG eWallet square | Account icon candidate; provenance/rights and exact mark require verification. |
| `08_24_18 AM-5.png` | Maybank-like tiger square | Same rights/accuracy condition. |
| `08_24_21 AM-6.png` | CIMB-like red geometric square | Same rights/accuracy condition. |
| `08_24_25 AM-7.png` | RHB-like blue/red square | Same rights/accuracy condition. |
| `08_24_28 AM-8.png` | Stylized GrabPay square | Same rights/accuracy condition. |
| `08_24_31 AM-9.png` | Illustrated RM50 note stack | Optional illustration; never a claimed real holding. |
| `08_24_35 AM-10.png` | Teal bank building with dollar symbol | Reference only; Lucide Landmark and MYR labels for UI. |
| `08_25_23 AM-2.png` | Two-phone marketing homepage, warm/teal palette, fabricated social proof | Superseded as primary homepage; reject fake 10,000+, ratings, video and bank-sync claims. |
| `08_31_45 AM-1.png` | Composite of 12 banking app icons; alternate rising-bars logo | Preserve as reference; not an official licensed mark pack or approved replacement brand. |
| `08_32_11 AM-2.png` | Composite of 10 wallet/finance app icons, skyline, alternate RFT logo | Preserve as reference; same rights restriction; bank-sync wording excluded. |

Together: 5 approved desktop/homepage sources + 8 mobile references + 12 other sources = 25 PNGs. No standalone leaf-logo sheet or favicon source exists; the approved green leaf appears within the five approved references. A small code-native brand mark derived from that geometry is required, with an explicit visual comparison. The older rising-bars mark must not silently replace it.

## Source preservation exception discovered during recovery

`assets/ChatGPT Image Oct 24, 2026, 08_23_55 AM-1.png` is absent from the working tree. The agent did not remove it. Its original bytes remain recoverable from baseline Git commit `c669f6ea616d266e6d433efec4cf4ac9853602a2`; a private audit copy was read from Git for inspection. The owner explicitly directed “Keep that file removed”. The deletion is an authorized exception, registered with the original hash in docs/authorized-asset-changes.json. All 20 surviving original PNGs were independently verified byte-for-byte against baseline Git; five approved additions are individually hash-registered. The source audit accepts only those exact changes. Do not restore the old source.

## Reference-derived token and component plan

Values below are initial measurements for implementation, not a claim of completed fidelity. Source pixels: white surfaces, cool near-white canvas (~`#f7f8fa`), navy-black headings (~`#080d24`), slate body (~`#525f7c`), green actions (~`#008665`), pale mint active navigation (~`#e2f2ec`), green income, coral expense, blue transfer. Contrast-adjust semantic text if needed; preserve light tinted icon containers. Current local DM Sans is a close available sans candidate; verify actual glyph sizes/weights visually. Reference typography: desktop title ~34px, amount ~36px, panel heading ~19px, body ~15–17px; tables may be denser but retain readable content and usable actions.

Reference shell: 255px sidebar, 77px top bar, ~30px content inset; 12px card radius, 1px cool gray border, restrained shadow; 14–18px gaps. Dashboard columns ~712:408; transaction content/form ~784:366; accounts content/form ~696:420. Wide screens retain these proportions with maximum readable widths. Do not use the old warm-canvas/oversized balance card as the desktop composition.

Refactor the current `FinanceApp` presentation into shell, page header, balance/metric panels, transaction table + mobile rows, institution icon, period/filter controls, reusable entry form content, account cards and chart/legend components. Preserve existing service calls, exact decimal data and server boundaries. Use explicit desktop/mobile composition components instead of accumulating boolean style modes. Load chart code only on routes that use it. No database replacement for visual recovery.

The audit found missing Version 1 goal persistence. Additive goal CRUD/schema/progress is now implemented and passed the 76-test local suite, including exact money/RLS/MFA/restore checks. Hosted migration 20261024090654 succeeded with eight RLS tables and unchanged ledger counts; see docs/savings-goals-migration.md. Actual hosted user goal CRUD remains unverified. All populated visual examples use labeled synthetic fixtures.

## Execution gates and comparison evidence

The owner explicitly approved M1–M8, the shared branding adaptation and the minimum responsive proposal in chat. Phase 1 approval is resolved; implementation may proceed. Independent route regression fixes/tests and read-only source audits may proceed. Sequence after approval: shared foundation → homepage → A/B/C/D desktop → mobile/tablet → auth/settings/supporting screens → regression and screenshot correction loops → conditional release.

For each screen capture the actual React implementation with synthetic fixtures at the reference 1448 × 1086 desktop viewport, plus 320/390/768/1440/1920 representative widths, selected mobile mockup content bounds, and populated/empty/loading/error states where relevant. Keep original screenshots and side-by-side comparison artifacts; record placement/proportions/type/color/forms/chart differences and subsequent fixes. Source images/contact sheets are never counted as implementation screenshots. Existing earlier browser screenshots are a **divergent baseline**, not proof of this recovery.

Production remains blocked. Mobile approval is recorded; implementation and visual comparisons are additional gates; prior engineering CI does not satisfy them. Existing OAuth audience, identity isolation/deletion, operational recovery/privacy and protected release gates remain in effect.

## Approved branding exception and truthful field adaptations

The owner approved white Google sign-in buttons, with authentic multicolor Google G, in the reference positions. Google requires a compliant light/dark/neutral button; the mockup green/white-G treatment was replaced only after approval. Official guidance: https://developers.google.com/identity/branding-guidelines. Google Sans Medium and the G are self-hosted; provenance and font license are in public/brand/README.md. The earlier recovery used a code-native green leaf. Current displayed branding uses the shaded original reference crop; existing install icons retain the earlier leaf geometry as a supporting-asset limitation.

At the earlier recovery checkpoint, supplied stylized bank/wallet marks were withheld pending direction and neutral Lucide account-type icons were documented as a limitation. The subsequent mandatory A–E directive explicitly requires suitable provided artwork and authorizes extraction from composite references. The correction therefore uses the original Maybank, CIMB, RHB, TNG and GrabPay illustrations, with crop/hash provenance; it does not claim verified official licensing or bank connections. Source PNGs are preserved. Exact illustrative reference strings are permitted only in the isolated synthetic comparison host, never as production account details. No notifications, testimonials, external transfers or device-session counts are fabricated. Description and optional Note share the existing persisted note field with a checked combined limit. A transfer fee is explicitly recorded as a separate expense, preserving the original atomic transfer contract. Date/time and optional reflection remain available. Goals are independent manual savings estimates and do not move money. The shaded source leaf now replaces the flat vector in the displayed Brand component; existing install-icon files remain a separate supporting-asset limitation. See docs/pixel-fidelity-correction.md for the current evidence boundary.
