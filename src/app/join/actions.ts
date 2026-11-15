'use server';

/**
 * "Join Us": sends a sign-up from the website's form to HopeServe
 * (POST {HOPESERVE_API_URL}/public/join), where it appears on the Visitors
 * page for someone to follow up. Runs on the website's server, so the
 * browser never talks to HopeServe directly.
 */

export type Intent = 'MEMBERSHIP' | 'VISIT' | 'NEW_CONVERT';

export type JoinState =
  | { status: 'idle' }
  | { status: 'ok'; name: string; intent: Intent; already: boolean }
  | { status: 'error'; message: string; values: Record<string, string> };

const API = (process.env.HOPESERVE_API_URL ?? '').replace(/\/+$/, '');
const FIELDS = ['intent', 'firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'visitDate', 'message', 'website'] as const;
const INTENTS: Intent[] = ['MEMBERSHIP', 'VISIT', 'NEW_CONVERT'];

export async function join(_prev: JoinState, form: FormData): Promise<JoinState> {
  const values = Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? '').trim()])) as Record<string, string>;
  const fail = (message: string): JoinState => ({ status: 'error', message, values });

  const intent = values.intent as Intent;
  if (!INTENTS.includes(intent)) return fail('Please choose what you would like to do.');
  if (!values.firstName || !values.lastName) return fail('Please enter your first and last name.');
  if (!values.phone) return fail('Please enter a phone number we can reach you on.');
  if (!API) return fail('Signing up is not available right now. Please try again later.');

  try {
    const res = await fetch(`${API}/public/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        intent,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender || undefined,
        visitDate: intent === 'VISIT' ? values.visitDate || undefined : undefined,
        message: values.message || undefined,
        website: values.website || undefined,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    });
    const body = (await res.json().catch(() => null)) as { error?: unknown; alreadyReceived?: boolean } | null;
    if (!res.ok) {
      return fail(typeof body?.error === 'string' ? body.error : 'Something went wrong. Please try again in a moment.');
    }
    return { status: 'ok', name: values.firstName, intent, already: !!body?.alreadyReceived };
  } catch {
    return fail('We could not send your details just now. Please try again in a moment.');
  }
}
