"use client";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
export function PeriodFilter({
  d,
  kind,
  setKind,
  from,
  setFrom,
  to,
  setTo,
  rangeLabel,
}: {
  d: Dictionary;
  kind: string;
  setKind: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  rangeLabel?: string;
}) {
  return (
    <div className="period-controls">
      <label className="inline-field">
        <span>{d.period}</span>
        {rangeLabel && kind === "month" ? (
          <span className="period-range" aria-hidden="true">
            <CalendarDays size={19} />
            {rangeLabel}
            <ChevronDown size={15} />
          </span>
        ) : null}
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {(["today", "week", "month", "all", "custom"] as const).map((key) => (
            <option key={key} value={key}>
              {d[key]}
            </option>
          ))}
        </select>
      </label>
      {kind === "custom" ? (
        <>
          <label className="inline-field">
            <span>{d.start}</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="inline-field">
            <span>{d.end}</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </>
      ) : null}
    </div>
  );
}
