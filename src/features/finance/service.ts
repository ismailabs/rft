import "server-only";
import { verifiedIdentity } from "@/lib/supabase/auth";
import type { Snapshot } from "@/domain/finance/types";
import { mutation } from "./validation";

export async function loadSnapshot() {
  const identity = await verifiedIdentity();
  const { data, error } = await identity.client.rpc("finance_snapshot");
  if (error || !data) throw new Error("LOAD_FAILED");
  return { ...identity, data: data as Snapshot };
}

export async function mutateFinance(input: unknown) {
  const parsed = mutation.safeParse(input);
  if (!parsed.success) throw new Error("VALIDATION_FAILED");
  const m = parsed.data;
  const { client, user } = await verifiedIdentity();
  let result;
  switch (m.kind) {
    case "locale":
      result = await client
        .from("profiles")
        .upsert(
          { user_id: user.id, locale: m.locale },
          { onConflict: "user_id" },
        )
        .select("user_id");
      break;
    case "delete_record":
      result = await client
        .from(m.table)
        .delete()
        .eq("id", m.id)
        .eq("user_id", user.id)
        .select("id");
      break;
    case "account_meta": {
      const { kind: _, id, ...values } = m;
      void _;
      result = await client
        .from("accounts")
        .update(values)
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");
      break;
    }
    case "category_meta":
    case "subcategory_meta": {
      result = await client
        .from(m.kind === "category_meta" ? "categories" : "subcategories")
        .update({ name: m.name, archived: m.archived })
        .eq("id", m.id)
        .eq("user_id", user.id)
        .select("id");
      break;
    }
    case "transaction": {
      const { kind: _, edit, ...values } = m;
      void _;
      result = edit
        ? await client
            .from("transactions")
            .update(values)
            .eq("id", m.id)
            .eq("user_id", user.id)
            .select("id")
        : await client
            .from("transactions")
            .insert({ ...values, user_id: user.id })
            .select("id");
      break;
    }
    default: {
      const table = {
        account: "accounts",
        transfer: "transfers",
        category: "categories",
        subcategory: "subcategories",
        budget: "budgets",
      }[m.kind];
      const { kind: _, ...values } = m;
      void _;
      result = await client
        .from(table)
        .insert({ ...values, user_id: user.id })
        .select("id");
    }
  }
  if (result.error) {
    if (result.error.code === "23505") throw new Error("CONFLICT");
    if (["23503", "23514", "42501"].includes(result.error.code))
      throw new Error("RECORD_NOT_ALLOWED");
    throw new Error("SAVE_FAILED");
  }
  if (!result.data?.length) throw new Error("RECORD_NOT_ALLOWED");
  return { ok: true };
}
