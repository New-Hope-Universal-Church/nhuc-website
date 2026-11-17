'use client';

import { AnimatePresence, MotionConfig, motion, useScroll, useTransform } from 'motion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

/**
 * Motion for the website, built on Framer Motion (the `motion` package).
 * Everything honours the visitor's "reduce motion" setting: with it on, things
 * simply appear in place.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Hero ─────────────────────────────────────────────────────────────────────

/** The hero photo. Until it is added to public/images the green church background shows. */
export const HERO_IMAGE = '/images/hero.jpg';

/**
 * The church's call and response, taking turns in the label above the
 * headline. Montserrat, so the Twi letters ɛ and ɔ are safe here.
 */
// const GREETINGS = ['Welcome home', 'Abusua Kɛseɛ', 'Abusua Kɛntinka', 'Yɛ de Nyame dɔ bɛ tena daa'];
const GREETINGS = ['Welcome Home','Akwaaba', 'Oobakɛ', 'Bienvenue', 'Faith', 'Love', 'Hope','Abusua Kɛseɛ',]

/** CSS animation delay, so the entrance runs on first paint (see globals.css). */
const after = (seconds: number) => ({ animationDelay: `${seconds}s` });

/**
 * A full-screen photo that settles in and sinks a little as you scroll, with
 * the greeting sliding up line by line over it.
 */
export function Hero({
  headline,
  scripture,
  actions,
  footer,
}: {
  /** One entry per line; each line slides up on its own. The last line is gold. */
  headline: string[];
  scripture: string;
  actions: ReactNode;
  /** Pinned to the bottom of the hero, e.g. the next event bar. */
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={ref} className="bg-church relative isolate flex min-h-svh flex-col overflow-hidden">
        {/* Photo: zooms out gently on arrival, then drifts. */}
        <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ y: photoY }}>
          <div className="hero-photo absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        </motion.div>
        {/* Shade so the words read on any photo. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-950/70 via-brand-950/45 to-brand-950/90" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,transparent,rgb(4_26_14/0.55))]" />

        <motion.div style={{ y: textY, opacity: textOpacity }} className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pt-32 pb-16 text-center sm:px-8">
          <div className="hero-rise" style={after(0.1)}>
            <Greeting />
          </div>

          <h1 className="mt-7 font-heading text-[clamp(2.6rem,7.5vw,6.25rem)] font-semibold leading-[1.02] tracking-tight text-ivory"
          >
            {headline.map((text, i) => (
              <span key={text} className="block overflow-hidden pb-[0.08em]">
                <span className={`hero-line block ${i === headline.length - 1 ? 'text-gold-300' : ''}`} style={after(0.35 + i * 0.14)}>
                  {text}
                </span>
              </span>
            ))}
          </h1>

          <p style={after(0.9)} className="hero-rise mt-5 font-serif text-base italic text-white/75">
            {scripture}
          </p>
          <div style={after(1.05)} className="hero-rise mt-10 flex flex-col gap-3 sm:flex-row">
            {actions}
          </div>
        </motion.div>

        {footer && (
          <div className="hero-rise" style={after(1.4)}>
            {footer}
          </div>
        )}
      </section>
    </MotionConfig>
  );
}

/** The crimson label, cycling through the greetings. */
function Greeting() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 3200);
    return () => clearInterval(id);
  }, []);

  // Sized by the longest greeting (held invisibly in place), so the pill keeps
  // one size while the greetings change inside it.
  const longest = GREETINGS.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <p className="relative inline-grid max-w-full overflow-hidden rounded-full border border-white/25 bg-crimson-600/90 px-5 py-2 text-center font-display text-[13px] font-semibold tracking-[0.02em] text-white backdrop-blur-sm sm:px-6 sm:text-sm">
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>{longest}</span>
      <span className="sr-only">{GREETINGS[0]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={GREETINGS[i]}
          aria-hidden
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {GREETINGS[i]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}

// ─── Reveal on scroll ─────────────────────────────────────────────────────────

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
