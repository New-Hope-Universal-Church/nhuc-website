import type { Metadata } from 'next';
import { getLatestSermons, getUpcomingEvents, scriptureLine, streamLink, type Sermon } from '@/lib/hopeserve';
import { fmtDay, fmtShortDate, fmtTime, nowInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import Markdown from '@/components/Markdown';
import { Container, Kicker, Photo } from '@/components/ui';
import { LiveBadge, PageHero, isLive } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Watch',
  description: `Sermons and messages from ${site.name}.`,
};

/** The video id from a YouTube link (watch, youtu.be, live or shorts). */
function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|[?&]v=|\/(?:live|shorts|embed)\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function Thumbnail({ sermon, className, sizes }: { sermon: Sermon; className: string; sizes?: string }) {
  const id = youtubeId(sermon.youtubeUrl);
  return <Photo src={id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined} alt={sermon.title} shot="Sermon video thumbnail" className={className} sizes={sizes} />;
}

function WatchLinks({ sermon }: { sermon: Sermon }) {
  const links = [
    sermon.youtubeUrl && { href: sermon.youtubeUrl, label: 'Watch on YouTube', cls: 'bg-crimson-600 hover:bg-crimson-700 text-white' },
    sermon.facebookUrl && { href: sermon.facebookUrl, label: 'Watch on Facebook', cls: 'bg-[#1d5fbf] hover:bg-[#184f9f] text-white' },
    sermon.otherUrl && { href: sermon.otherUrl, label: 'Listen / more', cls: 'bg-brand-950 hover:bg-brand-900 text-white' },
  ].filter(Boolean) as { href: string; label: string; cls: string }[];
  if (!links.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`inline-flex h-11 items-center rounded-md px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] transition-colors ${l.cls}`}>
          {l.label}
        </a>
      ))}
    </div>
  );
}

export default async function WatchPage() {
  const [sermons, events, now] = await Promise.all([getLatestSermons(24), getUpcomingEvents(10), nowInGhana()]);
  const [latest, ...rest] = sermons;
  // The next service that is streamed, and whether it is on right now.
  const streamed = events.find((e) => streamLink(e));
  const stream = streamed ? streamLink(streamed) : null;
  const live = streamed ? isLive(streamed, now) : false;
  return (
    <>
      <PageHero kicker="Sermons" title="Hear the Word" intro="Missed a Sunday, or want to hear it again? Watch and listen to recent messages." shot="The Leader preaching" />

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
        <section className="py-20 sm:py-28">
          <Container className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <a href={latest.youtubeUrl ?? latest.facebookUrl ?? undefined} target="_blank" rel="noreferrer" className="block">
              <Thumbnail sermon={latest} className="aspect-video rounded-md ring-[5px] ring-gold-400" sizes="(min-width: 1024px) 55vw, 100vw" />
            </a>
            <div>
              <Kicker>Latest message</Kicker>
              <h2 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">{latest.title}</h2>
              <p className="mt-4 text-ink/60">{latest.preacher} · {fmtShortDate(latest.date)}{latest.series ? ` · ${latest.series}` : ''}</p>
              {latest.scriptures.length > 0 && <p className="mt-1 font-serif italic text-crimson-700">{scriptureLine(latest)}</p>}
              {latest.notes && <Markdown text={latest.notes} className="mt-5 space-y-3 text-ink/75 line-clamp-6" />}
              <WatchLinks sermon={latest} />
            </div>
          </Container>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Container>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-brand-950">More messages</h2>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((s) => {
                const href = s.youtubeUrl ?? s.facebookUrl ?? s.otherUrl;
                const body = (
                  <>
                    <Thumbnail sermon={s} className="aspect-video rounded-md" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                    <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-brand-950 group-hover:text-brand-700">{s.title}</h3>
                    <p className="mt-1 text-sm text-ink/55">{s.preacher} · {fmtShortDate(s.date)}</p>
                    {s.scriptures.length > 0 && <p className="text-sm text-crimson-700">{scriptureLine(s)}</p>}
                  </>
                );
                return (
                  <article key={s.id}>
                    {href ? <a href={href} target="_blank" rel="noreferrer" className="group block">{body}</a> : body}
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
