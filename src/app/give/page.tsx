import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { Container, Kicker } from '@/components/ui';
import { PageHero } from '@/components/sections';
import { Stagger, StaggerItem } from '@/components/motion';

export const metadata: Metadata = {
  title: 'Give',
  description: `Ways to give to ${site.name}: tithes, offerings and special seeds.`,
};

export default function GivePage() {
  const g = site.giving;
  const momo = g.momoNumber ? [{ label: 'Number', value: g.momoNumber }, { label: 'Name', value: g.momoName }] : [];
  const bank = g.accountNumber
    ? [{ label: 'Bank', value: g.bankName }, { label: 'Account name', value: g.accountName }, { label: 'Account number', value: g.accountNumber }]
    : [];

  return (
    <>
      <PageHero kicker="Giving" title="Give with a cheerful heart" intro="“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” (2 Corinthians 9:7)" shot="Offering time in service" />
      <section className="py-20 sm:py-28">
        <Container><Stagger className="grid gap-6 lg:grid-cols-3" gap={0.12}>
          <StaggerItem className="rounded-md bg-white p-8 ring-1 ring-brand-950/5">
            <Kicker>In service</Kicker>
            <h2 className="mt-4 font-heading font-semibold tracking-tight text-3xl text-brand-950">During any service</h2>
            <p className="mt-3 text-ink/65">Give your tithe or offering during offering time at any of our services.</p>
          </StaggerItem>
          <StaggerItem className="rounded-md bg-white p-8 ring-1 ring-brand-950/5">
            <Kicker>Mobile money</Kicker>
            <h2 className="mt-4 font-heading font-semibold tracking-tight text-3xl text-brand-950">MoMo</h2>
            {momo.length ? (
              <dl className="mt-4 space-y-2">{momo.map((r) => <div key={r.label}><dt className="text-sm text-ink/55">{r.label}</dt><dd className="font-semibold text-brand-950">{r.value}</dd></div>)}</dl>
            ) : (
              <p className="mt-3 text-ink/65">Mobile money details are coming soon. Ask at the church office in the meantime.</p>
            )}
          </StaggerItem>
          <StaggerItem className="rounded-md bg-white p-8 ring-1 ring-brand-950/5">
            <Kicker>Bank transfer</Kicker>
            <h2 className="mt-4 font-heading font-semibold tracking-tight text-3xl text-brand-950">Bank</h2>
            {bank.length ? (
              <dl className="mt-4 space-y-2">{bank.map((r) => <div key={r.label}><dt className="text-sm text-ink/55">{r.label}</dt><dd className="font-semibold text-brand-950">{r.value}</dd></div>)}</dl>
            ) : (
              <p className="mt-3 text-ink/65">Bank details are coming soon. Ask at the church office in the meantime.</p>
            )}
          </StaggerItem>
        </Stagger></Container>
        <Container>
          <p className="mt-10 text-sm text-ink/55">Please use your name and &ldquo;Tithe&rdquo; or &ldquo;Offering&rdquo; as the reference, so the finance team can record it against your name.</p>
        </Container>
      </section>
    </>
  );
}
