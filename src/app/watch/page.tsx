import type { Metadata } from 'next';
import Link from 'next/link';
import { getLatestSermons, getUpcomingEvents, scriptureLine, streamLink } from '@/lib/hopeserve';
import { fmtDay, fmtShortDate, fmtTime, nowInGhana } from '@/lib/format';
import { SERMONS_IMAGE } from '@/lib/images';
import { site } from '@/lib/site';
import { NETWORKS } from '@/components/SocialLinks';
import { ArrowRight, ButtonLink, Container, Kicker } from '@/components/ui';
import { LiveBadge, PhotoBanner, isLive } from '@/components/sections';
import { SermonVideo, WatchLinks } from '@/components/sermons';
import SermonLibrary from './SermonLibrary';

export const metadata: Metadata = {
  title: 'Sermons',
  description: `Sermons, live services and our online family at ${site.name}: worship with us from anywhere.`,
};

/** What each channel invites you to do. */
const ACTION: Record<string, string> = {
  youtube: 'Subscribe and watch services live',
  facebook: 'Follow and join us live',
  tiktok: 'Short clips from services',
  instagram: 'Photos and updates',
  whatsapp: 'Join our WhatsApp channel',
};

export default async function WatchPage() {
  const [sermons, events, now] = await Promise.all([getLatestSermons(100), getUpcomingEvents(10), nowInGhana()]);
  const latest = sermons[0];
  const library = sermons.map((s) => ({ ...s, dateLabel: fmtShortDate(s.date) }));
  const channels = NETWORKS.filter((n) => site.social[n.key]);
  // The next service that is streamed, and whether it is on right now.
  const streamed = events.find((e) => streamLink(e));
  const stream = streamed ? streamLink(streamed) : null;
  const live = streamed ? isLive(streamed, now) : false;
  return (
    <>
      <PhotoBanner kicker="Sermons" title="Hear the Word" intro="Missed a Sunday, or want to hear it again? Watch and listen to every message." src={SERMONS_IMAGE} />

      {streamed && stream && (
        <section className="pt-16 sm:pt-20">
          <Container>
            <div className={`flex flex-col gap-6 rounded-md p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10 ${live ? 'bg-crimson-700 text-white' : 'bg-white ring-1 ring-brand-950/10'}`}>
              <div>
                {live ? <LiveBadge /> : <Kicker>Next live stream</Kicker>}
                <h2 className={`mt-4 font-heading text-3xl font-semibold tracking-tight ${live ? 'text-white' : 'text-brand-950'}`}>{streamed.title}</h2>
                <p className={`mt-1 ${live ? 'text-white/80' : 'text-ink/60'}`}>{live ? 'On now' : `${fmtDay(streamed.startDate)} · ${fmtTime(streamed.startDate)}`}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {streamed.youtubeUrl && (
                  <a href={streamed.youtubeUrl} target="_blank" rel="noreferrer" className={`inline-flex h-12 items-center rounded-md px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] ${live ? 'bg-white text-crimson-700 hover:bg-ivory' : 'bg-crimson-600 text-white hover:bg-crimson-700'}`}>
                    {live ? 'Watch live on YouTube' : 'YouTube'}
                  </a>
                )}
                {streamed.facebookUrl && (
                  <a href={streamed.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-md bg-[#1d5fbf] px-6 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#184f9f]">
                    {live ? 'Watch live on Facebook' : 'Facebook'}
                  </a>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {!latest && (
        <section className="py-24">
          <Container><p className="text-lg text-ink/60">Sermons will appear here soon.</p></Container>
        </section>
      )}

      {latest && (
        <section className="py-16 sm:py-24">
          <Container className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div className="relative">
              <span className="absolute -top-3 left-4 z-10 rounded-sm bg-crimson-600 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow">Latest</span>
              <SermonVideo sermon={latest} />
            </div>
            <div>
              <Kicker>{latest.series ?? 'Latest message'}</Kicker>
              <h2 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">{latest.title}</h2>
              <p className="mt-4 text-ink/60">{latest.preacher} · {fmtShortDate(latest.date)}</p>
              {latest.scriptures.length > 0 && <p className="mt-1 font-serif italic text-crimson-700">{scriptureLine(latest)}</p>}
              <WatchLinks sermon={latest} className="mt-6" />
              <Link href={`/watch/${latest.id}`} className="group mt-6 inline-flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-crimson-700 hover:text-crimson-800">
                {latest.notes ? 'Read the notes' : 'Open the sermon'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Container>
        </section>
      )}

      {sermons.length > 1 && (
        <section className="border-t border-brand-950/10 bg-white py-16 sm:py-24">
          <Container>
            <h2 className="text-center font-heading text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">All sermons</h2>
            <div className="mt-8">
              <SermonLibrary sermons={library} />
            </div>
          </Container>
        </section>
      )}
      <section id="online" className="scroll-mt-24 bg-church py-20 sm:py-24">
        <Container>
          <Kicker>Online family</Kicker>
          <h2 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-tight tracking-tight text-ivory sm:text-4xl">Worship with us from anywhere</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
            Travelling, living abroad, or unable to come in person? You are still part of the family. Watch live, read{' '}
            <Link href="/hope" className="text-gold-300 underline-offset-4 hover:underline">Hope for Today</Link>, and stay close.
          </p>
          {channels.length > 0 && (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((n) => (
                <li key={n.key}>
                  <a href={site.social[n.key]} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-md bg-white/5 p-5 ring-1 ring-white/10 transition-colors hover:bg-white/10">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gold-400 text-brand-950">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={n.path} /></svg>
                    </span>
                    <span>
                      <span className="block font-heading text-xl font-semibold text-ivory">{n.label}</span>
                      <span className="block text-sm text-white/60">{ACTION[n.key]}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg text-white/80">Part of our online family? Tell us who you are, so we can pray for you and keep in touch.</p>
            <ButtonLink href="/join" variant="gold">Let us know <ArrowRight /></ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
