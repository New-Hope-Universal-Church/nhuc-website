import { cacheLife } from 'next/cache';

/** Dates are shown in Ghana time, whatever server renders the page. */
const TZ = 'Africa/Accra';

export const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso));

export const fmtShortDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso)).toUpperCase();

/** "Fri" */
export const fmtWeekday = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' }).format(new Date(iso));

/** "2026-12-12", the calendar day in Ghana. */
const dayKey = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(iso));

/** Hour of the day in Ghana, 0-23. */
const hourOf = (iso: string) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(new Date(iso)));

/** One night that runs past midnight, like an All Night service (Friday
 *  9:00 PM to Saturday 4:00 AM): it ends the next morning, before noon. */
export const isOvernight = (e: { startDate: string; endDate: string | null }) =>
  !!e.endDate &&
  Date.parse(e.endDate) - Date.parse(e.startDate) < 86_400_000 &&
  dayKey(e.endDate) !== dayKey(e.startDate) &&
  hourOf(e.endDate) < 12;

/** Does it run over several days (a two or three day program)? An overnight
 *  service isn't: it's one night. */
export const isMultiDay = (e: { startDate: string; endDate: string | null }) =>
  !!e.endDate && dayKey(e.endDate) !== dayKey(e.startDate) && !isOvernight(e);

/** "Friday 12 December", or for a program over several days
 *  "Friday 12 to Sunday 14 December" / "Sunday 30 November to Tuesday 2 December". */
export function fmtDays(e: { startDate: string; endDate: string | null }): string {
  if (!isMultiDay(e)) return fmtDay(e.startDate);
  const part = (iso: string, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...o }).format(new Date(iso));
  const sameMonth = part(e.startDate, { month: 'long', year: 'numeric' }) === part(e.endDate!, { month: 'long', year: 'numeric' });
  const start = sameMonth ? part(e.startDate, { weekday: 'long', day: 'numeric' }) : fmtDay(e.startDate);
  return `${start} to ${fmtDay(e.endDate!)}`;
}

/** Whole calendar days (in Ghana) from `a` to `b`. */
const daysBetween = (a: string, b: string) => Math.round((Date.parse(dayKey(b)) - Date.parse(dayKey(a))) / 86_400_000);

/** Days from today to the event's day: 0 today, 1 tomorrow, negative if past. */
export const daysUntil = (iso: string, nowIso: string) => daysBetween(nowIso, iso);

/** Which day of a running program it is, e.g. { day: 3, of: 3 }, or null
 *  if it isn't a program over several days or isn't running today. */
export function programDay(e: { startDate: string; endDate: string | null }, nowIso: string): { day: number; of: number } | null {
  if (!isMultiDay(e)) return null;
  const of = daysBetween(e.startDate, e.endDate!) + 1;
  const day = daysBetween(e.startDate, nowIso) + 1;
  return day >= 1 && day <= of && Date.parse(nowIso) <= Date.parse(e.endDate!) ? { day, of } : null;
}

/** { month: 'NOV', day: '15' } for a date tile. */
export const dateTile = (iso: string) => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short' }).formatToParts(new Date(iso));
  return {
    month: (parts.find((p) => p.type === 'month')?.value ?? '').toUpperCase(),
    day: parts.find((p) => p.type === 'day')?.value ?? '',
  };
};

/** The current moment (ISO), refreshed every minute or so. Pre-built pages
 *  need a cached "now"; good enough to tell whether a service is live. */
export async function nowInGhana(): Promise<string> {
  'use cache';
  cacheLife('minutes');
  return new Date().toISOString();
}

/** Today in Ghana, "2026-11-14". Cached and refreshed every few minutes,
 *  which pre-built pages need for anything that depends on "now". */
export async function todayInGhana(): Promise<string> {
  'use cache';
  cacheLife('minutes');
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
}
