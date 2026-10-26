# Ringgit Finance Tracker (RFT)

Complete System Architecture · Proposed Production Blueprint · Version 1.0

Ringgit Finance Tracker (RFT) is a mobile-first, installable personal and behavioural finance web application designed for Malaysians.

Its purpose is to help users track their money, understand their spending habits, and make better financial decisions through a simple, trustworthy, and engaging experience.

This architecture establishes how RFT should work, how its components connect, where information is stored, how security is enforced, and how the system can evolve.

Architecture status

Proposed · Not implemented

Recommended approach: A modular monolith built with Next.js, TypeScript, Vercel and Supabase.

A modular monolith means one application and one primary database, internally divided into well-defined modules. It provides sufficient structure without prematurely introducing microservices or multiple backends.

## 1. System architecture overview

RFT consists of six logical layers:

1. Presentation: The public website and mobile-first finance interface.

2. Application: Routing, requests, authentication handling and UI coordination.

3. Business logic: Transactions, account balances, budgets and behavioural insights.

4. Data: PostgreSQL financial records, database constraints and security policies.

5. Platform: Vercel hosting, Supabase services and PWA capabilities.

6. Operations: Testing, monitoring, migrations, backups and deployment controls.


These are logical responsibilities, not six independently deployed services.

### Complete architecture diagram

USER DEVICES

Mobile PWA

Desktop web

Tablet web

Vercel · Next.js Application

Public landing page

Authenticated dashboard

Application services

Server Actions / APIs

Business Rules & Validation

Financial calculations · User ownership · Date ranges · Insights

Supabase Platform

Auth

Google + MFA

PostgreSQL

Financial data

RLS

Data isolation

DEVELOPMENT & OPERATIONS

ChatGPT · Codex Desktop · GitHub · CI/CD · Testing · Monitoring

Important architectural distinction: Users never connect directly to PostgreSQL with database credentials. RFT communicates through authenticated application interfaces and Supabase's controlled APIs. Some Supabase Auth interactions occur directly between the browser and Supabase; financial operations follow the application service layer.

## 2. Technology architecture

|Responsibility|Recommended technology|
|---|---|
|Web framework|Next.js App Router|
|Programming language|TypeScript|
|UI framework|React|
|Styling|Tailwind CSS|
|Component foundations|shadcn/ui and Radix primitives|
|Iconography|Lucide|
|Typography|DM Sans or another validated readable typeface|
|Animation|Motion|
|Data visualisation|Recharts|
|Validation|Zod|
|Application backend|Next.js Server Actions and Route Handlers|
|Authentication|Supabase Auth with Google OAuth and TOTP MFA|
|Database|Supabase PostgreSQL|
|Database access|Supabase JavaScript client and `@supabase/ssr`|
|Authorization|PostgreSQL Row Level Security|
|PWA|Web App Manifest and service worker|
|Hosting and server functions|Vercel|
|Source control|GitHub|
|Unit and integration testing|Vitest|
|Browser/E2E testing|Playwright|
|Development assistance|ChatGPT and Codex Desktop|

Supabase's current Next.js guidance supports cookie-based server-side authentication with separate browser and server clients. Its `@supabase/ssr` package remains in beta, so dependency versions should be pinned and reviewed during upgrades.

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

+1

### Why this combination?

It provides one codebase for the marketing site and the finance application, one primary database, one authentication provider, and one hosting platform.

It also separates the user experience from the financial rules. RFT can have a visually minimal interface while maintaining rigorous transaction validation and security underneath.

## 3. Frontend architecture

RFT has two distinct frontend environments.

Public website — `/`

Explains the problem, product, features, benefits, privacy commitments and how to start. Accessible without authentication and optimised for search engines.

Private application — `/app`

Provides the dashboard, transactions, accounts, financial insights and settings. Requires an authenticated session, with MFA verification when enrolled.

### Recommended route structure

