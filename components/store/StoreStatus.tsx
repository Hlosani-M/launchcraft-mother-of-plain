"use client";

import { useSyncExternalStore } from "react";
import type { TradingDay } from "@/types/site";
import { formatTimeRanges } from "@/lib/format";
import { getStoreStatus } from "@/lib/hours";

// Re-evaluate once a minute while the page is open.
function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 60_000);
  return () => window.clearInterval(id);
}

function useMinute() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
}

/** "Open now • Closes 18:00". Renders nothing on the server to avoid stale prerendered times. */
export function StoreStatus({ hours, className = "" }: { hours: TradingDay[]; className?: string }) {
  const minute = useMinute();
  if (minute === null) return <span className={`invisible ${className}`}>Checking hours</span>;

  const status = getStoreStatus(hours, new Date(minute * 60_000));
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-full ${status.isOpen ? "bg-success" : "bg-muted"}`}
      />
      <span>
        <strong className="font-semibold">{status.isOpen ? "Open now" : "Closed now"}</strong>
        {" • "}
        {status.detail}
      </span>
    </span>
  );
}

/** Highlights today's row in the trading-hours table after hydration. */
export function TodayHours({ hours }: { hours: TradingDay[] }) {
  const minute = useMinute();
  if (minute === null) return null;
  const { today } = getStoreStatus(hours, new Date(minute * 60_000));
  if (!today) return null;
  return (
    <p className="text-sm">
      <span className="font-semibold">Today ({today.label}):</span> {formatTimeRanges(today.ranges)}
    </p>
  );
}
