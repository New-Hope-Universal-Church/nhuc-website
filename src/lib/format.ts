import { cacheLife } from 'next/cache';

/** Dates are shown in Ghana time, whatever server renders the page. */
const TZ = 'Africa/Accra';

export const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso));

export const fmtShortDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso)).toUpperCase();

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
