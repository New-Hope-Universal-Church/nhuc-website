import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { todayInGhana } from '@/lib/format';
import { Container, Kicker } from '@/components/ui';
import { PageHero } from '@/components/sections';
import BookingForm from './BookingForm';

export const metadata: Metadata = {
  title: 'Book counselling',
  description: `Book a confidential counselling session at ${site.name}. We will call you to confirm a time.`,
};

const POINTS = [
  { title: 'Confidential', text: 'What you share stays between you and the person who counsels you.' },
  { title: 'We call you', text: 'Someone from the church will call to agree a time that suits you.' },
  { title: 'In person or by phone', text: `Meet at the church in ${site.address.line1}, or talk on the phone.` },
];

export default async function CounsellingPage() {
  const today = await todayInGhana();
  return (
    <>
      <PageHero
        kicker="Counselling"
        title="Book a counselling session"
        intro="Whatever you are carrying, you do not have to carry it alone. Ask for a time to talk and pray with someone from the church."
        shot="A quiet conversation and prayer"
      />
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <BookingForm minDate={today} />
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
