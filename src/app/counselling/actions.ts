'use server';

/**
 * Puts a name on a counselling day's list, from the website's form, through
 * HopeServe (POST {HOPESERVE_API_URL}/public/counselling). Runs on the
 * website's server, so the browser never talks to HopeServe directly.
 */

export type BookingState =
  | { status: 'idle' }
  | { status: 'ok'; name: string; eventId: string; already: boolean }
  | { status: 'error'; message: string; values: Record<string, string> };

const API = (process.env.HOPESERVE_API_URL ?? '').replace(/\/+$/, '');
const FIELDS = ['name', 'phone', 'email', 'eventId', 'message', 'website'] as const;

export async function bookCounselling(_prev: BookingState, form: FormData): Promise<BookingState> {
  const values = Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? '').trim()])) as Record<string, string>;
  const fail = (message: string): BookingState => ({ status: 'error', message, values });

  if (!values.eventId) return fail('Please choose a day.');
  if (!values.name) return fail('Please enter your name.');
  if (!values.phone) return fail('Please enter a phone number we can reach you on.');
  if (!API) return fail('Booking is not available right now. Please call the church office.');

  try {
    const res = await fetch(`${API}/public/counselling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        eventId: values.eventId,
        message: values.message || undefined,
        website: values.website || undefined,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    });
    const body = (await res.json().catch(() => null)) as { error?: unknown; alreadyBooked?: boolean } | null;
    if (!res.ok) {
      return fail(typeof body?.error === 'string' ? body.error : 'Something went wrong. Please try again, or call the church office.');
    }
    return { status: 'ok', name: values.name.split(' ')[0], eventId: values.eventId, already: !!body?.alreadyBooked };
  } catch {
    return fail('We could not add your name just now. Please try again in a moment.');
  }
}
