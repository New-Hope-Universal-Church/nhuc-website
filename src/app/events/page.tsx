import type { Metadata } from 'next';
import { getUpcomingEvents } from '@/lib/hopeserve';
import { nowInGhana } from '@/lib/format';
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

/** Events: what's running now (a program partway through, or live), then
 *  what's coming up. Weekly services are under service times instead. */
export default async function EventsPage() {
  const [events, now] = await Promise.all([getUpcomingEvents(24, true), nowInGhana()]);
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
    </>
  );
}