|Route|Purpose|
|---|---|
|`/`|Product homepage|
|`/privacy`|Privacy notice|
|`/terms`|Terms of service|
|`/login`|Continue with Google|
|`/auth/callback`|OAuth callback|
|`/auth/mfa`|MFA challenge and enrollment|
|`/app`|Financial overview|
|`/app/transactions`|Transaction history and editing|
|`/app/accounts`|Financial accounts|
|`/app/insights`|Spending analysis and behaviour|
|`/app/settings`|Preferences, security, export, deletion|

### Mobile interface structure

The primary navigation should have four destinations: Home, Activity, Insights and Settings. Account management can sit within Home or Settings, while transaction creation uses a prominent floating or fixed Add action.

The interface must be designed first for narrow mobile viewports, then adapt to tablet and desktop. Financial values and primary actions should take precedence over decorative content.

### Frontend responsibility boundaries

- Server Components: Initial authenticated data loading and server-rendered page content.

- Client Components: Transaction forms, bottom navigation, interactive filters, charts and animations.

- Shared UI components: Buttons, cards, inputs, dialog sheets, selectors, empty states and feedback messages.

- Design tokens: Typography, colors, spacing, radii and motion standards.


Business-critical calculations must not be implemented independently inside multiple React components. The frontend renders verified results from the shared financial domain logic.

## 4. Core application modules

RFT should be organised around seven primary business modules.

|Module|Main responsibility|
|---|---|
|Identity & Security|Google authentication, sessions, MFA and account lifecycle|
|Accounts|Cash, bank and e-wallet tracking|
|Transactions|Income, expenses, categories, timestamps and CRUD operations|
|Financial Overview|Balances, totals, timeframes and transaction summaries|
|Behavioural Insights|Spending patterns, comparisons and optional goals|
|Data Management|CSV export, account deletion and user preferences|
|Public Experience|Homepage, product information, onboarding and SEO|

Each module should have its own validation rules, business operations, database queries and relevant interface components.

This helps Codex modify one feature without unnecessarily affecting the rest of RFT.

## 5. Financial domain architecture

This is the most important part of the system.

Financial information must be mathematically correct, predictable and traceable. Attractive dashboards are meaningless when their totals are wrong.

### 5.1 Transaction types

Income

Money received

Expense

Money spent

Transfer

Money moved

Examples relevant to Malaysian users:

- Income: Salary, freelance earnings, allowances, gifts.

- Expense: Food, petrol, groceries, utilities, subscriptions, transport.

- Transfer: Cash to bank, Maybank to CIMB, bank to Touch 'n Go eWallet.


In the initial product, these are manually recorded transactions, not automatically imported banking records.

### 5.2 Financial calculation engine

For any selected reporting period:

\[ \text{Net Cash Flow}=\text{Income}-\text{Expenses} \]

For an individual account at a particular date:

\[ \begin{aligned} \text{Balance}={}&\text{Opening Balance}\\ &+\text{Cumulative Income}\\ &-\text{Cumulative Expenses}\\ &+\text{Transfers In}\\ &-\text{Transfers Out} \end{aligned} \]

These cumulative values are calculated from the account's defined starting balance through the requested date.

Example: Bank-to-e-wallet transfer

|   |   |
|---|---|
|Bank account|−RM50|
|E-wallet account|+RM50|
|Change in total tracked money|RM0|
|Income recorded|RM0|
|Expense recorded|RM0|

A transfer must not be counted as spending. If a transfer incurs a fee, the fee must be recorded separately as an expense.

Additional financial rules:

- Store MYR amounts exactly using PostgreSQL `NUMERIC(18,2)`; use decimal-safe arithmetic in application code rather than JavaScript floating-point sums.

- Require positive amounts and model transaction direction explicitly.

- Store timestamps consistently, with `Asia/Kuala_Lumpur` as the default display and reporting timezone.

- Use clear date-range boundaries so transactions cannot be counted twice or omitted.

- Define account opening balances relative to a documented starting date.

- Distinguish refunds from ordinary earnings.

- Support editing past transactions and automatically recomputing affected summaries.

- Treat account balances as user-recorded estimates, not verified bank balances.


### 5.3 Timeframe and dashboard calculations

Example reporting-period selector

