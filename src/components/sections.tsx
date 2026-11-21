import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { streamLink, type ScheduleItem, type UpcomingEvent } from '@/lib/hopeserve';
import { dateTile, daysUntil, fmtDay, fmtDays, fmtTime, fmtWeekday, isMultiDay, programDay } from '@/lib/format';
import { HERO_IMAGE } from '@/lib/images';
import { site } from '@/lib/site';
import { Stagger, StaggerItem } from './motion';
import { ArrowRight, Clock, Container, Kente, Kicker, MapPin, Photo } from './ui';

/**
 * The header every inner page opens with, in the style of the stream
 * graphics: deep green, a crimson label, the title in bold capitals, and a
 * gold-framed photo with kente beneath it.
 */
export function PageHero({ kicker, title, intro, shot, src }: { kicker: string; title: ReactNode; intro?: ReactNode; shot?: string; src?: string }) {
  return (
    <section className="bg-church overflow-hidden">
      <Container className="grid items-center gap-12 pt-32 pb-16 sm:pt-40 lg:grid-cols-[1fr_0.75fr] lg:gap-16 lg:pb-20">
        <div>
          <div className="hero-rise" style={{ animationDelay: '0.05s' }}><Kicker>{kicker}</Kicker></div>
          <h1 className="mt-6 overflow-hidden pb-[0.08em] font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">
            <span className="hero-line block" style={{ animationDelay: '0.15s' }}>{title}</span>
          </h1>
          {intro && <p className="hero-rise mt-6 max-w-xl text-lg leading-relaxed text-white/75" style={{ animationDelay: '0.4s' }}>{intro}</p>}
          {/* <Scripture light className="mt-8 text-sm">{site.motto}</Scripture>S */}
        </div>
        {/* <Photo framed src={src} alt="" shot={shot} priority sizes="(min-width: 1024px) 35vw, 100vw" className="hidden w-full max-w-sm justify-self-end lg:block" /> */}
      </Container>
      <Kente />
    </section>
  );
}

