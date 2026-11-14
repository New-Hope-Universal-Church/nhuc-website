'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/lib/site';
import { Logo } from './ui';

/**
 * A floating header: a rounded bar held away from the page edges. Dark glass
 * over each page's green header, light glass once the page scrolls. On
 * phones the menu drops down from the bar as a floating panel.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const light = scrolled && !open;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div
        className={`relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-xl pl-2.5 pr-2 sm:pl-3 transition-[background-color,box-shadow] duration-300 ${
          light
            ? 'bg-ivory/90 shadow-[0_10px_30px_-12px_rgba(6,34,20,0.35)] ring-1 ring-brand-950/10 backdrop-blur-md'
            : 'bg-brand-950/45 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-md'
        }`}
      >
        <Logo light={!light} compact />

        <nav aria-label="Main" className="hidden lg:flex items-center">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-md px-3 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  light ? 'text-brand-950/70 hover:text-brand-950 hover:bg-brand-950/5' : 'text-white/75 hover:text-white hover:bg-white/10'
                } ${active ? (light ? '!text-brand-950' : '!text-white') : ''}`}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 bottom-0.5 h-0.5 bg-crimson-600" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/give"
            className="hidden sm:inline-flex h-11 items-center rounded-lg bg-gold-400 px-5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-brand-950 transition-colors hover:bg-gold-300"
          >
            Give
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`lg:hidden flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
              light ? 'text-brand-950 hover:bg-brand-950/5' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        {/* Phone menu: a floating panel under the bar */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="lg:hidden absolute inset-x-0 top-full mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-xl bg-church p-3 shadow-2xl ring-1 ring-white/10"
        >
          <nav aria-label="Main" className="flex flex-col">
            {[{ href: '/', label: 'Home' }, ...nav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`rounded-lg px-4 py-3.5 font-heading text-2xl font-semibold transition-colors hover:bg-white/5 ${pathname === item.href ? 'text-gold-300' : 'text-white'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/give" className="mt-2 flex h-12 items-center justify-center rounded-lg bg-gold-400 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-brand-950">
            Give online
          </Link>
        </div>
      </div>
    </header>
  );
}
