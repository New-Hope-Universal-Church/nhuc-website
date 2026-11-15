import type { Metadata } from 'next';
import Link from 'next/link';
import { getUpcomingEvents, streamLink } from '@/lib/hopeserve';
import { fmtDay, fmtTime, nowInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import { NETWORKS } from '@/components/SocialLinks';
import { ArrowRight, ButtonLink, Container, Kicker, SectionHeading } from '@/components/ui';
import { LiveBadge, isLive } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Online family',
  description: `Worship with ${site.name} from anywhere: live services, Hope for Today, and our channels.`,
};

/** What each channel invites you to do. */
const ACTION: Record<string, string> = {
  youtube: 'Subscribe and watch services live',
  facebook: 'Follow and join us live',
  tiktok: 'Short clips from services',
  instagram: 'Photos and updates',
  whatsapp: 'Join our WhatsApp channel',
};

export default async function OnlinePage() {
  const [events, now] = await Promise.all([getUpcomingEvents(10), nowInGhana()]);
  const streamed = events.find((e) => streamLink(e));
  const live = streamed ? isLive(streamed, now) : false;
  const channels = NETWORKS.filter((n) => site.social[n.key]);

  return (
    <>
      <section className="bg-church">
        <Container className="pt-32 pb-16 sm:pt-40 sm:pb-20">
          <Kicker>Join Us</Kicker>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">Worship with us from anywhere</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Travelling, living abroad, or unable to come in person? You are still part of the family. Watch services live, read the word for each day, and stay close.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-5 md:grid-cols-2">
          <Link href="/watch" className={`group rounded-md p-8 sm:p-10 transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(6,34,20,0.25)] ${live ? 'bg-crimson-700 text-white' : 'bg-white ring-1 ring-brand-950/10'}`}>
            {live ? <LiveBadge /> : <Kicker>Services</Kicker>}
            <h2 className={`mt-5 font-heading text-3xl font-semibold ${live ? 'text-white' : 'text-brand-950'}`}>{live ? 'We are live now' : 'Watch live'}</h2>
            <p className={`mt-3 text-lg ${live ? 'text-white/80' : 'text-ink/65'}`}>
              {streamed && !live
                ? `Next stream: ${streamed.title}, ${fmtDay(streamed.startDate)} at ${fmtTime(streamed.startDate)}.`
                : live ? `${streamed!.title} is streaming now.` : 'Services and recent sermons, whenever you need them.'}
            </p>
            <span className={`mt-6 inline-flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.14em] ${live ? 'text-white' : 'text-crimson-700'}`}>
              {live ? 'Join now' : 'Watch'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link href="/hope" className="group rounded-md bg-white p-8 ring-1 ring-brand-950/10 transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(6,34,20,0.25)] sm:p-10">
            <Kicker>Every day</Kicker>
            <h2 className="mt-5 font-heading text-3xl font-semibold text-brand-950">Hope for Today</h2>
            <p className="mt-3 text-lg text-ink/65">A word for each day: scripture, a short message, a confession and a prayer.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-crimson-700">
              Read today&apos;s word <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          <SectionHeading kicker="Stay connected" title="Follow us" />
          {channels.length === 0 ? (
            <p className="mt-8 text-lg text-ink/60">Our channels will be listed here soon.</p>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((n) => (
                <li key={n.key}>
                  <a
                    href={site.social[n.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-md bg-white p-5 ring-1 ring-brand-950/10 transition-shadow hover:shadow-[0_14px_32px_-14px_rgba(6,34,20,0.25)]"
                  >
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-brand-950 text-white group-hover:bg-crimson-600">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={n.path} /></svg>
                    </span>
                    <span>
                      <span className="block font-heading text-xl font-semibold text-brand-950">{n.label}</span>
                      <span className="block text-sm text-ink/60">{ACTION[n.key]}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-brand-950">Part of our online family?</h2>
            <p className="mt-2 text-lg text-ink/65">Tell us who you are, so we can pray for you and keep in touch.</p>
          </div>
          <ButtonLink href="/join">Let us know <ArrowRight /></ButtonLink>
        </Container>
      </section>
    </>
  );
}
