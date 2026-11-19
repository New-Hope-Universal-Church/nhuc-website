'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** One devotional in the list, with its labels written out on the server
 *  (in Ghana time). */
export interface ListItem {
  date: string;
  title: string;
  scripture: string | null;
  /** "Today" or "Yesterday", else null. */
  relative: string | null;
  /** "Tuesday" */
  weekday: string;
  /** "2026-11", and "November 2026" to show. */
  month: string;
  monthLabel: string;
  /** Lower-case text to search in: title, scripture, author and the start of the message. */
  search: string;
}

/** Every devotional beside the one being read: search, newest or oldest
 *  first, and one month at a time. The one open is marked. */
export default function DevotionalList({ items, current }: { items: ListItem[]; current: string }) {
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('');
  const [oldestFirst, setOldestFirst] = useState(false);

  const months = useMemo(() => {
    const seen = new Map<string, string>();
    for (const i of items) seen.set(i.month, i.monthLabel);
    return [...seen];
  }, [items]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = items.filter((i) => (!month || i.month === month) && (!q || i.search.includes(q)));
    return oldestFirst ? [...found].reverse() : found;
  }, [items, query, month, oldestFirst]);

  const control = 'h-10 rounded-md bg-white px-3 text-sm text-ink ring-1 ring-brand-950/15 focus:outline-none focus:ring-2 focus:ring-gold-400';

  return (
    <div className="flex flex-col gap-3 lg:max-h-[calc(100svh-8rem)]">
      <label className="relative block">
        <span className="sr-only">Search devotionals</span>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search devotionals" className={`${control} w-full pr-10`} />
        <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </label>
      <div className="flex gap-2">
        <select aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)} className={`${control} min-w-0 flex-1`}>
          <option value="">All months</option>
          {months.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Order" value={oldestFirst ? 'old' : 'new'} onChange={(e) => setOldestFirst(e.target.value === 'old')} className={control}>
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
      </div>

      <p className="text-xs text-ink/50" aria-live="polite">{shown.length} {shown.length === 1 ? 'devotional' : 'devotionals'}</p>

      <ul className="-mr-2 space-y-1 overflow-y-auto pr-2 [scrollbar-width:thin] max-lg:max-h-[28rem]">
        {shown.map((i) => {
          const on = i.date === current;
          const [, m, day] = i.date.split('-');
          return (
            <li key={i.date}>
              <Link
                href={`/hope/${i.date}`}
                aria-current={on ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-md p-2 transition-colors ${on ? 'bg-brand-50 ring-1 ring-brand-600/20' : 'hover:bg-white'}`}
              >
                <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md ${on ? 'bg-brand-700 text-white' : 'bg-white text-brand-950 ring-1 ring-brand-950/10'}`}>
                  <span className={`font-display text-[9px] font-bold tracking-[0.16em] ${on ? 'text-gold-300' : 'text-crimson-700'}`}>{MONTHS[Number(m) - 1]}</span>
                  <span className="font-display text-lg font-extrabold leading-none">{Number(day)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-heading text-[15px] font-semibold leading-snug ${on ? 'text-brand-800' : 'text-brand-950 group-hover:text-brand-700'}`}>{i.title}</span>
                  <span className="block truncate text-xs text-ink/50">{[i.relative ?? i.weekday, i.scripture].filter(Boolean).join(' · ')}</span>
                </span>
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && <li className="rounded-md bg-white p-4 text-sm text-ink/60 ring-1 ring-brand-950/10">Nothing matches that. Try another word or month.</li>}
      </ul>
    </div>
  );
}
