import type { Metadata } from 'next';
import Link from 'next/link';
import { getPastEvents, getUpcomingEvents } from '@/lib/hopeserve';
import { fmtShortDate, nowInGhana } from '@/lib/format';
import { EVENTS_IMAGE } from '@/lib/images';
import { site } from '@/lib/site';
import { Container, SectionHeading } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { EventCard, PhotoBanner } from '@/components/sections';
import type { UpcomingEvent } from '@/lib/hopeserve';

export const metadata: Metadata = {
  title: 'Events',
  description: `What's coming up at ${site.name}.`,
};

function Grid({ events, now }: { events: UpcomingEvent[]; now: string }) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {events.map((e, i) => (
        <Reveal key={e.id} delay={(i % 2) * 0.1} className="flex [&>*]:w-full">
          <EventCard event={e} now={now} />
        </Reveal>
      ))}
    </div>
  );
}

/** A past event as a small row: when, what, where. Opens its page. */
function PastEvent({ event }: { event: UpcomingEvent }) {
  return (
    <Link href={`/events/${event.id}`} className="group flex items-center gap-4 rounded-md bg-white p-3 ring-1 ring-brand-950/10 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(6,34,20,0.25)] focus-visible:outline-2 focus-visible:outline-gold-400">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-church">
        {event.flyerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.flyerUrl} alt="" loading="lazy" className="size-full object-cover grayscale-[40%] transition group-hover:grayscale-0" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink/50">{fmtShortDate(event.startDate)}</p>
        <h3 className="mt-0.5 truncate font-heading text-lg font-semibold text-brand-950 group-hover:underline">{event.title}</h3>
        {event.location && <p className="truncate text-sm text-ink/60">{event.location}</p>}
      </div>
    </Link>
  );
}

/** Events: what's running now (a program partway through, or live), then
 *  what's coming up. Weekly services are under service times instead. */
export default async function EventsPage() {
  const [events, past, now] = await Promise.all([getUpcomingEvents(24, true), getPastEvents(6), nowInGhana()]);
  const t = Date.parse(now);
  const running = events.filter((e) => Date.parse(e.startDate) <= t);
  const upcoming = events.filter((e) => Date.parse(e.startDate) > t);

  return (
    <>
      <PhotoBanner kicker="What's on" title="Events" intro="Conventions, programmes and special services. Everyone is welcome." src={EVENTS_IMAGE} />

      {running.length > 0 && (
        <section className="pt-20 sm:pt-24">
          <Container>
            <SectionHeading kicker="Happening now" title="On right now" />
            <Grid events={running} now={now} />
          </Container>
        </section>
      )}

      <section className="py-20 sm:py-24">
        <Container>
          {upcoming.length > 0 ? (
            <>
              <SectionHeading kicker="Coming up" title={running.length ? 'Coming up next' : 'Coming up'} />
              <Grid events={upcoming} now={now} />
            </>
          ) : (
            running.length === 0 && <p className="text-lg text-ink/60">Nothing is scheduled just now. Check back soon.</p>
          )}
        </Container>
      </section>

      {past.length > 0 && (
        <section className="border-t border-brand-950/10 bg-cream/60 py-16 sm:py-20">
          <Container>
            <SectionHeading kicker="Looking back" title="Past events" />
            <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => <PastEvent key={e.id} event={e} />)}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
