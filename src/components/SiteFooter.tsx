import Link from 'next/link';
import { cacheLife } from 'next/cache';
import { nav, site } from '@/lib/site';
import { getSchedule } from '@/lib/hopeserve';
import { Container, Kente, Logo } from './ui';
import SocialLinks from './SocialLinks';

export default async function SiteFooter() {
  'use cache';
  cacheLife('days');
  const schedule = await getSchedule();

  return (
    <footer className="bg-church text-white">
      <Kente />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-xs font-serif text-xl italic leading-snug text-white/90">
              &ldquo;{site.motto}&rdquo;
            </p>
            <p className="mt-2 text-sm text-white/50">{site.mottoReference}</p>
            <p lang="tw" className="mt-5 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-gold-300">New Hope, {site.responses[0].twi}!</p>
            <SocialLinks light className="mt-6" />
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-white/70 hover:text-white">{item.label}</Link></li>
              ))}
              <li><Link href="/give" className="text-white/70 hover:text-white">Give</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Gather with us</h2>
            <ul className="mt-5 space-y-4 text-sm">
              {schedule.map((s) => (
                <li key={`${s.day}-${s.name}`}>
                  <p className="text-white">{s.name}</p>
                  <p className="text-white/55">{s.when} · {s.time}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Find us</h2>
            <address className="mt-5 not-italic text-sm leading-relaxed text-white/70">
              {site.address.line1}<br />{site.address.city}, {site.address.country}
            </address>
            <a href={site.address.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-gold-300 hover:text-gold-200">
              Get directions
            </a>
            {(site.phone || site.email) && (
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {site.phone && <li><a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-white">{site.phone}</a></li>}
                {site.email && <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <a href="https://hopeserve.newhopeuniversalchurch.org" className="hover:text-white/80">Staff sign in</a>
        </div>
      </Container>
    </footer>
  );
}
