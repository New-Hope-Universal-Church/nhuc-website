import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { getEvent, getUpcomingEvents, hours, type UpcomingEvent } from '@/lib/hopeserve';
import { daysUntil, fmtDay, fmtDays, fmtTime, isMultiDay, nowInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import { ArrowLeft, ArrowRight, ButtonLink, CalendarIcon, CalendarPlus, Clock, Container, Kente, Kicker, MapPin, Person, SectionHeading } from '@/components/ui';
import { EventCard, EventPoster, StatusTag, eventStatus } from '@/components/sections';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

/** Upcoming events are built ahead; any other is built on first visit. */
export async function generateStaticParams() {
  const events = await getUpcomingEvents(20);
  return events.length ? events.map((e) => ({ id: e.id })) : [{ id: 'none' }];
}

export async function generateMetadata({ params }: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const e = await getEvent(id);
  if (!e) return { title: 'Event' };
  const when = `${fmtDays(e)}, ${fmtTime(e.startDate)}`;
  const description = e.description ? `${when}. ${e.description}`.slice(0, 160) : `${when} at ${site.name}.`;
  return {
    title: e.title,
    description,
    openGraph: { title: e.title, description, type: 'website', ...(e.flyerUrl ? { images: [e.flyerUrl] } : {}) },
  };
}

/** One line of the details card: an icon, then what it says. */
function Detail({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-crimson-700">{icon}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

/** The sessions of a program, grouped by day: "Friday 3 April", then each
 *  session and its hours. */
function Programme({ event }: { event: UpcomingEvent }) {
  const days = new Map<string, UpcomingEvent['sessions']>();
  for (const s of event.sessions) {
    const day = fmtDay(s.startDate);
    days.set(day, [...(days.get(day) ?? []), s]);
  }
  return (
    <div className="mt-12">
      <h2 className="font-heading text-2xl font-semibold text-brand-950">Programme</h2>
      <div className="mt-5 divide-y divide-brand-950/10 border-y border-brand-950/10">
        {[...days].map(([day, sessions]) => (
          <div key={day} className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-crimson-700">{day}</p>
            <ul className="space-y-1.5">
              {sessions.map((s) => (
                <li key={s.name} className="flex flex-wrap justify-between gap-x-4 text-ink/80">
                  <span className="font-semibold text-brand-950">{s.name}</span>
                  <span className="tabular-nums text-ink/60">{hours(s, fmtTime)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Starts in 9 days", "Happening now · Day 2 of 3", "This has already taken place". */
function statusLine(e: UpcomingEvent, now: string, past: boolean): string | null {
  if (e.cancelled) return null;
  if (past) return 'This has already taken place';
  const status = eventStatus(e, now);
  if (status?.tone === 'running') return status.label.replace('Ongoing', 'Happening now');
  if (status) return status.label;
  const d = daysUntil(e.startDate, now);
  return d >= 7 ? `Starts in ${d} days` : null;
}

async function EventDetail({ params }: Pick<PageProps<'/events/[id]'>, 'params'>) {
  const { id } = await params;
  const [e, now, more] = await Promise.all([getEvent(id), nowInGhana(), getUpcomingEvents(4, true)]);

  if (!e) {
    return (
      <Container className="pt-40 pb-32 text-center">
        <h1 className="font-heading text-4xl font-semibold text-brand-950">We could not find that event</h1>
        <p className="mt-4 text-ink/65">It may have been moved or removed.</p>
        <div className="mt-8"><ButtonLink href="/events" variant="dark">See what&apos;s coming up</ButtonLink></div>
      </Container>
    );
  }

  const status = eventStatus(e, now);
  const live = status?.tone === 'live';
  const past = !live && Date.parse(e.endDate ?? e.startDate) < Date.parse(now);
  const line = statusLine(e, now, past);
  const counselling = e.eventType?.counselling && !e.cancelled && !past;
  const streamed = !e.cancelled && (e.youtubeUrl || e.facebookUrl);
  const multiDay = isMultiDay(e);
  const showProgramme = e.sessions.length > 1 || (multiDay && e.sessions.length > 0);
  const others = more.filter((o) => o.id !== e.id).slice(0, 3);

  return (
    <>
      <section className="bg-church">
        <Container className="pt-32 pb-12 sm:pt-40 sm:pb-14">
          <Link href="/events" className="inline-flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-gold-300 hover:text-gold-200"><ArrowLeft /> All events</Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {live && status ? <StatusTag status={status} /> : <Kicker>{e.eventType?.name ?? 'Event'}</Kicker>}
            {e.cancelled && <span className="rounded-sm bg-white px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-crimson-700">Cancelled</span>}
          </div>
          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">{e.title}</h1>
          <p className="mt-5 text-lg text-white/80">
            {fmtDays(e)} <span className="text-gold-300">·</span> {multiDay ? `from ${fmtTime(e.startDate)}` : hours(e, fmtTime)}
          </p>
        </Container>
        <Kente />
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal className="min-w-0">
            {e.flyerUrl ? (
              <a href={e.flyerUrl} target="_blank" rel="noreferrer" className="block">
                <Image src={e.flyerUrl} alt={`${e.title} flyer`} width={1200} height={1500} sizes="(min-width: 1024px) 55vw, 100vw" priority className="h-auto w-full rounded-md ring-1 ring-brand-950/10" />
              </a>
            ) : (
              <EventPoster event={e} large className="aspect-[16/9] rounded-md" />
            )}

            {line && (
              <p className={`mt-8 flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.18em] ${past ? 'text-ink/50' : 'text-crimson-700'}`}>
                {!past && <span className="h-2 w-2 rounded-full bg-crimson-600" aria-hidden="true" />}
                {line}
              </p>
            )}
            {e.cancelled && (
              <p className="mt-8 rounded-md bg-crimson-50 px-5 py-4 text-crimson-800">This has been cancelled. We are sorry for any inconvenience.</p>
            )}

            <h2 className="mt-8 font-heading text-2xl font-semibold text-brand-950">About this event</h2>
            {e.description ? (
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink/80">{e.description}</p>
            ) : (
              <p className="mt-4 text-lg leading-relaxed text-ink/70">Everyone is welcome. Come as you are.</p>
            )}

            {showProgramme && <Programme event={e} />}

            {counselling && (
              <div className="mt-12 rounded-md bg-white p-7 ring-1 ring-brand-950/10 sm:p-9">
                <Kicker>Counselling</Kicker>
                <h2 className="mt-4 font-heading text-2xl font-semibold text-brand-950">Book a session on this day</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/70">
                  Book a session, then come to the church any time between {hours(e, fmtTime).replace(' to ', ' and ')}.
                  You will be seen in the order you arrive.
                </p>
                <div className="mt-6"><ButtonLink href={`/counselling?day=${e.id}`}>Book a session</ButtonLink></div>
              </div>
            )}
          </Reveal>

          <aside className="self-start lg:sticky lg:top-28"><Reveal from="right" delay={0.15}>
            <div className="overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10">
              <Kente className="!h-1.5" />
              <div className="p-7">
                <ul className="space-y-5 text-ink/80">
                  <Detail icon={<CalendarIcon className="h-5 w-5" />}>{fmtDays(e)}</Detail>
                  <Detail icon={<Clock className="h-5 w-5" />}>{hours(e, fmtTime)}</Detail>
                  <Detail icon={<MapPin className="h-5 w-5" />}>
                    {e.location ?? site.address.line1}
                    <Link href="/visit" className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-crimson-700 hover:text-crimson-800">
                      Directions <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Detail>
                  {e.host && <Detail icon={<Person className="h-5 w-5" />}><span className="text-ink/55">Host:</span> {e.host}</Detail>}
                </ul>

                <div className="mt-7 flex flex-col gap-2">
                  {!past && !e.cancelled && (
                    <a href={`/events/${e.id}/calendar`} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-950 px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-brand-900">
                      <CalendarPlus className="h-4 w-4" /> Add to calendar
                    </a>
                  )}
                  {streamed && e.youtubeUrl && (
                    <a href={e.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-md bg-crimson-600 px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-crimson-700">
                      {live ? 'Watch live on YouTube' : past ? 'Watch again on YouTube' : 'Watch on YouTube'}
                    </a>
                  )}
                  {streamed && e.facebookUrl && (
                    <a href={e.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-md bg-[#1d5fbf] px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#184f9f]">
                      {live ? 'Watch live on Facebook' : past ? 'Watch again on Facebook' : 'Watch on Facebook'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal></aside>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="border-t border-brand-950/10 bg-white py-20 sm:py-24">
          <Container>
            <SectionHeading kicker="What's on" title="More events" />
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.12}>
              {others.map((o) => <StaggerItem key={o.id} className="flex *:w-full"><EventCard event={o} now={now} /></StaggerItem>)}
            </Stagger>
          </Container>
        </section>
      )}
    </>
  );
}

export default function EventPage(props: PageProps<'/events/[id]'>) {
  return (
    <Suspense fallback={<div className="bg-church min-h-[60vh]" />}>
      <EventDetail params={props.params} />
    </Suspense>
  );
}
