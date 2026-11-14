'use server';

/**
 * Sends a counselling request from the website's form to HopeServe
 * (POST {HOPESERVE_API_URL}/public/counselling). Runs on the website's
 * server, so the browser never talks to HopeServe directly.
 */

export type BookingState =
  | { status: 'idle' }
  | { status: 'ok'; name: string }
  | { status: 'error'; message: string; values: Record<string, string> };

const API = (process.env.HOPESERVE_API_URL ?? '').replace(/\/+$/, '');
const FIELDS = ['name', 'phone', 'email', 'preferredDate', 'preferredTime', 'mode', 'message', 'website'] as const;

export async function bookCounselling(_prev: BookingState, form: FormData): Promise<BookingState> {
  const values = Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? '').trim()])) as Record<string, string>;
  const fail = (message: string): BookingState => ({ status: 'error', message, values });

  if (!values.name) return fail('Please enter your name.');
  if (!values.phone) return fail('Please enter a phone number we can call.');
  if (!values.preferredDate) return fail('Please choose a day.');
  if (!API) return fail('Booking is not available right now. Please call the church office.');

  try {
    const res = await fetch(`${API}/public/counselling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime || undefined,
        mode: values.mode === 'PHONE' ? 'PHONE' : 'IN_PERSON',
        message: values.message || undefined,
        website: values.website || undefined,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
      return fail(typeof body?.error === 'string' ? body.error : 'Something went wrong. Please try again, or call the church office.');
    }
    return { status: 'ok', name: values.name.split(' ')[0] };
  } catch {
    return fail('We could not send your request just now. Please try again in a moment.');
  }
}
