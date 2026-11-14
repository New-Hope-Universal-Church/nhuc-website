import { cacheLife } from 'next/cache';

/**
 * Content from HopeServe's public feed (GET {HOPESERVE_API_URL}/public/...):
 * the weekly schedule, upcoming events, sermons and Hope for Today. The feed
 * is read-only and holds no member data.
 *
 * Results are cached and refreshed in the background, so pages stay fast and
 * a short HopeServe outage never takes the website down: a failed call shows
 * an empty state ("nothing scheduled") instead of an error.
 */

const API = (process.env.HOPESERVE_API_URL ?? '').replace(/\/+$/, '');

async function feed<T>(path: string, fallback: T): Promise<T> {
  if (!API) {
    console.warn('[hopeserve] HOPESERVE_API_URL is not set; showing empty content');
    return fallback;
  }
  try {
    const res = await fetch(`${API}/public${path}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
    if (res.status === 404) return fallback;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[hopeserve] ${path} failed:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

// ─── Shapes ───────────────────────────────────────────────────────────────────

export interface ScheduleItem {
  id: string;
  /** "SUN", "FRI" */
  day: string;
  name: string;
  description: string | null;
  /** "6:00 AM" */
  time: string;
  endTime: string | null;
  /** "Sundays", "Last Friday of the month" */
  when: string;
}

export interface EventSession {
  name: string;
  startDate: string;
  endDate: string | null;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  /** ISO date-time */
  startDate: string;
  endDate: string | null;
  location: string | null;
  description: string | null;
  eventType: { name: string } | null;
  /** 1st service, 2nd service... when the event runs more than once. */
  sessions: EventSession[];
  /** Where it is streamed live, if it is. */
  youtubeUrl: string | null;
  facebookUrl: string | null;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  /** ["John 3:16", "Romans 8:28-30"] */
  scriptures: string[];
  series: string | null;
  /** Summary, in Markdown. */
  notes: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  otherUrl: string | null;
}

/** A Hope for Today devotional. */
export interface Devotional {
  id: string;
  /** The day it is for, "2026-11-14"; also its address: /hope/2026-11-14. */
  date: string;
  title: string;
  author: string | null;
  /** Passage reference with version, "Romans 5:1-5, NLT". */
  scripture: string | null;
  /** The quoted passage itself. */
  passage: string | null;
  /** The message, in Markdown (paragraphs, **bold**, _italic_). */
  body: string;
  confession: string | null;
  prayer: string | null;
  /** The year's declaration. */
  declaration: string | null;
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export async function getSchedule(): Promise<ScheduleItem[]> {
  'use cache';
  // Minutes, not hours: a failed fetch (e.g. during a HopeServe deploy) is
  // cached too, and should not stick around.
  cacheLife('minutes');
  return feed<ScheduleItem[]>('/schedule', []);
}

export async function getUpcomingEvents(limit = 6): Promise<UpcomingEvent[]> {
  'use cache';
  cacheLife('minutes');
  return feed<UpcomingEvent[]>(`/events?limit=${limit}`, []);
}

export async function getLatestSermons(limit = 12): Promise<Sermon[]> {
  'use cache';
  cacheLife('minutes');
  return feed<Sermon[]>(`/sermons?limit=${limit}`, []);
}

/** Recent devotionals, newest first. */
export async function getDevotionals(limit = 30): Promise<Devotional[]> {
  'use cache';
  cacheLife('minutes');
  return feed<Devotional[]>(`/devotionals?limit=${limit}`, []);
}

/** One devotional by its day ("2026-11-14"), or null. */
export async function getDevotional(date: string): Promise<Devotional | null> {
  'use cache';
  cacheLife('minutes');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return feed<Devotional | null>(`/devotionals/${date}`, null);
}

export async function getLatestDevotional(): Promise<Devotional | null> {
  const [latest] = await getDevotionals(1);
  return latest ?? null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** The first plain sentences of some Markdown, for previews. */
export function excerpt(d: { body: string }, max = 220): string {
  const text = d.body.replace(/[*_#>]/g, '').replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max))}…`;
}

/** Where to watch an event live: YouTube first, then Facebook. */
export function streamLink(e: Pick<UpcomingEvent, 'youtubeUrl' | 'facebookUrl'>): { href: string; label: string } | null {
  if (e.youtubeUrl) return { href: e.youtubeUrl, label: 'YouTube' };
  if (e.facebookUrl) return { href: e.facebookUrl, label: 'Facebook' };
  return null;
}

/** "John 3:16 · Romans 8:28" */
export const scriptureLine = (s: Sermon) => s.scriptures.join(' · ');
