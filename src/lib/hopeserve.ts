import { cacheLife } from 'next/cache';

/**
 * Content that lives in HopeServe: the weekly schedule, upcoming events,
 * sermons and Hope for Today. For now these return SAMPLE content so the
 * design can be built; each function will be switched to HopeServe's public
 * API (read-only, no member data) once that exists. The shapes below are what
 * the pages expect, so only these function bodies change.
 */

export interface ScheduleItem {
  /** "SUN", "FRI" */
  day: string;
  name: string;
  /** "6:00 AM" */
  time: string;
  /** "Sundays", "Last Friday of the month" */
  when: string;
  /** "Two services", or null */
  note: string | null;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  /** ISO date-time */
  startDate: string;
  endDate: string | null;
  location: string | null;
  description: string | null;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string | null;
  youtubeUrl: string | null;
}

/** A Hope for Today devotional, as HopeServe stores it. */
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

// ─── Sample content (replace with HopeServe) ─────────────────────────────────

const SAMPLE_SCHEDULE: ScheduleItem[] = [
  { day: 'SUN', name: 'Sunday Service', time: '6:00 AM', when: 'Sundays', note: 'Two services' },
  { day: 'FRI', name: 'Hour of Supernatural Overflow', time: '9:00 AM', when: 'Fridays', note: null },
  { day: 'FRI', name: 'All Night Service', time: '9:00 PM', when: 'Last Friday of the month', note: null },
];

function nextWeekday(weekday: number, hour: number, minute = 0, addWeeks = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7) + addWeeks * 7);
  return d.toISOString();
}

// ─── Public functions ─────────────────────────────────────────────────────────

export async function getSchedule(): Promise<ScheduleItem[]> {
  'use cache';
  cacheLife('hours');
  return SAMPLE_SCHEDULE;
}

export async function getUpcomingEvents(limit = 6): Promise<UpcomingEvent[]> {
  'use cache';
  cacheLife('hours');
  const sample: UpcomingEvent[] = [
    { id: 's1', title: 'Sunday Service', startDate: nextWeekday(0, 6), endDate: nextWeekday(0, 9, 45), location: 'Otojor, Dansoman', description: 'Two services: 6:00 AM and 7:45 AM.' },
    { id: 's2', title: 'Hour of Supernatural Overflow', startDate: nextWeekday(5, 9), endDate: nextWeekday(5, 12), location: 'Otojor, Dansoman', description: 'A morning of prayer, worship and the Word.' },
    { id: 's3', title: 'All Night Service', startDate: nextWeekday(5, 21, 0, 2), endDate: null, location: 'Otojor, Dansoman', description: 'Our monthly night of prayer and praise, on the last Friday.' },
    { id: 's4', title: 'Sunday Service', startDate: nextWeekday(0, 6, 0, 1), endDate: nextWeekday(0, 9, 45, 1), location: 'Otojor, Dansoman', description: null },
  ];
  return sample.sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, limit);
}

export async function getLatestSermons(limit = 3): Promise<Sermon[]> {
  'use cache';
  cacheLife('hours');
  const sample: Sermon[] = [
    { id: 'm1', title: 'The Hope of Glory', preacher: 'The Leader', date: nextWeekday(0, 6, 0, -1), scripture: 'Colossians 1:24-29', youtubeUrl: null },
    { id: 'm2', title: 'Overflowing Grace', preacher: 'The Leader', date: nextWeekday(0, 6, 0, -2), scripture: 'Psalm 23', youtubeUrl: null },
    { id: 'm3', title: 'Built on the Rock', preacher: 'Associate Pastor', date: nextWeekday(0, 6, 0, -3), scripture: 'Matthew 7:24-27', youtubeUrl: null },
  ];
  return sample.slice(0, limit);
}

// Sample devotionals, dated today and the two days before.
function sampleDevotionals(): Devotional[] {
  const day = (offset: number) => {
    const d = new Date(Date.now() - offset * 86_400_000);
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Accra' }).format(d);
  };
  const declaration = 'This is my year of overflow. Christ in me, the hope of glory!';
  return [
    {
      id: 'd1', date: day(0), title: 'Hope that does not disappoint', author: null,
      scripture: 'Romans 5:5, NLT',
      passage: 'And this hope will not lead to disappointment. For we know how dearly God loves us, because he has given us the Holy Spirit to fill our hearts with his love.',
      body: 'Hope in God is not wishful thinking. It rests on a love **already poured** into our hearts by the Holy Spirit.\n\nWhen circumstances shout that nothing will change, remember whose love is holding you. The God who began a good work in you will carry it through.\n\n_Today, choose to hope on purpose._',
      confession: 'My hope is in the Lord. I will not be put to shame.',
      prayer: 'Father, fill my heart afresh with Your love today, and let my hope rest in You alone, in Jesus\' name. Amen.',
      declaration,
    },
    {
      id: 'd2', date: day(1), title: 'Anointed for good news', author: null,
      scripture: 'Isaiah 61:1, NLT',
      passage: 'The Spirit of the Sovereign Lord is upon me, for the Lord has anointed me to bring good news to the poor.',
      body: 'The anointing is never just for us. God fills us so that others can be comforted, freed and lifted.\n\nWho around you needs good news today? Ask the Holy Spirit to show you, and be ready to speak.',
      confession: 'The Spirit of the Lord is upon me. I carry good news.',
      prayer: 'Lord, use me today to comfort someone who is broken, in Jesus\' name. Amen.',
      declaration,
    },
    {
      id: 'd3', date: day(2), title: 'A big family', author: null,
      scripture: 'Psalm 133:1, NLT',
      passage: 'How wonderful and pleasant it is when brothers live together in harmony!',
      body: 'New Hope is _abusua kɛseɛ_, a big family. Families do not always agree, but they stay together in love.\n\nReach out to a brother or sister you have not spoken to in a while.',
      confession: 'I am part of God\'s family, and I walk in love.',
      prayer: 'Father, bind us together in Your love always. Amen.',
      declaration,
    },
  ];
}

/** Recent devotionals, newest first. */
export async function getDevotionals(limit = 30): Promise<Devotional[]> {
  'use cache';
  cacheLife('hours');
  return sampleDevotionals().slice(0, limit);
}

/** One devotional by its day ("2026-11-14"), or null. */
export async function getDevotional(date: string): Promise<Devotional | null> {
  'use cache';
  cacheLife('hours');
  return sampleDevotionals().find((d) => d.date === date) ?? null;
}

export async function getLatestDevotional(): Promise<Devotional | null> {
  'use cache';
  cacheLife('hours');
  return sampleDevotionals()[0] ?? null;
}

/** The first plain sentences of a devotional, for previews. */
export function excerpt(d: Devotional, max = 220): string {
  const text = d.body.replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max))}…`;
}
