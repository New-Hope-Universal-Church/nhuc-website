import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { excerpt, getDevotional, getDevotionals } from '@/lib/hopeserve';
import { fmtDay } from '@/lib/format';
import { site } from '@/lib/site';
import Markdown from '@/components/Markdown';
import { ArrowLeft, ArrowRight, ButtonLink, Container, Kente, Kicker, Scripture } from '@/components/ui';

/** Recent days are built ahead; older ones are built on first visit. */
export async function generateStaticParams() {
  const recent = await getDevotionals(14);
  return recent.length ? recent.map((d) => ({ date: d.date })) : [{ date: 'today' }];
}

export async function generateMetadata({ params }: PageProps<'/hope/[date]'>): Promise<Metadata> {
  const { date } = await params;
  const d = await getDevotional(date);
  if (!d) return { title: 'Hope for Today' };
  return {
    title: `${d.title} | Hope for Today`,
    description: excerpt(d, 160),
    openGraph: { title: d.title, description: excerpt(d, 160), type: 'article' },
  };
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-brand-950/10 pt-8">
      <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-crimson-700">{label}</p>
      <div className="mt-3 text-lg leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

async function Devotional({ params }: Pick<PageProps<'/hope/[date]'>, 'params'>) {
  const { date } = await params;
  const [d, all] = await Promise.all([getDevotional(date), getDevotionals(60)]);

  if (!d) {
    return (
      <Container className="py-32 text-center">
        <h1 className="font-heading text-4xl font-semibold text-brand-950">No devotional for this day</h1>
        <p className="mt-4 text-ink/65">It may not have been published yet.</p>
        <div className="mt-8"><ButtonLink href="/hope" variant="dark">See all devotionals</ButtonLink></div>
      </Container>
    );
  }

  const i = all.findIndex((x) => x.date === d.date);
  const newer = i > 0 ? all[i - 1] : null;
  const older = i >= 0 && i < all.length - 1 ? all[i + 1] : null;
  const url = `${site.url}/hope/${d.date}`;
  const shareText = `Hope for Today: ${d.title}\n${url}`;

  return (
    <>
      <header className="bg-church">
        <Container className="pt-32 pb-14 sm:pt-40">
          <Link href="/hope" className="inline-flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-gold-300 hover:text-gold-200"><ArrowLeft /> Hope for Today</Link>
          <div className="mt-6"><Kicker>{fmtDay(`${d.date}T12:00:00Z`)}</Kicker></div>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight text-ivory sm:text-6xl">{d.title}</h1>
          {d.author && <p className="mt-4 text-white/70">{d.author}</p>}
        </Container>
        <Kente />
      </header>

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-10">
          {(d.passage || d.scripture) && (
            <figure className="rounded-md bg-white p-8 ring-1 ring-brand-950/10 sm:p-10">
              {d.passage && <Scripture className="text-xl leading-relaxed !text-brand-950 sm:text-2xl">&ldquo;{d.passage}&rdquo;</Scripture>}
              {d.scripture && <figcaption className="mt-5 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-crimson-700">{d.scripture}</figcaption>}
            </figure>
          )}

          <Markdown text={d.body} className="space-y-5 text-lg leading-relaxed text-ink/85" />

          {d.confession && <Section label="Confession"><p className="font-serif italic">{d.confession}</p></Section>}
          {d.prayer && <Section label="Prayer"><p>{d.prayer}</p></Section>}
          {d.declaration && (
            <div className="rounded-md bg-church p-8 text-center sm:p-10">
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-gold-300">This year&apos;s declaration</p>
              <p className="mt-3 font-heading text-2xl font-semibold leading-snug text-ivory sm:text-3xl">{d.declaration}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-brand-950/10 pt-8 sm:flex-row sm:items-center">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-ink/55 sm:mr-2">Share</p>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md bg-[#1f8f4e] px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#187a42]">WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md bg-[#1d5fbf] px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#184f9f]">Facebook</a>
          </div>

          {(newer || older) && (
            <nav aria-label="More devotionals" className="grid gap-3 sm:grid-cols-2">
              {older ? (
                <Link href={`/hope/${older.date}`} className="group rounded-md bg-white p-5 ring-1 ring-brand-950/10 hover:ring-gold-400">
                  <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50"><ArrowLeft className="inline h-3.5 w-3.5" /> Previous day</span>
                  <span className="mt-1 block font-heading text-lg font-semibold text-brand-950">{older.title}</span>
                </Link>
              ) : <span />}
              {newer && (
                <Link href={`/hope/${newer.date}`} className="group rounded-md bg-white p-5 text-right ring-1 ring-brand-950/10 hover:ring-gold-400">
                  <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Next day <ArrowRight className="inline h-3.5 w-3.5" /></span>
                  <span className="mt-1 block font-heading text-lg font-semibold text-brand-950">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}
        </Container>
      </article>
    </>
  );
}

export default function DevotionalPage(props: PageProps<'/hope/[date]'>) {
  return (
    <Suspense fallback={<div className="bg-church min-h-[60vh]" />}>
      <Devotional params={props.params} />
    </Suspense>
  );
}
