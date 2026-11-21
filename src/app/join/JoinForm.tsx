'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { join, type Intent, type JoinState } from './actions';

const input =
  'w-full h-12 rounded-md bg-white px-4 text-base text-ink ring-1 ring-inset ring-brand-950/15 placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold-400';
const label = 'block font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 mb-2';
const optional = <span className="normal-case tracking-normal font-normal text-ink/40">(optional)</span>;

const CHOICES: { value: Intent; title: string; text?: string }[] = [
  { value: 'MEMBERSHIP', title: 'Become a member', text: 'Make New Hope your church home.' },
  { value: 'VISIT', title: 'Plan a visit', text: 'Tell us you are coming, and we will look out for you.' },
  { value: 'NEW_CONVERT', title: 'Gave my life to Christ', text: 'Let us walk with you in your new life.' },
];

const THANKS: Record<Intent, string> = {
  MEMBERSHIP: 'Someone from the church will call you about becoming a member.',
  VISIT: 'We look forward to welcoming you. Someone may call to help you find your way.',
  NEW_CONVERT: 'Heaven rejoices with you! Someone from the church will call to pray with you and help you take your next steps.',
};

/**
 * The "Join Us" sign-up. `minDate` is today in Ghana, the earliest
 * day a visit can be planned for.
 */
export default function JoinForm({ minDate }: { minDate: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(join, { status: 'idle' });
  const v = state.status === 'error' ? state.values : {};
  const [intent, setIntent] = useState<Intent>((v.intent as Intent) || 'MEMBERSHIP');

  if (state.status === 'ok') {
    return (
      <div role="status" className="rounded-md bg-white p-8 text-center ring-1 ring-brand-950/10 sm:p-12">
        <p className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-crimson-700">
          {state.already ? 'We already have your details' : 'Welcome to the family'}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold text-brand-950">Thank you, {state.name}.</h2>
        <p className="mt-3 text-lg text-ink/70">{THANKS[state.intent]}</p>
        <p className="mt-6">
          <Link href="/watch#online" className="font-semibold text-crimson-700 hover:text-crimson-800">Follow us online in the meantime</Link>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-md bg-white p-6 ring-1 ring-brand-950/10 sm:p-10">
      <fieldset>
        <legend className={label}>I would like to</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CHOICES.map((c) => (
            <label key={c.value} className="flex cursor-pointer flex-col rounded-md px-4 py-2 ring-1 ring-inset ring-brand-950/15 has-checked:bg-gold-50 has-checked:ring-2 has-checked:ring-gold-400">
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="intent"
                  value={c.value}
                  checked={intent === c.value}
                  onChange={() => setIntent(c.value)}
                  className="accent-brand-700"
                />
                <span className="font-semibold text-brand-950">{c.title}</span>
              </span>
              {/* <span className="mt-1.5 pl-6 text-sm text-ink/60">{c.text}</span> */}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={label}>First name</label>
          <input id="firstName" name="firstName" required autoComplete="given-name" defaultValue={v.firstName} maxLength={60} className={input} />
        </div>
        <div>
          <label htmlFor="lastName" className={label}>Last name</label>
          <input id="lastName" name="lastName" required autoComplete="family-name" defaultValue={v.lastName} maxLength={60} className={input} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Phone number</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="024 000 0000" defaultValue={v.phone} maxLength={25} className={input} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email {optional}</label>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} maxLength={150} className={input} />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className={label}>Date of birth {optional}</label>
          <input id="dateOfBirth" name="dateOfBirth" type="date" max={minDate} autoComplete="bday" defaultValue={v.dateOfBirth} className={input} />
        </div>
        <div>
          <label htmlFor="gender" className={label}>Gender {optional}</label>
          <select id="gender" name="gender" defaultValue={v.gender ?? ''} className={input}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        {intent === 'VISIT' && (
          <div>
            <label htmlFor="visitDate" className={label}>When are you coming? {optional}</label>
            <input id="visitDate" name="visitDate" type="date" min={minDate} defaultValue={v.visitDate} className={input} />
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>Anything you would like us to know? {optional}</label>
          <textarea id="message" name="message" rows={3} maxLength={1000} defaultValue={v.message} placeholder="A prayer request, a question, who invited you…" className={`${input} h-auto py-3`} />
        </div>
        {/* Honeypot: hidden from people, filled in by spam bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
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
          {pending ? 'Sending…' : 'Send'}
        </button>
        <p className="text-sm text-ink/55">Your details are only seen by the church office.</p>
      </div>
    </form>
  );
}
