'use client';

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

/**
 * The church's greetings, flying in one after another as call and response.
 * Not used yet; ready for the home page hero or anywhere else. For example:
 *
 *   <Greetings greetings={CHURCH_GREETINGS} as="h1" />
 *
 * The call ("New Hope,") is set in the ivory serif, the response in gold
 * Montserrat (the heading face has no Twi ɛ or ɔ), with a small line under
 * them. When only the response changes, the call holds still, the way a
 * congregation answers. With "reduce motion" on, the first greeting stays.
 */

/** One greeting: "New Hope," / "Abusua kɛseɛ", and its small line ("A big family"). */
export interface ChurchGreeting {
  call: string;
  response: string;
  /** A translation, or the verse for "Christ in you". */
  note: string;
}

/** The motto, then the church's call and response from lib/site.ts. */
export const CHURCH_GREETINGS: ChurchGreeting[] = [
  { call: 'Christ in you,', response: 'the Hope of Glory', note: site.mottoReference },
  ...site.responses.map((r) => ({ call: 'New Hope,', response: r.twi, note: r.english })),
];

const EASE = [0.22, 1, 0.36, 1] as const;

const CALL_CLS = 'font-heading text-[clamp(2.6rem,7.5vw,6.25rem)] font-semibold leading-[1.02] tracking-tight text-ivory';
/** Montserrat, which has the Twi letters ɛ and ɔ (the heading face doesn't). */
const RESPONSE_CLS = 'text-balance font-display text-[clamp(1.9rem,5.4vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-gold-300';
const NOTE_CLS = 'font-serif text-base italic text-white/75';

/** A line, its words flying up into place one after another. */
function FlyingWords({ text, className, delay }: { text: string; className: string; delay: number }) {
  const words = text.split(' ');
  return (
    <span className={`block ${className}`}>
      {words.map((word, n) => (
        <span key={n} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '105%', opacity: 0, rotate: 4 },
              shown: { y: '0%', opacity: 1, rotate: 0, transition: { duration: 0.8, delay: 0.1 + delay + n * 0.07, ease: EASE } },
              gone: { y: '-60%', opacity: 0, transition: { duration: 0.4, delay: n * 0.03, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
          {/* The space between words, outside the moving part. */}
          {n < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

/**
 * One line that swaps on its own: its words fly in when its text changes and
 * stay put when it doesn't. The space is held by every version of the line
 * laid invisibly on top of each other, so nothing around it jumps.
 */
function GreetingLine({ texts, text, className, delay = 0 }: { texts: string[]; text: string; className: string; delay?: number }) {
  return (
    <span className="grid w-full justify-items-center">
      {[...new Set(texts)].map((t) => (
        <span key={t} aria-hidden className={`invisible col-start-1 row-start-1 ${className}`}>{t}</span>
      ))}
      {/* Old and new overlap: the next flies up as the last lifts away. */}
      <AnimatePresence initial={false}>
        <motion.span key={text} aria-hidden className="col-start-1 row-start-1 w-full self-center" initial="hidden" animate="shown" exit="gone">
          <FlyingWords text={text} delay={delay} className={className} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Greetings({
  greetings = CHURCH_GREETINGS,
  every = 6000,
  as: Tag = 'div',
  className = '',
  callClassName = CALL_CLS,
  responseClassName = RESPONSE_CLS,
  noteClassName = NOTE_CLS,
}: {
  /** The first is shown on arrival, and is what screen readers hear. */
  greetings?: ChurchGreeting[];
  /** Milliseconds each greeting stays. */
  every?: number;
  /** The element around the call and response, e.g. "h1" in a hero. */
  as?: 'div' | 'h1' | 'h2' | 'p';
  className?: string;
  /** Override the look of each line (for a smaller or light-background use). */
  callClassName?: string;
  responseClassName?: string;
  noteClassName?: string;
}) {
  const [i, setI] = useState(0);
  const still = useReducedMotion();
  useEffect(() => {
    if (still || greetings.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % greetings.length), every);
    return () => clearInterval(id);
  }, [still, greetings.length, every]);
  const g = greetings[i];
  // When the call changes too ("Christ in you," to "New Hope,"), the response follows it in.
  const callChanged = i === 0 || greetings[i - 1]?.call !== g.call;

  return (
    <MotionConfig reducedMotion="user">
      <div className={`w-full text-center ${className}`}>
        <Tag className="w-full">
          <span className="sr-only">{greetings[0].call} {greetings[0].response}</span>
          <GreetingLine texts={greetings.map((x) => x.call)} text={g.call} className={callClassName} />
          <span className="mt-2 block">
            <GreetingLine texts={greetings.map((x) => x.response)} text={g.response} className={responseClassName} delay={callChanged ? 0.25 : 0} />
          </span>
        </Tag>
        <div className="mt-5 grid justify-items-center">
          {greetings.map((x) => (
            <span key={x.note} aria-hidden className={`invisible col-start-1 row-start-1 ${noteClassName}`}>{x.note}</span>
          ))}
          <AnimatePresence initial={false}>
            <motion.p
              key={g.note}
              aria-hidden
              className={`col-start-1 row-start-1 ${noteClassName}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              {g.note}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
