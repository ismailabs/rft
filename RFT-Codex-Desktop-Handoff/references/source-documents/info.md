# Malaysian Personal & Behavioural Finance Tracker

Product strategy · Technology architecture · UI/UX · Codex Desktop · Agent skills

## 1. Recommended AI model and reasoning effort

RECOMMENDED CONFIGURATION

## GPT-6.1 Sol · Extra High

Recommended

This is my recommended default for planning, designing, architecting, and implementing your application with Codex Desktop.

OpenAI's official model-selection guidance identifies GPT-6.1 Sol at Extra High as suitable for polished deliverables, interconnected visual systems, and difficult decisions. It also cautions that higher reasoning effort increases usage without guaranteeing better results.

![](https://www.google.com/s2/favicons?domain=https://developers.openai.com&sz=32)

OpenAI API

+1

|Reasoning effort|Recommended use|
|---|---|
|High|Routine features, UI refinements, small bug fixes|
|Extra High|Product architecture, design system, major features, complex implementation|
|Max|Difficult security, authentication, database and financial-calculation problems|
|Ultra|Not listed as a separate GPT-6.1 Sol API reasoning-effort value in the current official documentation|

The documented API levels include `high`, `xhigh` (Extra High), and `max`.

![](https://www.google.com/s2/favicons?domain=https://developers.openai.com&sz=32)

OpenAI API

+1

Decision: Use GPT-6.1 Sol with Extra High for the core development workflow. Escalate individual difficult tasks to Max when justified, rather than keeping every task at the highest setting.

## 2. Product vision

The product should not feel like accounting software. It should help ordinary Malaysians understand their money without needing financial expertise.

SUGGESTED PRODUCT PROMISE

# Know where your money goes. Understand why. Make better decisions.

A mobile-first, privacy-conscious personal finance tracker designed around Malaysian spending habits and everyday financial decisions.

Its key difference from a conventional expense tracker should be behavioural understanding, not simply collecting more financial data.

A user should be able to open the app, record a transaction in a few seconds, immediately understand the result, and gradually learn about their financial habits.

The ambition to help millions of Malaysians is reasonable as a product vision, but actual demand, usability, security, and scalability must be validated before claiming that reach.

## 3. Best technology stack combination

I recommend a TypeScript-first Next.js application, hosted on Vercel, with Supabase providing the database and authentication.

This is a strong fit for a mobile-first PWA because it keeps the architecture relatively simple while supporting production-grade security, responsive interfaces, and future growth.

RECOMMENDED SYSTEM ARCHITECTURE

Mobile-first Next.js PWA

React · TypeScript · Tailwind CSS · shadcn/ui

Authenticated requests

Vercel

Hosting, SSR, server functions, deployment

Supabase

PostgreSQL, Google OAuth, MFA, RLS

GitHub + Codex Desktop + automated testing

### Recommended technologies

|Layer|Technology|Why|
|---|---|---|
|Framework|Next.js App Router|Public marketing pages and authenticated app in one project|
|Language|TypeScript|Safer data types and easier maintenance|
|Frontend|React|Reusable, responsive interface|
|Styling|Tailwind CSS|Consistent spacing and visual design tokens|
|UI primitives|shadcn/ui + Radix primitives|Accessible, customisable components without the appearance of a rigid template|
|Icons|Lucide|Consistent, lightweight icons|
|Motion|Motion (`motion.dev`)|Subtle transitions and feedback|
|Charts|Recharts|Spending breakdowns and trends|
|Backend|Next.js Server Actions and Route Handlers|Avoids maintaining a separate backend|
|Database|Supabase PostgreSQL|Relational financial data, transactional consistency|
|Authentication|Supabase Auth|Google OAuth + TOTP MFA|
|Supabase integration|`@supabase/supabase-js` + `@supabase/ssr`|Typed queries, browser/server clients and cookie-based sessions|
|Validation|Zod|Validate amounts, dates and transaction inputs|
|Testing|Vitest + Playwright|Financial-logic tests and real-browser workflows|
|Hosting|Vercel|Preview deployments, production hosting and functions|
|Version control|GitHub|Reviewable changes, CI and rollback history|
|Installable app|Next.js PWA manifest + service worker|Add to home screen on supported mobile browsers|

Supabase specifically recommends `@supabase/ssr` for cookie-based Next.js sessions, although that package remains in beta. Next.js documents native manifest support and service-worker integration for PWAs.

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

+1

### What I would deliberately avoid

Do not introduce a separate Express/NestJS server, microservices, Redis, Kubernetes, an elaborate event system, or a second authentication provider for the MVP.

I would also start without Prisma or another ORM. Use Supabase's typed client, PostgreSQL constraints, and versioned SQL migrations. Add another database abstraction only when there is a proven need.

Do not add AI to the application just because AI is being used to develop it. Financial calculations and early behavioural insights should be deterministic, explainable, and inexpensive to operate.

## 4. What the first version must do

The MVP should contain the complete, dependable core of a finance tracker—not a large set of unfinished features.

|Module|Essential capabilities|
|---|---|
|Authentication|Google-only sign-up/sign-in, sign-out|
|Security|TOTP MFA enrollment and verification, secure sessions|
|Dashboard|Income, expenses, net cash flow, account balances|
|Transactions|Create, view, edit, update and delete|
|Transaction details|Type, amount, category, subcategory, account, date, time, optional note|
|Categories|Useful defaults plus custom categories and subcategories|
|Accounts|Cash, bank accounts, e-wallets, opening balances|
|Transfers|Move money between accounts without recording an expense|
|Filters|Today, this week, this month, custom dates and all time|
|Analysis|Spending by category, basic trends and simple comparisons|
|Data|Download CSV, delete account and associated personal data|
|Settings|Language, MFA, accounts, categories, data management|
|PWA|Installable experience, app icon, standalone display|
|Public website|Product explanation, benefits, how it works, privacy and getting started|

### Essential financial calculation rules

A finance tracker must distinguish money earned, money spent, money moved, and money currently held.

Income

# RM3,500

Expenses

# RM1,250

Net cash flow for the selected period

# +RM2,250

Illustrative example: income minus expenses. This is not necessarily the total money across the user's accounts.

The distinction matters because a bank-to-e-wallet transfer must not inflate expenses. Similarly, an account's actual balance must account for its opening balance and subsequent transactions.

Use `NUMERIC`/decimal values for MYR amounts, not floating-point arithmetic. Store timestamps consistently, display dates in `Asia/Kuala_Lumpur`, and handle custom date-range boundaries correctly.

## 5. Behavioural finance: the product's differentiator

The strongest feature is not another chart. It is helping users recognise patterns and make decisions based on their own recorded data.

Bank Negara Malaysia's 2024 financial capability survey considered financial behaviour, financial well-being, and digital financial literacy amid rising living costs. This provides a credible basis for investigating the problem, although it does not prove demand for this particular app.

![](https://www.google.com/s2/favicons?domain=https://www.fenetwork.my&sz=32)

Financial Education Network

+1

I recommend starting with four behavioural features.

Understand spending patterns

Show which categories consume the largest share of expenditure, and whether they are changing over time.

Simple, personalised insights

Example: “Your food spending is RM45 higher than last week.” Always explain the comparison period and use only available data.

Small, achievable spending goals

Let users optionally set category limits and observe their progress without punitive warnings.

Optional spending reflection

Add a lightweight note such as “Planned” or “Unplanned” to help users understand decisions without requiring additional fields for every transaction.

Avoid guilt-based messages, anxiety-inducing alerts, competitive financial rankings, and artificial streaks. The objective is useful awareness, not compulsive engagement.

## 6. Mobile-first UI/UX direction

Design principle: calm financial clarity, not a complicated fintech dashboard.

![GPT Image 2 Prompt Guide: How to Write Prompts That Actually Work | iMini AI](https://images.openai.com/static-rsc-4/hvLIVun8p3OvhlYchXMXRfMeiakJLiiAEVj1fZjoIWyXoNvTSvgFOZMy4HMa5LUlm95m0Xd4bUykrQDkimPVSC0KpEBOXl-dgbJuZLz269jk8oFWQJopr5nuV19UPWPJd3tuUtMFuICtvlGjdhQ3vBiuye0RvZvm-ddxMpJh0V0?purpose=inline)

Visual reference: quiet typography, simple balances and clear transaction history.

![MoneyFlow — Minimal Expense Tracker Mobile App by Slow Studio on Dribbble](https://images.openai.com/static-rsc-4/b9r68Y449Iag4nzT7N-iiVdHOhKQBsuY4lPo0nYNcDlyID3RVGwMcjgThe6t714KFA6IXYZJPG8ZYnl6HCTBuGXa-wLa10u6CO9ylLCwk84OPK4yLuhzEs_rWXIUjX4LJlMK8qRLgrZuUzdA4VoKOHia2rYUuhJRMxLIHiyhJIs?purpose=inline)

Visual reference: a focused transaction-entry flow with minimal visual clutter.

These are directional visual references, not approved mockups or the final application design.

### Recommended design system

|Element|Direction|
|---|---|
|Visual language|Minimal, warm, trustworthy, understated|
|Background|Warm off-white `#F7F7F4`|
|Text|Deep charcoal `#202521`|
|Accent|Muted teal `#287566`|
|Secondary color|Soft grey and subtle natural tones|
|Geometry|Rounded corners, mostly 14–20px|
|Typography|A carefully selected readable sans-serif, such as DM Sans|
|Layout|Generous spacing, strong numerical hierarchy|
|Animations|Subtle, purposeful and brief; respect reduced-motion settings|
|Accessibility|High contrast, visible focus states, comfortable touch targets|
|Languages|English and Bahasa Melayu; provide a clear language switch|

These are proposed design tokens, not independently established branding requirements. Final color contrast and typography should be verified on real devices.

### Navigation architecture

SUGGESTED MOBILE NAVIGATION

4 destinations

Home

Activity

Insights

Settings

Use a persistent, accessible Add transaction action above the bottom navigation. Avoid crowding the navigation with additional features.

The first screen should prioritise the current financial situation, followed by recent activity and one useful insight. More detailed reporting can live in the Insights screen.

### Transaction entry should be exceptionally fast

For most users, the default flow should be:

New expense

Illustrative interaction

# RM 24.90

Category

Food & drinks

Account

Cash

Date and time

Today, now

Save expense

The application should default to the current date/time and remember the user's last-used account. Notes and subcategories should remain optional. The goal is to minimise interaction cost without sacrificing accurate data.

## 7. Public homepage structure

The public homepage and the authenticated dashboard should be separate experiences.

|Section|Purpose|Recommended content|
|---|---|---|
|Hero|Immediately communicate value|Clear headline, short supporting line, strong CTA|
|Product preview|Show the actual application|Large, realistic mobile dashboard presentation|
|The problem|Demonstrate understanding|Tracking spending is tedious; money disappears without clear awareness|
|The solution|Explain the product|Track, understand, improve|
|Core features|Show useful functionality|Transactions, categories, accounts, dashboard, insights|
|Behavioural approach|Explain the difference|Financial habits and understandable personal insights|
|How it works|Reduce perceived effort|Sign in, record transactions, review progress|
|Privacy|Establish trust|Clear data handling, export and deletion controls|
|FAQ and CTA|Resolve doubts|Is it free? Is it secure? Does it connect to banks? Can I install it?|

Suggested headline direction:

> Your money, made clearer.

Supporting copy:

> Track what comes in, see what goes out, and build a better understanding of your financial habits.

For the initial launch, I recommend manual transaction tracking without bank account connections. This reduces security exposure, integration complexity and operating costs. State this clearly on the homepage; do not imply automatic bank synchronisation.

## 8. Best agent skills to install from skills.sh

I recommend installing a small, curated set of skills, rather than dozens of overlapping skills. Too many can create conflicting instructions and unnecessary context usage.

These recommendations are based on the actual skills.sh entries and their documented purposes.

### Core skills — install these first

|Skill|Why it matters|
|---|---|
|[find-skills](https://www.skills.sh/vercel-labs/skills/find-skills?utm_source=chatgpt.com)|Discover relevant skills as the project develops|
|[frontend-design](https://www.skills.sh/anthropics/skills/frontend-design?utm_source=chatgpt.com)|Distinctive visual design; helps avoid generic AI-generated interfaces|
|[web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines?utm_source=chatgpt.com)|Accessibility, usability and UI quality reviews|
|[vercel-react-best-practices](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices?utm_source=chatgpt.com)|React/Next.js performance and implementation practices|
|[supabase](https://www.skills.sh/supabase/agent-skills/supabase?utm_source=chatgpt.com)|Authentication, secure data access, migrations and platform integration|
|[supabase-postgres-best-practices](https://www.skills.sh/supabase/agent-skills/supabase-postgres-best-practices?utm_source=chatgpt.com)|Database design, SQL performance and RLS|
|[verification-before-completion](https://www.skills.sh/obra/superpowers/verification-before-completion?utm_source=chatgpt.com)|Prevents Codex from claiming success without running checks|
|[systematic-debugging](https://www.skills.sh/obra/superpowers/systematic-debugging?utm_source=chatgpt.com)|Investigate root causes instead of repeatedly patching symptoms|

The Vercel and Supabase skills are maintained by their respective ecosystems; the debugging and verification skills provide complementary engineering discipline.

![](https://www.google.com/s2/favicons?domain=https://www.skills.sh&sz=32)

vercel-labs/agent-skills

+5

### Installation commands for Codex Desktop

Run these from the new finance tracker repository, not your existing portfolio website.

```

npx skills add vercel-labs/skills --skill find-skills
npx skills add anthropics/skills --skill frontend-design
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add supabase/agent-skills --skill supabase
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices
npx skills add obra/superpowers --skill verification-before-completion
npx skills add obra/superpowers --skill systematic-debugging
```

Select Codex and the project-local installation option when prompted. The Skills CLI supports Codex and project-scoped installations. Review a skill's source files and security audit before installing; popularity is not a security guarantee.

![](https://www.google.com/s2/favicons?domain=https://www.skills.sh&sz=32)

Skills Documentation

+1

### Additional skills — install when needed

|Skill|When to install|
|---|---|
|[vercel-composition-patterns](https://www.skills.sh/vercel-labs/agent-skills/vercel-composition-patterns?utm_source=chatgpt.com)|As the React component library grows|
|[webapp-testing](https://www.skills.sh/anthropics/skills/webapp-testing?utm_source=chatgpt.com)|During browser-based QA|
|[deploy-to-vercel](https://www.skills.sh/vercel-labs/agent-skills/deploy-to-vercel?utm_source=chatgpt.com)|Once the application is ready for preview deployments|
|[ui-ux-pro-max](https://www.skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max?utm_source=chatgpt.com)|If additional mobile UI/UX references or design-system exploration are useful|

Use `find-skills` when you encounter a real capability gap, rather than installing everything at the beginning.

## 9. Database and security architecture

Because this application handles personal financial records, security must be built into its architecture from the first migration.

### Recommended initial data model

|Table|Responsibility|
|---|---|
|`profiles`|User profile, locale, preferences|
|`accounts`|User's cash, banks, e-wallets and opening balances|
|`categories`|Income and expense classifications|
|`subcategories`|Optional classifications within categories|
|`transactions`|Income and expense entries, timestamps, amounts, account references|
|`transfers`|Account-to-account transfers, implemented atomically|
|`category_budgets`|Optional spending targets|
|`user_settings`|Personal display and application preferences|

Every user-owned table must have an enforceable ownership model. RLS must protect each user's records from other users, with policies for reads, inserts, updates and deletes as applicable.

### Google-only authentication and MFA

Supabase supports Google OAuth, including a server-side integration with Next.js, and authenticator-app TOTP MFA.

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

+1

Recommended flow:

Continue with Google

Supabase validates Google authentication

Complete MFA challenge if enrolled

Authenticated finance dashboard

I recommend offering MFA enrollment during onboarding and in Settings, with clear encouragement to enable it. Sensitive operations should require appropriate recent authentication and additional verification. Account recovery must also be designed before launch.

### Required security controls

- Data isolation: Strict PostgreSQL RLS, server-side ownership checks and negative cross-user access tests.

- Session protection: Secure authentication flows, appropriate cookie handling and MFA assurance checks.

- Financial integrity: Database constraints, atomic transfers, validated amounts and consistent date handling.

- CSV export: Authenticated, complete exports with correct escaping and spreadsheet-formula-injection protection.

- Account deletion: Explicit confirmation, reauthentication, server-controlled deletion, and documented backup/retention handling.

- Infrastructure: Secrets kept server-side, protected production migrations, backups and restore testing.

- PWA privacy: Never indiscriminately cache authenticated financial responses in a shared or persistent service-worker cache.


Supabase's administrative user-deletion operation requires privileged server credentials and must never run with secret keys exposed to the browser.

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

+1

Malaysia's Personal Data Protection Act 2010 and its 2024 amendments also need to be considered. Before a public release, establish a privacy notice, retention policy, deletion process, breach-response procedure, and review applicable cross-border data transfer obligations. The precise legal obligations depend on the final service and operations.

![](https://www.google.com/s2/favicons?domain=https://www.pdp.gov.my&sz=32)

Personal Data Protection

+1

## 10. PWA and production deployment

For the MVP, the PWA should provide a proper installable experience on supported Android and iPhone browsers, with HTTPS, a valid manifest, suitable icons, standalone display and platform-specific installation guidance.

On iPhone, installation guidance needs to account for Safari's Add to Home Screen workflow rather than assuming a universal install prompt. Full offline transaction creation and background synchronisation can come later; they add significant consistency and privacy complexity.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js

For deployment, use separate development and production environments, GitHub pull requests, Vercel previews, reviewed Supabase migrations and explicit production release approval.

Important commercial constraint: Vercel's Hobby plan is limited to personal, non-commercial use. Plan for a suitable paid Vercel tier if the product becomes commercial. Supabase's production checklist also highlights backups, RLS, load testing and availability requirements.

![](https://www.google.com/s2/favicons?domain=https://vercel.com&sz=32)

Vercel

+1

## 11. Recommended ChatGPT + Codex execution workflow

Phase 1 — Product requirements

Define users, problems, MVP scope, financial calculation rules, behavioural features, privacy requirements and acceptance criteria. Keep these in one concise product specification.

Phase 2 — Design approval

Produce original mobile-first mockups of the public homepage, dashboard, transaction entry, activity and insights screens. Validate the design before extensive implementation.

Phase 3 — Secure foundation

Set up Next.js, Supabase, Google authentication, MFA, initial schema, RLS, migrations and protected routes.

Phase 4 — Functional MVP

Implement transaction CRUD, accounts, categories, transfers, dashboard, date filters, CSV export and deletion.

Phase 5 — Behavioural experience

Add simple spending insights, comparisons and optional goals, with clear explanations of every calculation.

Phase 6 — QA and controlled launch

Test on real Android and iPhone devices, verify privacy and account lifecycle, conduct accessibility and security reviews, then release through protected production gates.

### Non-negotiable acceptance criteria

Before production, Codex must provide evidence that financial totals reconcile correctly, transfers do not alter net cash flow, one user cannot access another user's data, OAuth and MFA work end to end, account deletion and CSV export behave correctly, and the application remains usable on narrow mobile screens.

No production deployment should occur solely because Codex reports that the implementation is finished.

## 12. Final recommendations

|Decision|Recommendation|
|---|---|
|AI model|GPT-6.1 Sol|
|Default effort|Extra High|
|Framework|Next.js + TypeScript|
|Backend|Supabase|
|Hosting|Vercel|
|Database|PostgreSQL with strict RLS|
|Authentication|Google OAuth + TOTP MFA|
|Delivery|Mobile-first installable PWA|
|Design|Minimal, calm, rounded, accessible, distinctive|
|Product differentiator|Simple, trustworthy behavioural insights|
|MVP strategy|Manual tracking, strong fundamentals, no unnecessary AI|
|Agent skills|Eight carefully selected core skills|
|Release strategy|Evidence-based QA and explicit production approval|

The most important product decision is to design around one repeated action: record a transaction easily and receive an accurate, useful picture of your money.

Start with that experience, validate it with Malaysian users, and expand only where real evidence shows that additional functionality improves their financial understanding.
