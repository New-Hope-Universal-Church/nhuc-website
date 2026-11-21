import type { Metadata } from 'next';
import { getSchedule } from '@/lib/hopeserve';
import { site } from '@/lib/site';
import { ButtonLink, Container, Kicker, Photo, SectionHeading } from '@/components/ui';
import { PageHero, ServiceTimes } from '@/components/sections';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import SocialLinks, { hasSocials } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'Visit us',
  description: `Service times, directions and how to reach ${site.name}, ${site.address.line1}, ${site.address.city}.`,
};

const EXPECT = [
  { title: 'A warm welcome', text: 'Our ushers will greet you at the door and help you find a seat.' },
  { title: 'Lively worship', text: 'Our choir, praise team and singing band lead us in songs of praise.' },
  { title: 'The Word', text: 'A message from the Bible you can apply to your everyday life.' },
  { title: 'Come as you are', text: 'Wear what you are comfortable in. You belong here.' },
];

export default async function VisitPage() {
  const schedule = await getSchedule();
  const channels = [
    site.phone && { label: 'Call or WhatsApp', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    site.email && { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];
  return (
    <>
      <PageHero kicker="Plan your visit" title="We saved you a seat" intro="Whether it is your first time in church or your first time with us, we would love to meet you." />

      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading kicker="When" title="Service times" intro="Arrive a few minutes early so we can welcome you properly." />
          {schedule.length ? <ServiceTimes items={schedule} /> : <p className="self-center text-lg text-ink/60">Service times will be listed here soon. Ask any usher, or call the church office.</p>}
        </Container>
      </section>

      <section id="contact" className="scroll-mt-24 bg-white py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading kicker="Where" title="Find us" />
            <Reveal from="left"><address className="mt-8 not-italic font-heading text-2xl font-semibold leading-snug tracking-tight text-brand-950">
              {site.address.line1}<br />{site.address.city}, {site.address.country}
            </address></Reveal>
            <Reveal className="mt-8" delay={0.1}><ButtonLink href={site.address.mapsUrl} target="_blank" rel="noreferrer" variant="gold">Get directions</ButtonLink></Reveal>

            <Reveal className="mt-12 border-t border-brand-950/10 pt-8" delay={0.15}>
              <Kicker>Reach us</Kicker>
              <p className="mt-4 text-ink/65">Prayer requests, questions about the church, or help finding your way to us.</p>
              {channels.length ? (
                <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                  {channels.map((c) => (
                    <li key={c.label}>
                      <p className="text-sm text-ink/55">{c.label}</p>
                      <a href={c.href} className="font-heading text-xl font-semibold tracking-tight text-brand-950 hover:text-brand-700">{c.value}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-ink/65">Phone and email details are coming soon. Until then, please speak to an usher at any service.</p>
              )}
              {hasSocials() && <SocialLinks className="mt-6" />}
            </Reveal>
          </div>
          <Reveal from="zoom" delay={0.1}><Photo alt="" shot="The church entrance and signboard" className="aspect-[4/3] rounded-md" /></Reveal>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading kicker="Your first Sunday" title="What to expect" />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.12}>
            {EXPECT.map((e) => (
              <StaggerItem key={e.title} className="rounded-md bg-white p-7 ring-1 ring-brand-950/5">
                <Kicker>{e.title}</Kicker>
                <p className="mt-4 text-ink/70 leading-relaxed">{e.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