TodayWeekMonthAll time

Today

From 12:00 AM to now

A custom date-range selector should also be available in the actual application.

The dashboard must distinguish three measurements:

|Measurement|Meaning|
|---|---|
|Period income|Total incoming earnings during the selected period|
|Period expenses|Total spending during the selected period|
|Period net cash flow|Income minus expenses during that period|
|Account balance at period end|Estimated accumulated funds up to the end of that period|

The current balance and the current month's net cash flow are not interchangeable.

## 6. Database architecture

Database engine: PostgreSQL, managed through Supabase.

RFT should use a relational schema because financial transactions are linked to users, accounts and classifications.

### 6.1 Recommended schema

|Table|Essential fields|Relationship|
|---|---|---|
|`auth.users`|User ID, identity provider information|Managed by Supabase Auth|
|`profiles`|User ID, display name, locale|One per user|
|`accounts`|ID, user ID, name, type, opening balance, start date|One user → many accounts|
|`categories`|ID, user ID, name, transaction type|One user → many categories|
|`subcategories`|ID, user ID, category ID, name|One category → many subcategories|
|`transactions`|ID, user ID, account ID, category ID, subcategory ID, type, amount, timestamp, note|One user → many transactions|
|`transfers`|ID, user ID, source account, destination account, amount, timestamp|One user → many transfers|
|`budgets`|ID, user ID, category ID, period, limit|Optional goals|
|`user_settings`|User ID, timezone, language and preferences|One per user|

### 6.2 Entity relationship diagram

#chatgpt-mermaid-_r_pgf_{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;fill:rgb(255, 255, 255);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_pgf_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_pgf_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_pgf_ .error-icon{fill:rgba(255, 255, 255, 0.03);}#chatgpt-mermaid-_r_pgf_ .error-text{fill:rgb(255, 255, 255);stroke:rgb(255, 255, 255);}#chatgpt-mermaid-_r_pgf_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_pgf_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_pgf_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_pgf_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_pgf_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_pgf_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_pgf_ .marker{fill:rgba(255, 255, 255, 0.498);stroke:rgba(255, 255, 255, 0.498);}#chatgpt-mermaid-_r_pgf_ .marker.cross{stroke:rgba(255, 255, 255, 0.498);}#chatgpt-mermaid-_r_pgf_ svg{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;}#chatgpt-mermaid-_r_pgf_ p{margin:0;}#chatgpt-mermaid-_r_pgf_ .entityBox{fill:rgb(26, 40, 61);stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_pgf_ .relationshipLabelBox{fill:rgba(255, 255, 255, 0.03);opacity:0.7;background-color:rgba(255, 255, 255, 0.03);}#chatgpt-mermaid-_r_pgf_ .relationshipLabelBox rect{opacity:0.5;}#chatgpt-mermaid-_r_pgf_ .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#chatgpt-mermaid-_r_pgf_ .edgeLabel{background-color:rgb(24, 24, 24);}#chatgpt-mermaid-_r_pgf_ .edgeLabel .label rect{fill:rgb(24, 24, 24);}#chatgpt-mermaid-_r_pgf_ .edgeLabel .label text{fill:rgb(255, 255, 255);}#chatgpt-mermaid-_r_pgf_ .edgeLabel .label{fill:rgb(31, 78, 148);font-size:14px;}#chatgpt-mermaid-_r_pgf_ .label{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:rgb(255, 255, 255);}#chatgpt-mermaid-_r_pgf_ .edge-pattern-dashed{stroke-dasharray:8,8;}#chatgpt-mermaid-_r_pgf_ .node rect,#chatgpt-mermaid-_r_pgf_ .node circle,#chatgpt-mermaid-_r_pgf_ .node ellipse,#chatgpt-mermaid-_r_pgf_ .node polygon{fill:rgb(26, 40, 61);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_pgf_ .relationshipLine{stroke:rgba(255, 255, 255, 0.498);stroke-width:1px;fill:none;}#chatgpt-mermaid-_r_pgf_ .marker{fill:none!important;stroke:rgba(255, 255, 255, 0.498)!important;stroke-width:1;}#chatgpt-mermaid-_r_pgf_ [data-look=neo].labelBkg{background-color:rgba(255, 255, 255, 0.5);}#chatgpt-mermaid-_r_pgf_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_pgf_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_pgf_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_pgf_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_pgf_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_pgf_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_pgf_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_pgf_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_pgf_ :root{--mermaid-font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}AUTH_USERSPROFILESACCOUNTSCATEGORIESTRANSACTIONSTRANSFERSBUDGETSUSER_SETTINGSSUBCATEGORIESownsownsownsrecordsrecordssetsconfigurescontainsclassifiesrefinescontainsparticipates

