import { connection } from 'next/server';
import { getEvent } from '@/lib/hopeserve';
import { site } from '@/lib/site';

/**
 * "Add to calendar": the event as a calendar file (.ics) that phones and
 * Google, Apple and Outlook calendars open. Built from the event's own dates,
 * so it needs nothing extra in HopeServe.
 */

/** 20261213T060000Z */
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Escapes text for a calendar field. */
const text = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');

export async function GET(_request: Request, { params }: RouteContext<'/events/[id]/calendar'>) {
  await connection();
  const { id } = await params;
  const e = await getEvent(id);
  if (!e) return new Response('We could not find that event.', { status: 404 });

  const start = new Date(e.startDate);
  // With no end time, assume it runs about two hours.
  const end = e.endDate ? new Date(e.endDate) : new Date(start.getTime() + 2 * 3_600_000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//New Hope Universal Church//Website//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.id}@newhopeuniversalchurch.org`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${text(e.title)}`,
    `LOCATION:${text(`${e.location ?? site.address.line1}, ${site.name}`)}`,
    ...(e.description ? [`DESCRIPTION:${text(e.description)}`] : []),
    `URL:${site.url}/events/${e.id}`,
    ...(e.cancelled ? ['STATUS:CANCELLED'] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const file = e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${file}.ics"`,
    },
  });
}
