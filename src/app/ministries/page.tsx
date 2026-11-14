import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { ButtonLink, Container, Photo } from '@/components/ui';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Ministries',
  description: `Departments and fellowships at ${site.name}. Find where you belong.`,
};

// The church's real departments and fellowships (from HopeServe).
// TODO: a line from each leader about what they do and when they meet.
const MINISTRIES = [
  { name: 'Music', text: 'The Choir, Praise and Worship team and Singing Band lead the church in worship.', shot: 'Choir and band leading worship' },
  { name: 'Prayer Warriors', text: 'Standing in the gap for the church, our families and the nation.', shot: 'Prayer meeting' },
  { name: 'Ushering', text: 'The first smile at the door, keeping every service warm and orderly.', shot: 'Ushers at work' },
  { name: 'Youth', text: 'Young people growing in faith, friendship and purpose.', shot: 'Youth fellowship' },
  { name: 'Media', text: 'Sound, screens, streaming and photography that carry the message further.', shot: 'Media desk during service' },
  { name: 'Lay Readers', text: 'Reading the Scriptures aloud in our services.', shot: 'Scripture reading' },
  { name: "Women's Fellowship", text: 'Women encouraging one another in faith and service.', shot: "Women's fellowship gathering" },
  { name: 'Visitation & Hospitality', text: 'Visiting the sick, welcoming newcomers and caring for members.', shot: 'Home visit' },
];

export default function MinistriesPage() {
  return (
    <>
      <PageHero kicker="Serve with us" title="Every member, a minister" intro="God has given every believer gifts to serve. Find a department or fellowship where you can grow and give." shot="Volunteers serving together" />
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {MINISTRIES.map((m) => (
              <article key={m.name}>
                <Photo alt="" shot={m.shot} className="aspect-[4/5] rounded-md" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                <h2 className="mt-5 font-heading font-semibold tracking-tight text-2xl text-brand-950">{m.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{m.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-20 rounded-md bg-church p-10 text-center sm:p-14">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">Ready to serve?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">Speak to an usher on Sunday, or send us a message and the right leader will reach out.</p>
            <div className="mt-8"><ButtonLink href="/contact" variant="gold">Get in touch</ButtonLink></div>
          </div>
        </Container>
      </section>
    </>
  );
}
