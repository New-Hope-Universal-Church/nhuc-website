import Link from 'next/link';
import type { ReactNode } from 'react';
import { excerpt, type Devotional } from '@/lib/hopeserve';
import { daysUntil, fmtDay } from '@/lib/format';
import { HOPE_IMAGE, HERO_IMAGE } from '@/lib/images';
import { site } from '@/lib/site';
import Markdown from '@/components/Markdown';
import { ArrowLeft, ArrowRight, Container, Kente, Kicker, Scripture } from '@/components/ui';
import DevotionalList, { type ListItem } from './DevotionalList';

const noon = (date: string) => `${date}T12:00:00Z`;

function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-l-4 border-gold-400 pl-6">
      <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-crimson-700">{label}</p>
      <div className="mt-2 text-lg leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

/**
 * Hope for Today: one devotional in full, with every other one listed
 * beside it to search, sort and filter by month. The same on /hope (the
 * latest) and /hope/[date] (that day's), so reading never needs a click
 * through.
 */
export default function HopeReader({ d, all, today, isIndex }: { d: Devotional; all: Devotional[]; today: string; isIndex: boolean }) {
  const relative = (date: string) => {
    const n = daysUntil(noon(date), noon(today));
    return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : null;
  };
  const label = (date: string) => {
    const r = relative(date);
    return r ? `${r}, ${fmtDay(noon(date))}` : fmtDay(noon(date));
  };
  const monthLabel = (date: string) => new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(noon(date)));
  const items: ListItem[] = all.map((x) => ({
    date: x.date,
    title: x.title,
    scripture: x.scripture,
    relative: relative(x.date),
    weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' }).format(new Date(noon(x.date))),
    month: x.date.slice(0, 7),
    monthLabel: monthLabel(x.date),
    search: [x.title, x.scripture, x.author, excerpt(x, 400)].filter(Boolean).join(' ').toLowerCase(),
  }));

  const i = all.findIndex((x) => x.date === d.date);
  const newer = i > 0 ? all[i - 1] : null;
  const older = i >= 0 && i < all.length - 1 ? all[i + 1] : null;
  const url = `${site.url}/hope/${d.date}`;
  const shareText = `Hope for Today: ${d.title}\n${url}`;
  const Title = isIndex ? 'h2' : 'h1';

  return (
    <>
      <section className="bg-church relative isolate overflow-hidden">
        <div aria-hidden="true" className="hero-photo absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${HOPE_IMAGE}), url(${HERO_IMAGE})` }} />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950/90 via-brand-950/65 to-brand-950/30" />
        <Container className="pt-36 pb-12 sm:pt-44 sm:pb-16">
          <Kicker>Daily devotional</Kicker>
          {isIndex ? (
            <h1 className="mt-5 font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-ivory sm:text-6xl">Hope for Today</h1>
          ) : (
            <Link href="/hope" className="mt-5 block font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-ivory hover:text-gold-200 sm:text-6xl">Hope for Today</Link>
          )}
          <p className="mt-4 max-w-xl text-lg text-white/80">A word for every day: scripture, a short message, a confession and a prayer.</p>
        </Container>
        <Kente />
      </section>

      <section className="py-12 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium text-ink/55">{label(d.date)}</p>
              <a href="#all-devotionals" className="shrink-0 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-crimson-700 hover:text-crimson-800 lg:hidden">All devotionals</a>
            </div>
            <Title className="mt-2 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">{d.title}</Title>
            {d.author && <p className="mt-2 text-ink/60">{d.author}</p>}

            {(d.passage || d.scripture) && (
              <figure className="mt-6 border-l-2 border-gold-400 pl-4">
                {d.passage && <Scripture className="text-[15px] leading-relaxed text-ink/70!">&ldquo;{d.passage}&rdquo;</Scripture>}
                {d.scripture && <figcaption className="mt-2 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-crimson-700">{d.scripture}</figcaption>}
              </figure>
            )}

            <Markdown text={d.body} className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85" />

            <div className="mt-10 space-y-8">
              {d.confession && <Part label="Confession"><p className="font-serif italic">{d.confession}</p></Part>}
              {d.prayer && <Part label="Prayer"><p>{d.prayer}</p></Part>}
            </div>

            {d.declaration && (
              <div className="mt-10 rounded-md bg-church p-8 text-center sm:p-10">
                <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-gold-300">This year&apos;s declaration</p>
                <p className="mt-3 font-heading text-2xl font-semibold leading-snug text-ivory sm:text-3xl">{d.declaration}</p>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 border-t border-brand-950/10 pt-8 sm:flex-row sm:items-center">
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-ink/55 sm:mr-2">Share</p>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md bg-[#1f8f4e] px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#187a42]">WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md bg-[#1d5fbf] px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#184f9f]">Facebook</a>
            </div>

            {(newer || older) && (
              <nav aria-label="Next and previous day" className="mt-8 grid gap-3 sm:grid-cols-2">
                {older ? (
                  <Link href={`/hope/${older.date}`} className="rounded-md bg-white p-5 ring-1 ring-brand-950/10 hover:ring-gold-400">
                    <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50"><ArrowLeft className="inline h-3.5 w-3.5" /> Previous day</span>
                    <span className="mt-1 block font-heading text-lg font-semibold text-brand-950">{older.title}</span>
                  </Link>
                ) : <span />}
                {newer && (
                  <Link href={`/hope/${newer.date}`} className="rounded-md bg-white p-5 text-right ring-1 ring-brand-950/10 hover:ring-gold-400">
                    <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Next day <ArrowRight className="inline h-3.5 w-3.5" /></span>
                    <span className="mt-1 block font-heading text-lg font-semibold text-brand-950">{newer.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside id="all-devotionals" aria-label="All devotionals" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-brand-950">All devotionals</h2>
            <DevotionalList items={items} current={d.date} />
          </aside>
        </Container>
      </section>
    </>
  );
}
