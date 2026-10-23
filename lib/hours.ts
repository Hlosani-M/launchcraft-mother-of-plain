import type { TradingDay, Weekday } from "@/types/site";

const TIME_ZONE = "Africa/Johannesburg";

const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Store-local weekday and minutes since midnight. */
function storeClock(now: Date) {
  const parts = weekdayFormatter.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: get("weekday").toLowerCase() as Weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export interface StoreStatus {
  day: Weekday;
  today: TradingDay | undefined;
  isOpen: boolean;
  /** e.g. "Closes 18:00", "Opens 14:00", "Closed for today". Ignores public holidays. */
  detail: string;
}

export function getStoreStatus(hours: TradingDay[], now = new Date()): StoreStatus {
  const { day, minutes } = storeClock(now);
  const today = hours.find((h) => h.day === day);
  const ranges = today?.ranges ?? [];

  const current = ranges.find((r) => minutes >= toMinutes(r.open) && minutes < toMinutes(r.close));
  if (current) return { day, today, isOpen: true, detail: `Closes ${current.close}` };

  const next = ranges.find((r) => minutes < toMinutes(r.open));
  return {
    day,
    today,
    isOpen: false,
    detail: next ? `Opens ${next.open}` : "Closed for today",
  };
}
