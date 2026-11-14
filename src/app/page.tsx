import { excerpt, getLatestDevotional, getLatestSermons, getSchedule, getUpcomingEvents, scriptureLine, streamLink } from '@/lib/hopeserve';
import { fmtDay, fmtShortDate, fmtTime, nowInGhana, todayInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import { ArrowRight, ButtonLink, Container, Kente, Kicker, Photo, Scripture, SectionHeading } from '@/components/ui';
import { AnchorVerse, EventCard, LiveBadge, MoreLink, ServiceTimes, isLive } from '@/components/sections';

/**
 * The home page, kept short: who we are in one line, the anchor verse, when
 * to come, today's word and the latest sermon, what's next, and counselling.
 */
export default async function HomePage() {
  const [schedule, events, sermons, devotional, today, now] = await Promise.all([
    getSchedule(),
    getUpcomingEvents(3),
    getLatestSermons(1),
    getLatestDevotional(),
    todayInGhana(),
    nowInGhana(),
  ]);
  const next = events[0];
  const live = next && isLive(next, now);
  const nextStream = next && streamLink(next);
  const sermon = sermons[0];

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-church overflow-hidden">
        <Container className="grid min-h-[88svh] items-center gap-12 pt-32 pb-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:pt-36">
          <Photo framed alt="" shot="The Leader ministering, or the congregation in worship" priority sizes="(min-width: 1024px) 35vw, 100vw" className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:max-w-none" />
          <div className="order-1 lg:order-2">
            <Kicker>Welcome home</Kicker>
            <h1 className="mt-7 font-heading text-[clamp(2.4rem,6.2vw,5.25rem)] font-semibold leading-[1.02] tracking-tight text-ivory">
              Christ in you, <span className="text-gold-300">the hope of glory</span>
            </h1>
            <Scripture light className="mt-4 text-base">{site.mottoReference}</Scripture>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
              A family of believers in {site.address.line1}, {site.address.city}. There is a seat for you here.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/visit" variant="gold">Plan your visit <ArrowRight /></ButtonLink>
              <ButtonLink href="/watch" variant="outline-light">Watch online</ButtonLink>
            </div>
          </div>
        </Container>

        {next && (
          <div className="border-t border-white/10 bg-black/20">
            <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {live ? <LiveBadge /> : <span className="rounded-sm bg-crimson-600 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">Next</span>}
                <p className="font-heading text-lg font-semibold text-ivory">{next.title}</p>
              </div>
              <p className="text-sm text-white/70">
                <span className="text-gold-300">{fmtDay(next.startDate)}</span> · {fmtTime(next.startDate)} · {site.address.line1}
              </p>
              {nextStream ? (
                <a href={nextStream.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-gold-300 hover:text-gold-200">
                  {live ? 'Watch live now' : `Watch live on ${nextStream.label}`} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <MoreLink href="/visit" light>Directions</MoreLink>
              )}
            </Container>
          </div>
        )}
        <Kente />
      </section>

      <AnchorVerse />

      {/* ─── Service times ────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading kicker="Gather with us" title="Service times" intro="Come as you are. Our ushers will help you find a seat." />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/visit" variant="dark">Plan your visit</ButtonLink>
              <ButtonLink href={site.address.mapsUrl} target="_blank" rel="noreferrer" variant="outline-dark">Get directions</ButtonLink>
            </div>
          </div>
          {schedule.length ? <ServiceTimes items={schedule} /> : <p className="self-center text-lg text-ink/60">Service times will be listed here soon. Ask any usher, or call the church office.</p>}
        </Container>
      </section>

      {/* ─── Today's word and the latest sermon ───────────────────────────── */}
      {(devotional || sermon) && (
        <section className="bg-white py-24 sm:py-28">
          <Container className="grid gap-6 lg:grid-cols-2">
            {devotional && (
              <article className="flex flex-col overflow-hidden rounded-md bg-cream ring-1 ring-brand-950/10">
                <Kente />
                <div className="flex flex-1 flex-col p-8 sm:p-10">
                  <Kicker>Hope for Today</Kicker>
                  <p className="mt-4 text-sm text-ink/50">{fmtDay(`${devotional.date}T12:00:00Z`)}</p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-950">{devotional.title}</h2>
                  {devotional.scripture && <Scripture className="mt-2 !text-crimson-700">{devotional.scripture}</Scripture>}
                  <p className="mt-5 flex-1 leading-relaxed text-ink/75">{excerpt(devotional, 180)}</p>
                  <div className="mt-7">
                    <ButtonLink href={`/hope/${devotional.date}`} variant="dark">{devotional.date === today ? 'Read today’s devotional' : 'Read the latest devotional'}</ButtonLink>
                  </div>
                </div>
              </article>
            )}
            {sermon && (
              <article className="flex flex-col overflow-hidden rounded-md bg-church text-white">
                <Kente />
                <div className="flex flex-1 flex-col p-8 sm:p-10">
                  <Kicker>Latest sermon</Kicker>
                  <p className="mt-4 text-sm text-white/55">{sermon.preacher} · {fmtShortDate(sermon.date)}</p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-ivory">{sermon.title}</h2>
                  {sermon.scriptures.length > 0 && <Scripture light className="mt-2">{scriptureLine(sermon)}</Scripture>}
                  <div className="flex-1" />
                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {(sermon.youtubeUrl || sermon.facebookUrl) && (
                      <ButtonLink href={(sermon.youtubeUrl ?? sermon.facebookUrl)!} target="_blank" rel="noreferrer" variant="gold">Watch the sermon</ButtonLink>
                    )}
                    <MoreLink href="/watch" light>All sermons</MoreLink>
                  </div>
                </div>
              </article>
            )}
          </Container>
        </section>
      )}

      {/* ─── Coming up ────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading kicker="What's on" title="Coming up" />
            <MoreLink href="/events">All events</MoreLink>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {events.map((e) => <EventCard key={e.id} event={e} now={now} />)}
            {events.length === 0 && <p className="text-lg text-ink/60 md:col-span-3">Nothing is scheduled just now. Check back soon.</p>}
          </div>
        </Container>
      </section>

      {/* ─── Counselling ──────────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-28">
        <Container>
          <div className="overflow-hidden rounded-md bg-church">
            <Kente />
            <div className="flex flex-col items-start gap-8 p-8 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Kicker>Counselling</Kicker>
                <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight tracking-tight text-ivory sm:text-4xl">Need someone to talk to and pray with?</h2>
                <p className="mt-4 text-lg text-white/75">Book a confidential counselling session. We will call you to confirm a time.</p>
              </div>
              <ButtonLink href="/counselling" variant="gold" className="flex-shrink-0">Book a session <ArrowRight /></ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

