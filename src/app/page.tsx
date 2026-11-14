import Link from 'next/link';
import { excerpt, getLatestDevotional, getLatestSermons, getSchedule, getUpcomingEvents, scriptureLine } from '@/lib/hopeserve';
import { fmtDay, fmtShortDate, fmtTime, todayInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import { ArrowRight, ButtonLink, Container, Kente, Kicker, Photo, Scripture, SectionHeading } from '@/components/ui';
import { AnchorVerse, CallAndResponse, EventCard, MoreLink, ServiceTimes } from '@/components/sections';

const PATHWAYS = [
  { href: '/visit', title: 'Plan a visit', text: 'Service times, directions, and what to expect on your first Sunday.', shot: 'Ushers welcoming people at the door' },
  { href: '/watch', title: 'Watch online', text: 'Catch up on recent sermons wherever you are.', shot: 'The Leader preaching from the pulpit' },
  { href: '/ministries', title: 'Find your place', text: 'Music, youth, prayer, ushering and more. There is room for you.', shot: 'Choir singing' },
  { href: '/give', title: 'Give', text: 'Support the work of the church with your tithes and offerings.', shot: 'Offering time in service' },
];

const MINISTRIES = ['Music', 'Youth', 'Prayer Warriors', 'Ushering', 'Media', "Women's Fellowship", 'Lay Readers', 'Visitation & Hospitality'];

export default async function HomePage() {
  const [schedule, events, sermons, devotional, today] = await Promise.all([
    getSchedule(),
    getUpcomingEvents(3),
    getLatestSermons(3),
    getLatestDevotional(),
    todayInGhana(),
  ]);
  const next = events[0];

  return (
    <>
      {/* ─── Hero, like the stream slides ─────────────────────────────────── */}
      <section className="bg-church overflow-hidden">
        <Container className="grid min-h-[92svh] items-center gap-12 pt-32 pb-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:pt-36">
          <Photo framed alt="" shot="The Leader ministering, or the congregation in worship" priority sizes="(min-width: 1024px) 35vw, 100vw" className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:max-w-none" />
          <div className="order-1 lg:order-2">
            <Kicker>Welcome home</Kicker>
            <h1 className="mt-7 font-heading text-[clamp(2.4rem,6.2vw,5.25rem)] font-semibold leading-[1.02] tracking-tight text-ivory">
              Christ in you, <span className="text-gold-300">the hope of glory</span>
            </h1>
            <Scripture light className="mt-4 text-base">{site.mottoReference}</Scripture>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
              {site.name} is a family of believers in {site.address.line1}, {site.address.city}. Wherever you are coming from, there is a seat for you here.
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
                <span className="rounded-sm bg-crimson-600 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">Next</span>
                <p className="font-heading text-lg font-semibold text-ivory">{next.title}</p>
              </div>
              <p className="text-sm text-white/70">
                <span className="text-gold-300">{fmtDay(next.startDate)}</span> · {fmtTime(next.startDate)} · {site.address.line1}
              </p>
              <MoreLink href="/visit" light>Directions</MoreLink>
            </Container>
          </div>
        )}
        <Kente />
      </section>

      <AnchorVerse />

      {/* ─── Welcome ──────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Photo alt="" shot="The church building from outside" className="aspect-[4/3] rounded-md" />
          <div>
            <SectionHeading
              kicker="Who we are"
              title={<>A church built on <span className="text-brand-700">hope</span></>}
              intro="We gather to worship God, to grow in His Word, and to carry His love into Dansoman and beyond. We are Christian and proudly Ghanaian: our faith and our culture belong together."
            />
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-brand-950/10 pt-8">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson-700">Our mission</dt>
                <dd className="mt-2 font-display text-lg font-bold leading-snug text-brand-950">To make disciples who carry the hope of Christ.</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson-700">Our home</dt>
                <dd className="mt-2 font-display text-lg font-bold leading-snug text-brand-950">{site.address.line1}, {site.address.city}</dd>
              </div>
            </dl>
            <div className="mt-10"><MoreLink href="/about">More about us</MoreLink></div>
          </div>
        </Container>
      </section>

      <CallAndResponse />

      {/* ─── Service times ────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading kicker="Gather with us" title="Service times" intro="Come as you are. Every gathering is open to everyone, and our ushers will help you find a seat." />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/visit" variant="dark">Plan your visit</ButtonLink>
              <ButtonLink href={site.address.mapsUrl} target="_blank" rel="noreferrer" variant="outline-dark">Get directions</ButtonLink>
            </div>
          </div>
          {schedule.length ? <ServiceTimes items={schedule} /> : <p className="self-center text-lg text-ink/60">Service times will be listed here soon. Ask any usher, or call the church office.</p>}
        </Container>
      </section>

      {/* ─── Pathways ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <SectionHeading kicker="Get connected" title="There is a place for you" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PATHWAYS.map((p) => (
              <Link key={p.href} href={p.href} className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-md p-6 text-white ring-[3px] ring-transparent transition hover:ring-gold-400">
                <Photo alt="" shot={p.shot} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 -z-10 transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/95 via-brand-950/40 to-transparent" />
                <h3 className="font-heading text-2xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{p.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-300">
                  Go <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Hope for Today + latest sermons ──────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {devotional && (
            <div className="overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10">
              <Kente />
              <div className="p-8 sm:p-12">
                <Kicker>Hope for Today</Kicker>
                <p className="mt-4 text-sm text-ink/50">{fmtDay(`${devotional.date}T12:00:00Z`)}</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-950">{devotional.title}</h2>
                {devotional.scripture && <Scripture className="mt-2 font-semibold !text-crimson-700">{devotional.scripture}</Scripture>}
                <p className="mt-6 text-lg leading-relaxed text-ink/75">{excerpt(devotional)}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ButtonLink href={`/hope/${devotional.date}`} variant="dark">{devotional.date === today ? 'Read today’s devotional' : 'Read the latest devotional'}</ButtonLink>
                  <MoreLink href="/hope">Earlier devotionals</MoreLink>
                </div>
              </div>
            </div>
          )}
          <div>
            <SectionHeading kicker="Recent messages" title="Hear the Word" />
            {sermons.length === 0 && <p className="mt-10 text-lg text-ink/60">Recent sermons will appear here soon.</p>}
            <ul className={`mt-10 divide-y divide-brand-950/10 border-y border-brand-950/10 ${sermons.length ? '' : 'hidden'}`}>
              {sermons.map((s) => (
                <li key={s.id}>
                  <Link href="/watch" className="group flex items-center gap-5 py-5">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-950 text-gold-300 transition-colors group-hover:bg-crimson-600 group-hover:text-white">
                      <svg className="ml-0.5 h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-heading text-lg font-semibold tracking-tight text-brand-950">{s.title}</span>
                      <span className="block text-sm text-ink/55">{s.preacher} · {fmtShortDate(s.date)}{s.scriptures.length ? ` · ${scriptureLine(s)}` : ''}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8"><MoreLink href="/watch">All sermons</MoreLink></div>
          </div>
        </Container>
      </section>

      {/* ─── Upcoming ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading kicker="What's on" title="Coming up" />
            <MoreLink href="/events">All events</MoreLink>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
            {events.length === 0 && <p className="text-lg text-ink/60 md:col-span-3">Nothing is scheduled just now. Check back soon.</p>}
          </div>
        </Container>
      </section>

      {/* ─── Ministries ───────────────────────────────────────────────────── */}
      <section className="bg-church">
        <Container className="grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionHeading light kicker="Serve with us" title="Every member, a minister" intro="Use your gifts to serve God and His people. Join a department or fellowship and grow alongside others." />
            <ul className="mt-10 flex flex-wrap gap-2">
              {MINISTRIES.map((m) => (
                <li key={m} className="rounded-sm px-3.5 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-white/85 ring-1 ring-inset ring-white/20">{m}</li>
              ))}
            </ul>
            <div className="mt-10"><ButtonLink href="/ministries" variant="gold">Explore ministries <ArrowRight /></ButtonLink></div>
          </div>
          <Photo framed alt="" shot="Youth group or volunteers serving together" className="mx-auto w-full max-w-sm" sizes="(min-width: 1024px) 35vw, 100vw" />
        </Container>
        <Kente />
      </section>

      {/* ─── Give ─────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col items-start gap-8 rounded-md bg-crimson-700 p-8 text-white sm:p-14 lg:flex-row lg:items-center lg:justify-between" style={{ backgroundImage: 'radial-gradient(70% 120% at 100% 0%, rgba(233,183,48,0.25), transparent 60%)' }}>
            <div className="max-w-xl">
              <p className="inline-block rounded-sm bg-gold-400 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-brand-950">Generosity</p>
              <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Partner with what God is doing</h2>
              <p className="mt-4 text-lg text-white/80">Your tithes and offerings keep the doors open, support the needy and spread the Gospel.</p>
            </div>
            <ButtonLink href="/give" variant="gold" className="flex-shrink-0">Ways to give <ArrowRight /></ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
