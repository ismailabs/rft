# RFT — Codex Visual Fidelity Recovery & Implementation Directive

## 1. Mission and execution context

You are continuing the **existing Codex Desktop task, "Implement RFT handoff plan,"** for Ringgit Finance Tracker (RFT).

Your task is to **correct the current application's visual implementation so that it faithfully reproduces my explicitly approved UI/UX mockups**, while preserving completed engineering work, functioning features, database security, and the existing project architecture.

**The central problem:** You previously viewed and inspected images inside `assets/`, but the actual application you implemented looks substantially different from those designs.

Inspecting an image does not constitute implementing it. Reading design skills does not constitute applying the approved design.

The currently implemented homepage, dashboard, and mobile interface demonstrate substantial visual differences from my supplied mockups. This task must resolve those differences through actual frontend implementation, not another design proposal or documentation exercise.

**This is a high-fidelity implementation and recovery task, not an invitation to independently redesign RFT.**

### Workspace

- Local repository: `C:\Users\moham\OneDrive\Desktop\rft`
- GitHub: `https://github.com/ismailabs/rft`
- Existing agent skills: `.agents/skills/`
- Existing image assets: `assets/`
- Existing Codex handoff: `RFT-Codex-Desktop-Handoff/`
- Existing project instructions: `AGENTS.md`, `START-HERE.md`, `README.md`, `MANIFEST.md`
- Application: Next.js, React, TypeScript, Tailwind CSS, Supabase, Vercel
- Budget: **RM0 total**
- Product: Free, non-commercial, Malaysian personal and behavioural finance tracker

Work within this existing repository. Do not initialize a replacement project or discard completed work.

## 2. Non-negotiable design authority

My approved mockups are **binding visual specifications**, not optional inspiration.

The existing design skills may help you implement, optimize, and verify the designs, but they must not replace those designs with their own aesthetic recommendations.

### Approved desktop application mockups

**A. Dashboard — `image-gen-1(9).png`**

Implement the approved design's:

- Left sidebar with RFT branding and navigation.
- Main header and personalized dashboard greeting.
- Estimated balance summary with accompanying visual treatment.
- Income, expenses, and net cash flow components.
- Income-versus-expenses chart.
- Recent transactions table.
- Right-side Malaysian bank/e-wallet account list.
- Right-side financial insights.
- Typography, spacing, colors, visual hierarchy, borders, radii, iconography, and overall composition.

**B. Transactions — `image-gen-3(8).png`**

Implement the approved design's:

- Consistent desktop navigation and page header.
- Transaction-type tabs and reporting-period controls.
- Search, filtering, and category controls.
- Transaction table and pagination.
- Malaysian financial institution icons.
- Right-side Add Transaction form.
- Form field order, section structure, layout proportions, and visual styling.

All forms, filters, buttons, and transaction operations must function with the existing application logic.

**C. Accounts & Transfers — `image-gen-4(8).png`**

Implement the approved design's:

- Account balance summary.
- Malaysian bank/e-wallet account cards.
- Authentic-looking, appropriately licensed account iconography from existing assets.
- Account-management controls.
- Right-side transfer form.
- Recent account transactions.
- Account summary chart and breakdown.
- Consistent spacing, typography, proportions, colors, and composition.

Preserve RFT's approved **manual account-tracking model**. Do not implement live bank connections, actual external money transfers, or imply that tracked balances are verified bank balances merely because a mockup depicts such controls.

**D. Insights & Budgets — `image-gen-5(4).png`**

Implement the approved design's:

- Financial insights and budget overview.
- Category expense distribution.
- Month-to-month income and expense comparisons.
- Budget progress.
- Goal progress.
- Consistent chart, card, icon, typography, and spacing treatments.
- Shared sidebar and page structure.

Insights must use actual authorized user data and correct financial calculations. Do not introduce fabricated recommendations or sample statistics as real financial records.

### Approved public homepage

**E. Homepage Concept A — `image-gen-2(9).png`**

This is the approved homepage direction.

Implement its:

- RFT logo and top navigation.
- Large marketing headline: **"Track your money. A brighter tomorrow."**
- Supporting value proposition.
- Prominent Google sign-in CTA.
- Large desktop dashboard preview.
- Structured feature sections.
- Consistent green-accented branding, typography, spacing, surfaces, and composition.

The homepage must closely resemble this approved reference, not the current simplified homepage.

The alternative two-phone homepage design is **not approved as the primary homepage design**.

### Design fidelity requirement

Use **high visual fidelity**.

Match the approved references closely in:

1. Overall screen composition.
2. Section positioning and visual hierarchy.
3. Grid structure and component proportions.
4. Typography families, sizes, weights, and line heights.
5. Brand colors and semantic colors.
6. Backgrounds, surfaces, borders, shadows, and radii.
7. Navigation structure.
8. Buttons, forms, cards, and tables.
9. Chart styling and information presentation.
10. Icon sizing, positioning, and consistency.
11. Whitespace and alignment.
12. Responsive adaptations.

Pixel-perfect reproduction is not required where viewport differences, accessibility, dynamic content, or functional requirements make it inappropriate. However, materially different compositions and unrelated visual interpretations are unacceptable.

Do not introduce a new visual direction.

## 3. Mandatory repository and current-state audit

Before changing implementation files, inspect the actual state of the existing Codex task and repository.

Read and understand the relevant:

- Root project instructions.
- Existing handoff requirements, including the Version 2.1 design-authority correction if installed.
- Current frontend implementation.
- Shared design components and styling.
- Application routes.
- Existing authentication and Supabase integrations.
- Financial domain logic.
- Existing tests.
- Git branch, working tree, commits, and uncommitted modifications.
- Current development server and available browser previews.
- Earlier implementation work and verification results in this Codex task.

Do not assume the current project is still the empty repository described by the initial handoff.

Determine which features are already working, which visual components need replacement, and which parts must remain untouched.

Produce a concise internal implementation plan that preserves completed work.

**Do not reset the repository, discard uncommitted changes, or start over unnecessarily.**

## 4. Mandatory image inspection and approval mapping

Inspect the complete contents of:

`C:\Users\moham\OneDrive\Desktop\rft\assets`

Open and visually examine the actual image contents, not just their filenames.

Classify the images into:

- Approved desktop UI mockups.
- Mobile UI mockups.
- Marketing homepage concepts.
- RFT logos and favicons.
- Google and MFA artwork.
- Malaysian banking and e-wallet icons.
- Composite image sheets.
- Alternative or superseded designs.
- Other relevant visual assets.

### Resolve reference filenames

The approved names above identify images supplied in my ChatGPT conversation. The copies in `assets/` may use different filenames.

Use visual content to map each approved reference to its exact existing local file.

Create a concise design-reference register recording:

- Approved screen.
- Exact local image path.
- Thumbnail or contact-sheet reference.
- Intended implementation route.
- Approval status.
- Excluded alternatives.
- Any remaining ambiguity.

The five selected concepts in Section 2 are already approved. **Do not reopen the creative-direction decision.**

If you can unambiguously identify the corresponding local files, record the mapping and use them. If multiple assets are plausible matches, present a numbered contact sheet with exact filenames and request my selection before implementing the affected screens.

Never silently select a different design.

### Mobile design authority

Existing approved mobile mockups must also be treated as binding references.

Inspect mobile images and identify their intended screens.

If competing mobile concepts exist and their approval status is uncertain, present the relevant alternatives for my selection. Allow multiple selections.

Do not declare a mobile design approved based solely on its presence in `assets/`.

Where no approved mobile reference exists, use the desktop design's visual language to prepare the minimum necessary responsive adaptation. Obtain approval for material visual decisions before implementing the affected layout.

**Design approval gate:** Do not implement mockup-governed screens until the authoritative local references and any necessary mobile selections are resolved. You may continue independent, safe engineering and test work while waiting for a required design decision.

## 5. Mandatory use of installed skills

Read and use the relevant installed project-local skills rather than ignoring them.

The most relevant include:

- `.agents/skills/frontend-design/`
- `.agents/skills/ui-ux-pro-max/`
- `.agents/skills/web-design-guidelines/`
- `.agents/skills/vercel-react-best-practices/`
- `.agents/skills/vercel-composition-patterns/`
- `.agents/skills/webapp-testing/`
- `.agents/skills/systematic-debugging/`
- `.agents/skills/verification-before-completion/`

Consult the Supabase-related skills when changes affect authentication, data integration, or financial operations.

Read the relevant `SKILL.md` files and supporting materials when applicable.

Use these skills for:

- Accurate implementation of the approved visual designs.
- Clean React component architecture.
- Responsive layout behavior.
- Accessibility.
- Performance.
- Browser-based testing.
- Screenshot inspection.
- Regression prevention.
- Root-cause debugging.
- Evidence-based verification.

**Skill recommendations are subordinate to my approved mockups.**

Do not install redundant skills or generate alternative design concepts because a skill suggests doing so.

## 6. Implement real, reusable, functional UI

Build the approved screens using actual Next.js and React components.

Do not use whole mockup images as substitutes for functional application interfaces.

You may use approved artwork as actual image assets where appropriate.

### Shared components

Establish or correct shared components for:

- Application sidebar and navigation.
- Page headers.
- Financial summary cards.
- Account cards.
- Transaction tables.
- Filters and selectors.
- Transaction forms and dialogs.
- Buttons and form controls.
- Charts and legends.
- Financial institution icons.
- Empty, loading, error, and success states.

Create reusable components where beneficial, without unnecessary abstractions.

### Design system

Derive the actual design tokens from the approved images.

Do not impose a generic Tailwind, shadcn/ui, or AI-generated theme when it visually conflicts with the references.

The design system must establish consistent:

- Typography.
- Colors.
- Spacing.
- Component sizing.
- Radii.
- Borders and shadows.
- Iconography.
- Navigation.
- Motion.
- Responsive behavior.

Use **Lucide icons** for general UI actions and appropriate existing branded artwork for Malaysian financial institutions.

Preserve the original files in `assets/`. Derived assets may be optimized and organized under appropriate application directories, with their source paths documented.

### No AI Slop

Do not introduce:

- Generic SaaS dashboard compositions.
- Random gradients or unnecessary glassmorphism.
- Repetitive identical cards disconnected from the mockups.
- Arbitrary colors or typography.
- Decorative animations without functional purpose.
- Fake financial statistics.
- Invented testimonials, user counts, ratings, or endorsements.
- Excessive interface complexity.
- Placeholder images where a suitable approved asset exists.
- Generic AI-generated copy that replaces approved wording without justification.

The objective is faithful implementation of the specific reference designs, not a new design exercise.

## 7. Preserve functionality, security, and project scope

This visual correction must not destroy completed application functionality.

Preserve the existing:

- Google OAuth.
- Optional TOTP MFA.
- Supabase authentication and session handling.
- Database schema and Row Level Security.
- User-data isolation.
- Accounts and transaction management.
- Atomic internal transfers.
- Exact MYR financial calculations.
- Reporting periods.
- Behavioural insights and budgets.
- CSV export.
- Account deletion.
- English and Bahasa Melayu support.
- PWA behavior.

Do not redesign or replace the database architecture merely to implement the approved UI.

Use the existing API contracts and domain services wherever feasible.

If a frontend change reveals an integration defect, diagnose it and implement a narrowly scoped, tested fix within existing authorization boundaries.

Never expose privileged Supabase credentials, modify real user financial data destructively, or weaken security to make a visual feature work.

### Functionality depicted but outside scope

Some mockups contain elements that could imply features not approved for Version 1.

Examples include automatic bank linking, transfers to external recipients, unimplemented recurring-payment capabilities, or fabricated marketing statistics.

Preserve the applicable visual design without inventing those capabilities.

Replace misleading functionality or claims with truthful, in-scope equivalents. For any material conflict with the approved composition, document the issue and obtain a focused decision.

Financial calculations and privacy take priority over literal reproduction of a misleading mockup detail.

## 8. Implementation sequence

Execute the recovery in controlled phases.

### Phase 1 — Establish authoritative references

