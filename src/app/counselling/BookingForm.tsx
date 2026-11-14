'use client';

import { useActionState } from 'react';
import { bookCounselling, type BookingState } from './actions';

const input =
  'w-full h-12 rounded-md bg-white px-4 text-base text-ink ring-1 ring-inset ring-brand-950/15 placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold-400';
const label = 'block font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 mb-2';

/** The counselling booking form. Sends through a server action. */
/** `minDate` is today in Ghana ("2026-11-14"), the earliest day you can pick. */
export default function BookingForm({ minDate }: { minDate: string }) {
  const [state, action, pending] = useActionState<BookingState, FormData>(bookCounselling, { status: 'idle' });

  if (state.status === 'ok') {
    return (
      <div role="status" className="rounded-md bg-white p-8 text-center ring-1 ring-brand-950/10 sm:p-12">
        <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-crimson-700">Request received</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold text-brand-950">Thank you, {state.name}.</h2>
        <p className="mt-3 text-lg text-ink/70">We will call you soon to confirm a time. Everything you share stays confidential.</p>
      </div>
    );
  }

  const v = state.status === 'error' ? state.values : {};

  return (
    <form action={action} className="rounded-md bg-white p-6 ring-1 ring-brand-950/10 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
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
        <div>
          <label htmlFor="preferredDate" className={label}>Preferred day</label>
          <input id="preferredDate" name="preferredDate" type="date" required min={minDate} defaultValue={v.preferredDate} className={input} />
        </div>
        <div>
          <label htmlFor="preferredTime" className={label}>Best time</label>
          <select id="preferredTime" name="preferredTime" defaultValue={v.preferredTime ?? ''} className={input}>
            <option value="">Any time</option>
            <option value="MORNING">Morning</option>
            <option value="AFTERNOON">Afternoon</option>
            <option value="EVENING">Evening</option>
          </select>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={label}>How would you like to meet?</legend>
          <div className="flex flex-wrap gap-3">
            {[{ value: 'IN_PERSON', text: 'In person at church' }, { value: 'PHONE', text: 'By phone' }].map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2.5 rounded-md px-4 py-3 ring-1 ring-inset ring-brand-950/15 has-[:checked]:ring-2 has-[:checked]:ring-gold-400 has-[:checked]:bg-gold-50">
                <input type="radio" name="mode" value={o.value} defaultChecked={(v.mode || 'IN_PERSON') === o.value} className="accent-brand-700" />
                <span className="text-sm font-medium text-ink">{o.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
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
          {pending ? 'Sending…' : 'Request a session'}
        </button>
        <p className="text-sm text-ink/55">We will call you to confirm a time.</p>
      </div>
    </form>
  );
}
