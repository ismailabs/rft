import { z } from "zod";
import { parseMoney, decimal, positiveMoney } from "@/domain/finance/money";
const id = z.uuid();
const name = z.string().trim().min(1).max(60);
const amount = z.string().transform((v, ctx) => {
  try {
    return positiveMoney(v);
  } catch {
    ctx.addIssue({ code: "custom", message: "INVALID_AMOUNT" });
    return z.NEVER;
  }
});
const opening = z.string().transform((v, ctx) => {
  try {
    return decimal(parseMoney(v, true));
  } catch {
    ctx.addIssue({ code: "custom", message: "INVALID_AMOUNT" });
    return z.NEVER;
  }
});
const instant = z.iso.datetime({ offset: true });
const common = {
  id,
  occurred_at: instant,
  note: z.string().max(300).default(""),
};
export const mutation = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("account"),
      id,
      name,
      type: z.enum(["cash", "bank", "ewallet"]),
      provider: z.string().max(60).default(""),
      opening_balance: opening,
      opened_at: instant,
    })
    .strict(),
  z
    .object({
      kind: z.literal("account_meta"),
      id,
      name,
      type: z.enum(["cash", "bank", "ewallet"]),
      provider: z.string().max(60),
      archived: z.boolean(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("transaction"),
      ...common,
      account_id: id,
      category_id: id,
      subcategory_id: id.nullable(),
      type: z.enum(["income", "expense"]),
      amount,
      planned: z.boolean().nullable(),
      edit: z.boolean().default(false),
    })
    .strict(),
  z
    .object({
      kind: z.literal("transfer"),
      ...common,
      source_id: id,
      destination_id: id,
      amount,
    })
    .strict(),
  z
    .object({
      kind: z.literal("category"),
      id,
      name,
      type: z.enum(["income", "expense"]),
    })
    .strict(),
  z
    .object({ kind: z.literal("subcategory"), id, name, category_id: id })
    .strict(),
  z
    .object({
      kind: z.literal("category_meta"),
      id,
      name,
      archived: z.boolean(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("subcategory_meta"),
      id,
      name,
      archived: z.boolean(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("budget"),
      id,
      category_id: id,
      month: z.iso.date(),
      amount,
    })
    .strict(),
  z
    .object({ kind: z.literal("locale"), locale: z.enum(["en", "ms"]) })
    .strict(),
  z
    .object({
      kind: z.literal("delete_record"),
      id,
      table: z.enum([
        "transactions",
        "transfers",
        "budgets",
        "accounts",
        "categories",
        "subcategories",
      ]),
    })
    .strict(),
]);