- Audit the existing repository and current task state.
- Inspect relevant existing skills.
- Inspect all images.
- Map approved mockups to exact local paths.
- Resolve necessary mobile-reference ambiguity.
- Document the design system and screen-specific fidelity requirements.

**Exit criterion:** Approved source designs are reliably identified and ready for implementation.

### Phase 2 — Shared visual foundation

- Extract design tokens.
- Implement consistent typography.
- Correct shared navigation.
- Build or refactor reusable visual components.
- Integrate RFT branding and appropriate icons.
- Preserve existing application functionality.

**Exit criterion:** The application has a shared foundation matching the approved visual system.

### Phase 3 — Public homepage

Rebuild the current homepage to faithfully reproduce approved Homepage Concept A.

Implement its layout, typography, marketing content, dashboard presentation, CTA, feature sections, and responsive behavior.

Compare real browser screenshots against the approved reference and correct discrepancies before declaring this phase complete.

### Phase 4 — Core desktop application

Implement the approved:

1. Dashboard.
2. Transactions.
3. Accounts & Transfers.
4. Insights & Budgets.

Preserve each screen's distinctive composition while maintaining a consistent shared design system.

Connect functional controls to the existing application services.

After each screen, perform browser inspection and record material discrepancies.

### Phase 5 — Mobile and tablet

Implement the approved mobile references where available.

Adapt all relevant screens to practical tablet and mobile layouts without introducing an unrelated aesthetic.

Verify navigation, forms, charts, large monetary values, long labels, and touch interactions.

### Phase 6 — Supporting application screens

Bring authentication, MFA, onboarding, settings, dialogs, errors, and other required interfaces into the approved design system.

Preserve all relevant security boundaries.

### Phase 7 — Visual and functional verification

Perform the full validation process specified below.

Correct failures and repeat affected tests.

### Phase 8 — Conditional release

Proceed under the previously authorized RFT deployment policy only if all design, security, financial-integrity, operational, and production requirements pass.

Otherwise, stop the affected release operation and report the blocker.

## 9. Mandatory visual verification

**A successful build is not proof of design fidelity.**

Use the available local browser and web-testing tools to inspect the actual rendered application.

For each approved screen:

1. Open the approved reference image.
2. Open the corresponding actual application route.
3. Match the relevant viewport dimensions where practical.
4. Capture a real implementation screenshot.
5. Compare the screenshots side by side.
6. Identify visual differences.
7. Correct material differences in the code.
8. Render and compare again.
9. Record the final result and remaining exceptions.

### Required comparison criteria

Check:

- Overall page structure.
- Component placement.
- Grid columns and proportions.
- Sidebar and navigation dimensions.
- Spacing and alignment.
- Typography hierarchy.
- Financial amount presentation.
- Colors and contrast.
- Borders, radii, and shadows.
- Charts and legends.
- Icons and branding.
- Form composition.
- Responsive behavior.
- Interaction and accessibility.

Do not rely exclusively on automated screenshot-difference metrics. Judge actual visual discrepancies using the approved mockup and objective design criteria.

### Required viewport coverage

Test representative:

- Narrow mobile screens.
- Standard mobile screens.
- Tablet screens.
- Desktop screens.
- Wider desktop screens.

Include relevant populated, empty, loading, and error states.

Use synthetic financial data for testing. Never expose real personal financial information in screenshots or test artifacts.

## 10. Mandatory regression testing

After the visual correction, run relevant existing tests and additional tests where necessary.

Verify:

- Application build, TypeScript, and linting.
- Correct financial calculations.
- Account balance reconciliation.
- Income and expense tracking.
- Transaction CRUD.
- Internal transfer accounting.
- Supabase ownership protections.
- Google OAuth and MFA behavior.
- Relevant authenticated routes.
- Data export and deletion.
- Charts and reporting filters.
- English/Bahasa Melayu rendering.
- Responsive navigation and forms.
- Accessibility and keyboard interactions.
- PWA behavior.

Do not run destructive tests against production financial records.

Do not claim a test passed unless you actually executed it and observed its result.

If verification is unavailable because of access or environment limitations, record the test as blocked or not run, not passed.

## 11. Completion criteria

