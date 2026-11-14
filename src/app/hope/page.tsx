import type { Metadata } from 'next';
import Link from 'next/link';
import { excerpt, getDevotionals } from '@/lib/hopeserve';
import { fmtDay, dateTile } from '@/lib/format';
import { site } from '@/lib/site';
import { ArrowRight, ButtonLink, Container, Kente, Kicker, Scripture } from '@/components/ui';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Hope for Today',
  description: `A daily devotional from ${site.name}: scripture, a short message, a confession and a prayer for the day.`,
};

export default async function HopePage() {
  const [today, ...earlier] = await getDevotionals(30);

  return (
    <>
      <PageHero
        kicker="Daily devotional"
        title="Hope for Today"
        intro="A word for every day: scripture, a short message, a confession and a prayer. Read it here, or share it with someone who needs hope."
        shot="Open Bible on the pulpit"
      />

      {today && (
        <section className="py-20 sm:py-28">
          <Container>
            <article className="overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10">
              <Kente />
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
                <div>
                  <Kicker>Today</Kicker>
                  <p className="mt-4 text-sm text-ink/55">{fmtDay(`${today.date}T12:00:00Z`)}</p>
                  <h2 className="mt-2 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">{today.title}</h2>
                  {today.scripture && <p className="mt-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-crimson-700">{today.scripture}</p>}
                  <p className="mt-6 text-lg leading-relaxed text-ink/75">{excerpt(today, 260)}</p>
                  <div className="mt-8"><ButtonLink href={`/hope/${today.date}`} variant="dark">Read today&apos;s devotional <ArrowRight /></ButtonLink></div>
                </div>
                {today.passage && (
                  <blockquote className="self-center border-l-4 border-gold-400 pl-6">
                    <Scripture className="text-xl leading-relaxed !text-brand-950">{today.passage}</Scripture>
                  </blockquote>
                )}
              </div>
            </article>
          </Container>
        </section>
      )}

      {earlier.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Container>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-brand-950">Earlier devotionals</h2>
            <ul className="mt-8 divide-y divide-brand-950/10 border-y border-brand-950/10">
              {earlier.map((d) => {
                const tile = dateTile(`${d.date}T12:00:00Z`);
                return (
                  <li key={d.id}>
                    <Link href={`/hope/${d.date}`} className="group flex items-center gap-5 py-5">
                      <span className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-sm bg-brand-950 text-white">
                        <span className="font-display text-[10px] font-bold tracking-[0.18em] text-gold-300">{tile.month}</span>
                        <span className="font-display text-xl font-extrabold leading-none">{tile.day}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-xl font-semibold text-brand-950 group-hover:text-brand-700">{d.title}</span>
                        <span className="block truncate text-sm text-ink/55">{d.scripture ? `${d.scripture} · ` : ''}{excerpt(d, 110)}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-crimson-700" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
