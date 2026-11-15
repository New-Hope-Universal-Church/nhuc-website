'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { bookCounselling, type BookingState } from './actions';

const input =
  'w-full h-12 rounded-md bg-white px-4 text-base text-ink ring-1 ring-inset ring-brand-950/15 placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold-400';
const label = 'block font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 mb-2';

/** A counselling day as the form shows it, already formatted on the server. */
export interface DayOption {
  id: string;
  /** "Thursday 19 November" */
  day: string;
  /** "9:00 AM to 4:00 PM" */
  hours: string;
}

/**
 * Put your name down for one of the next counselling days. Sends through a
 * server action. `?day=<id>` (from an event's page) picks that day.
 */
export default function BookingForm({ days }: { days: DayOption[] }) {
  const [state, action, pending] = useActionState<BookingState, FormData>(bookCounselling, { status: 'idle' });
  const asked = useSearchParams().get('day');

  if (state.status === 'ok') {
    const d = days.find((x) => x.id === state.eventId);
    return (
      <div role="status" className="rounded-md bg-white p-8 text-center ring-1 ring-brand-950/10 sm:p-12">
        <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-crimson-700">
          {state.already ? 'Already on the list' : 'You are on the list'}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold text-brand-950">Thank you, {state.name}.</h2>
        {d ? (
          <p className="mt-3 text-lg text-ink/70">
            Come to the church on <span className="font-semibold text-brand-950">{d.day}</span>, any time between {d.hours.replace(' to ', ' and ')}.
            You will be seen in the order you arrive.
          </p>
        ) : (
          <p className="mt-3 text-lg text-ink/70">Come to the church on the day. You will be seen in the order you arrive.</p>
        )}
        <p className="mt-3 text-ink/55">Everything you share stays confidential.</p>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="rounded-md bg-white p-8 ring-1 ring-brand-950/10 sm:p-10">
        <h2 className="font-heading text-2xl font-semibold text-brand-950">No counselling days are open just now</h2>
        <p className="mt-3 text-lg text-ink/70">Please check back soon, or speak to someone at church on Sunday.</p>
      </div>
    );
  }

  const v = state.status === 'error' ? state.values : {};
  const chosen = v.eventId || (asked && days.some((d) => d.id === asked) ? asked : days[0].id);

  return (
    <form action={action} className="rounded-md bg-white p-6 ring-1 ring-brand-950/10 sm:p-10">
      <fieldset>
        <legend className={label}>Choose a day</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {days.map((d) => (
            <label key={d.id} className="flex cursor-pointer items-start gap-3 rounded-md px-4 py-3.5 ring-1 ring-inset ring-brand-950/15 has-[:checked]:bg-gold-50 has-[:checked]:ring-2 has-[:checked]:ring-gold-400">
              <input type="radio" name="eventId" value={d.id} defaultChecked={chosen === d.id} required className="mt-1 accent-brand-700" />
              <span>
                <span className="block font-semibold text-brand-950">{d.day}</span>
                <span className="block text-sm text-ink/60">{d.hours}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={label}>Your name</label>
          <input id="name" name="name" required autoComplete="name" defaultValue={v.name} maxLength={100} className={input} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Phone number</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="024 000 0000" defaultValue={v.phone} maxLength={25} className={input} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email <span className="normal-case tracking-normal font-normal text-ink/40">(optional)</span></label>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} maxLength={150} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>What would you like to talk about? <span className="normal-case tracking-normal font-normal text-ink/40">(optional)</span></label>
          <textarea id="message" name="message" rows={4} maxLength={1000} defaultValue={v.message} placeholder="Share as much or as little as you like." className={`${input} h-auto py-3`} />
        </div>
        {/* Honeypot: hidden from people, filled in by spam bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Leave this empty</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="mt-6 rounded-md bg-crimson-50 px-4 py-3 text-sm text-crimson-800">{state.message}</p>
      )}

      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-md bg-gold-400 px-7 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brand-950 transition-colors hover:bg-gold-300 disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Put my name down'}
        </button>
        <p className="text-sm text-ink/55">Then come on the day. You will be seen in the order you arrive.</p>
      </div>
    </form>
  );
}
