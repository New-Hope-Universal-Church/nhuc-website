import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getEvent, getUpcomingEvents, hours } from '@/lib/hopeserve';
import { fmtDay, fmtTime, nowInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import { ArrowRight, ButtonLink, Container, Kente, Kicker } from '@/components/ui';
import { LiveBadge, isLive } from '@/components/sections';

/** Upcoming events are built ahead; any other is built on first visit. */
export async function generateStaticParams() {
  const events = await getUpcomingEvents(20);
  return events.length ? events.map((e) => ({ id: e.id })) : [{ id: 'none' }];
}

export async function generateMetadata({ params }: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const e = await getEvent(id);
  if (!e) return { title: 'Event' };
  const when = `${fmtDay(e.startDate)}, ${fmtTime(e.startDate)}`;
  const description = e.description ? `${when}. ${e.description}`.slice(0, 160) : `${when} at ${site.name}.`;
  return { title: e.title, description, openGraph: { title: e.title, description, type: 'website' } };
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-brand-950/10 pt-5">
      <dt className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-crimson-700">{label}</dt>
      <dd className="mt-2 text-lg text-ink/80">{children}</dd>
    </div>
  );
}

async function EventDetail({ params }: Pick<PageProps<'/events/[id]'>, 'params'>) {
  const { id } = await params;
  const [e, now] = await Promise.all([getEvent(id), nowInGhana()]);

  if (!e) {
    return (
      <Container className="pt-40 pb-32 text-center">
        <h1 className="font-heading text-4xl font-semibold text-brand-950">We could not find that event</h1>
        <p className="mt-4 text-ink/65">It may have been moved or removed.</p>
        <div className="mt-8"><ButtonLink href="/events" variant="dark">See what&apos;s coming up</ButtonLink></div>
      </Container>
    );
  }

  const live = !e.cancelled && isLive(e, now);
  const end = e.endDate ?? e.startDate;
  const past = !live && new Date(end).getTime() < new Date(now).getTime();
  const counselling = e.eventType?.counselling && !e.cancelled && !past;
  const streamed = !e.cancelled && (e.youtubeUrl || e.facebookUrl);

  return (
    <>
      <section className="bg-church">
        <Container className="pt-32 pb-14 sm:pt-40 sm:pb-16">
          <Link href="/events" className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-gold-300 hover:text-gold-200">&larr; All events</Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {live ? <LiveBadge /> : <Kicker>{e.eventType?.name ?? 'Event'}</Kicker>}
            {e.cancelled && <span className="rounded-sm bg-white px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-crimson-700">Cancelled</span>}
          </div>
          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">{e.title}</h1>
          <p className="mt-6 text-lg text-white/80">
            {fmtDay(e.startDate)} <span className="text-gold-300">·</span> {hours(e, fmtTime)}
          </p>
        </Container>
        <Kente />
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            {e.cancelled && (
              <p className="mb-8 rounded-md bg-crimson-50 px-5 py-4 text-crimson-800">This has been cancelled. We are sorry for any inconvenience.</p>
            )}
            {past && !e.cancelled && (
              <p className="mb-8 rounded-md bg-cream px-5 py-4 text-ink/70">This has already taken place.</p>
            )}
            {e.description ? (
              <p className="whitespace-pre-line text-xl leading-relaxed text-ink/80">{e.description}</p>
            ) : (
              <p className="text-xl leading-relaxed text-ink/70">Everyone is welcome. Come as you are.</p>
            )}

            {counselling && (
              <div className="mt-10 rounded-md bg-white p-7 ring-1 ring-brand-950/10 sm:p-9">
                <Kicker>Counselling</Kicker>
                <h2 className="mt-4 font-heading text-2xl font-semibold text-brand-950">Put your name down for this day</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/70">
                  Add your name to the list, then come to the church any time between {hours(e, fmtTime).replace(' to ', ' and ')}.
                  You will be seen in the order you arrive.
                </p>
                <div className="mt-6"><ButtonLink href={`/counselling?day=${e.id}`}>Put my name down</ButtonLink></div>
              </div>
            )}

            {streamed && (
              <div className={`mt-10 rounded-md p-7 sm:p-9 ${live ? 'bg-crimson-700 text-white' : 'bg-white ring-1 ring-brand-950/10'}`}>
                <p className={`font-display text-[12px] font-bold uppercase tracking-[0.2em] ${live ? 'text-white/80' : 'text-crimson-700'}`}>
                  {live ? 'On now' : past ? 'Watch again' : 'Watch live'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.youtubeUrl && (
                    <a href={e.youtubeUrl} target="_blank" rel="noreferrer" className={`inline-flex h-12 items-center rounded-md px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] ${live ? 'bg-white text-crimson-700 hover:bg-ivory' : 'bg-crimson-600 text-white hover:bg-crimson-700'}`}>
                      YouTube
                    </a>
                  )}
                  {e.facebookUrl && (
                    <a href={e.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-md bg-[#1d5fbf] px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#184f9f]">
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <dl className="space-y-6 self-start">
            {e.flyerUrl && (
              <a href={e.flyerUrl} target="_blank" rel="noreferrer" className="block">
                <Image src={e.flyerUrl} alt={`${e.title} flyer`} width={800} height={1000} sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full rounded-md ring-1 ring-brand-950/10" />
              </a>
            )}
            <Detail label="When">
              {fmtDay(e.startDate)}
              <span className="block text-ink/60">{hours(e, fmtTime)}</span>
            </Detail>
            <Detail label="Where">
              {e.location ?? site.address.line1}
              <Link href="/visit" className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-crimson-700 hover:text-crimson-800">
                Directions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Detail>
            {e.sessions.length > 1 && (
              <Detail label="Times">
                <ul className="space-y-1">
                  {e.sessions.map((s) => (
                    <li key={s.name}><span className="font-semibold text-brand-950">{s.name}</span> · {hours(s, fmtTime)}</li>
                  ))}
                </ul>
              </Detail>
            )}
          </dl>
        </Container>
      </section>
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
