import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { getLatestSermons, getSermon, scriptureLine } from '@/lib/hopeserve';
import { fmtDay, fmtShortDate } from '@/lib/format';
import { site } from '@/lib/site';
import Markdown from '@/components/Markdown';
import { ArrowLeft, ButtonLink, Container, Kente, Kicker } from '@/components/ui';
import { SermonThumb, SermonVideo, WatchLinks } from '@/components/sermons';

/** Recent sermons are built ahead; any other is built on first visit. */
export async function generateStaticParams() {
  const sermons = await getLatestSermons(100);
  return sermons.length ? sermons.map((s) => ({ id: s.id })) : [{ id: 'none' }];
}

export async function generateMetadata({ params }: PageProps<'/watch/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const s = await getSermon(id);
  if (!s) return { title: 'Sermon' };
  return {
    title: s.title,
    description: `${s.title}, preached by ${s.preacher} on ${fmtDay(s.date)} at ${site.name}.`,
  };
}

async function SermonDetail({ params }: Pick<PageProps<'/watch/[id]'>, 'params'>) {
  const { id } = await params;
  const [s, all] = await Promise.all([getSermon(id), getLatestSermons(100)]);

  if (!s) {
    return (
      <Container className="pt-40 pb-32 text-center">
        <h1 className="font-heading text-4xl font-semibold text-brand-950">We could not find that sermon</h1>
        <p className="mt-4 text-ink/65">It may have been moved or removed.</p>
        <div className="mt-8"><ButtonLink href="/watch" variant="dark">See all sermons</ButtonLink></div>
      </Container>
    );
  }

  // More from the same series first, then the most recent.
  const others = all.filter((o) => o.id !== s.id);
  const more = [...others.filter((o) => s.series && o.series === s.series), ...others.filter((o) => !s.series || o.series !== s.series)].slice(0, 4);

  return (
    <>
      <section className="bg-church">
        <Container className="pt-32 pb-12 sm:pt-40 sm:pb-14">
          <Link href="/watch" className="inline-flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-gold-300 hover:text-gold-200"><ArrowLeft /> All sermons</Link>
          <div className="mt-8"><Kicker>{s.series ?? 'Sermon'}</Kicker></div>
          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ivory sm:text-5xl lg:text-6xl">{s.title}</h1>
          <p className="mt-5 text-lg text-white/80">{s.preacher} <span className="text-gold-300">·</span> {fmtDay(s.date)}</p>
        </Container>
        <Kente />
      </section>

      <section className="py-14 sm:py-20">
        <Container className="max-w-4xl">
          <SermonVideo sermon={s} />
          <WatchLinks sermon={s} className="mt-6" />
          {s.scriptures.length > 0 && (
            <p className="mt-10 font-serif text-xl italic text-crimson-700">{scriptureLine(s)}</p>
          )}
          {s.notes && (
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-semibold text-brand-950">Notes</h2>
              <Markdown text={s.notes} className="mt-4 space-y-4 text-lg leading-relaxed text-ink/80" />
            </div>
          )}
        </Container>
      </section>

      {more.length > 0 && (
        <section className="border-t border-brand-950/10 bg-white py-16 sm:py-20">
          <Container>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-brand-950">{s.series && others.some((o) => o.series === s.series) ? `More from ${s.series}` : 'More sermons'}</h2>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((o) => (
                <Link key={o.id} href={`/watch/${o.id}`} className="group block">
                  <SermonThumb sermon={o} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <h3 className="mt-4 font-heading text-lg font-semibold leading-snug text-brand-950 group-hover:text-brand-700">{o.title}</h3>
                  <p className="mt-1 truncate text-sm text-ink/55">{fmtShortDate(o.date)} · {o.preacher}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

/** One sermon: the video, scripture and notes, then more from the series. */
export default function SermonPage(props: PageProps<'/watch/[id]'>) {
  return (
    <Suspense fallback={<div className="bg-church min-h-[60vh]" />}>
      <SermonDetail params={props.params} />
    </Suspense>
  );
}