### 6.3 Database integrity principles

Use UUID identifiers, foreign keys, check constraints, appropriate uniqueness rules and indexes.

Each user-owned record must identify its owner. Related accounts, categories and transactions must belong to the same owner; enforce this through database constraints as well as service-level checks.

The `transfers` table represents each transfer as one atomic financial event with two affected accounts. This avoids the inconsistency of creating separate withdrawal and deposit records that could accidentally become disconnected.

Balances should generally be derived from records rather than maintained as independently editable, duplicated totals.

Indexes should prioritise ownership and reporting queries, especially `(user_id, occurred_at)` for transactions and transfers.

## 7. Backend and business-logic architecture

RFT does not require a separate Express or NestJS backend.

Next.js provides server-side capabilities through Server Actions and Route Handlers. These communicate with Supabase using authenticated clients and shared domain services.

### Responsibilities of each backend layer

|Layer|Responsibility|
|---|---|
|Input validation|Ensure supplied data matches expected types and rules|
|Authentication|Verify the requesting identity|
|Authorization|Check ownership and appropriate session assurance|
|Domain services|Apply financial rules|
|Data access|Execute protected database operations|
|Response formatting|Return only data needed by the UI|
|Error handling|Return safe, understandable feedback|

Next.js explicitly advises treating Server Actions and Route Handlers as externally callable endpoints, with authentication and authorization checks even if access is hidden in the interface.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js

+1

### Example: creating a transaction

1. User saves an RM25 food expense

2. Server validates input and identity

Amount, category, account, timestamp, permissions

3. Transaction service applies business rules

Expense classification and ownership consistency

4. Supabase PostgreSQL stores the record

Constraints and Row Level Security enforced

5. Interface refreshes the financial summary

Updated totals, history and spending breakdown

The client may display immediate feedback, but a transaction is only considered saved after the database confirms it.

For concurrent updates, use safe database operations and consistent recomputation rather than trusting locally modified balance values.

## 8. Authentication, authorization and security

### Authentication architecture

The initial authentication method is Google OAuth only.

The user signs in with Google; Supabase Auth establishes the RFT session. If the user has enrolled in MFA, an additional TOTP challenge is required before accessing the private application.

Supabase documents TOTP enrollment, verification and Authenticator Assurance Levels (AAL1 and AAL2).

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

Security is layered:

|Protection|Implementation|
|---|---|
|Identity|Google OAuth through Supabase Auth|
|Additional verification|TOTP MFA|
|Session|Cookie-based SSR session management|
|Route access|Server-side authentication checks|
|Data access|PostgreSQL RLS|
|Ownership|User-scoped queries, foreign-key integrity|
|Secrets|Server-only environment variables|
|Input protection|Zod validation, parameterised database access|
|Abuse prevention|Rate limits and platform protection|
|Transport|HTTPS|
|Sensitive actions|Recent authentication and appropriate MFA assurance|

### RLS: the essential privacy boundary

The ownership rule is straightforward:

> A user can read or modify only financial records that belong to that same authenticated user.

For an owner-scoped table, a typical read policy uses the current Supabase user ID. Create, update and delete operations require their own appropriate rules; updates should check both the existing owner and the resulting owner.

Supabase's RLS documentation describes these separate access policies and how they integrate with Auth.

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

MFA must be enforced at the protected server/data-access boundary, not only by hiding the dashboard behind a challenge screen. RLS and session assurance should remain effective if a malicious client calls an API directly.

