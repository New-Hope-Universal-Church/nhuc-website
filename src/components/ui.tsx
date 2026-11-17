import Link from 'next/link';
import Image from 'next/image';
import { ComponentProps, ReactNode } from 'react';

// ─── Logo ─────────────────────────────────────────────────────────────────────

/**
 * The logo in a gold-ringed circle, with the name in spaced capitals, as on
 * the stream graphics. `compact` (the header) shows "NHUC" where the full
 * name doesn't fit: on phones, and beside the menu on smaller laptops.
 */
export function Logo({ light = false, compact = false, className = '' }: { light?: boolean; compact?: boolean; className?: string }) {
  const name = `font-display font-bold uppercase tracking-[0.16em] ${light ? 'text-white' : 'text-brand-950'}`;
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label="New Hope Universal Church, home">
      <span className={`${compact ? 'w-11 h-11' : 'w-12 h-12'} rounded-full bg-white ring-[3px] ring-gold-400 flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Image src="/images/logo.png" alt="" width={44} height={44} className={`${compact ? 'w-9 h-9' : 'w-10 h-10'} object-contain`} priority />
      </span>
      {compact ? (
        <>
          <span className={`${name} text-[15px] sm:hidden lg:inline xl:hidden`}>NHUC</span>
          <span className={`${name} hidden text-[13px] sm:inline lg:hidden xl:inline`}>New Hope Universal Church</span>
        </>
      ) : (
        <span className={`${name} text-[13px] leading-[1.25]`}>New Hope<br />Universal Church</span>
      )}
    </Link>
  );
}

// ─── Buttons (links styled as buttons) ───────────────────────────────────────

type ButtonVariant = 'gold' | 'crimson' | 'light' | 'outline-light' | 'outline-dark' | 'dark';

const VARIANTS: Record<ButtonVariant, string> = {
  gold: 'bg-gold-400 text-brand-950 hover:bg-gold-300 shadow-sm shadow-gold-900/20',
  crimson: 'bg-crimson-600 text-white hover:bg-crimson-700 shadow-sm shadow-crimson-900/30',
  light: 'bg-ivory text-brand-950 hover:bg-white',
  dark: 'bg-brand-950 text-white hover:bg-brand-900',
  'outline-light': 'ring-2 ring-inset ring-white/35 text-white hover:bg-white/10',
  'outline-dark': 'ring-2 ring-inset ring-brand-950/20 text-brand-950 hover:bg-brand-950/5',
};

export function ButtonLink({
  variant = 'gold',
  className = '',
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      {...rest}
      className={`inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md font-display text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeft({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Kente ────────────────────────────────────────────────────────────────────

/** A strip of kente: crimson, gold, green and black. */
export function Kente({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`kente ${className}`} />;
}

// ─── Section headings ─────────────────────────────────────────────────────────

/** A crimson label above a heading, like "PRAYER POINT" on the stream slides. */
export function Kicker({ children }: { children: ReactNode; light?: boolean }) {
  return (
    <p className="inline-block rounded-sm bg-crimson-600 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-white">
      {children}
    </p>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  light = false,
  center = false,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <Kicker>{kicker}</Kicker>
      <h2 className={`mt-5 font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl ${light ? 'text-ivory' : 'text-brand-950'}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-ink/70'}`}>{intro}</p>}
    </div>
  );
}

/** A line in the italic serif, for the motto, scripture and quotes. */
export function Scripture({ children, light = false, className = '' }: { children: ReactNode; light?: boolean; className?: string }) {
  return <p className={`font-serif italic ${light ? 'text-white/70' : 'text-ink/65'} ${className}`}>{children}</p>;
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

// ─── Photos ───────────────────────────────────────────────────────────────────

/**
 * A photo, or until the church sends one, a styled stand-in that names the
 * shot needed ("Congregation in worship"). Pass `src` to show the real photo.
 * `framed` gives it the gold frame and kente strip of the stream graphics.
 */
export function Photo({
  src,
  alt,
  shot,
  className = '',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  fullBleed = false,
  framed = false,
}: {
  src?: string;
  alt: string;
  /** What the photo should show, displayed on the stand-in. */
  shot: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Behind a page header: keeps the stand-in's label clear of the site header. */
  fullBleed?: boolean;
  /** Gold frame with a kente strip beneath, for feature photos. */
  framed?: boolean;
}) {
  if (framed) {
    return (
      <figure className={className}>
        <Photo src={src} alt={alt} shot={shot} priority={priority} sizes={sizes} className="aspect-[4/5] w-full rounded-md ring-[5px] ring-gold-400" />
        <Kente className="mt-2" />
      </figure>
    );
  }

  // Positioned by the caller (e.g. "absolute inset-0" behind a card), else relative.
  const position = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative';
  if (src) {
    return (
      <div className={`${position} overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${position} overflow-hidden bg-brand-900 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(110% 80% at 80% 15%, rgba(233,183,48,0.28), transparent 55%), radial-gradient(80% 70% at 5% 100%, rgba(200,32,47,0.30), transparent 60%), linear-gradient(160deg, #144e2a 0%, #062214 100%)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#fff' }}
      />
      <span className={`absolute right-4 ${fullBleed ? 'top-24' : 'top-4'} inline-flex items-center gap-2 rounded-sm bg-black/30 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-white/80`}>
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
          <rect x="2.5" y="5" width="15" height="11" rx="2" />
          <circle cx="10" cy="10.5" r="3" />
          <path d="M7 5l1.2-2h3.6L13 5" />
        </svg>
        Photo: {shot}
      </span>
    </div>
  );
}
