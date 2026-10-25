"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export function BalanceValue({
  value,
  locale,
}: {
  value: string;
  locale: string;
}) {
  const [visible, setVisible] = useState(true);
  return (
    <>
      <strong>{visible ? value : "••••••••"}</strong>
      <button
        className="balance-visibility icon-button"
        aria-label={
          locale === "ms"
            ? visible
              ? "Sembunyikan baki"
              : "Tunjukkan baki"
            : visible
              ? "Hide balance"
              : "Show balance"
        }
        aria-pressed={!visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </>
  );
}
