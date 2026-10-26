export type Period = { start: string | null; end: string };
const DAY = 86400000;

export function localDate(value: Date): string {
  return new Date(value.getTime() + 8 * 3600000).toISOString().slice(0, 10);
}
export function localMidnight(date: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("INVALID_DATE");
  const value = new Date(`${date}T00:00:00+08:00`);
  if (!Number.isFinite(value.getTime()) || localDate(value) !== date)
    throw new Error("INVALID_DATE");
  return value;
}
export function localInstant(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value))
    throw new Error("INVALID_DATE");
  localMidnight(value.slice(0, 10));
  const [hour, minute, second = "0"] = value.slice(11).split(":");
  if (+hour > 23 || +minute > 59 || +second > 59)
    throw new Error("INVALID_DATE");
  return new Date(`${value}+08:00`).toISOString();
}
export function periodFor(
  kind: string,
  now = new Date(),
  from?: string,
  to?: string,
): Period {
  const today = localDate(now);
  const midnight = localMidnight(today);
  let start: Date | null;
  let end = new Date(now.getTime() + 1);
  if (kind === "all") start = null;
  else if (kind === "today") start = midnight;
  else if (kind === "week") {
    const malaysiaDay = new Date(midnight.getTime() + 8 * 3600000).getUTCDay();
    start = new Date(midnight.getTime() - ((malaysiaDay + 6) % 7) * DAY);
  } else if (kind === "month") start = localMidnight(`${today.slice(0, 7)}-01`);
  else if (kind === "custom" && from && to) {
    start = localMidnight(from);
    end = new Date(localMidnight(to).getTime() + DAY);
    if (start >= end) throw new Error("INVALID_RANGE");
  } else throw new Error("INVALID_RANGE");
  return { start: start?.toISOString() ?? null, end: end.toISOString() };
}
export function inPeriod(instant: string, period: Period): boolean {
  const time = new Date(instant).getTime();
  return (
    (period.start === null || time >= Date.parse(period.start)) &&
    time < Date.parse(period.end)
  );
}
export function completedWeeks(now = new Date()): [Period, Period] {
  const current = periodFor("week", now);
  const end = Date.parse(current.start!);
  return [
    {
      start: new Date(end - 14 * DAY).toISOString(),
      end: new Date(end - 7 * DAY).toISOString(),
    },
    {
      start: new Date(end - 7 * DAY).toISOString(),
      end: new Date(end).toISOString(),
    },
  ];
}
