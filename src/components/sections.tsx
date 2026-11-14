import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ScheduleItem, UpcomingEvent } from '@/lib/hopeserve';
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
          <Scripture light className="mt-8 text-sm">{site.motto}</Scripture>
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
              {s.when}{s.note ? ` · ${s.note}` : ''}
            </span>
          </span>
          <span className={`col-start-2 sm:col-start-3 font-display text-base font-bold tabular-nums ${light ? 'text-gold-300' : 'text-gold-700'}`}>{s.time}</span>
        </li>
      ))}
    </ul>
  );
}

/** One upcoming event as a card with a date tile. */
export function EventCard({ event }: { event: UpcomingEvent }) {
  const tile = dateTile(event.startDate);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10 transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(6,34,20,0.25)]">
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
      <div className="flex-1 p-6">
        <h3 className="font-heading text-xl font-semibold leading-tight tracking-tight text-brand-950">{event.title}</h3>
        {event.location && <p className="mt-1 text-sm text-ink/55">{event.location}</p>}
        {event.description && <p className="mt-4 text-sm leading-relaxed text-ink/70">{event.description}</p>}
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
 * The call and response: the man of God calls "New Hope!" and the church
 * answers, in Twi with the English beneath.
 */
export function CallAndResponse() {
  return (
    <section className="bg-church relative overflow-hidden">
      <Kente />
      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Kicker>Our family</Kicker>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/55">The man of God calls</p>
            <p className="mt-2 font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-gold-300 sm:text-7xl">{site.call}</p>
            <p className="mt-6 max-w-sm text-white/65">
              We are Christian and proudly Ghanaian. When the man of God calls, the church answers as one family, in Twi and in every language we bring.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">And we respond</p>
            <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {site.responses.map((r) => (
                <li key={r.twi} className="py-6">
                  <p lang="tw" className="font-display text-2xl font-extrabold uppercase tracking-tight text-ivory sm:text-[2rem] sm:leading-tight">
                    <span className="text-gold-300">New Hope,</span> {r.twi}
                  </p>
                  <Scripture light className="mt-1.5">{r.english}</Scripture>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
      <Kente />
    </section>
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
