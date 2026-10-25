"use client";
import { useId, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { balances } from "@/domain/finance/calculations";
import { CategoryMark, AccountMark } from "./visual-components";
import { parseMoney, money } from "@/domain/finance/money";
import type {
  Snapshot,
  Transaction,
  Account,
  Category,
  Subcategory,
  Budget,
  SavingsGoal,
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
  | "budget"
  | "goal";
// Goals are manually recorded estimates, independent of posted account movements.
export type Editable =
  Transaction | Account | Category | Subcategory | Budget | SavingsGoal;
const localNow = () =>
  new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 16);
const localTime = (v: string) =>
  new Date(Date.parse(v) + 8 * 3600000).toISOString().slice(0, 16);
function displayLocalDate(value: unknown, ms: boolean) {
  const time = new Date(`${String(value)}+08:00`);
  return Number.isNaN(time.getTime())
    ? ms
      ? "Pilih tarikh"
      : "Choose a date"
    : new Intl.DateTimeFormat(ms ? "ms-MY" : "en-MY", {
        dateStyle: "medium",
        timeZone: "Asia/Kuala_Lumpur",
      }).format(time);
}
export function EntryForm({
  kind,
  data,
  d,
  initial,
  onSave,
  onCancel,
  defaultDateTime,
  defaults,
  placement = "dialog",
  onDelete,
}: {
  kind: FormKind;
  data: Snapshot;
  d: Dictionary;
  initial?: Editable;
  onSave: (value: unknown) => Promise<void>;
  onCancel: () => void;
  defaultDateTime?: string;
  defaults?: {
    account?: string;
    category?: string;
    destination?: string;
    noteLimit?: 100;
  };
  placement?: "dialog" | "inline";
  onDelete?: () => void;
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
  const [categoryId, setCategoryId] = useState(
    record?.category_id || defaults?.category || "",
  );
  const [entryAccount, setEntryAccount] = useState(
    record?.account_id || defaults?.account || "",
  );
  const [additionalNote, setAdditionalNote] = useState("");
  const [transactionAt, setTransactionAt] = useState(
    record?.occurred_at
      ? localTime(record.occurred_at)
      : defaultDateTime
        ? localTime(defaultDateTime)
        : localNow,
  );
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const requestId = useRef("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [sourceId, setSourceId] = useState(defaults?.account || "");
  const [destinationId, setDestinationId] = useState(
    defaults?.destination || "",
  );
  const [transferAt, setTransferAt] = useState(
    defaultDateTime ? localTime(defaultDateTime) : localNow,
  );
  const uid = useId();
  let transferBalances: Map<string, bigint> | null = null;
  let transactionBalances: Map<string, bigint> | null = null;
  try {
    transferBalances = balances(data, localInstant(transferAt));
  } catch {
    /* A cleared date is an incomplete draft, not a zero balance. */
  }
  try {
    if (kind === "transaction")
      transactionBalances = balances(data, localInstant(transactionAt));
  } catch {
    /* Incomplete dates do not imply a recorded zero balance. */
  }
  const goal = initial && "target_amount" in initial ? initial : undefined;
  const accounts = data.accounts.filter(
    (a) => !a.archived || a.id === record?.account_id,
  );
  const categories = data.categories.filter(
    (c) =>
      (!c.archived || c.id === record?.category_id) &&
      c.type === (kind === "budget" ? "expense" : type),
  );
  const field = (name: string, label: string, node: React.ReactNode) => (
    <label
      className={`field field-${({ occurred_at: "date", note: "description", category_id: "category", subcategory_id: "subcategory", account_id: "account", planned: "reflection" } as Record<string, string>)[name] || name}`}
      htmlFor={`${uid}-${name}`}
    >
      <span title={label}>
        {label === d.date ? (d.home === "Utama" ? "Tarikh" : "Date") : label}
      </span>
      {node}
    </label>
  );
  const input = (
    name: string,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) =>
    field(
      name,
      label,
      props.type === "datetime-local" ? (
        <span className="datetime-field">
          <span className="datetime-display" aria-hidden="true">
            <CalendarDays size={19} />
            {displayLocalDate(
              props.value ?? props.defaultValue ?? localNow(),
              d.home === "Utama",
            )}
            <ChevronDown size={16} />
          </span>
          <input
            id={`${uid}-${name}`}
            name={name}
            aria-label={label}
            {...props}
          />
        </span>
      ) : name === "amount" ? (
        <span className="money-input">
          <input
            id={`${uid}-${name}`}
            name={name}
            aria-label={label}
            {...props}
          />
          <span className="currency-affix" aria-hidden="true">
            RM
          </span>
        </span>
      ) : name === "note" && kind === "transfer" ? (
        <span className="transfer-note-input">
          <input
            id={`${uid}-${name}`}
            name={name}
            aria-label={label}
            aria-describedby={`${uid}-note-count`}
            {...props}
          />
          <small id={`${uid}-note-count`}>
            {transferNote.length}/{props.maxLength || 300}
          </small>
        </span>
      ) : (
        <input id={`${uid}-${name}`} name={name} {...props} />
      ),
    );
  const select = (
    name: string,
    label: string,
    options: { id: string; name: string }[],
    props: React.SelectHTMLAttributes<HTMLSelectElement> = {},
  ) =>
    field(
      name,
      label,
      <span
        className={`select-with-mark ${name === "source_id" || name === "destination_id" ? "transfer-account-select" : ""}`}
      >
        {(() => {
          const selected = String(props.value || props.defaultValue || "");
          const account = data.accounts.find((a) => a.id === selected);
          const category = data.categories.find((c) => c.id === selected);
          return account ? (
            <>
              <AccountMark account={account} />
              {name === "source_id" || name === "destination_id" ? (
                <span className="selected-account-detail" aria-hidden="true">
                  <b>{account.name}</b>
                  <small>
                    {transferBalances
                      ? money(transferBalances.get(account.id) || 0n)
                      : "—"}
                  </small>
                </span>
              ) : null}
            </>
          ) : category ? (
            <CategoryMark name={category.name} type={category.type} />
          ) : null;
        })()}
        <select id={`${uid}-${name}`} name={name} {...props}>
          <option value="">{d.none}</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown className="select-chevron" size={16} aria-hidden="true" />
      </span>,
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
    ...(kind === "transfer"
      ? {
          value: transferAmount,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setTransferAmount(e.target.value),
        }
      : { defaultValue: record?.amount || "" }),
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
        case "goal":
          payload = {
            ...base,
            name: values.name,
            target_amount: values.target_amount,
            saved_amount: values.saved_amount,
            target_date: values.target_date || null,
            edit: !!goal,
          };
          break;
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
        case "transaction": {
          const combinedNote = [values.note, values.additional_note]
            .filter(Boolean)
            .join("\n\n");
          if (combinedNote.length > 300) throw new Error("NOTE_TOO_LONG");
          payload = {
            ...base,
            type,
            amount: values.amount,
            account_id: values.account_id,
            category_id: categoryId,
            subcategory_id: values.subcategory_id || null,
            occurred_at: localInstant(String(values.occurred_at)),
            note: combinedNote,
            planned: values.planned === "" ? null : values.planned === "true",
            edit: !!record,
          };
          break;
        }
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
        code === "NOTE_TOO_LONG"
          ? d.home === "Utama"
            ? "Keterangan dan nota boleh mengandungi 300 aksara keseluruhannya. Pendekkan salah satu medan."
            : "Description and note can contain 300 characters combined. Shorten either field."
          : code === "SAME_ACCOUNT"
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
      {kind === "goal" ? (
        <>
          {input("name", d.goalName, {
            required: true,
            maxLength: 60,
            defaultValue: goal?.name || "",
          })}
          {input("target_amount", d.targetAmount, {
            required: true,
            inputMode: "decimal",
            autoComplete: "off",
            maxLength: 19,
            placeholder: "0.00",
            defaultValue: goal?.target_amount || "",
          })}
          {input("saved_amount", d.savedAmount, {
            required: true,
            inputMode: "decimal",
            autoComplete: "off",
            maxLength: 19,
            defaultValue: goal?.saved_amount || "0.00",
          })}
          {input("target_date", d.targetDate, {
            type: "date",
            defaultValue: goal?.target_date || "",
          })}
          <p className="hint">{d.savingsHelp}</p>
        </>
      ) : null}
      {kind === "transaction" ? (
        <>
          <div
            className="transaction-type-buttons"
            role="group"
            aria-label={d.type}
          >
            <button
              type="button"
              aria-pressed={type === "expense"}
              onClick={() => {
                setType("expense");
                setCategoryId("");
              }}
            >
              <ArrowUp aria-hidden="true" />
              {d.expense}
            </button>
            <button
              type="button"
              className="income"
              aria-pressed={type === "income"}
              onClick={() => {
                setType("income");
                setCategoryId("");
              }}
            >
              <ArrowDown aria-hidden="true" />
              {d.income}
            </button>
          </div>
          {amountField}
          <div
            className="mobile-category-choices"
            role="group"
            aria-label={d.category}
          >
            {categories.map((c) => (
              <button
                type="button"
                key={c.id}
                aria-pressed={categoryId === c.id}
                onClick={() => setCategoryId(c.id)}
              >
                <CategoryMark name={c.name} type={type} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
          {select(
            "account_id",
            d.account,
            accounts.map((a) => ({
              ...a,
              name: `${a.name} (${transactionBalances ? money(transactionBalances.get(a.id) || 0n) : "—"})`,
            })),
            {
              required: true,
              value: entryAccount,
              onChange: (e) => setEntryAccount(e.target.value),
            },
          )}
          {select("category_id", d.category, categories, {
            required: true,
            value: categoryId,
            onChange: (e) => setCategoryId(e.target.value),
          })}
          {data.subcategories.some(
            (c) =>
              c.category_id === categoryId &&
              (!c.archived || c.id === record?.subcategory_id),
          )
            ? select(
                "subcategory_id",
                d.subcategory,
                data.subcategories.filter(
                  (c) =>
                    c.category_id === categoryId &&
                    (!c.archived || c.id === record?.subcategory_id),
                ),
                { defaultValue: record?.subcategory_id || "" },
              )
            : null}
          {input("occurred_at", d.date, {
            type: "datetime-local",
            required: true,
            value: transactionAt,
            onChange: (e) => setTransactionAt(e.target.value),
          })}
          {field(
            "note",
            d.home === "Utama" ? "Keterangan" : "Description",
            <textarea
              id={`${uid}-note`}
              name="note"
              rows={1}
              maxLength={300}
              defaultValue={record?.note || ""}
              placeholder={
                d.home === "Utama"
                  ? "cth. Jaya Grocer Mid Valley"
                  : "e.g. Jaya Grocer Mid Valley"
              }
            />,
          )}
          <div className="transaction-notes">
            {field(
              "additional_note",
              d.note,
              <>
                <textarea
                  id={`${uid}-additional_note`}
                  aria-label={d.note}
                  name="additional_note"
                  rows={4}
                  maxLength={200}
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  placeholder={
                    d.home === "Utama"
                      ? "Tambah nota atau rujukan…"
                      : "Add a note, reference or other details…"
                  }
                />
                <small className="note-count">
                  {additionalNote.length}/200
                </small>
                <span className="sr-only">
                  {d.home === "Utama"
                    ? "Keterangan dan nota disimpan bersama, maksimum 300 aksara."
                    : "Description and note are saved together, up to 300 characters combined."}
                </span>
              </>,
            )}
            <details className="reflection-options">
              <summary>
                <span>{d.planned}</span>
                <MoreHorizontal
                  className="reflection-more"
                  size={20}
                  aria-hidden="true"
                />
              </summary>
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
            </details>
          </div>
        </>
      ) : null}
      {kind === "transfer" ? (
        <>
          <p className="hint">{d.transferHelp}</p>
          {select("source_id", d.source, accounts, {
            required: true,
            value: sourceId,
            onChange: (e) => setSourceId(e.target.value),
          })}
          {select("destination_id", d.destination, accounts, {
            required: true,
            value: destinationId,
            onChange: (e) => setDestinationId(e.target.value),
          })}
          {amountField}
          {placement === "inline" ? (
            <details className="transfer-date-options">
              <summary>{d.date}</summary>
              <div className="transfer-date-content">
                {input("occurred_at", d.date, {
                  type: "datetime-local",
                  required: true,
                  value: transferAt,
                  onChange: (e) => setTransferAt(e.target.value),
                })}
                <p>{d.transferHelp}</p>
                <button type="button" className="text-link" onClick={onCancel}>
                  {d.cancel}
                </button>
              </div>
            </details>
          ) : (
            input("occurred_at", d.date, {
              type: "datetime-local",
              required: true,
              value: transferAt,
              onChange: (e) => setTransferAt(e.target.value),
            })
          )}
          {input("note", d.note, {
            maxLength: defaults?.noteLimit || 300,
            value: transferNote,
            onChange: (e) => setTransferNote(e.target.value),
            placeholder:
              d.home === "Utama"
                ? "cth. Pindahan untuk belanja bulanan"
                : "e.g. Transfer for monthly expenses",
          })}
          <TransferPreview
            data={data}
            sourceId={sourceId}
            destinationId={destinationId}
            amount={transferAmount}
            occurredAt={transferAt}
            d={d}
          />
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
        {onDelete ? (
          <button
            type="button"
            className="text-link danger-text"
            onClick={onDelete}
          >
            {d.remove}
          </button>
        ) : null}
        <button
          type="button"
          className="button secondary"
          onClick={onCancel}
          disabled={pending}
        >
          {d.cancel}
        </button>
        <button type="submit" className="button" disabled={pending}>
          <span className="standard-save-label">
            {pending ? d.saving : d.save}
          </span>
          {kind === "transaction" ? (
            <span className="desktop-save-label">
              {pending
                ? d.saving
                : d.home === "Utama"
                  ? "Simpan transaksi"
                  : "Save Transaction"}
            </span>
          ) : kind === "transfer" ? (
            <span className="desktop-save-label">
              <ArrowLeftRight size={21} />
              {pending
                ? d.saving
                : d.home === "Utama"
                  ? "Pindah wang"
                  : "Transfer Money"}
            </span>
          ) : null}
        </button>
      </div>
    </form>
  );
}

function TransferPreview({
  data,
  sourceId,
  destinationId,
  amount,
  occurredAt,
  d,
}: {
  data: Snapshot;
  sourceId: string;
  destinationId: string;
  amount: string;
  occurredAt: string;
  d: Dictionary;
}) {
  let value: bigint;
  try {
    value = parseMoney(amount);
  } catch {
    return null;
  }
  if (!sourceId || !destinationId || sourceId === destinationId || value <= 0n)
    return null;
  let end: string;
  try {
    end = new Date(Date.parse(localInstant(occurredAt)) + 1).toISOString();
  } catch {
    return null;
  }
  const current = balances(data, end);
  return (
    <div className="transfer-preview">
      <ArrowLeftRight size={21} aria-hidden="true" />
      <p>
        {data.accounts.find((a) => a.id === sourceId)?.name}:{" "}
        <strong>{money((current.get(sourceId) || 0n) - value)}</strong>
      </p>
      <p>
        {data.accounts.find((a) => a.id === destinationId)?.name}:{" "}
        <strong>{money((current.get(destinationId) || 0n) + value)}</strong>
      </p>
      <p>{d.transferHelp}</p>
    </div>
  );
}
