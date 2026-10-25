"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
export function CopyReference({ value, ms }: { value: string; ms: boolean }) {
  const [copied, setCopied] = useState(false),
    [failed, setFailed] = useState(false);
  return (
    <>
      <button
        type="button"
        className="copy-reference"
        aria-label={ms ? "Salin rujukan akaun" : "Copy account reference"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setFailed(false);
          } catch {
            setFailed(true);
          }
        }}
      >
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
      </button>
      <span role="status" className="sr-only">
        {failed
          ? ms
            ? "Pilih dan salin rujukan secara manual."
            : "Select and copy the reference manually."
          : copied
            ? ms
              ? "Disalin"
              : "Copied"
            : ""}
      </span>
    </>
  );
}
