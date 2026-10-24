"use client";
import { useId, useRef, useState } from "react";
import type {
  Snapshot,
  Transaction,
  Account,
  Category,
  Subcategory,
  Budget,
} from "@/domain/finance/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { localInstant } from "@/domain/finance/periods";
export type FormKind =
  | "transaction"
  | "transfer"
  | "account"
  | "account_meta"
  | "category"
  | "subcategory"
  | "category_meta"
  | "subcategory_meta"
  | "budget";
export type Editable = Transaction | Account | Category | Subcategory | Budget;
const localNow = () =>
  new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 16);
const localTime = (v: string) =>
  new Date(Date.parse(v) + 8 * 3600000).toISOString().slice(0, 16);
export function EntryForm({
  kind,
  data,
  d,
  initial,
  onSave,
  onCancel,
}: {
  kind: FormKind;
  data: Snapshot;
  d: Dictionary;
  initial?: Editable;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
}) {
  const record:
    | {
        id: string;
        type?: Account["type"] | Transaction["type"];
        category_id?: string;
        account_id?: string;
        subcategory_id?: string | null;
        amount?: string;
        occurred_at?: string;
        note?: string;
        planned?: boolean | null;
        name?: string;
        provider?: string;
        archived?: boolean;
      }
    | undefined = initial;
  const [type, setType] = useState<"income" | "expense">(
    record?.type === "income" ? "income" : "expense",
  );
  const [categoryId, setCategoryId] = useState(record?.category_id || "");
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const requestId = useRef("");
  const uid = useId();
  const accounts = data.accounts.filter(
    (a) => !a.archived || a.id === record?.account_id,
  );
  const categories = data.categories.filter(
    (c) =>
      (!c.archived || c.id === record?.category_id) &&
      c.type === (kind === "budget" ? "expense" : type),
  );
  const field = (name: string, label: string, node: React.ReactNode) => (
    <label className="field" htmlFor={`${uid}-${name}`}>
      <span>{label}</span>
      {node}
    </label>
  );
  const input = (
    name: string,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) =>
    field(name, label, <input id={`${uid}-${name}`} name={name} {...props} />);
  const select = (
    name: string,
    label: string,
    options: { id: string; name: string }[],
    props: React.SelectHTMLAttributes<HTMLSelectElement> = {},
  ) =>
    field(
      name,
      label,
      <select id={`${uid}-${name}`} name={name} {...props}>
        <option value="">{d.none}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>,
    );
  const typeField = field(
    "type",
    d.type,
    <select
      id={`${uid}-type`}
      name="type"
      value={type}
      onChange={(e) => {
        setType(e.target.value as "income" | "expense");
        setCategoryId("");
      }}
    >
      <option value="expense">{d.expense}</option>
      <option value="income">{d.income}</option>
    </select>,
  );
  const amountField = input("amount", kind === "budget" ? d.limit : d.amount, {
    required: true,
    inputMode: "decimal",
    autoComplete: "off",
    defaultValue: record?.amount || "",
    placeholder: "0.00",
    className: "amount-input",
    maxLength: 19,
  });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const base = { kind, id: record?.id || requestId.current };
    let payload: unknown;
    try {
      switch (kind) {
        case "account":
          payload = {
            ...base,
            name: values.name,
            type: values.type,
            provider: values.provider,
            opening_balance: values.opening_balance,
            opened_at: localInstant(String(values.opened_at)),
          };
          break;
        case "account_meta":
          payload = {
            ...base,
            name: values.name,
            type: values.type,
            provider: values.provider,
            archived: values.archived === "on",
          };
          break;
        case "transaction":
          payload = {
            ...base,
            type,
            amount: values.amount,
            account_id: values.account_id,
            category_id: categoryId,
            subcategory_id: values.subcategory_id || null,
            occurred_at: localInstant(String(values.occurred_at)),
            note: values.note || "",
            planned: values.planned === "" ? null : values.planned === "true",
            edit: !!record,
          };
          break;
        case "transfer":
          if (values.source_id === values.destination_id)
            throw new Error("SAME_ACCOUNT");
          payload = {
            ...base,
            source_id: values.source_id,
            destination_id: values.destination_id,
            amount: values.amount,
            occurred_at: localInstant(String(values.occurred_at)),
            note: values.note || "",
          };
          break;
        case "category":
          payload = { ...base, name: values.name, type };
          break;
        case "subcategory":
          payload = {
            ...base,
            name: values.name,
            category_id: values.category_id,
          };
          break;
        case "category_meta":
        case "subcategory_meta":
          payload = {
            ...base,
            name: values.name,
            archived: values.archived === "on",
          };
          break;
        case "budget":
          payload = {
            ...base,
            category_id: values.category_id,
            month: `${values.month}-01`,
            amount: values.amount,
          };
          break;
      }
      await onSave(payload);
    } catch (e) {
      const code = e instanceof Error ? e.message : "SERVER_UNAVAILABLE";
      setError(
        code === "SAME_ACCOUNT"
          ? d.sameAccount
          : d.errors[code as keyof typeof d.errors] ||
              d.errors.VALIDATION_FAILED,
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="entry-form">
      {kind === "transaction" ? (
        <>
          {typeField}
          {amountField}
          {select("account_id", d.account, accounts, {
            required: true,
            defaultValue: record?.account_id || "",
          })}
          {select("category_id", d.category, categories, {
            required: true,
            value: categoryId,
            onChange: (e) => setCategoryId(e.target.value),
          })}
          {select(
            "subcategory_id",
            d.subcategory,
            data.subcategories.filter(
              (c) => c.category_id === categoryId && !c.archived,
            ),
            { defaultValue: record?.subcategory_id || "" },
          )}
          {input("occurred_at", d.date, {
            type: "datetime-local",
            required: true,
            defaultValue: record?.occurred_at
              ? localTime(record.occurred_at)
              : localNow(),
          })}
          {input("note", d.note, {
            maxLength: 300,
            defaultValue: record?.note || "",
          })}
          {field(
            "planned",
            d.planned,
            <select
              id={`${uid}-planned`}
              name="planned"
              defaultValue={
                record?.planned === null || !record
                  ? ""
                  : String(record.planned)
              }
            >
              <option value="">{d.unspecified}</option>
              <option value="true">{d.yesPlanned}</option>
              <option value="false">{d.unplanned}</option>
            </select>,
          )}
        </>
      ) : null}
      {kind === "transfer" ? (
        <>
          <p className="hint">{d.transferHelp}</p>
          {select("source_id", d.source, accounts, { required: true })}
          {select("destination_id", d.destination, accounts, {
            required: true,
          })}
          {amountField}
          {input("occurred_at", d.date, {
            type: "datetime-local",
            required: true,
            defaultValue: localNow(),
          })}
          {input("note", d.note, { maxLength: 300 })}
        </>
      ) : null}
      {kind === "account" || kind === "account_meta" ? (
        <>
          {input("name", d.name, {
            required: true,
            maxLength: 60,
            defaultValue: record?.name || "",
          })}
          {field(
            "type",
            d.type,
            <select
              id={`${uid}-type`}
              name="type"
              defaultValue={record?.type || "cash"}
            >
              <option value="cash">{d.cash}</option>
              <option value="bank">{d.bank}</option>
              <option value="ewallet">{d.ewallet}</option>
            </select>,
          )}
          {input("provider", d.provider, {
            maxLength: 60,
            defaultValue: record?.provider || "",
          })}
          {kind === "account" ? (
            <>
              {input("opening_balance", d.opening, {
                inputMode: "decimal",
                required: true,
                defaultValue: "0.00",
                maxLength: 20,
              })}
              {input("opened_at", d.opened, {
                type: "datetime-local",
                required: true,
                defaultValue: localNow(),
              })}
              <p className="hint">{d.noAccountsHelp}</p>
            </>
          ) : (
            input("archived", d.archived, {
              type: "checkbox",
              defaultChecked: record?.archived,
            })
          )}
        </>
      ) : null}
      {kind === "category" ||
      kind === "subcategory" ||
      kind === "category_meta" ||
      kind === "subcategory_meta" ? (
        <>
          {input("name", d.name, {
            required: true,
            maxLength: 60,
            defaultValue: record?.name || "",
          })}
          {kind === "category" ? typeField : null}
          {kind === "subcategory"
            ? select(
                "category_id",
                d.category,
                data.categories.filter((c) => !c.archived),
                { required: true },
              )
            : null}
          {kind.endsWith("_meta")
            ? input("archived", d.archived, {
                type: "checkbox",
                defaultChecked: record?.archived,
              })
            : null}
        </>
      ) : null}
      {kind === "budget" ? (
        <>
          {select("category_id", d.category, categories, { required: true })}
          {input("month", d.month, {
            type: "month",
            required: true,
            defaultValue: localNow().slice(0, 7),
          })}
          {amountField}
          <p className="hint">{d.goalHelp}</p>
        </>
      ) : null}
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form-actions">
        <button
          type="button"
          className="button secondary"
          onClick={onCancel}
          disabled={pending}
        >
          {d.cancel}
        </button>
        <button type="submit" className="button" disabled={pending}>
          {pending ? d.saving : d.save}
        </button>
      </div>
    </form>
  );
}
