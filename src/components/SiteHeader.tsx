/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { nav, type NavLink } from '@/lib/site';
import { Logo } from './ui';

/**
 * A floating header: a rounded bar held away from the page edges. Dark glass
 * over each page's green header, light glass once the page scrolls. On
 * phones the menu drops down from the bar as a floating panel. Under the
 * bar, the service times (`services`) until the page scrolls.
 */
export default function SiteHeader({ services }: { services?: ReactNode }) {
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
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const itemCls = (active: boolean) =>
    `relative rounded-md px-3 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
      light ? 'text-brand-950/70 hover:text-brand-950 hover:bg-brand-950/5' : 'text-white/75 hover:text-white hover:bg-white/10'
    } ${active ? (light ? '!text-brand-950' : '!text-white') : ''}`;
  const underline = <span className="absolute inset-x-3 bottom-0.5 h-0.5 bg-crimson-600" aria-hidden="true" />;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      {/* Frosted band from the top of the screen to just below the bar, fading
          out at its foot, so what has scrolled past blurs away instead of
          showing round the floating bar. Only once the page has scrolled. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -top-3 -bottom-6 -z-10 bg-cream/70 backdrop-blur-md transition-opacity duration-300 [mask-image:linear-gradient(to_bottom,black_65%,transparent)] sm:-top-4 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`relative mx-auto max-w-7xl rounded-xl transition-[background-color,box-shadow] duration-300 ${
          light
            ? 'bg-ivory/90 shadow-[0_10px_30px_-12px_rgba(6,34,20,0.35)] ring-1 ring-brand-950/10 backdrop-blur-md'
            : 'bg-brand-950/45 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-md'
        }`}
      >
      <div className="flex h-16 items-center justify-between gap-4 pl-2.5 pr-2 sm:pl-3">
        <Logo light={!light} compact />

        <nav aria-label="Main" className="hidden lg:flex items-center">
          {nav.map((item) => {
            if ('items' in item) {
              return (
                <MenuGroup key={item.label} label={item.label} items={item.items} pathname={pathname}
                  buttonCls={itemCls(item.items.some((i) => isActive(i.href)))} underline={item.items.some((i) => isActive(i.href)) ? underline : null} />
              );
            }
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={itemCls(active)}>
                {item.label}
                {active && underline}
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

      </div>

        {services && (
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ${scrolled || open ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] border-t border-white/10 opacity-100'}`}
            aria-hidden={scrolled || open}
            inert={scrolled || open}
          >
            <div className="min-h-0 overflow-hidden">{services}</div>
          </div>
        )}

        {/* Phone menu: a floating panel under the bar */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="lg:hidden absolute inset-x-0 top-full mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-xl bg-church p-3 shadow-2xl ring-1 ring-white/10"
        >
          <nav aria-label="Main" className="flex flex-col">
            {nav.map((item) =>
              'items' in item ? (
                <MobileGroup key={item.label} label={item.label} items={item.items} isActive={isActive} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`rounded-lg px-4 py-3.5 font-heading text-2xl font-semibold transition-colors hover:bg-white/5 ${pathname === item.href ? 'text-gold-300' : 'text-white'}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <Link href="/give" className="mt-2 flex h-12 items-center justify-center rounded-lg bg-gold-400 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-brand-950">
            Give online
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * A menu heading with a small panel of links ("Outreach"). Opens on hover or
 * click, closes on Escape, a click elsewhere, or moving to another page.
 */
function MenuGroup({
  label, items, pathname, buttonCls, underline,
}: {
  label: string;
  items: NavLink[];
  pathname: string;
  buttonCls: string;
  underline: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // A mouse opens it on hover, so a click right after must not close it.
  const hoveredAt = useRef(0);
  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!open) hoveredAt.current = Date.now();
    setOpen(true);
  };
  const toggle = () => setOpen((v) => (v && Date.now() - hoveredAt.current < 600 ? true : !v));
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={toggle} className={`${buttonCls} inline-flex items-center gap-1.5`}>
        {label}
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M3 4.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {underline}
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3">
          <ul className="overflow-hidden rounded-xl bg-ivory p-2 shadow-[0_18px_40px_-14px_rgba(6,34,20,0.45)] ring-1 ring-brand-950/10">
            {items.map((i) => {
              const active = pathname === i.href || pathname.startsWith(`${i.href}/`);
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-4 py-3 transition-colors hover:bg-brand-950/5 ${active ? 'bg-brand-950/5' : ''}`}
                  >
                    <span className="block font-heading text-lg font-semibold text-brand-950">{i.label}</span>
                    {/* {i.blurb && <span className="block text-sm text-ink/55">{i.blurb}</span>} */}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * A group in the phone menu ("Outreach", "Join Us"): a row that folds open
 * to show its pages underneath, on a lighter band. Starts open when you are
 * on one of its pages.
 */
function MobileGroup({ label, items, isActive }: { label: string; items: NavLink[]; isActive: (href: string) => boolean }) {
  const here = items.some((i) => isActive(i.href));
  const [open, setOpen] = useState(here);
  const id = `menu-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left font-heading text-2xl font-semibold transition-colors hover:bg-white/5 ${here ? 'text-gold-300' : 'text-white'}`}
      >
        {label}
        <svg className={`h-5 w-5 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={id} hidden={!open} className="mb-1 rounded-lg bg-white/6 py-1">
        {items.map((sub) => (
          <Link
            key={sub.href}
            href={sub.href}
            aria-current={isActive(sub.href) ? 'page' : undefined}
            className={`block px-7 py-3 text-lg transition-colors hover:bg-white/5 ${isActive(sub.href) ? 'font-semibold text-gold-300' : 'text-white/80'}`}
          >
            {sub.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
