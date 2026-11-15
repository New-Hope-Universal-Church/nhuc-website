import type { Metadata } from 'next';
import Image from 'next/image';
import { getAnnouncements } from '@/lib/hopeserve';
import { fmtDay } from '@/lib/format';
import { site } from '@/lib/site';
import Markdown from '@/components/Markdown';
import { Container, Kicker } from '@/components/ui';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Announcements',
  description: `News and notices from ${site.name}.`,
};

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  return (
    <>
      <PageHero kicker="Church news" title="Announcements" intro="What is happening in the church family this week and beyond." shot="Church notice board" />
      <section className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          {announcements.length === 0 ? (
            <p className="text-lg text-ink/60">There are no announcements just now. Check back soon.</p>
          ) : (
            <div className="space-y-8">
              {announcements.map((a) => (
                <article key={a.id} className="overflow-hidden rounded-md bg-white ring-1 ring-brand-950/10">
                  {a.imageUrl && (
                    <Image src={a.imageUrl} alt={a.title} width={1200} height={800} sizes="(min-width: 896px) 896px, 100vw" className="h-auto max-h-[32rem] w-full bg-cream object-contain" />
                  )}
                  <div className="p-7 sm:p-10">
                    <div className="flex flex-wrap items-center gap-3">
                      {a.pinned && <Kicker>Important</Kicker>}
                      <p className="text-sm text-ink/55">{fmtDay(a.date)}</p>
                    </div>
                    <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-brand-950 sm:text-3xl">{a.title}</h2>
                    <Markdown text={a.body} className="mt-5 space-y-4 text-lg leading-relaxed text-ink/80" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