This task is not complete merely because you viewed the images, read the skills, changed some CSS, or generated screenshots.

Completion requires:

- Approved designs correctly mapped to local assets.
- Every required UI screen implemented using the approved references.
- Real React components, not mockup screenshots masquerading as an application.
- Consistent design system and Lucide iconography.
- Appropriate reuse of original branding and financial account assets.
- Desktop, tablet, and mobile interfaces verified.
- Material visual discrepancies corrected or explicitly approved.
- Existing application functionality preserved.
- Relevant tests passed.
- Security and financial integrity preserved.
- No unauthorized spending.
- Production release conditions satisfied before deployment.

A functioning application with substantial visual divergence from the approved references is **not complete**.

Likewise, a visually faithful application with broken financial calculations or security is **not complete**.

Both dimensions must pass.

## 12. Production deployment authorization

The existing RFT conditional autonomous production-release authorization remains in effect.

You may continue implementation, debugging, testing, and the previously authorized Git workflow independently.

Production deployment is allowed **only when every required engineering and visual acceptance gate has verifiably passed**.

Additional mandatory visual gates:

- The authoritative mockups have been explicitly identified.
- Required mobile design decisions have been resolved.
- The approved layouts are faithfully implemented.
- Real screenshots have been reviewed against the approved images.
- Material deviations have been corrected or approved.
- Functional regression checks have passed.

Also preserve existing release gates for security, database integrity, authentication, recovery, privacy, infrastructure and the RM0 budget.

Do not deploy an unfinished visual implementation merely because the original application passed an earlier build.

Do not perform destructive production database operations without the separate authorization required by the existing handoff.

If a required condition fails, preserve progress and report the exact blocker.

## 13. Autonomy, progress, and interruptions

Continue the existing Codex task rather than starting a new project.

Do not repeat discovery questions whose answers are established in this directive.

Make ordinary technical implementation decisions independently when they do not conflict with approved designs or protected requirements.

Ask for input only when necessary, particularly for:

- Ambiguous approved-image mapping.
- Competing mobile mockups.
- Material changes to approved visual compositions.
- New access or permissions that require my involvement.
- Genuine safety, cost, or protected-release blockers.

Keep a concise implementation progress record with actual completed work, changed files, test results, and next actions.

If interrupted by a usage limit, session termination, or another environmental constraint, preserve the current state and provide an accurate resume point. Do not claim to be continuing work in the background unless the environment actually supports that.

Do not use the usage limit as justification to skip verification or declare the task finished.

## 14. Required final report

When the work is complete—or if a genuine blocker prevents completion—report:

### A. Implementation summary

Identify the application screens and components modified, including the actual file paths.

### B. Approved reference mapping

For each approved screen, identify its exact source image inside `assets/` and corresponding application route.

### C. Visual verification

Provide real implementation screenshots or their accessible file locations, reference comparisons, significant corrections, and any unresolved discrepancies.

### D. Functional verification

List actual checks executed, their results, failures, and corrective actions.

### E. Repository changes

Summarize Git commits, branches, modified files, and relevant pull requests.

### F. Deployment status

State whether the application remains local, has a preview deployment, or was successfully released to production.

Provide the real public URL only if it has actually been deployed and verified.

### G. Remaining issues

Identify material limitations and specific actions I must take, using plain language.

Do not fabricate success, screenshots, test output, or deployment confirmation.

---

## 15. Final operating instruction

**The approved mockups define what RFT must look like. The existing codebase defines what has already been implemented. The existing handoff defines the protected engineering requirements. Your job is to bring these together into one accurate, functional, visually faithful application.**

Do not redesign RFT from imagination.

Do not treat installed skills as substitutes for approved visual references.

Do not treat image inspection as completed implementation.

Do not overwrite functioning backend systems unnecessarily.

Do not sacrifice financial accuracy, privacy, accessibility, or RM0 compliance for visual fidelity.

**First audit the current code and map the authoritative reference images. Then implement the approved designs faithfully, compare the rendered results against those references, correct discrepancies, preserve existing functionality, and proceed through the protected release process only when all mandatory gates pass.**