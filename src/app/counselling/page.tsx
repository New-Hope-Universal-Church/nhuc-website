import type { Metadata } from 'next';
import { Suspense } from 'react';
import { site } from '@/lib/site';
import { getCounsellingDays, hours } from '@/lib/hopeserve';
import { fmtDay, fmtTime } from '@/lib/format';
import { Container, Kicker } from '@/components/ui';
import { PageHero } from '@/components/sections';
import BookingForm, { type DayOption } from './BookingForm';

export const metadata: Metadata = {
  title: 'Counselling',
  description: `Book a visit for counselling at ${site.name}, then come on the day. Confidential.`,
};

const POINTS = [
  { title: 'Book a session', text: 'Choose one of the coming counselling days and book it.' },
  { title: 'Come on the day', text: `Come to the church in ${site.address.line1} during the hours shown. You will be seen in the order you arrive.` },
  { title: 'Confidential', text: 'What you share stays between you and the person who counsels you.' },
];

export default async function CounsellingPage() {
  const days: DayOption[] = (await getCounsellingDays()).map((d) => ({ id: d.id, day: fmtDay(d.startDate), hours: hours(d, fmtTime) }));
  return (
    <>
      <PageHero
        kicker="Counselling"
        title="Talk and pray with someone"
        intro="Whatever you are carrying, you do not have to carry it alone. Book a visit for a counselling day and come to see the Leader."
        shot="A quiet conversation and prayer"
      />
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* The form reads ?day= from the address, so it renders in the browser. */}
          <Suspense fallback={<div className="min-h-128 rounded-md bg-white ring-1 ring-brand-950/10" />}>
            <BookingForm days={days} />
          </Suspense>
          <aside className="space-y-8">
            {POINTS.map((p) => (
              <div key={p.title}>
                <Kicker>{p.title}</Kicker>
                <p className="mt-3 text-lg leading-relaxed text-ink/70">{p.text}</p>
              </div>
            ))}
            <p className="border-t border-brand-950/10 pt-6 text-sm text-ink/55">
              In an emergency or if you are in danger, please call <a href="tel:112" className="font-semibold text-crimson-700">112</a> straight away.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
