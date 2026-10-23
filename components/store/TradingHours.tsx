import type { TradingDay } from "@/types/site";

function formatRanges(day: TradingDay) {
  return day.ranges.map((r) => `${r.open}–${r.close}`);
}

export function TradingHours({ hours, compact = false }: { hours: TradingDay[]; compact?: boolean }) {
  return (
    <dl className={`divide-y divide-line ${compact ? "text-sm" : "text-[0.95rem]"}`}>
      {hours.map((day) => (
        <div key={day.day} className={`flex justify-between gap-4 ${compact ? "py-1.5" : "py-2.5"}`}>
          <dt className="font-medium">{day.label}</dt>
          <dd className="text-right tabular-nums">
            {formatRanges(day).map((range, i) => (
              <span key={range} className="block sm:inline">
                {i > 0 && <span className="hidden sm:inline"> / </span>}
                {range}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
