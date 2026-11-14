import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { ButtonLink, Container, Kicker } from '@/components/ui';
import { PageHero } from '@/components/sections';
import SocialLinks, { hasSocials } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'Contact',
  description: `How to reach ${site.name}.`,
};

export default function ContactPage() {
  const channels = [
    site.phone && { label: 'Call or WhatsApp', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    site.email && { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <>
      <PageHero kicker="Contact" title="We would love to hear from you" intro="Prayer requests, questions about the church, or help finding your way to us." shot="Church office or reception" />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-md bg-white p-8 sm:p-10 ring-1 ring-brand-950/5">
            <Kicker>Visit</Kicker>
            <address className="mt-5 not-italic font-heading text-2xl font-semibold leading-snug tracking-tight text-brand-950">
              {site.address.line1}<br />{site.address.city}, {site.address.country}
            </address>
            <div className="mt-8"><ButtonLink href={site.address.mapsUrl} target="_blank" rel="noreferrer" variant="gold">Get directions</ButtonLink></div>
          </div>
          <div className="rounded-md bg-white p-8 sm:p-10 ring-1 ring-brand-950/5">
            <Kicker>Reach us</Kicker>
            {channels.length ? (
              <ul className="mt-5 space-y-5">
                {channels.map((c) => (
                  <li key={c.label}>
                    <p className="text-sm text-ink/55">{c.label}</p>
                    <a href={c.href} className="font-heading font-semibold tracking-tight text-2xl text-brand-950 hover:text-brand-700">{c.value}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-ink/65">Phone and email details are coming soon. Until then, please speak to an usher at any service.</p>
            )}
            {hasSocials() && (
              <div className="mt-8 border-t border-brand-950/10 pt-6">
                <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-ink/55">Follow us</p>
                <SocialLinks className="mt-3" />
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
