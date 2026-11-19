import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { todayInGhana } from '@/lib/format';
import { Container, Kicker } from '@/components/ui';
import { MoreLink, PageHero } from '@/components/sections';
import JoinForm from './JoinForm';

export const metadata: Metadata = {
  title: 'Join Us',
  description: `Become a member of ${site.name}, plan a visit, or tell us you have given your life to Christ.`,
};

const POINTS = [
  { title: 'A big family', text: 'New Hope is Abusua kɛseɛ, a big family. There is a place for you here.' },
  { title: 'We will call you', text: 'Someone from the church will get in touch to welcome you and answer your questions.' },
  { title: 'Kept private', text: 'Your details are only seen by the church office, never shared or shown on this website.' },
];

export default async function JoinPage() {
  const today = await todayInGhana();
  return (
    <>
      <PageHero
        kicker="Join Us"
        title="Become part of the family"
        intro="Whether you want to make New Hope your church home, are planning your first visit, or have just given your life to Christ, we would love to hear from you."
        shot="The church family together after service"
      />
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <JoinForm minDate={today} />
          <aside className="space-y-8">
            {POINTS.map((p) => (
              <div key={p.title}>
                <Kicker>{p.title}</Kicker>
                <p className="mt-3 text-lg leading-relaxed text-ink/70">{p.text}</p>
              </div>
            ))}
            <div className="border-t border-brand-950/10 pt-6">
              <p className="text-ink/65">Far away, or can&apos;t make it in person?</p>
              <div className="mt-3"><MoreLink href="/watch#online">Join our online family</MoreLink></div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
