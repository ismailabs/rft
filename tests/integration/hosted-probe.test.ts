import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
const A = "00000000-0000-4000-8000-000000000001",
  B = "00000000-0000-4000-8000-000000000002";
let db: PGlite;
const probe = readFileSync("supabase/tests/hosted-read-only.sql", "utf8");
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key,created_at timestamptz not null);
    create table auth.identities(user_id uuid references auth.users(id) on delete cascade,provider text);
    create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id) on delete cascade,not_after timestamptz,created_at timestamptz not null default now());
    create table auth.mfa_factors(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id) on delete cascade,status text);
    create function auth.jwt() returns jsonb language sql stable as $$ select current_setting('request.jwt.claims',true)::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    grant usage on schema public,auth to authenticated,anon;
    grant execute on function auth.jwt(),auth.uid() to authenticated,anon;
    insert into auth.users values('${A}','2026-01-01'),('${B}','2026-01-02');
    insert into auth.identities values('${A}','google'),('${B}','google');
    insert into auth.sessions(id,user_id) values('00000000-0000-4000-8000-000000000011','${A}'),('00000000-0000-4000-8000-000000000012','${B}');
    insert into auth.mfa_factors(user_id,status) values('${A}','verified'),('${B}','verified');`);
  for (const file of readdirSync("supabase/migrations")
    .filter((f) => f.endsWith(".sql"))
    .sort())
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  await db.exec(`insert into public.profiles(user_id) values('${A}')`);
});
afterAll(async () => db?.close());
afterEach(async () => db.exec("rollback; reset role;"));
it("rehearses all read-only hosted contexts without persistent data or role changes", async () => {
  const results = await db.exec(probe);
  expect(results.at(-1)?.rows).toEqual([
    {
      verification_receipt: {
        status: "passed",
        mode: "read-only SQL claim-context simulation, not signed REST JWTs",
        contexts: 5,
        relations: 8,
        persistent_data_changed: false,
      },
    },
  ]);
  expect(
    (await db.query("select count(*)::int as count from public.profiles")).rows,
  ).toEqual([{ count: 1 }]);
  expect(
    (
      await db.query(
        "select current_user as role,current_setting('transaction_read_only') as read_only",
      )
    ).rows,
  ).toEqual([{ role: "postgres", read_only: "off" }]);
});
it("the probe actually fails when owner isolation is disabled in this disposable database", async () => {
  await db.exec("alter table public.profiles disable row level security");
  try {
    await expect(db.exec(probe)).rejects.toThrow(
      "RFT_PROBE_B_AAL2_FOREIGN_READ_VISIBLE_profiles",
    );
  } finally {
    await db.exec(
      "rollback; reset role; alter table public.profiles enable row level security;",
    );
  }
});
