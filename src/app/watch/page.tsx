import type { Metadata } from 'next';
import { getLatestSermons } from '@/lib/hopeserve';
import { fmtShortDate } from '@/lib/format';
import { site } from '@/lib/site';
import { Container, Photo } from '@/components/ui';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Watch',
  description: `Sermons and messages from ${site.name}.`,
};

export default async function WatchPage() {
  const sermons = await getLatestSermons(12);
  const [latest, ...rest] = sermons;
  return (
    <>
      <PageHero kicker="Sermons" title="Hear the Word" intro="Missed a Sunday, or want to hear it again? Watch and listen to recent messages." shot="The Leader preaching" />

      {latest && (
        <section className="py-20 sm:py-28">
          <Container className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            {latest.youtubeUrl ? (
              <a href={latest.youtubeUrl} target="_blank" rel="noreferrer" className="block">
                <Photo alt={latest.title} shot="Sermon video thumbnail" className="aspect-video rounded-md" />
              </a>
            ) : (
              <Photo alt={latest.title} shot="Sermon video thumbnail" className="aspect-video rounded-md" />
            )}
            <div>
              <p className="inline-block rounded-sm bg-crimson-600 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-white">Latest message</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-4xl">{latest.title}</h2>
              <p className="mt-4 text-ink/60">{latest.preacher} · {fmtShortDate(latest.date)}</p>
              {latest.scripture && <p className="mt-1 font-serif italic text-crimson-700">{latest.scripture}</p>}
            </div>
          </Container>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Container>
            <h2 className="font-heading font-semibold tracking-tight text-3xl text-brand-950">More messages</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((s) => (
                <article key={s.id}>
                  <Photo alt={s.title} shot="Sermon thumbnail" className="aspect-video rounded-md" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  <h3 className="mt-4 font-heading font-semibold tracking-tight text-xl text-brand-950">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink/55">{s.preacher} · {fmtShortDate(s.date)}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