/** The weekly schedule: day, gathering, time, in a scannable list. */
export function ServiceTimes({ items, light = false }: { items: ScheduleItem[]; light?: boolean }) {
  return (
    <Stagger as="ul" gap={0.1} className={`divide-y ${light ? 'divide-white/10 border-y border-white/10' : 'divide-brand-950/10 border-y border-brand-950/10'}`}>
      {items.map((s) => (
        <StaggerItem as="li" from="right" key={`${s.day}-${s.name}`} className="grid grid-cols-[3.75rem_1fr] sm:grid-cols-[4.75rem_1fr_auto] items-center gap-x-5 gap-y-1 py-5">
          <span className="row-span-2 sm:row-span-1 flex h-12 w-14 items-center justify-center rounded-sm bg-crimson-600 font-display text-sm font-extrabold tracking-[0.15em] text-white">{s.day}</span>
          <span>
            <span className={`block font-heading text-xl font-semibold ${light ? 'text-ivory' : 'text-brand-950'}`}>{s.name}</span>
            <span className={`block text-sm ${light ? 'text-white/55' : 'text-ink/55'}`}>
              {s.when}{s.endTime ? `, until ${s.endTime}` : ''}
            </span>
          </span>
          <span className={`col-start-2 sm:col-start-3 font-display text-base font-bold tabular-nums ${light ? 'text-gold-300' : 'text-gold-700'}`}>{s.time}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** Is one stretch of time on now? From 15 minutes before the start until the
 *  end (or 3 hours in). */
function onNow(startIso: string, endIso: string | null, now: number): boolean {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : start + 3 * HOUR;
  return now >= start - 15 * 60_000 && now <= end;
}

/** On now. With sessions, only while a session is on, so a three-day
 *  program isn't "live" overnight. A program over several days with no
 *  sessions counts as on for 3 hours from its start time each day. */
export function isLive(e: Pick<UpcomingEvent, 'startDate' | 'endDate'> & { sessions?: UpcomingEvent['sessions'] }, nowIso: string): boolean {
  const now = new Date(nowIso).getTime();
  if (e.sessions?.length) return e.sessions.some((s) => onNow(s.startDate, s.endDate, now));
  if (!isMultiDay(e)) return onNow(e.startDate, e.endDate, now);
  if (now > new Date(e.endDate!).getTime()) return false;
  const start = new Date(e.startDate).getTime();
  const day = Math.floor((now - start + 15 * 60_000) / DAY);
  return day >= 0 && onNow(new Date(start + day * DAY).toISOString(), null, now);
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

// ─── Events ───────────────────────────────────────────────────────────────────

/** A short label for where an event stands: live, running, or soon. */
export interface EventStatus {
  label: string;
  tone: 'live' | 'running' | 'soon';
}

export function eventStatus(e: UpcomingEvent, nowIso: string): EventStatus | null {
  if (e.cancelled) return null;
  if (isLive(e, nowIso)) return { label: 'Live now', tone: 'live' };
  const p = programDay(e, nowIso);
  if (p) return { label: `Ongoing · Day ${p.day} of ${p.of}`, tone: 'running' };
  const d = daysUntil(e.startDate, nowIso);
  if (d === 0) return { label: 'Today', tone: 'soon' };
  if (d === 1) return { label: 'Tomorrow', tone: 'soon' };
  if (d > 1 && d < 7) return { label: `In ${d} days`, tone: 'soon' };
  return null;
}

/** The status as a tag in the corner of a card or banner. */
export function StatusTag({ status, className = '' }: { status: EventStatus; className?: string }) {
  if (status.tone === 'live') return <span className={className}><LiveBadge /></span>;
  const colours = status.tone === 'running' ? 'bg-crimson-600 text-white' : 'bg-gold-300 text-brand-950';
  return (
    <span className={`inline-flex rounded-sm px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] ${colours} ${className}`}>
      {status.label}
    </span>
  );
}

/** Stands in for a flyer: the church green with the kind of event and its
 *  title set large, so an event without a flyer still looks designed. */
export function EventPoster({ event, large = false, className = '' }: { event: UpcomingEvent; large?: boolean; className?: string }) {
  const position = /\babsolute\b/.test(className) ? '' : 'relative';
  return (
    <div className={`bg-church ${position} flex flex-col justify-end overflow-hidden ${large ? 'p-8 sm:p-12' : 'p-6'} ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#fff' }} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_70%_at_85%_10%,rgba(233,183,48,0.22),transparent_60%)]" />
      <p className="relative font-display text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">{event.eventType?.name ?? 'Event'}</p>
      <p className={`relative mt-2 font-heading font-semibold leading-[1.05] tracking-tight text-ivory ${large ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{event.title}</p>
    </div>
  );
}

/** The date over the corner of a card: "NOV 20", or "SEP 14 to 22 NOV". */
function DateBadge({ event }: { event: UpcomingEvent }) {
  const start = dateTile(event.startDate);
  const end = isMultiDay(event) ? dateTile(event.endDate!) : null;
  return (
    <div className="absolute left-3 top-3 rounded-sm bg-brand-950/90 px-3 py-2 text-center text-white backdrop-blur-sm">
      <span className="block font-display text-[10px] font-bold tracking-[0.2em] text-gold-300">{start.month}</span>
      <span className="block font-display text-2xl font-extrabold leading-none">{start.day}</span>
      {end && (
        <span className="mt-1 block font-display text-[10px] font-bold tracking-widest text-white/70">
          to {end.day}{end.month !== start.month && ` ${end.month}`}
        </span>
      )}
    </div>
  );
}

/** One event as a card: the flyer (or a designed panel) with the date and
 *  status over it, then the title, time and place. The whole card opens the
 *  event's page; a watch-live or booking link sits on top of it. */
export function EventCard({ event, now }: { event: UpcomingEvent; now?: string }) {
  const status = now ? eventStatus(event, now) : null;
  const live = status?.tone === 'live';
  const stream = streamLink(event);
  const counselling = event.eventType?.counselling;
  const multiDay = isMultiDay(event);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10 transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(6,34,20,0.25)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-gold-400">
      <div className="relative aspect-[3/2] overflow-hidden">
        {event.flyerUrl ? (
          // The whole flyer, never cropped: flyers come square, tall or wide,
          // so it sits on a blurred copy of itself that fills the card.
          <div className="absolute inset-0 bg-brand-950">
            <div aria-hidden="true" className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-2xl" style={{ backgroundImage: `url(${event.flyerUrl})` }} />
            <Image src={event.flyerUrl} alt={`${event.title} flyer`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
          </div>
        ) : (
          <EventPoster event={event} className="absolute inset-0" />
        )}
        <DateBadge event={event} />
        {status && <StatusTag status={status} className="absolute right-3 top-3" />}
      </div>
      <Kente className="!h-1.5" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold leading-tight tracking-tight text-brand-950 group-hover:text-brand-700">
          {/* Stretched over the card, so a tap anywhere opens the event. */}
          <Link href={`/events/${event.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">{event.title}</Link>
        </h3>
        <ul className="mt-3 space-y-1.5 text-sm text-ink/65">
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-700" />
            {multiDay ? fmtDays(event) : `${fmtDay(event.startDate)} · ${fmtTime(event.startDate)}`}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-700" />
            {event.location ?? site.address.line1}
          </li>
        </ul>
        {event.sessions.length > 1 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {event.sessions.map((s) => (
              <li key={s.name} className="rounded-sm bg-cream px-2.5 py-1 text-xs text-ink/70">
                <span className="font-semibold text-brand-950">{s.name}</span> · {multiDay && `${fmtWeekday(s.startDate)} `}{fmtTime(s.startDate)}
              </li>
            ))}
          </ul>
        )}
        {event.description && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink/70">{event.description}</p>}
        {(stream || counselling) && (
          <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3 pt-5">
            {stream && (
              <a href={stream.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-crimson-700 hover:text-crimson-800">
                {live ? 'Watch live now' : `Watch live on ${stream.label}`} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
            {counselling && (
              <Link href={`/counselling?day=${event.id}`} className="inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-crimson-700 hover:text-crimson-800">
                Book a session <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * A page header with a photo behind it, like the home page hero but
 * shorter: for pages led by pictures, such as Events.
 */
export function PhotoBanner({ kicker, title, intro, src }: { kicker: string; title: ReactNode; intro?: ReactNode; src: string }) {
  return (
    <section className="bg-church relative isolate overflow-hidden">
      <div aria-hidden="true" className="hero-photo absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${src}), url(${HERO_IMAGE})` }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950/90 via-brand-950/60 to-brand-950/25" />
      <Container className="pt-36 pb-16 sm:pt-44 sm:pb-24">
        <div className="hero-rise" style={{ animationDelay: '0.1s' }}><Kicker>{kicker}</Kicker></div>
        <h1 className="mt-6 overflow-hidden pb-[0.08em] font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
          <span className="hero-line block" style={{ animationDelay: '0.2s' }}>{title}</span>
        </h1>
        {intro && <p className="hero-rise mt-6 max-w-xl text-lg leading-relaxed text-white/80" style={{ animationDelay: '0.45s' }}>{intro}</p>}
      </Container>
      <Kente />
    </section>
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
        <Stagger as="figure" gap={0.18} className="mx-auto max-w-4xl text-center">
          <StaggerItem from="zoom"><Kicker>Our anchor scripture</Kicker></StaggerItem>
          <blockquote className="relative mt-10">
            <StaggerItem from="zoom" className="absolute -top-10 left-1/2 -translate-x-1/2">
              <span aria-hidden="true" className="block font-heading text-[7rem] leading-none text-gold-400/60 select-none">&ldquo;</span>
            </StaggerItem>
            <StaggerItem from="blur">
              <p className="relative font-serif text-2xl italic leading-[1.6] text-brand-950 sm:text-[2rem] sm:leading-[1.55]">{v.text}</p>
            </StaggerItem>
          </blockquote>
          <StaggerItem>
            <figcaption className="mt-8 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-crimson-700">
              {v.reference} <span className="text-ink/40">({v.translation})</span>
            </figcaption>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}
