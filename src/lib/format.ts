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

/** Does it end on a later day than it starts (a two or three day program)? */
export const isMultiDay = (e: { startDate: string; endDate: string | null }) =>
  !!e.endDate && dayKey(e.endDate) !== dayKey(e.startDate);

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