The application's browser must never receive privileged Supabase credentials. Sensitive administrative operations require narrowly scoped server-side execution.

## 9. Behavioural finance architecture

RFT should have a dedicated insights engine that interprets recorded transactions and converts them into useful observations.

MVP approach: Deterministic, rule-based insights without an external AI model.

This ensures calculations are reproducible, inexpensive, explainable and not dependent on sending personal financial records to an AI provider.

### How the insights engine works

Transaction history

Income, expenses, categories and timestamps

Financial aggregation

Category totals, comparable periods and spending patterns

Behavioural rules

Evaluate meaningful changes and optional personal goals

Simple, actionable insights

Plain-language explanations supported by recorded data

### Examples of insight rules

|Insight|How it works|
|---|---|
|Spending concentration|Identify categories representing the highest share of expenses|
|Period comparison|Compare equivalent completed periods|
|Recurring patterns|Detect repeated categories or user-labelled recurring expenses|
|Spending goal|Compare actual category expenses against an optional limit|
|Unusual increase|Identify material deviations from a sufficiently established baseline|
|Personal reflection|Let users voluntarily record whether spending was planned|

An illustrative insight might say:

> Food spending was RM40 higher than in the previous comparable week.

The underlying calculation must be available, and an insight should not appear if insufficient data makes the comparison misleading.

### Behavioural design principles

The application should promote awareness, autonomy and understanding, not financial anxiety.

Avoid aggressive warnings, fabricated insights, guilt-based messages, manipulative streaks or pressure to achieve arbitrary financial targets.

Optional goals should remain optional. Users must still receive full value from RFT when they only want a straightforward expense tracker.

## 10. PWA and mobile platform architecture

RFT is a Progressive Web Application.

It uses one responsive web codebase rather than separate Android and iOS applications.

Mobile

Primary experience: touch-friendly interactions, bottom navigation, quick transaction entry and installability.

Desktop

Responsive adaptation: wider dashboards, richer tables and charts, keyboard navigation.

### PWA component responsibilities

|Component|Responsibility|
|---|---|
|Manifest|App identity, name, icon, display mode and theme|
|Service worker|Carefully controlled asset caching and lifecycle|
|Responsive UI|Adapt layouts to device sizes|
|HTTPS|Secure delivery|
|Install experience|Explain supported Add to Home Screen flows|
|Update handling|Help installed clients transition to new releases|
|Offline fallback|Explain unavailable features when disconnected|

Next.js documents the web manifest, service workers and installation features needed to build a PWA.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org&sz=32)

Next.js

### Offline behaviour

For Version 1, I recommend:

- The app is installable.

- Static application resources can be cached appropriately.

- Authenticated financial data requires network connectivity.

- Failed or interrupted saves are clearly reported.

- Sensitive API responses are not stored in service-worker caches.


Do not claim full offline financial tracking in Version 1. It requires a separate design for local encrypted storage, synchronisation, conflict resolution, user switching and device security.

## 11. Malaysian localisation architecture

RFT should feel designed for Malaysians rather than adapted superficially from an overseas finance template.

|Dimension|Recommended behaviour|
|---|---|
|Currency|MYR / RM, displayed with two decimal places|
|Default timezone|`Asia/Kuala_Lumpur`|
|Languages|English and Bahasa Melayu|
|Date format|Clear local day/month/year formatting|
|Accounts|Cash, bank and e-wallet account types|
|Categories|Familiar Malaysian expenditure classifications|
|Amount entry|Numeric mobile keyboard, prominent RM amount|
|Local examples|Makan, petrol, tolls, groceries, subscriptions|
|Accessibility|Large touch targets, readable contrast, screen-reader support|
|Language storage|User-selectable preference with translation keys|

Use internationalisation keys rather than hardcoding English strings into components.

For the initial version, MYR-only tracking is preferable to prematurely supporting multiple currencies and exchange rates.

## 12. Data management, privacy and account lifecycle

