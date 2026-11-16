import Link from 'next/link';
import type { ReactNode } from 'react';
import { streamLink, type ScheduleItem, type UpcomingEvent } from '@/lib/hopeserve';
import { dateTile, fmtDay, fmtTime } from '@/lib/format';
import { site } from '@/lib/site';
import { ArrowRight, Container, Kente, Kicker, Photo, Scripture } from './ui';

/**
 * The header every inner page opens with, in the style of the stream
 * graphics: deep green, a crimson label, the title in bold capitals, and a
 * gold-framed photo with kente beneath it.
 */
export function PageHero({ kicker, title, intro, shot, src }: { kicker: string; title: ReactNode; intro?: ReactNode; shot: string; src?: string }) {
  return (
    <section className="bg-church overflow-hidden">
      <Container className="grid items-center gap-12 pt-32 pb-16 sm:pt-40 lg:grid-cols-[1fr_0.75fr] lg:gap-16 lg:pb-20">
        <div>
          <Kicker>{kicker}</Kicker>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">{title}</h1>
          {intro && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{intro}</p>}
          {/* <Scripture light className="mt-8 text-sm">{site.motto}</Scripture>S */}
        </div>
        <Photo framed src={src} alt="" shot={shot} priority sizes="(min-width: 1024px) 35vw, 100vw" className="hidden w-full max-w-sm justify-self-end lg:block" />
      </Container>
      <Kente />
    </section>
  );
}

/** The weekly schedule: day, gathering, time, in a scannable list. */
export function ServiceTimes({ items, light = false }: { items: ScheduleItem[]; light?: boolean }) {
  return (
    <ul className={`divide-y ${light ? 'divide-white/10 border-y border-white/10' : 'divide-brand-950/10 border-y border-brand-950/10'}`}>
      {items.map((s) => (
        <li key={`${s.day}-${s.name}`} className="grid grid-cols-[3.75rem_1fr] sm:grid-cols-[4.75rem_1fr_auto] items-center gap-x-5 gap-y-1 py-5">
          <span className="row-span-2 sm:row-span-1 flex h-12 w-14 items-center justify-center rounded-sm bg-crimson-600 font-display text-sm font-extrabold tracking-[0.15em] text-white">{s.day}</span>
          <span>
            <span className={`block font-heading text-xl font-semibold ${light ? 'text-ivory' : 'text-brand-950'}`}>{s.name}</span>
            <span className={`block text-sm ${light ? 'text-white/55' : 'text-ink/55'}`}>
              {s.when}{s.endTime ? `, until ${s.endTime}` : ''}
            </span>
          </span>
          <span className={`col-start-2 sm:col-start-3 font-display text-base font-bold tabular-nums ${light ? 'text-gold-300' : 'text-gold-700'}`}>{s.time}</span>
        </li>
      ))}
    </ul>
  );
}

/** On now: from 15 minutes before the start until the end (or 3 hours in). */
export function isLive(e: Pick<UpcomingEvent, 'startDate' | 'endDate'>, nowIso: string): boolean {
  const now = new Date(nowIso).getTime();
  const start = new Date(e.startDate).getTime();
  const end = e.endDate ? new Date(e.endDate).getTime() : start + 3 * 3_600_000;
  return now >= start - 15 * 60_000 && now <= end;
}

/** A pulsing crimson "LIVE NOW" tag. */
export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm bg-crimson-600 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      Live now
    </span>
  );
}

/** One upcoming event as a card with a date tile. The whole card opens the
 *  event's page; a watch-live link (or, for a counselling day, a booking
 *  link) sits on top of it. */
export function EventCard({ event, now }: { event: UpcomingEvent; now?: string }) {
  const tile = dateTile(event.startDate);
  const stream = streamLink(event);
  const live = now ? isLive(event, now) : false;
  const counselling = event.eventType?.counselling;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10 transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(6,34,20,0.25)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-gold-400">
      <div className="flex items-stretch">
        <div className="flex w-20 flex-col items-center justify-center bg-brand-950 py-4 text-white">
          <span className="font-display text-[11px] font-bold tracking-[0.2em] text-gold-300">{tile.month}</span>
          <span className="font-display text-3xl font-extrabold leading-none">{tile.day}</span>
        </div>
        <div className="flex flex-1 items-center justify-between gap-3 px-5">
          <span className="text-sm text-ink/60">{fmtDay(event.startDate)}</span>
          <span className="font-display text-sm font-bold text-crimson-700">{fmtTime(event.startDate)}</span>
        </div>
      </div>
      <Kente className="!h-1.5" />
      {event.flyerUrl && <Photo src={event.flyerUrl} alt={`${event.title} flyer`} shot="Event flyer" sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[3/2]" />}
      <div className="flex-1 p-6">
        <h3 className="font-heading text-xl font-semibold leading-tight tracking-tight text-brand-950 group-hover:text-brand-700">
          {/* Stretched over the card, so a tap anywhere opens the event. */}
          <Link href={`/events/${event.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">{event.title}</Link>
        </h3>
        {event.location && <p className="mt-1 text-sm text-ink/55">{event.location}</p>}
        {event.sessions.length > 1 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {event.sessions.map((s) => (
              <li key={s.name} className="rounded-sm bg-cream px-2.5 py-1 text-xs text-ink/70">
                <span className="font-semibold text-brand-950">{s.name}</span> · {fmtTime(s.startDate)}
              </li>
            ))}
          </ul>
        )}
        {event.description && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink/70">{event.description}</p>}
        {(live || stream || counselling) && (
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
            {live && <LiveBadge />}
            {stream && (
              <a href={stream.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-crimson-700 hover:text-crimson-800">
                {live ? 'Watch live now' : `Watch live on ${stream.label}`} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
            {counselling && (
              <Link href={`/counselling?day=${event.id}`} className="inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-crimson-700 hover:text-crimson-800">
                Put your name down <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/** "See all" style link with an arrow. */
export function MoreLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.14em] ${light ? 'text-gold-300 hover:text-gold-200' : 'text-crimson-700 hover:text-crimson-800'}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * The church's anchor scripture, the verse on the banner behind the pulpit,
 * set large like that banner.
 */
export function AnchorVerse() {
  const v = site.anchorVerse;
  return (
    <section className="bg-ivory">
      <Container className="py-20 sm:py-28">
        <figure className="mx-auto max-w-4xl text-center">
          <Kicker>Our anchor scripture</Kicker>
          <blockquote className="relative mt-10">
            <span aria-hidden="true" className="absolute -top-10 left-1/2 -translate-x-1/2 font-heading text-[7rem] leading-none text-gold-400/60 select-none">&ldquo;</span>
            <p className="relative font-serif text-2xl italic leading-[1.6] text-brand-950 sm:text-[2rem] sm:leading-[1.55]">{v.text}</p>
          </blockquote>
          <figcaption className="mt-8 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-crimson-700">
            {v.reference} <span className="text-ink/40">({v.translation})</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
