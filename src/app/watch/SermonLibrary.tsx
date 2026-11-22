'use client';

import Link from 'next/link';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { Sermon } from '@/lib/hopeserve';
import { SermonThumb } from '@/components/sermons';

/** A sermon with its date already written out (dates are formatted on the
 *  server, in Ghana time). */
export type LibrarySermon = Sermon & { dateLabel: string };

const PAGE = 12;

/** Every sermon: search, filter by series, and a grid that grows with
 *  "Show more". Each card opens the sermon's own page. */
export default function SermonLibrary({ sermons }: { sermons: LibrarySermon[] }) {
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);

  const allSeries = useMemo(
    () => [...new Set(sermons.map((s) => s.series).filter((s): s is string => !!s))].sort(),
    [sermons],
  );

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter((s) =>
      (!series || s.series === series) &&
      (!q || [s.title, s.preacher, s.series ?? '', ...s.scriptures].some((t) => t.toLowerCase().includes(q))));
  }, [sermons, query, series]);

  const pick = (s: string | null) => {
    setSeries(s);
    setShown(PAGE);
  };

  const chip = (on: boolean) =>
    `shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors ${
      on ? 'bg-brand-800 text-white ring-brand-800' : 'bg-white text-ink/75 ring-brand-950/15 hover:bg-brand-950/5'
    }`;

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <label className="relative block">
          <span className="sr-only">Search sermons</span>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }}
            placeholder="Search by title, preacher or scripture"
            className="h-12 w-full rounded-full bg-white pl-5 pr-12 text-base text-ink ring-1 ring-brand-950/15 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </label>
      </div>

      {allSeries.length > 0 && (
        <div role="group" aria-label="Series" className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center scrollbar-none">
          <button type="button" aria-pressed={!series} onClick={() => pick(null)} className={chip(!series)}>All</button>
          {allSeries.map((s) => (
            <button key={s} type="button" aria-pressed={series === s} onClick={() => pick(series === s ? null : s)} className={chip(series === s)}>{s}</button>
          ))}
        </div>
      )}

      {found.length === 0 ? (
        <p className="mt-12 text-center text-ink/60">No sermons match that. Try another word.</p>
      ) : (
        <MotionConfig reducedMotion="user">
        <motion.div layout className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Cards rise in as they scroll into view; when searching or
              filtering, the ones that go fade away and the rest glide into place. */}
          <AnimatePresence mode="popLayout">
          {found.slice(0, shown).map((s, n) => (
            <motion.article
              key={s.id}
              layout
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (n % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/watch/${s.id}`} className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400">
                <SermonThumb sermon={s} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                <h3 className="mt-4 font-heading text-lg font-semibold leading-snug tracking-tight text-brand-950 group-hover:text-brand-700">{s.title}</h3>
                <p className="mt-1 truncate text-sm text-ink/55">{s.dateLabel} · {s.preacher}</p>
              </Link>
              {s.series && (
                <button type="button" onClick={() => pick(s.series)} className="mt-2 rounded-sm bg-brand-950/5 px-2 py-0.5 text-xs font-medium text-ink/70 hover:bg-brand-950/10">
                  {s.series}
                </button>
              )}
            </motion.article>
          ))}
          </AnimatePresence>
        </motion.div>
        </MotionConfig>
      )}

      {found.length > shown && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="inline-flex h-12 items-center rounded-md bg-brand-950 px-7 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-brand-900">
            Show more sermons
          </button>
        </div>
      )}
    </div>
  );
}