RFT will handle highly personal financial information. The product should minimise the data collected, clearly communicate its purposes, and allow users to control their records.

### Data lifecycle

Account creation — Google sign-in and initial preferences

Data storage — Financial records protected by ownership rules

Data maintenance — Create, edit and delete individual records

Data portability — Export transaction history to CSV

Account deletion — Verified and controlled removal workflow

### CSV export

An authenticated export should support selected timeframes and all-time transaction history.

The CSV should contain clearly defined columns such as transaction date, type, amount, account, category, subcategory and note.

Exports need proper escaping, including protection against spreadsheet-formula injection. Generated downloads must not be stored in publicly accessible locations.

### Account deletion

The process should:

1. Explain the consequences and ask for explicit confirmation.

2. Verify the user's identity and appropriate MFA status.

3. Revoke sessions and initiate controlled deletion of associated application data and authentication records.

4. Handle any related stored files and required retention exceptions.

5. Confirm the outcome without exposing deleted financial data.


Supabase notes that deleting an Auth user does not automatically invalidate already-issued access tokens. Short token lifetimes and sensitive-operation session validation must be considered during implementation.

![](https://www.google.com/s2/favicons?domain=https://supabase.com&sz=32)

Supabase Docs

### Malaysia privacy requirements

RFT's legal and operational design must be reviewed against Malaysia's Personal Data Protection Act 2010 and the Personal Data Protection (Amendment) Act 2024. The amendments came into force in stages during 2025.

![](https://www.google.com/s2/favicons?domain=https://www.pdp.gov.my&sz=32)

Personal Data Protection

This includes examining applicable notice, security, retention, cross-border transfer, breach and deletion requirements before public launch.

Privacy architecture principle: Do not sell users' financial records, expose them to advertising trackers, or send them to third-party AI systems without a defined, properly disclosed and justified purpose.

## 13. Infrastructure, deployment and scalability

### Hosting topology

Users across Malaysia

Vercel

Public content, Next.js rendering and application functions

Supabase

Authentication, PostgreSQL database and security policies

Choose the Supabase database region and Vercel server-function region to minimise latency for Malaysian users, subject to actual provider availability and data-residency requirements. Vercel specifically recommends positioning functions near the database.

![](https://www.google.com/s2/favicons?domain=https://vercel.com&sz=32)

Vercel

### Environment separation

|Environment|Purpose|Data|
|---|---|---|
|Local|Codex and developer testing|Synthetic test records|
|Preview/Staging|QA and feature verification|Isolated non-production database|
|Production|Real application users|Real protected records|

Production credentials must never be exposed to preview deployments. Likewise, test fixtures must not be inserted into the production database.

Vercel supports Local, Preview and Production environments, with independently configured environment variables. Preview deployment protection should be enabled.

![](https://www.google.com/s2/favicons?domain=https://vercel.com&sz=32)

Vercel

+1

### Scalability strategy

The architectural goal is scalability without premature complexity.

|Stage|Architecture strategy|
|---|---|
|Initial MVP|Single Next.js application and Supabase database|
|Early adoption|Indexing, pagination, efficient queries and monitoring|
|Growing usage|More efficient reporting queries, measured resource scaling and connection management|
|Larger scale|Selective caching of safe data, background processing where justified, database optimisation|
|Very large scale|Capacity planning, load testing, reliability engineering and architectural changes based on measured bottlenecks|

Do not assume the stack automatically supports millions of concurrent users. That depends on traffic patterns, infrastructure tiers, database capacity, query efficiency and operational investment.

### Monitoring and reliability

RFT should monitor availability, request failures, slow queries, authentication problems and infrastructure costs.

Financial data must not be accidentally exposed through logs, telemetry or analytics. Use redacted, structured operational logs.

Establish database backups, tested recovery procedures, incident-response rules and documented rollback plans. Application rollback does not automatically reverse database migrations.

## 14. Testing and quality assurance architecture

For a finance application, correctness is a release requirement, not simply a development preference.

|Test layer|Primary verification|
|---|---|
|Unit tests|Financial formulas, validations, category logic and insights|
|Database tests|Constraints, migrations, RLS and ownership integrity|
|Integration tests|Transactions, accounts, transfers, reports and exports|
|Authentication tests|OAuth, session refresh, MFA and access denial|
|End-to-end tests|Real user workflows through Playwright|
|Accessibility tests|Keyboard, screen readers, contrast and focus|
|PWA tests|Installation, updates, disconnected behaviour|
|Performance tests|Mobile responsiveness, query latency and load|
|Security tests|Cross-user access attempts and sensitive endpoints|
|Recovery tests|Backups, restore and failure handling|

### Critical invariants

The following must always hold:

- A transfer between two tracked accounts changes neither total tracked funds nor reported income and expenses, excluding separately recorded fees.

- Creating, editing or deleting a transaction updates all affected totals correctly.

- A user cannot read or modify another user's financial records.

- Amounts are never silently rounded through floating-point arithmetic.

- Timeframe filters handle midnight, month boundaries and the local timezone correctly.

- An export contains only authorised records.

- Deleting an account cannot leave its related financial records orphaned or inconsistently counted.

- A failed database operation must not be displayed as a successful save.


CI should block releases when these checks fail.

## 15. Recommended repository architecture

A feature-oriented structure makes the codebase easier for both developers and Codex to understand.

```

ringgit-finance-tracker/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── (protected)/
│   │   │   └── app/
│   │   ├── api/
│   │   └── manifest.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   ├── dashboard/
│   │   ├── insights/
│   │   ├── budgets/
│   │   └── settings/
│   │
│   ├── domain/
│   │   └── finance/
│   │       ├── calculations/
│   │       └── rules/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validation/
│   │   └── utils/
│   │
│   └── proxy.ts
│
├── supabase/
│   ├── migrations/
│   └── tests/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/
│   ├── icons/
│   └── sw.js
│
├── docs/
│   ├── product-requirements.md
│   ├── architecture.md
│   └── decisions.md
│
├── AGENTS.md
├── package.json
└── ...
```

The actual structure can be adjusted to the verified framework version and implementation needs.

Architectural rule for Codex: Every feature should follow the same path—UI → validation → domain service → protected database operation → verified result.

Avoid placing database mutations, complex calculations and component rendering logic into one enormous file.

## 16. Scope and implementation priority

The entire architecture does not need to be implemented simultaneously.

### Version 1 — Core MVP

Priority

Google authentication, MFA, accounts, transaction management, categories, transfers, dashboard, timeframes, CSV export, account deletion, responsive UI and PWA installation.

### Version 1.1 — Behavioural intelligence

Category comparisons, spending trends, optional category budgets, contextual insights and improved personalisation.

### Future versions — Evidence-driven expansion

Recurring transactions, reminders, more detailed reports, improved offline capabilities, and potential financial integrations only after their security, legal and user-value implications are understood.

## 17. Final architectural decisions

|Area|Decision|
|---|---|
|Product identity|Ringgit Finance Tracker (RFT)|
|Audience|Malaysians seeking straightforward personal finance tracking|
|Primary platform|Mobile-first web and installable PWA|
|System style|Modular monolith|
|Application stack|Next.js + React + TypeScript|
|UI|Tailwind CSS + shadcn/ui + Motion|
|Backend|Next.js server capabilities|
|Database|Supabase PostgreSQL|
|Authentication|Google OAuth + TOTP MFA|
|Authorization|User ownership + strict RLS|
|Financial logic|Centralised, exact and deterministic|
|Behavioural logic|Explainable, rule-based insights|
|Localisation|MYR, English/Bahasa Melayu, Malaysia timezone|
|Hosting|Vercel|
|QA|Automated tests and protected deployments|
|MVP boundary|Manual tracking; no bank connections or financial AI|

The central architectural principle for RFT is simple:

The user should experience an uncomplicated finance tracker. Behind that interface, the system must enforce accurate financial rules, strong privacy boundaries, predictable application behaviour and reliable data management.

That separation—simple on the surface, rigorous underneath—should guide every design and implementation decision in Ringgit Finance Tracker.
