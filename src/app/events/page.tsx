import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAnnouncements, getPastEvents, getUpcomingEvents, type Announcement } from '@/lib/hopeserve';
import { fmtDay, fmtShortDate, nowInGhana } from '@/lib/format';
import Markdown from '@/components/Markdown';
import { EVENTS_IMAGE } from '@/lib/images';
import { site } from '@/lib/site';
import { Container, Kicker, SectionHeading } from '@/components/ui';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { EventCard, PhotoBanner } from '@/components/sections';
import type { UpcomingEvent } from '@/lib/hopeserve';

export const metadata: Metadata = {
  title: "What's on",
  description: `Events, programmes and church news from ${site.name}.`,
};

/** One church notice: its picture if it has one, the date, title and text. */
function Notice({ a }: { a: Announcement }) {
  return (
    <article className="mb-6 flex break-inside-avoid flex-col overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10">
      {a.imageUrl && (
        <Image src={a.imageUrl} alt={a.title} width={1200} height={800} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto max-h-80 w-full bg-cream object-contain" />
      )}
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          {a.pinned && <Kicker>Important</Kicker>}
          <p className="text-sm text-ink/55">{fmtDay(a.date)}</p>
        </div>
        <h3 className="mt-2 font-heading text-2xl font-semibold leading-tight text-brand-950">{a.title}</h3>
        <Markdown text={a.body} className="mt-3 space-y-3 leading-relaxed text-ink/75" />
      </div>
    </article>
  );
}

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

/** What's on: what's running now (a program partway through, or live),
 *  what's coming up, church news, then past events. Weekly services are
 *  under service times instead. */
export default async function EventsPage() {
  const [events, past, news, now] = await Promise.all([getUpcomingEvents(24, true), getPastEvents(6), getAnnouncements(), nowInGhana()]);
  const t = Date.parse(now);
  const running = events.filter((e) => Date.parse(e.startDate) <= t);
  const upcoming = events.filter((e) => Date.parse(e.startDate) > t);

  return (
    <>
      <PhotoBanner kicker="What's on" title="Events and news" intro="Conventions, programmes, special services and notices from the church. Everyone is welcome." src={EVENTS_IMAGE} />

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

      {news.length > 0 && (
        <section id="news" className="scroll-mt-24 border-t border-brand-950/10 bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading kicker="Church news" title="Announcements" />
            <Stagger className="mt-8 gap-6 md:columns-2" gap={0.12}>
              {news.map((a) => <StaggerItem key={a.id} className="break-inside-avoid"><Notice a={a} /></StaggerItem>)}
            </Stagger>
          </Container>
        </section>
      )}

      {past.length > 0 && (
        <section className="border-t border-brand-950/10 bg-cream/60 py-16 sm:py-20">
          <Container>
            <SectionHeading kicker="Looking back" title="Past events" />
            <Stagger className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3" gap={0.07}>
              {past.map((e) => <StaggerItem key={e.id} from="left"><PastEvent event={e} /></StaggerItem>)}
            </Stagger>
          </Container>
        </section>
      )}
    </>
  );
}
