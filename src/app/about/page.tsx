import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { ButtonLink, Container, Kicker, Photo, SectionHeading } from '@/components/ui';
import { AnchorVerse, PageHero } from '@/components/sections';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

export const metadata: Metadata = {
  title: 'About us',
  description: `Who we are at ${site.name}: our story, what we believe, and our leadership.`,
};

// TODO: replace with the church's own words (mission, vision, story, beliefs, the Leader's introduction).
const BELIEFS = [
  { title: 'The Bible', text: 'The inspired Word of God, our guide for faith and life.' },
  { title: 'Jesus Christ', text: 'The Son of God, who died and rose again for our salvation.' },
  { title: 'The Holy Spirit', text: 'Living in every believer, empowering us to live for God.' },
  { title: 'The Church', text: 'A family of believers, called to worship, fellowship and mission.' },
];

const STORY = [
  { label: 'The calling', text: 'How God laid the vision for New Hope on the hearts of our founders.' },
  { label: 'The beginning', text: 'The first gatherings and the family that formed around them.' },
  { label: 'Our home', text: 'Settling in Otojor, Dansoman, and growing as a church.' },
  { label: 'Today', text: 'Departments, fellowships and branches carrying the hope of Christ.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero kicker="About us" title={<>We are <span className="text-gold-300">New Hope</span></>} intro={`${site.motto} (${site.mottoReference})`} shot="Wide shot of the congregation" />

      <AnchorVerse />

      <section className="bg-white py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <Kicker>Our mission</Kicker>
            <p className="mt-6 font-serif text-2xl italic leading-snug text-brand-950 sm:text-3xl">To make disciples who carry the hope of Christ into every home and community.</p>
          </Reveal>
          <Reveal from="right" delay={0.12}>
            <Kicker>Our vision</Kicker>
            <p className="mt-6 font-serif text-2xl italic leading-snug text-brand-950 sm:text-3xl">A church where every person finds hope, healing and purpose in Jesus.</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal from="zoom"><Photo alt="" shot="Portrait of the Leader" className="aspect-4/5 rounded-md" /></Reveal>
          <div>
            <SectionHeading kicker="Our Leader" title="Meet our Leader" intro="A short introduction to our Leader: their calling, their family, and their heart for the church. (To be written with the church office.)" />
          </div>
        </Container>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <Container>
          <SectionHeading kicker="Our journey" title="How we got here" />
          <Stagger as="ol" className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4" gap={0.14}>
            {STORY.map((s, i) => (
              <StaggerItem as="li" key={s.label} className="border-t-4 border-crimson-600 pt-6">
                <span className="font-display text-5xl font-extrabold text-gold-500/40">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-heading font-semibold tracking-tight text-2xl text-brand-950">{s.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading kicker="What we believe" title="Our foundations" />
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-2" gap={0.1}>
            {BELIEFS.map((b) => (
              <StaggerItem key={b.title} from="zoom" className="bg-brand-950/80 p-8">
                <h3 className="font-heading font-semibold tracking-tight text-2xl text-white">{b.title}</h3>
                <p className="mt-2 text-white/65">{b.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12" delay={0.2}><ButtonLink href="/visit" variant="gold">Visit us this Sunday</ButtonLink></Reveal>
        </Container>
      </section>
    </>
  );
}
