"use client";
import { useEffect } from "react";
export function Pwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Installation is optional; finance remains network-only. */
      });
  }, []);
  return null;
}
