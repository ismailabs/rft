"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import type { Locale } from "@/domain/finance/types";
import { dictionary } from "@/i18n/dictionaries";
import { Sheet } from "@/components/ui/dialog";
export function MfaClient({
  locale,
  factors,
  level,
}: {
  locale: Locale;
  factors: { id: string; friendly_name?: string; status: string }[];
  level: string | null;
}) {
  const d = dictionary(locale),
    router = useRouter();
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  const [factorId, setFactorId] = useState(
    factors.find((f) => f.status === "verified")?.id || factors[0]?.id || "",
  );
  const [setup, setSetup] = useState<{
      id: string;
      qr: string;
      secret: string;
    } | null>(null),
    [name, setName] = useState(""),
    [code, setCode] = useState(""),
    [removing, setRemoving] = useState(false);
  const verified = factors.some((f) => f.status === "verified");
  async function call(body: unknown) {
    const response = await fetch("/api/mfa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const value = await response.json();
    if (!response.ok) throw new Error(value.error);
    return value;
  }
  async function run(action: () => Promise<void>) {
    setPending(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        d.errors[
          (e instanceof Error
            ? e.message
            : "SERVER_UNAVAILABLE") as keyof typeof d.errors
        ] || d.errors.SERVER_UNAVAILABLE,
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="mfa-panel">
      <ShieldCheck size={37} strokeWidth={1.5} />
      <h1>{d.mfaTitle}</h1>
      <p>{verified && level !== "aal2" ? d.mfaNeeded : d.mfaHelp}</p>
      <p className="hint">{d.mfaLost}</p>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {done ? (
        <p role="status" className="success">
          {d.mfaDone}
        </p>
      ) : null}
      {setup ? (
        <div className="mfa-setup">
          <p>{d.mfaSetup}</p>
          <Image
            unoptimized
            src={setup.qr}
            width={240}
            height={240}
            alt={d.mfaSetup}
          />
          <details>
            <summary>{d.setupKey}</summary>
            <code>{setup.secret}</code>
          </details>
        </div>
      ) : null}
      {(factors.length > 0 || setup) && !done ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await call({
                operation: "verify",
                factorId: setup?.id || factorId,
                code,
              });
              setSetup(null);
              setCode("");
              setDone(true);
              router.refresh();
            });
          }}
          className="entry-form"
        >
          {!setup ? (
            <label className="field">
              <span>{d.mfaDevice}</span>
              <select
                value={factorId}
                onChange={(e) => setFactorId(e.target.value)}
              >
                {factors.map((f, i) => (
                  <option key={f.id} value={f.id}>
                    {f.friendly_name || `${d.mfaDevice} ${i + 1}`} —{" "}
                    {f.status === "verified" ? d.mfaEnabled : d.mfaDisabled}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="field">
            <span>{d.mfaCode}</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              minLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className="button" disabled={pending}>
            {d.verify}
          </button>
        </form>
      ) : null}
      {!setup && (!verified || level === "aal2") ? (
        <div className="entry-form">
          <label className="field">
            <span>{d.mfaDevice}</span>
            <input
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button
            className="button secondary"
            disabled={pending || !name.trim()}
            onClick={() =>
              run(async () => {
                const value = await call({ operation: "enroll", name });
                setSetup(value);
                setDone(false);
              })
            }
          >
            {d.enroll}
          </button>
          {factors.length ? (
            <button
              className="text-link danger-text"
              onClick={() => setRemoving(true)}
            >
              {d.mfaRemove}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="button-row">
        <Link className="text-link" href="/app">
          {d.openApp}
        </Link>
        <Link className="text-link" href="/login">
          {d.reauth}
        </Link>
      </div>
      <Sheet
        open={removing}
        onOpenChange={setRemoving}
        title={d.mfaRemove}
        description={d.mfaHelp}
        close={d.close}
      >
        <label className="field">
          <span>{d.mfaDevice}</span>
          <select
            value={factorId}
            onChange={(e) => setFactorId(e.target.value)}
          >
            {factors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.friendly_name || d.mfaDevice}
              </option>
            ))}
          </select>
        </label>
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          className="button danger"
          disabled={pending || !factorId}
          onClick={() =>
            run(async () => {
              await call({ operation: "unenroll", factorId });
              setRemoving(false);
              router.refresh();
            })
          }
        >
          {d.mfaRemove}
        </button>
      </Sheet>
    </section>
  );
}
