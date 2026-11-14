import type { Metadata } from 'next';
import { getUpcomingEvents } from '@/lib/hopeserve';
import { site } from '@/lib/site';
import { Container } from '@/components/ui';
import { EventCard, PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Events',
  description: `What's coming up at ${site.name}.`,
};

export default async function EventsPage() {
  const events = await getUpcomingEvents(12);
  return (
    <>
      <PageHero kicker="What's on" title="Events" intro="Services, prayer nights, conferences and fellowship. Everyone is welcome." shot="All Night Service in prayer" />
      <section className="py-20 sm:py-28">
        <Container>
          {events.length === 0 ? (
            <p className="text-lg text-ink/60">Nothing is scheduled just now. Check back soon.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
