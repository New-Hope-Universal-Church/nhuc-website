import type { Metadata } from 'next';
import { getDevotionals } from '@/lib/hopeserve';
import { todayInGhana } from '@/lib/format';
import { site } from '@/lib/site';
import { Container } from '@/components/ui';
import { PageHero } from '@/components/sections';
import HopeReader from './HopeReader';

export const metadata: Metadata = {
  title: 'Hope for Today',
  description: `A daily devotional from ${site.name}: scripture, a short message, a confession and a prayer for the day.`,
};

/** The latest devotional in full, with all the others beside it. */
export default async function HopePage() {
  const [all, today] = await Promise.all([getDevotionals(365), todayInGhana()]);
  const latest = all[0];

  if (!latest) {
    return (
      <>
        <PageHero kicker="Daily devotional" title="Hope for Today" intro="A word for every day: scripture, a short message, a confession and a prayer." shot="Open Bible on the pulpit" />
        <section className="py-24">
          <Container><p className="text-lg text-ink/60">Today&apos;s devotional will appear here soon.</p></Container>
        </section>
      </>
    );
  }
  return <HopeReader d={latest} all={all} today={today} isIndex />;
}
