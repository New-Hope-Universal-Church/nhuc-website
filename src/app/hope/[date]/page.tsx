import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excerpt, getDevotional, getDevotionals } from '@/lib/hopeserve';
import { todayInGhana } from '@/lib/format';
import { ButtonLink, Container } from '@/components/ui';
import HopeReader from '../HopeReader';

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

async function Devotional({ params }: Pick<PageProps<'/hope/[date]'>, 'params'>) {
  const { date } = await params;
  const [d, all, today] = await Promise.all([getDevotional(date), getDevotionals(365), todayInGhana()]);

  if (!d) {
    return (
      <Container className="pt-40 pb-32 text-center">
        <h1 className="font-heading text-4xl font-semibold text-brand-950">No devotional for this day</h1>
        <p className="mt-4 text-ink/65">It may not have been published yet.</p>
        <div className="mt-8"><ButtonLink href="/hope" variant="dark">See all devotionals</ButtonLink></div>
      </Container>
    );
  }
  return <HopeReader d={d} all={all} today={today} isIndex={false} />;
}

export default function DevotionalPage(props: PageProps<'/hope/[date]'>) {
  return (
    <Suspense fallback={<div className="bg-church min-h-[60vh]" />}>
      <Devotional params={props.params} />
    </Suspense>
  );
}
