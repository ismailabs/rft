import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";

const A = "00000000-0000-4000-8000-000000000001",
  B = "00000000-0000-4000-8000-000000000002";
const sessionA = "00000000-0000-4000-8000-000000000011",
  sessionB = "00000000-0000-4000-8000-000000000012";
const accountA = "00000000-0000-4000-8000-000000000021",
  accountB = "00000000-0000-4000-8000-000000000022",
  wallet = "00000000-0000-4000-8000-000000000023";
const category = "00000000-0000-4000-8000-000000000031",
  foreignCategory = "00000000-0000-4000-8000-000000000032";
let db: PGlite;
async function asUser(
  id = A,
  aal = "aal1",
  session = id === A ? sessionA : sessionB,
) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: id, aal, session_id: session }),
  ]);
  await db.exec("set role authenticated");
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create table auth.identities(user_id uuid references auth.users(id) on delete cascade,provider text);
    create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id) on delete cascade,not_after timestamptz);
    create table auth.mfa_factors(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id) on delete cascade,status text);
    create function auth.jwt() returns jsonb language sql stable as $$ select current_setting('request.jwt.claims',true)::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    grant usage on schema public,auth to authenticated,anon;
    grant execute on function auth.jwt(),auth.uid() to authenticated,anon;
    insert into auth.users values('${A}'),('${B}');
    insert into auth.identities values('${A}','google'),('${B}','google');
    insert into auth.sessions values('${sessionA}','${A}',null),('${sessionB}','${B}',null);`);
  for (const file of readdirSync("supabase/migrations")
    .filter((file) => file.endsWith(".sql"))
    .sort())
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  await asUser();
  await db.exec(`insert into public.accounts(id,user_id,name,type,opening_balance,opened_at) values('${accountA}','${A}','Synthetic bank','bank',100,'2026-01-01'),('${wallet}','${A}','Synthetic wallet','ewallet',20,'2026-01-01');
    insert into public.categories(id,user_id,name,type) values('${category}','${A}','Food','expense');`);
  await asUser(B);
  await db.exec(`insert into public.accounts(id,user_id,name,type,opening_balance,opened_at) values('${accountB}','${B}','Synthetic other user','bank',0,'2026-01-01');
    insert into public.categories(id,user_id,name,type) values('${foreignCategory}','${B}','Foreign food','expense');`);
});
afterAll(async () => db?.close());
describe("PostgreSQL RLS and integrity in isolated PGlite", () => {
  it("denies foreign SELECT UPDATE DELETE and owner reassignment", async () => {
    await asUser();
    expect(
      (await db.query("select id from public.accounts")).rows,
    ).toHaveLength(2);
    expect(
      (
        await db.query(
          "update public.accounts set name=$1 where id=$2 returning id",
          ["bad", accountB],
        )
      ).rows,
    ).toHaveLength(0);
    expect(
      (
        await db.query("delete from public.accounts where id=$1 returning id", [
          accountB,
        ])
      ).rows,
    ).toHaveLength(0);
    await expect(
      db.query("update public.accounts set user_id=$1 where id=$2", [
        B,
        accountA,
      ]),
    ).rejects.toThrow();
    await expect(
      db.query(
        `insert into public.accounts(user_id,name,type,opened_at) values($1,'forged','cash',now())`,
        [B],
      ),
    ).rejects.toThrow();
  });
  it("rejects cross-owner account/category references on insert and update", async () => {
    await asUser();
    for (const [account, cat] of [
      [accountB, category],
      [accountA, foreignCategory],
    ])
      await expect(
        db.query(
          `insert into public.transactions(user_id,account_id,category_id,type,amount,occurred_at) values($1,$2,$3,'expense',1,'2026-02-01')`,
          [A, account, cat],
        ),
      ).rejects.toThrow();
    await db.query(
      `insert into public.transactions(id,user_id,account_id,category_id,type,amount,occurred_at) values('00000000-0000-4000-8000-000000000099',$1,$2,$3,'expense',24.90,'2026-02-01')`,
      [A, accountA, category],
    );
    await expect(
      db.query(
        `update public.transactions set category_id=$1 where id='00000000-0000-4000-8000-000000000099'`,
        [foreignCategory],
      ),
    ).rejects.toThrow();
  });
  it("rejects zero, negative, excess precision and nonfinite money without rounding", async () => {
    await asUser();
    for (const amount of [
      "0",
      "-1",
      "1.001",
      "NaN",
      "Infinity",
      "10000000000000000",
    ])
      await expect(
        db.query(
          `insert into public.transactions(user_id,account_id,category_id,type,amount,occurred_at) values($1,$2,$3,'expense',$4,'2026-02-01')`,
          [A, accountA, category, amount],
        ),
      ).rejects.toThrow();
  });
  it("enforces opening timestamp, history and category type", async () => {
    await asUser();
    await expect(
      db.query(
        `insert into public.transactions(user_id,account_id,category_id,type,amount,occurred_at) values($1,$2,$3,'expense',1,'2025-01-01')`,
        [A, accountA, category],
      ),
    ).rejects.toThrow();
    await expect(
      db.query(
        `insert into public.transactions(user_id,account_id,category_id,type,amount,occurred_at) values($1,$2,$3,'income',1,'2026-02-01')`,
        [A, accountA, category],
      ),
    ).rejects.toThrow();
    await expect(
      db.query(`update public.accounts set opening_balance=1 where id=$1`, [
        accountA,
      ]),
    ).rejects.toThrow();
  });
  it("single transfer conserves and failed transactions roll back", async () => {
    await asUser();
    await db.query(
      `insert into public.transfers(user_id,source_id,destination_id,amount,occurred_at) values($1,$2,$3,50,'2026-02-01')`,
      [A, accountA, wallet],
    );
    await expect(
      db.query(
        `insert into public.transfers(user_id,source_id,destination_id,amount,occurred_at) values($1,$2,$2,1,'2026-02-01')`,
        [A, accountA],
      ),
    ).rejects.toThrow();
    await expect(
      db.query(
        `insert into public.transfers(user_id,source_id,destination_id,amount,occurred_at) values($1,$2,$3,50,'2026-02-01')`,
        [A, accountA, accountB],
      ),
    ).rejects.toThrow();
    await expect(
      db.transaction(async (tx) => {
        await tx.query(
          `insert into public.transfers(user_id,source_id,destination_id,amount,occurred_at) values($1,$2,$3,1,'2026-02-01')`,
          [A, accountA, wallet],
        );
        throw new Error("SIMULATED_FAILURE");
      }),
    ).rejects.toThrow("SIMULATED_FAILURE");
    expect(
      (await db.query("select * from public.transfers")).rows,
    ).toHaveLength(1);
  });
  it("serializes maximum decimal as text and recomputes history after edits/deletion", async () => {
    await asUser();
    const large = "00000000-0000-4000-8000-000000000077";
    await db.query(
      `insert into public.accounts(id,user_id,name,type,opening_balance,opened_at) values($1,$2,'Synthetic maximum','cash',$3,'2026-01-01')`,
      [large, A, "9999999999999999.99"],
    );
    const snapshot = await db.query<{
      finance_snapshot: { accounts: { id: string; opening_balance: string }[] };
    }>("select public.finance_snapshot()");
    expect(
      snapshot.rows[0].finance_snapshot.accounts.find((a) => a.id === large)
        ?.opening_balance,
    ).toBe("9999999999999999.99");
    await db.query("delete from public.accounts where id=$1", [large]);
    const result = await db.query<{
      finance_snapshot: { transactions: { amount: string }[] };
    }>("select public.finance_snapshot()");
    expect(result.rows[0].finance_snapshot.transactions[0].amount).toBe(
      "24.90",
    );
    await db.exec(
      "update public.transactions set amount=12.30 where id='00000000-0000-4000-8000-000000000099'",
    );
    expect(
      (
        await db.query<{ amount: string }>(
          "select sum(amount)::text as amount from public.transactions",
        )
      ).rows[0].amount,
    ).toBe("12.30");
    await db.exec(
      "delete from public.transactions where id='00000000-0000-4000-8000-000000000099'",
    );
    expect(
      (await db.query("select * from public.transactions")).rows,
    ).toHaveLength(0);
  });
  it("isolates every user-owned table on read, update and delete", async () => {
    await asUser();
    await db.exec(`insert into public.profiles(user_id) values('${A}');
      insert into public.subcategories(id,user_id,category_id,name) values('00000000-0000-4000-8000-000000000041','${A}','${category}','Synthetic child');
      insert into public.transactions(user_id,account_id,category_id,subcategory_id,type,amount,occurred_at) values('${A}','${accountA}','${category}','00000000-0000-4000-8000-000000000041','expense',1,'2026-02-01');
      insert into public.budgets(user_id,category_id,month,amount) values('${A}','${category}','2026-02-01',100);`);
    await asUser(B);
    for (const table of [
      "profiles",
      "accounts",
      "categories",
      "subcategories",
      "transactions",
      "transfers",
      "budgets",
    ]) {
      expect(
        (
          await db.query(
            `select user_id from public.${table} where user_id=$1`,
            [A],
          )
        ).rows,
      ).toHaveLength(0);
      expect(
        (
          await db.query(
            `update public.${table} set user_id=user_id where user_id=$1 returning user_id`,
            [A],
          )
        ).rows,
      ).toHaveLength(0);
      expect(
        (
          await db.query(
            `delete from public.${table} where user_id=$1 returning user_id`,
            [A],
          )
        ).rows,
      ).toHaveLength(0);
    }
    await asUser();
    const wrong = "00000000-0000-4000-8000-000000000042";
    await db.query(
      `insert into public.categories(id,user_id,name,type) values($1,$2,'Other synthetic','expense')`,
      [wrong, A],
    );
    await expect(
      db.query(
        `update public.transactions set category_id=$1 where subcategory_id='00000000-0000-4000-8000-000000000041'`,
        [wrong],
      ),
    ).rejects.toThrow();
    await expect(
      db.query("delete from public.accounts where id=$1", [accountA]),
    ).rejects.toThrow();
  });
  it("enforces optional MFA at table and RPC boundaries", async () => {
    await db.exec("reset role");
    await db.query(
      "insert into auth.mfa_factors(user_id,status) values($1,'unverified')",
      [A],
    );
    await asUser();
    expect((await db.query("select * from public.accounts")).rows).toHaveLength(
      2,
    );
    await db.exec("reset role");
    await db.query(
      "update auth.mfa_factors set status='verified' where user_id=$1",
      [A],
    );
    await asUser();
    expect((await db.query("select * from public.accounts")).rows).toHaveLength(
      0,
    );
    await expect(
      db.query("select public.finance_snapshot()"),
    ).rejects.toThrow();
    expect(
      (await db.query("update public.accounts set name=name returning id"))
        .rows,
    ).toHaveLength(0);
    expect(
      (await db.query("delete from public.accounts returning id")).rows,
    ).toHaveLength(0);
    await expect(
      db.query(
        `insert into public.accounts(user_id,name,type,opened_at) values($1,'bypass','cash',now())`,
        [A],
      ),
    ).rejects.toThrow();
    await asUser(A, "aal2");
    expect((await db.query("select * from public.accounts")).rows).toHaveLength(
      2,
    );
  });
  it("revoked or mismatched sessions fail closed even with AAL2", async () => {
    await asUser(A, "aal2", sessionB);
    expect((await db.query("select * from public.accounts")).rows).toHaveLength(
      0,
    );
    await asUser(A, "aal2", "00000000-0000-4000-8000-000000000088");
    expect((await db.query("select * from public.accounts")).rows).toHaveLength(
      0,
    );
  });
  it("anonymous role cannot read or invoke snapshot", async () => {
    await db.exec("reset role; set role anon");
    await expect(db.query("select * from public.accounts")).rejects.toThrow();
    await expect(
      db.query("select public.finance_snapshot()"),
    ).rejects.toThrow();
  });
  it("initializes BM taxonomy once without duplicating on later locale choices", async () => {
    const user = "00000000-0000-4000-8000-000000000003",
      session = "00000000-0000-4000-8000-000000000013";
    await db.exec("reset role");
    await db.query("insert into auth.users(id) values($1)", [user]);
    await db.query("insert into auth.identities values($1,'google')", [user]);
    await db.query("insert into auth.sessions values($1,$2,null)", [
      session,
      user,
    ]);
    await asUser(user, "aal1", session);
    await db.query("select public.initialize_profile('ms')");
    expect(
      (await db.query("select name from public.categories")).rows,
    ).toHaveLength(15);
    expect(
      (await db.query("select name from public.categories where name='Gaji'"))
        .rows,
    ).toHaveLength(1);
    await db.query("select public.initialize_profile('en')");
    expect(
      (await db.query("select name from public.categories")).rows,
    ).toHaveLength(15);
  });
  it("restores synthetic database bytes, exact money and owner isolation", async () => {
    await asUser(A, "aal2");
    const before = (
      await db.query<{ finance_snapshot: unknown }>(
        "select public.finance_snapshot()",
      )
    ).rows[0].finance_snapshot;
    await db.exec("reset role");
    const backup = await db.dumpDataDir("none");
    const restored = new PGlite({ loadDataDir: backup });
    try {
      await restored.query("select set_config('request.jwt.claims',$1,false)", [
        JSON.stringify({ sub: A, aal: "aal2", session_id: sessionA }),
      ]);
      await restored.exec("set role authenticated");
      expect(
        (
          await restored.query<{ finance_snapshot: unknown }>(
            "select public.finance_snapshot()",
          )
        ).rows[0].finance_snapshot,
      ).toEqual(before);
      expect(
        (
          await restored.query(
            "select * from public.accounts where user_id=$1",
            [B],
          )
        ).rows,
      ).toHaveLength(0);
      await restored.exec("reset role");
      await restored.query("select set_config('request.jwt.claims',$1,false)", [
        JSON.stringify({ sub: A, aal: "aal1", session_id: sessionA }),
      ]);
      await restored.exec("set role authenticated");
      expect(
        (await restored.query("select * from public.accounts")).rows,
      ).toHaveLength(0);
    } finally {
      await restored.close();
    }
  });
  it("identity deletion cascades all app rows and stale tokens cannot access", async () => {
    await db.exec("reset role");
    await db.query("delete from auth.users where id=$1", [A]);
    for (const table of [
      "profiles",
      "accounts",
      "categories",
      "subcategories",
      "transactions",
      "transfers",
      "budgets",
    ])
      expect(
        (await db.query(`select * from public.${table} where user_id=$1`, [A]))
          .rows,
      ).toHaveLength(0);
    await asUser(A, "aal2");
    expect((await db.query("select * from public.accounts")).rows).toHaveLength(
      0,
    );
    await expect(
      db.query("select public.finance_snapshot()"),
    ).rejects.toThrow();
  });
});
