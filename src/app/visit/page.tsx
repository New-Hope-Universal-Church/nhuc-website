import type { Metadata } from 'next';
import { getSchedule } from '@/lib/hopeserve';
import { site } from '@/lib/site';
import { ButtonLink, Container, Kicker, Photo, SectionHeading } from '@/components/ui';
import { PageHero, ServiceTimes } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Plan your visit',
  description: `Service times and directions for ${site.name}, ${site.address.line1}, ${site.address.city}.`,
};

const EXPECT = [
  { title: 'A warm welcome', text: 'Our ushers will greet you at the door and help you find a seat.' },
  { title: 'Lively worship', text: 'Our choir, praise team and singing band lead us in songs of praise.' },
  { title: 'The Word', text: 'A message from the Bible you can apply to your everyday life.' },
  { title: 'Come as you are', text: 'Wear what you are comfortable in. You belong here.' },
];

export default async function VisitPage() {
  const schedule = await getSchedule();
  return (
    <>
      <PageHero kicker="Plan your visit" title="We saved you a seat" intro="Whether it is your first time in church or your first time with us, we would love to meet you." shot="Ushers welcoming people at the entrance" />

      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading kicker="When" title="Service times" intro="Arrive a few minutes early so we can welcome you properly." />
          {schedule.length ? <ServiceTimes items={schedule} /> : <p className="self-center text-lg text-ink/60">Service times will be listed here soon. Ask any usher, or call the church office.</p>}
        </Container>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading kicker="Where" title="Find us" />
            <address className="mt-8 not-italic font-heading text-2xl font-semibold leading-snug tracking-tight text-brand-950">
              {site.address.line1}<br />{site.address.city}, {site.address.country}
            </address>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={site.address.mapsUrl} target="_blank" rel="noreferrer" variant="gold">Get directions</ButtonLink>
              <ButtonLink href="/contact" variant="outline-dark">Contact us</ButtonLink>
            </div>
          </div>
          <Photo alt="" shot="The church entrance and signboard" className="aspect-[4/3] rounded-md" />
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading kicker="Your first Sunday" title="What to expect" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXPECT.map((e) => (
              <div key={e.title} className="rounded-md bg-white p-7 ring-1 ring-brand-950/5">
                <Kicker>{e.title}</Kicker>
                <p className="mt-4 text-ink/70 leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
